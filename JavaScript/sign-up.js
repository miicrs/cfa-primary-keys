// Query selectors
const form = document.querySelector('form');
const firstNameInput = document.querySelector('#firstname-input');
const lastNameInput = document.querySelector('#lastname-input');
const emailInput = document.querySelector('#email-input');
const createPassInput = document.querySelector('#createpass-input');
const confirmPassInput = document.querySelector('#confirmpass-input');
const warning = document.querySelector('#warning');

// Form submission
form.addEventListener('submit', function (event) {
    event.preventDefault();
    let firstName = firstNameInput.value;
    let lastName = lastNameInput.value;
    let email = emailInput.value;
    let createPass = createPassInput.value;
    let confirmPass = confirmPassInput.value;

    // Warnings
    warning.textContent = "";
    warning.style.color = "red";

    // Password matching
    if (createPass != confirmPass) {
        warning.textContent = "Passwords do not match.";
        return;
    } 

    // Password length min
    if (createpass.length < 8) {
        warning.textContent = "Password is too short, must be at least 8 characters.";
        return;
    }

    // Password length max
    if (createpass.length > 20) {
        warning.textContent = "Password is too long, must be under 20 characters.";
        return;
    }
});