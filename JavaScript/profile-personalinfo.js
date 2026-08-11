// query selectors
const editBtn = document.querySelector('#edit-personalinfo-btn');
const saveBtn = document.querySelector('#save-personalinfo-btn');
const fieldGroups = document.querySelectorAll('.profile-fields-infos');
const warning = document.querySelector('#personal-info-warning');
const summaryNameDisplay = document.querySelector('#users-name');
const summaryEmailDisplay = document.querySelector('#users-email');

// saves each fields into localStorage
function saveProfile() {
    fieldGroups.forEach(field => {
        let userAttributes = field.querySelector('label').textContent;
        // considering both input made from user and a placeholder
        let input = field.querySelector('.field-value');

        if (input) {
            localStorage.setItem(`profile_field_${userAttributes}`, input.textContent);
        }
    });
}

// show the input the user entered when press save button
function showProfile() {
    fieldGroups.forEach(field => {
        let userAttributes = field.querySelector('label').textContent;
        let savedInput = localStorage.getItem(`profile_field_${userAttributes}`);
        let input = field.querySelector('.field-value');

        if (savedInput && input) { // becoming 1 input
            input.textContent = savedInput;
        }
    });

    // publicly displaying some personal information from user and save to storage
    let savedFirstName = localStorage.getItem('profile_field_FirstName:');
    let savedLastName  = localStorage.getItem('profile_field_LastName:');
    let savedEmail     = localStorage.getItem('profile_field_Email:');

    if (savedFirstName && savedLastName && summaryNameDisplay) { // update as 1 input
        summaryNameDisplay.textContent = `${savedFirstName} ${savedLastName}`;
    }

    if (savedEmail && summaryEmailDisplay) { // update as 1 input
        summaryEmailDisplay.textContent = savedEmail;
    }
}

// checking every field and see if any are empty
function validateInputs() {
    let isValid = true;

    fieldGroups.forEach(field => {
        let usersInput = field.querySelector('input');

        if (usersInput) {
            if (usersInput.value === '') {
                usersInput.classList.add('is-invalid', 'border-danger');
                isValid = false;
            } else {
                usersInput.classList.remove('is-invalid', 'border-danger');
            }
        }
    });

    return isValid;
}

// turn every field's group into an editable input text box
function editMode() {
    fieldGroups.forEach(group => {
        let input = group.querySelector('.field-value');
        if (!input) return;

        let currVal = input.textContent;

        // making sure the fields are filled out
        input.innerHTML = `<input type="text" class="edit-input form-control" value="${currVal}" required>`;

        let newInput = input.querySelector('input');

        if (newInput) {
            newInput.addEventListener('focus', function () {
                this.classList.remove('is-invalid', 'border-danger');
                warning.style.display = 'none';
                warning.textContent = '';
            });
        }
    });

    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
}

// save user's input
function saveMode() {
    // before saving need to validate if field correctly filled out
    if (!validateInputs()) {
        warning.textContent = 'Please make sure to fill out all personal information fields before saving!';
        warning.classList.add('is-danger');
        warning.style.display = 'block';
        return;
    }

    fieldGroups.forEach(field => {
        let placeholderInput = field.querySelector('.field-value');
        if (!placeholderInput) return;

        const usersInput = placeholderInput.querySelector('input');
        if (usersInput) {
            placeholderInput.textContent = usersInput.value;
        }
    });

    let firstNameVal = fieldGroups[0].querySelector('.field-value').textContent;
    let lastNameVal = fieldGroups[1].querySelector('.field-value').textContent;
    let emailVal = fieldGroups[2].querySelector('.field-value').textContent;

    if (summaryNameDisplay) {
        summaryNameDisplay.textContent = `${firstNameVal} ${lastNameVal}`;
    }

    if (summaryEmailDisplay) {
        summaryEmailDisplay.textContent = emailVal;
    }

    saveProfile();

    // double measures by hiding the warning if still shown from a previous failed attempt
    warning.style.display = 'none';
    saveBtn.style.display = 'none';
    editBtn.style.display = 'inline-block';
}

showProfile();

if (editBtn) {
    editBtn.addEventListener('click', editMode);
} 

if (saveBtn) {
    saveBtn.addEventListener('click', saveMode);
}