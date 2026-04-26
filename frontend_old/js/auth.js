"use strict";
// Authentication Logic
let currentUser = null;
function showLoginForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
}
function showRegisterForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}
function showAuthSection() {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    authSection.style.display = 'flex';
    dashboardSection.style.display = 'none';
}
function showDashboard() {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    authSection.style.display = 'none';
    dashboardSection.style.display = 'block';
}
async function handleLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    try {
        const response = await apiClient.login(emailInput.value, passwordInput.value);
        apiClient.setToken(response.token);
        currentUser = response.user;
        document.getElementById('user-name').textContent = currentUser.name;
        showAlert('Login successful!', 'success');
        showDashboard();
        loadDashboard();
        // Reset form
        document.getElementById('login-form-element').reset();
    }
    catch (error) {
        showAlert(error.message, 'error');
    }
}
async function handleRegister(e) {
    e.preventDefault();
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const passwordConfirmInput = document.getElementById('register-password-confirm');
    if (passwordInput.value !== passwordConfirmInput.value) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    try {
        await apiClient.register(nameInput.value, emailInput.value, passwordInput.value);
        showAlert('Registration successful! Please login.', 'success');
        showLoginForm();
        document.getElementById('register-form-element').reset();
    }
    catch (error) {
        showAlert(error.message, 'error');
    }
}
function handleLogout() {
    apiClient.clearToken();
    currentUser = null;
    showAuthSection();
    showLoginForm();
    showAlert('Logged out successfully', 'success');
}
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
}
// Event Listeners for Auth
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        apiClient.setToken(token);
        showDashboard();
        apiClient.getProfile().then(user => {
            currentUser = user;
            document.getElementById('user-name').textContent = user.name;
            loadDashboard();
        }).catch(() => {
            showAuthSection();
        });
    }
    else {
        showAuthSection();
    }
    // Login/Register Toggle
    const toggleRegister = document.getElementById('toggle-register');
    const toggleLogin = document.getElementById('toggle-login');
    toggleRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
    toggleLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    // Form Submissions
    const loginForm = document.getElementById('login-form-element');
    const registerForm = document.getElementById('register-form-element');
    const logoutBtn = document.getElementById('logout-btn');
    loginForm?.addEventListener('submit', handleLogin);
    registerForm?.addEventListener('submit', handleRegister);
    logoutBtn?.addEventListener('click', handleLogout);
});
//# sourceMappingURL=auth.js.map