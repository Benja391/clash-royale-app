const toggleBtn = document.getElementById('themeToggle');
const body = document.body;

// Cargar preferencia guardada
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light');
}

// Activar toggle solo si el botón existe
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light');
    const theme = body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  });
}
