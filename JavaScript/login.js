// Query selectors
const API_URL = "http://localhost:3000";

const form = document.querySelector('#form');
const emailInput = document.querySelector('#email-input');
const passInput = document.querySelector('#password-input');
const warning = document.querySelector('#warning');

// Form submission
form.addEventListener('submit', async function (event) {
    event.preventDefault();
    let email = emailInput.value;
    let pass = passInput.value;

    // Warnings
    warning.textContent = "";
    warning.style.color = "red";

    // Email formatting
    if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
        warning.textContent = "Please enter a valid email address.";
        return;
    }

    const success = await login(email, pass);
    if (success) {
        // Prevent form submission if the sign up form is not filled out all the way
        window.location.href = 'index.html';
    } else {
        warning.textContent = "Invalid email or password, please try again.";
    }
});

// Login function
async function login(email, password) {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Storing auth token if login is successful
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            // setStatus('login-status', 'Logged in.', 'success');

            const tokenBox = document.getElementById('token-box');
            tokenBox.style.display = 'block';
            tokenBox.textContent = data.token;
            return true;
        // Returns an error if login is not successful
        } else {
            // setStatus('login-status', 'Invalid email or password.', 'error');
            warning.textContent = "Invalid email or password, please try again.";
            return false;
        }
    } catch (err) {
        // setStatus('login-status', 'Could not reach the server.', 'error');
        warning.textContent = "Could not reach the server, please try again.";
        return false;
    }
}