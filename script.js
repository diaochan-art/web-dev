// DARK MODE
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// LOADING
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 500);
  }, 1500);
});

// SHARE
function shareCV() {
  if (navigator.share) {
    navigator.share({
      title: 'CV Fakih Abdul Aziz - Web Developer',
      text: 'Cek CV interaktif saya! 🚀',
      url: window.location.href
    });
  } else {
    prompt('Salin link ini:', window.location.href);
  }
}