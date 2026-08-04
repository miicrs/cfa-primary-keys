(function () {
  // Cycles through this palette as the user creates new groups.
  // Colors are deeper/more saturated than before so they stay visible against a white background.
  const COLOR_PALETTE = ["#2F9E8F", "#C97F2A", "#3E6FBF", "#8E4FBF", "#C24F6B", "#3F9E63", "#B79328"];
  const REMAINING_COLOR = "#D8DCE0"; // neutral gray slice for unallocated income

  const incomeInput = document.getElementById("income");
  const groupNameInput = document.getElementById("group-name-input");
  const addGroupBtn = document.getElementById("add-group-btn");
  const groupsContainer = document.getElementById("groups-container");
  const totalExpensesDisplay = document.getElementById("total-expenses-display");
  const balanceDisplay = document.getElementById("balance-display");

  // groups = [{ id, name, color, items: [{ id, name, amount }] }]
  let groups = [];
  let groupCounter = 0;
  let itemCounter = 0;

  addGroupBtn.addEventListener("click", addGroup);
  groupNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); addGroup(); }
  });
  incomeInput.addEventListener("input", recalculate);

  function addGroup() {
    const name = groupNameInput.value.trim();
    if (!name) return;

    groupCounter++;
    const color = COLOR_PALETTE[(groupCounter - 1) % COLOR_PALETTE.length];
    groups.push({ id: `group-${groupCounter}`, name, color, items: [] });

    groupNameInput.value = "";
    renderGroups();
    recalculate();
  }

  function removeGroup(groupId) {
    groups = groups.filter(g => g.id !== groupId);
    renderGroups();
    recalculate();
  }

  function addItem(groupId, name) {
    const group = groups.find(g => g.id === groupId);
    if (!group || !name.trim()) return;
    itemCounter++;
    group.items.push({ id: `item-${itemCounter}`, name: name.trim(), amount: 0 });
    renderGroups();
    recalculate();
  }

  function removeItem(groupId, itemId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    group.items = group.items.filter(i => i.id !== itemId);
    renderGroups();
    recalculate();
  }

  function renderGroups() {
    if (groups.length === 0) {
      groupsContainer.innerHTML = `<p class="empty-hint">No groups yet — name one above to get started (e.g. "Needs", "Wants", "Savings").</p>`;
      return;
    }

    groupsContainer.innerHTML = groups.map(group => `
      <div class="group-card" data-group-id="${group.id}">
        <div class="group-card-header">
          <span class="group-swatch" style="background:${group.color}"></span>
          <h3 class="group-name">${escapeHtml(group.name)}</h3>
          <button class="remove-group-btn" data-group-id="${group.id}" aria-label="Remove group ${escapeHtml(group.name)}">×</button>
        </div>

        <div class="add-row item-add-row">
          <input type="text" class="item-name-input" placeholder="Expense name (e.g. Rent)" maxlength="28" data-group-id="${group.id}">
          <button type="button" class="add-item-btn" data-group-id="${group.id}" aria-label="Add expense">+</button>
        </div>

        <div class="items-list">
          ${group.items.length === 0
            ? `<p class="empty-hint">No expenses in this group yet.</p>`
            : group.items.map(item => `
              <div class="expense-line">
                <span class="expense-label">
                  <span class="swatch" style="background:${group.color}"></span>
                  ${escapeHtml(item.name)}
                </span>
                <div class="amount-wrap">
                  <span>$</span>
                  <input type="number" min="0" step="0.01" placeholder="0.00" inputmode="decimal"
                         data-group-id="${group.id}" data-item-id="${item.id}" value="${item.amount || ""}">
                </div>
                <button class="remove-expense-btn" data-group-id="${group.id}" data-item-id="${item.id}" aria-label="Remove ${escapeHtml(item.name)}">×</button>
              </div>
            `).join("")
          }
        </div>
      </div>
    `).join("");

    wireGroupEvents();
  }

  function wireGroupEvents() {
    groupsContainer.querySelectorAll(".remove-group-btn").forEach(btn => {
      btn.addEventListener("click", () => removeGroup(btn.dataset.groupId));
    });

    groupsContainer.querySelectorAll(".add-item-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const groupId = btn.dataset.groupId;
        const nameInput = groupsContainer.querySelector(`.item-name-input[data-group-id="${groupId}"]`);
        addItem(groupId, nameInput.value);
        nameInput.value = "";
      });
    });

    groupsContainer.querySelectorAll(".item-name-input").forEach(input => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addItem(input.dataset.groupId, input.value);
          input.value = "";
        }
      });
    });

    groupsContainer.querySelectorAll(".expense-line input[type='number']").forEach(input => {
      input.addEventListener("input", (e) => {
        const group = groups.find(g => g.id === e.target.dataset.groupId);
        const item = group && group.items.find(i => i.id === e.target.dataset.itemId);
        if (item) item.amount = parseFloat(e.target.value) || 0;
        recalculate();
      });
    });

    groupsContainer.querySelectorAll(".remove-expense-btn").forEach(btn => {
      btn.addEventListener("click", () => removeItem(btn.dataset.groupId, btn.dataset.itemId));
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Chart.js setup
  const ctx = document.getElementById("budgetChart").getContext("2d");
  const budgetChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        borderColor: "#FFFFFF",
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#6E6E6E",
            font: { family: "Helvetica", size: 11 },
            padding: 12,
            boxWidth: 10,
          },
        },
        tooltip: {
          backgroundColor: "#1A1A1A",
          titleFont: { family: "Helvetica" },
          bodyFont: { family: "Helvetica" },
          padding: 10,
          callbacks: {
            label: (context) => ` ${context.label}: $${context.raw.toFixed(2)}`,
          },
        },
      },
      animation: { duration: 400 },
    },
  });

  function recalculate() {
    const income = parseFloat(incomeInput.value) || 0;

    const groupTotals = groups.map(g => ({
      name: g.name,
      color: g.color,
      total: g.items.reduce((sum, i) => sum + i.amount, 0),
    }));

    const totalExpenses = groupTotals.reduce((sum, g) => sum + g.total, 0);
    const balance = income - totalExpenses;

    totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
    balanceDisplay.textContent = balance.toFixed(2);

    const balanceHeading = balanceDisplay.closest("h3");
    if (balanceHeading) balanceHeading.classList.toggle("negative", balance < 0);

    updateChart(groupTotals, Math.max(balance, 0));
  }

  function updateChart(groupTotals, remainingSlice) {
    const labels = groupTotals.map(g => g.name);
    const data = groupTotals.map(g => g.total);
    const colors = groupTotals.map(g => g.color);

    if (remainingSlice > 0) {
      labels.push("Remaining");
      data.push(remainingSlice);
      colors.push(REMAINING_COLOR);
    }

    const isEmpty = data.length === 0 || data.every(v => v === 0);

    budgetChart.data.labels = isEmpty ? ["No data yet"] : labels;
    budgetChart.data.datasets[0].data = isEmpty ? [1] : data;
    budgetChart.data.datasets[0].backgroundColor = isEmpty ? ["#EDEDED"] : colors;
    budgetChart.update();
  }

  renderGroups();
  recalculate();
})();