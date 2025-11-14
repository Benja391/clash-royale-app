function switchView(viewId) {
  ['loginView', 'registerView', 'appView'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const target = document.getElementById(viewId);
  if (target) {
    target.style.display = viewId === 'appView' ? 'block' : 'flex';
  }
}

function showApp() {
  const user = localStorage.getItem('sessionUser');
  if (!user) return;

  switchView('appView');
 document.getElementById('sessionUser').textContent = `👤 ${user}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('sessionUser');
  switchView(user ? 'appView' : 'registerView');
  if (user) showApp();
});

document.addEventListener('click', (e) => {
  if (e.target.id === 'logoutBtn') {
    localStorage.removeItem('sessionUser');
    switchView('loginView');
  }
});

document.getElementById('registerBtn').addEventListener('click', () => {
  const user = document.getElementById('registerUser').value.trim();
  const pass = document.getElementById('registerPass').value.trim();
  const confirm = document.getElementById('registerPassConfirm').value.trim();

  if (!user || !pass || !confirm || pass !== confirm) return;

  const users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[user]) return;

  users[user] = pass;
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('sessionUser', user);
  showApp();
});

document.getElementById('loginBtn').addEventListener('click', () => {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();

  const users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[user] === pass) {
    localStorage.setItem('sessionUser', user);
    showApp();
  }
});

document.getElementById('gotoRegisterBtn').addEventListener('click', () => {
  switchView('registerView');
});

document.getElementById('gotoLoginBtn').addEventListener('click', () => {
  switchView('loginView');
});
