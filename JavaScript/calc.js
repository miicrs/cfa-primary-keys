// grabs elements on the page 

const incomeInput = document.getElementById("income");
const groupNameInput = document.getElementById("group-name-input");
const addGroupBtn = document.getElementById("add-group-btn");
const groupsContainer = document.getElementById("groups-container");
const totalExpensesDisplay = document.getElementById("total-expenses-display");
const balanceDisplay = document.getElementById("balance-display");

const REMAINING_COLOR = "#D8DCE0"; //  color used for unallocated money 


function runOnEnterKey(inputElement, callback) {
  inputElement.addEventListener("keydown", function (e) {
    // "e" is the event object the browser automatically gives us it holds info about
    // what just happened including which key was pressed
    if (e.key === "Enter") {
      e.preventDefault(); 
      callback(); 
    }
  });
}

// Creates a new element and sets its class in one line instead of two lines every time
function makeElement(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}


// Add group feature so when u click that button this runs or when u press enter
addGroupBtn.addEventListener("click", addGroup);
runOnEnterKey(groupNameInput, addGroup);

function addGroup() {
  const groupName = groupNameInput.value.trim(); // .trim() removes extra spaces before/after
  if (groupName === "") return; // don't create a blank/empty group

  const groupCard = buildGroupCard(groupName);
  groupsContainer.appendChild(groupCard); // actually inserts the new card onto the page

  groupNameInput.value = ""; // clears the text box after adding
  recalculateAll();
}

// Builds one full group card: the header, the "add expense" row, and the (empty) expenses list.
// Wrapped in a Bootstrap "col" div since #groups-container is a Bootstrap row grid
function buildGroupCard(groupName) {
  const col = makeElement("div", "col");
  const card = makeElement("div", "card group-card h-100");
  const cardBody = makeElement("div", "card-body p-3");

  //  Header row group name and remove button 
  const header = makeElement("div", "d-flex align-items-center gap-2 mb-2");

  const nameHeading = makeElement("h3", "group-name h6 mb-0 flex-grow-1 text-truncate");
  nameHeading.textContent = groupName;

  const removeGroupBtn = makeElement("button", "btn-close remove-group-btn");
  removeGroupBtn.setAttribute("aria-label", "Remove group " + groupName); // for screen readers, not visible on screen
  // only later, whenever someone actually clicks this specific remove button.
  removeGroupBtn.addEventListener("click", function () {
    col.remove(); // deletes this entire group card from the page
    recalculateAll(); // update totals now that a group is gone
  });

  header.appendChild(nameHeading);
  header.appendChild(removeGroupBtn);

  // Row for typing a new expense name into this group 
  const addRow = makeElement("div", "input-group input-group-sm mb-2");

  const itemNameInput = makeElement("input", "form-control item-name-input");
  itemNameInput.type = "text";
  itemNameInput.placeholder = "Expense name (e.g. Rent)";
  itemNameInput.maxLength = 28;

  const addItemBtn = makeElement("button", "btn btn-dark add-item-btn");
  addItemBtn.type = "button";
  addItemBtn.textContent = "+";
  addItemBtn.setAttribute("aria-label", "Add expense");

  addRow.appendChild(itemNameInput);
  addRow.appendChild(addItemBtn);

  //  The list that will hold each expense row 
  const itemsList = makeElement("div", "items-list d-flex flex-column gap-2");

  const emptyItemsMessage = makeElement("p", "empty-hint text-muted fst-italic small mb-0");
  emptyItemsMessage.textContent = "No expenses in this group yet.";
  itemsList.appendChild(emptyItemsMessage);

  // Adds one expense row to this specific group's list.
  function addExpense() {
    const expenseName = itemNameInput.value.trim();
    if (expenseName === "") return;

    const expenseRow = buildExpenseRow(expenseName, itemsList, emptyItemsMessage);
    itemsList.appendChild(expenseRow);
    if (itemsList.contains(emptyItemsMessage)) {
      emptyItemsMessage.remove(); // hide the "No expenses yet" message once there's a real one
    }

    itemNameInput.value = "";
    recalculateAll();
  }

  addItemBtn.addEventListener("click", addExpense);
  runOnEnterKey(itemNameInput, addExpense);

  cardBody.appendChild(header);
  cardBody.appendChild(addRow);
  cardBody.appendChild(itemsList);
  card.appendChild(cardBody);
  col.appendChild(card);

  return col;
}

// builds expense row for each expense in a group
function buildExpenseRow(expenseName, itemsList, emptyItemsMessage) {
  const row = makeElement("div", "expense-line d-flex align-items-center gap-2");

  const label = makeElement("span", "expense-label d-flex align-items-center gap-2 flex-grow-1 text-truncate small");
  label.textContent = expenseName;

  const amountWrap = makeElement("div", "input-group input-group-sm");
  amountWrap.style.width = "115px";
  amountWrap.style.flexShrink = "0";

  const dollarSign = makeElement("span", "input-group-text");
  dollarSign.textContent = "$";

  const amountInput = makeElement("input", "form-control expense-amount");
  amountInput.type = "number";
  amountInput.min = "0";
  amountInput.step = "0.01";
  amountInput.placeholder = "0.00";
  // Runs recalculateAll every time you type a new digit in this box — recalculateAll
  // is passed directly as the callback here, same idea as runOnEnterKey above.
  amountInput.addEventListener("input", recalculateAll);

  amountWrap.appendChild(dollarSign);
  amountWrap.appendChild(amountInput);

  const removeBtn = makeElement("button", "btn-close remove-expense-btn flex-shrink-0");
  removeBtn.setAttribute("aria-label", "Remove " + expenseName);
  removeBtn.addEventListener("click", function () {
    row.remove(); // deletes just this one expense row
    //if this was the last expense in the group it brings back the no expense message
    if (itemsList.querySelectorAll(".expense-line").length === 0) {
      itemsList.appendChild(emptyItemsMessage);
    }
    recalculateAll();
  });

  row.appendChild(label);
  row.appendChild(amountWrap);
  row.appendChild(removeBtn);

  return row;
}



//calculates the total and adds it to the chart 
incomeInput.addEventListener("input", recalculateAll);

function recalculateAll() {
  // Converts the text input to a real number defaulting to 0 if it's empty/invalid
  const income = parseFloat(incomeInput.value) || 0;
  let totalExpenses = 0;

  const groupNames = [];
  const groupTotals = [];

  //this portion of the code grabs all elements on the page and loops through them 
  // to calculate the total expenses and balance
  const groupCards = groupsContainer.querySelectorAll(".group-card");
  for (let i = 0; i < groupCards.length; i++) {
    const card = groupCards[i];
    const name = card.querySelector(".group-name").textContent; 

    let groupTotal = 0;
    const amountInputs = card.querySelectorAll(".expense-amount"); 
    for (let j = 0; j < amountInputs.length; j++) {
      groupTotal += parseFloat(amountInputs[j].value) || 0;
    }

    groupNames.push(name);
    groupTotals.push(groupTotal);
    totalExpenses += groupTotal;
  }
  const balance = income - totalExpenses;

  //formats a number to always show  2 decimal places
  totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
  balanceDisplay.textContent = balance.toFixed(2);

  const balanceHeading = balanceDisplay.closest("h3");
  if (balanceHeading) {
    if (balance < 0) {
      // classList.remove/add swap which CSS class is applied, which is what actually changes the color
      balanceHeading.classList.remove("balance-positive");
      balanceHeading.classList.add("balance-negative");
    } else {
      balanceHeading.classList.remove("balance-negative");
      balanceHeading.classList.add("balance-positive");
    }
  }

  updateChart(groupNames, groupTotals, Math.max(balance, 0));
}

recalculateAll();