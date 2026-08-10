// Query selectors
const API_URL = "http://localhost:3000";

const form = document.querySelector('form');
const firstNameInput = document.querySelector('#firstname-input');
const lastNameInput = document.querySelector('#lastname-input');
const emailInput = document.querySelector('#email-input');
const phoneInput = document.querySelector('#phone-input');
const createPassInput = document.querySelector('#createpass-input');
const confirmPassInput = document.querySelector('#confirmpass-input');
const warning = document.querySelector('#warning');

// Form submission
form.addEventListener('submit', async function (event) {
    event.preventDefault();
    let firstName = firstNameInput.value;
    let lastName = lastNameInput.value;
    let email = emailInput.value;
    let phone = phoneInput.value;
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
    if (createPass.length < 8) {
        warning.textContent = "Password is too short, must be at least 8 characters.";
        return;
    }

    // Password length max
    if (createPass.length > 20) {
        warning.textContent = "Password is too long, must be under 20 characters.";
        return;
    }

    // Phone length
    if (phone.length != 10) {
        warning.textContent = "Please enter a valid 10 digit phone number.";
        return;
    }

    // Email formatting
    if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
        warning.textContent = "Please enter a valid email address.";
        return;
    }

    // Submitting user sign-up request to the API
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName, lastName, email, phone, createPass
        })
    });
    // Logging response to the console for debugging
    console.log(response);
    } catch (error) {
        console.error('Error has occurred during sign-up' + error);
    }

    // Prevent form submission if the sign up form is not filled out all the way
    window.location.href = 'bank-selection.html';
});