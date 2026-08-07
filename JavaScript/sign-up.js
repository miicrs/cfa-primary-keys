// Query selectors
import { connectSqlite } from './connect.js';

const form = document.querySelector('form');
const firstNameInput = document.querySelector('#firstname-input');
const lastNameInput = document.querySelector('#lastname-input');
const emailInput = document.querySelector('#email-input');
const phoneInput = document.querySelector('#phone-input');
const createPassInput = document.querySelector('#createpass-input');
const confirmPassInput = document.querySelector('#confirmpass-input');
const warning = document.querySelector('#warning');

// Form submission
form.addEventListener('submit', function (event) {
    event.preventDefault();
    let firstName = firstNameInput.value;
    let lastName = lastNameInput.value;
    let email = emailInput.value;
    let phone = phoneInput.value;
    let createPass = createPassInput.value;
    let confirmPass = confirmPassInput.value;

    const db = connectSqlite();

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

    // Prevent form submission if the sign up form is not filled out all the way
    window.location.href = 'bank-selection.html';

    const insertQuery = `INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)`;
    db.run(insertQuery, [firstName, lastName, email, phone, createPass], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
    db.close();
});