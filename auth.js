import { supabase } from './supabaseClient.js';

const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const toggleAuthBtn = document.getElementById('toggle-auth');
const toggleText = document.getElementById('toggle-text');
const errorMsg = document.getElementById('error-msg');

let isLogin = true;

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.href = 'todo.html';
  }
});

toggleAuthBtn.addEventListener('click', (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  errorMsg.textContent = '';
  
  if (isLogin) {
    authTitle.textContent = 'Welcome Back';
    authSubtitle.textContent = 'Login to continue to your To-Do List';
    submitBtn.textContent = 'Login';
    toggleText.textContent = "Don't have an account?";
    toggleAuthBtn.textContent = 'Create Account';
  } else {
    authTitle.textContent = 'Create Account';
    authSubtitle.textContent = 'Sign up to manage your daily tasks';
    submitBtn.textContent = 'Sign Up';
    toggleText.textContent = 'Already have an account?';
    toggleAuthBtn.textContent = 'Login';
  }
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (isLogin) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      errorMsg.textContent = error.message;
    } else {
      window.location.href = 'todo.html';
    }
  } else {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      errorMsg.textContent = error.message;
    } else {
      alert('Signup successful! Check your email for confirmation or login.');
      isLogin = true;
      toggleAuthBtn.click();
    }
  }
});