// Query selectors
const API_URL = "http://localhost:3000";

const form = document.querySelector('form');
const emailInput = document.querySelector('#email-input');
const passInput = document.querySelector('#pass-input');
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

    // Prevent form submission if the sign up form is not filled out all the way
    // window.location.href = 'bank-selection.html';
});

async function login() {
const email = document.getElementById('login-email').value;
const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
            setStatus('login-status', 'Logged in.', 'success');

            const tokenBox = document.getElementById('token-box');
            tokenBox.style.display = 'block';
            tokenBox.textContent = data.token;
        } else {
            setStatus('login-status', 'Invalid email or password.', 'error');
        }
    } catch (err) {
        setStatus('login-status', 'Could not reach the server.', 'error');
    }
}