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

    await login(email, pass);

    // Prevent form submission if the sign up form is not filled out all the way
    window.location.href = 'index.html';
});

async function login(email, password) {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
            // setStatus('login-status', 'Logged in.', 'success');

            const tokenBox = document.getElementById('token-box');
            tokenBox.style.display = 'block';
            tokenBox.textContent = data.token;
        } else {
            // setStatus('login-status', 'Invalid email or password.', 'error');
            warning.textContent = "Invalid email or password, please try again.";
            return;
        }
    } catch (err) {
        // setStatus('login-status', 'Could not reach the server.', 'error');
        warning.textContent = "Could not reach the server, please try again.";
        return;
    }
}