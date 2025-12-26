// Meta-Call home page functionality

function join() {
  const usernameEl = document.getElementById('username');
  const roomcodeEl = document.getElementById('roomcode');
  const passwordEl = document.getElementById('password');
  const camEl = document.getElementById('cam');

  const username = usernameEl.value.trim();
  const roomcode = roomcodeEl.value.trim();
  const password = passwordEl.value.trim();
  const cam = camEl.value;

  // Clear previous errors
  removeError(usernameEl);
  removeError(roomcodeEl);

  let hasError = false;
  if (!username) {
    showError(usernameEl, 'This field cannot be empty');
    hasError = true;
  }
  if (!roomcode) {
    showError(roomcodeEl, 'This field cannot be empty');
    hasError = true;
  }
  if (hasError) return;

  // Create form data and submit via POST
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/room';

  const usernameInput = document.createElement('input');
  usernameInput.type = 'hidden';
  usernameInput.name = 'username';
  usernameInput.value = username;

  const roomcodeInput = document.createElement('input');
  roomcodeInput.type = 'hidden';
  roomcodeInput.name = 'roomcode';
  roomcodeInput.value = roomcode;

  const passwordInput = document.createElement('input');
  passwordInput.type = 'hidden';
  passwordInput.name = 'password';
  passwordInput.value = password;

  const camInput = document.createElement('input');
  camInput.type = 'hidden';
  camInput.name = 'cam';
  camInput.value = cam;

  form.appendChild(usernameInput);
  form.appendChild(roomcodeInput);
  form.appendChild(passwordInput);
  form.appendChild(camInput);

  document.body.appendChild(form);
  form.submit();
}

function showError(inputEl, message){
  const container = inputEl.closest('.mb-3');
  if(!container) return;
  removeError(inputEl);
  const err = document.createElement('div');
  err.className = 'form-error';
  err.textContent = message;
  err.style.color = '#ff6b6b';
  err.style.fontSize = '12px';
  err.style.marginTop = '6px';
  container.appendChild(err);
}

function removeError(inputEl){
  const container = inputEl.closest('.mb-3');
  if(!container) return;
  const prev = container.querySelector('.form-error');
  if(prev) prev.remove();
}

// Optional: Allow Enter key to submit form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        join();
      }
    });
  }
});
