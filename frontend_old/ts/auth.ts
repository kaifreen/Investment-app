// Authentication Logic
let currentUser: any = null;

function showLoginForm(): void {
  const loginForm = document.getElementById('login-form') as HTMLElement;
  const registerForm = document.getElementById('register-form') as HTMLElement;
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
}

function showRegisterForm(): void {
  const loginForm = document.getElementById('login-form') as HTMLElement;
  const registerForm = document.getElementById('register-form') as HTMLElement;
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
}

function showAuthSection(): void {
  const authSection = document.getElementById('auth-section') as HTMLElement;
  const dashboardSection = document.getElementById('dashboard-section') as HTMLElement;
  authSection.style.display = 'flex';
  dashboardSection.style.display = 'none';
}

function showDashboard(): void {
  const authSection = document.getElementById('auth-section') as HTMLElement;
  const dashboardSection = document.getElementById('dashboard-section') as HTMLElement;
  authSection.style.display = 'none';
  dashboardSection.style.display = 'block';
}

async function handleLogin(e: Event): Promise<void> {
  e.preventDefault();
  
  const emailInput = document.getElementById('login-email') as HTMLInputElement;
  const passwordInput = document.getElementById('login-password') as HTMLInputElement;
  
  try {
    const response = await apiClient.login(emailInput.value, passwordInput.value);
    apiClient.setToken(response.token);
    currentUser = response.user;
    
    (document.getElementById('user-name') as HTMLElement).textContent = currentUser.name;
    showAlert('Login successful!', 'success');
    showDashboard();
    loadDashboard();
    
    // Reset form
    (document.getElementById('login-form-element') as HTMLFormElement).reset();
  } catch (error) {
    showAlert((error as Error).message, 'error');
  }
}

async function handleRegister(e: Event): Promise<void> {
  e.preventDefault();
  
  const nameInput = document.getElementById('register-name') as HTMLInputElement;
  const emailInput = document.getElementById('register-email') as HTMLInputElement;
  const passwordInput = document.getElementById('register-password') as HTMLInputElement;
  const passwordConfirmInput = document.getElementById('register-password-confirm') as HTMLInputElement;
  
  if (passwordInput.value !== passwordConfirmInput.value) {
    showAlert('Passwords do not match', 'error');
    return;
  }
  
  try {
    await apiClient.register(nameInput.value, emailInput.value, passwordInput.value);
    showAlert('Registration successful! Please login.', 'success');
    showLoginForm();
    (document.getElementById('register-form-element') as HTMLFormElement).reset();
  } catch (error) {
    showAlert((error as Error).message, 'error');
  }
}

function handleLogout(): void {
  apiClient.clearToken();
  currentUser = null;
  showAuthSection();
  showLoginForm();
  showAlert('Logged out successfully', 'success');
}

function showAlert(message: string, type: 'success' | 'error' | 'warning'): void {
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
      (document.getElementById('user-name') as HTMLElement).textContent = user.name;
      loadDashboard();
    }).catch(() => {
      showAuthSection();
    });
  } else {
    showAuthSection();
  }
  
  // Login/Register Toggle
  const toggleRegister = document.getElementById('toggle-register') as HTMLElement;
  const toggleLogin = document.getElementById('toggle-login') as HTMLElement;
  
  toggleRegister?.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
  });
  
  toggleLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
  });
  
  // Form Submissions
  const loginForm = document.getElementById('login-form-element') as HTMLFormElement;
  const registerForm = document.getElementById('register-form-element') as HTMLFormElement;
  const logoutBtn = document.getElementById('logout-btn') as HTMLElement;
  
  loginForm?.addEventListener('submit', handleLogin);
  registerForm?.addEventListener('submit', handleRegister);
  logoutBtn?.addEventListener('click', handleLogout);
});
