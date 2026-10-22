/* ============================================
   STACKLY Electronics — login_signup.js
   Role-wise Login & Signup Logic
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initRoleSwitcher();
  initFormValidation();
});

/* ── 1. Role Switcher Logic ──────────────── */
function initRoleSwitcher() {
  const roleButtons = document.querySelectorAll('.role-pill');
  const roleInput = document.getElementById('selectedRole');
  const adminSecretGroup = document.getElementById('adminSecretGroup');
  
  if (!roleButtons.length) return;

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all pills in the container
      const container = btn.closest('.role-switcher-container');
      container.querySelectorAll('.role-pill').forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked pill
      btn.classList.add('active');
      
      const role = btn.getAttribute('data-role');
      if (roleInput) roleInput.value = role;

      // Dynamic field visibility for Admin on signup page
      if (adminSecretGroup) {
        if (role === 'admin') {
          adminSecretGroup.classList.remove('d-none');
          const input = adminSecretGroup.querySelector('input');
          if (input) input.setAttribute('required', 'required');
        } else {
          adminSecretGroup.classList.add('d-none');
          const input = adminSecretGroup.querySelector('input');
          if (input) input.removeAttribute('required');
        }
      }
    });
  });
}

/* ── 2. Form Validation & Submission ─────── */
function initFormValidation() {
  const loginForm = document.getElementById('lumisLoginForm');
  const signupForm = document.getElementById('lumisSignupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(loginForm)) {
        simulateAuthSubmit(loginForm, 'login');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(signupForm)) {
        simulateAuthSubmit(signupForm, 'signup');
      }
    });
  }
}

// Simple validation utility
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('.lumis-input[required]');
  
  inputs.forEach(input => {
    // Clear existing error states
    input.classList.remove('is-invalid');
    const formGroup = input.closest('.lumis-form-group');
    if (formGroup) {
      const err = formGroup.querySelector('.invalid-feedback');
      if (err) err.remove();
    }

    if (!input.value.trim()) {
      showInputError(input, 'This field is required');
      isValid = false;
    } else if (input.type === 'email' && !validateEmail(input.value)) {
      showInputError(input, 'Please enter a valid email address');
      isValid = false;
    } else if (input.type === 'password' && input.value.length < 6) {
      showInputError(input, 'Password must be at least 6 characters');
      isValid = false;
    }
  });

  // Terms and conditions checkbox validation on signup
  const termsCheck = form.querySelector('#termsCheck');
  if (termsCheck && !termsCheck.checked) {
    termsCheck.classList.add('is-invalid');
    isValid = false;
  }

  // Password matching check for signup page
  if (form.id === 'lumisSignupForm') {
    const suPass = form.querySelector('#suPass');
    const suConfirmPass = form.querySelector('#suConfirmPass');
    if (suPass && suConfirmPass && suPass.value && suConfirmPass.value) {
      if (suPass.value !== suConfirmPass.value) {
        suConfirmPass.classList.add('is-invalid');
        const formGroup = suConfirmPass.closest('.lumis-form-group');
        if (formGroup) {
          const err = formGroup.querySelector('.invalid-feedback');
          if (err) err.remove();
        }
        showInputError(suConfirmPass, 'Passwords do not match');
        isValid = false;
      }
    }
  }

  return isValid;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showInputError(input, message) {
  input.classList.add('is-invalid');
  const formGroup = input.closest('.lumis-form-group');
  if (formGroup) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
  }
}

/* ── 3. Simulated Auth API Call ──────────── */
function simulateAuthSubmit(form, type) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const role = document.getElementById('selectedRole')?.value || 'customer';
  const emailInput = form.querySelector('input[type="email"]');
  const email = emailInput ? emailInput.value : 'guest@example.com';
  
  // Set loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...`;

  setTimeout(() => {
    // Success simulation
    submitBtn.innerHTML = `<i class="fas fa-check me-2"></i> Success!`;
    submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)';
    submitBtn.style.color = '#ffffff';

    if (type === 'signup') {
      // Redirect to login after successful signup
      window.location.href = 'login.html';
      return;
    }

    // Store user session in localStorage
    localStorage.setItem('lumisUserEmail', email);
    localStorage.setItem('lumisUserRole', role);

    // Redirect to dashboard
    window.location.href = 'dashboard.html';

  }, 1500);
}

/* ── 4. Toast Notification helper ────────── */
function showToast(message) {
  const existing = document.querySelector('.lumis-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'lumis-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 3rem; right: 3rem;
    background: #0d1b2e; color: #f4f8fb;
    padding: 1rem 2rem; border-radius: 99px;
    font-size: 0.9rem; font-family: 'Inter', sans-serif;
    box-shadow: 0 12px 40px rgba(0,0,0,0.35);
    border: 1px solid rgba(0,194,255,0.35);
    z-index: 99999; opacity: 0;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  `;
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
}


