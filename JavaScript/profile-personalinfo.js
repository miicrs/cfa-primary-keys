// query selectors
const API_URL = "http://localhost:3000";

const editBtn = document.querySelector('#edit-personalinfo-btn');
const saveBtn = document.querySelector('#save-personalinfo-btn');
const fieldGroups = document.querySelectorAll('.profile-fields-infos');
const warning = document.querySelector('#personal-info-warning');
const userImage = document.querySelector('#user-image');
const summaryNameDisplay = document.querySelector('#users-name');
const summaryEmailDisplay = document.querySelector('#users-email');
const summaryJoinDateDisplay = document.querySelector('#users-join-date');
const summaryFinancialFocusDisplay = document.querySelector('#users-financial-focus-selected');

// grabbing the information from localStorage
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

// fetch user's profile data from the server
async function fetchProfile() {
    if (!token || !userId) return null;

    try {
        let response = await fetch(`${API_URL}/users/${userId}`, {
            headers: { // "Bearer <token>"
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            warning.textContent = "Could not fetch profile information. Please try again.";
            return null;
        }
    } catch (err) {
        warning.textContent = "Could not reach the server. Please try again.";
        return null;
    }
}

// show user's profile information entered in from signup
async function showProfile() {
    let profile = await fetchProfile();
    if (!profile) return;

    let values = [profile.firstName, profile.lastName, profile.email, profile.phone];

    fieldGroups.forEach((field, index) => {
        let displayInfo = field.querySelector('.field-value');
        if (displayInfo && values[index] !== undefined) {
            displayInfo.textContent = values[index];
        }
    });

    if (summaryNameDisplay) {
        summaryNameDisplay.textContent = `${profile.firstName} ${profile.lastName}`;
    }

    if (summaryEmailDisplay) {
        summaryEmailDisplay.textContent = profile.email;
    }

    if (summaryJoinDateDisplay && profile.createdAt) { // combine into 1 input
        let parsedDate = new Date(profile.createdAt);
        
        // want to check if the date is valid (not NULL/Invalid) from previous users
        if (!isNaN(parsedDate.getTime())) {
            const options = { month: "long", year: "numeric" };
            const displayDate = parsedDate.toLocaleDateString('en-us', options);
            summaryJoinDateDisplay.textContent = `Member since ${displayDate}`;
        } else {
            summaryJoinDateDisplay.textContent = `Member since N/A`;
        }
    }

    if (userImage && profile.profileImage) {
        userImage.src = profile.profileImage;
    }

    if (summaryFinancialFocusDisplay && profile.financialFocus) {
    summaryFinancialFocusDisplay.textContent = profile.financialFocus;
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
async function saveMode() {
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

        let usersInput = placeholderInput.querySelector('input');
        if (usersInput) {
            placeholderInput.textContent = usersInput.value;
        }
    });

    let firstNameVal = fieldGroups[0].querySelector('.field-value').textContent;
    let lastNameVal = fieldGroups[1].querySelector('.field-value').textContent;
    let emailVal = fieldGroups[2].querySelector('.field-value').textContent;
    let phoneVal = fieldGroups[3].querySelector('.field-value').textContent;


    if (summaryNameDisplay) {
        summaryNameDisplay.textContent = `${firstNameVal} ${lastNameVal}`;
    }

    if (summaryEmailDisplay) {
        summaryEmailDisplay.textContent = emailVal;
    }

    try {
        let res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                firstName: firstNameVal,
                lastName: lastNameVal,
                email: emailVal,
                phone: phoneVal
            })
        });

        if (!res.ok) {
            warning.textContent = "Could not update profile info. Please try again.";
            warning.style.display = 'block';
            return;
        }
    } catch (err) {
        warning.textContent = "Could not reach the server. Please try again.";
        warning.style.display = 'block';
        return;
    }

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