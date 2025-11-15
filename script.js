// script.js - 7 Hari Ngoding Fakih

// LOADER
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
  }, 1500);
});

// DARK MODE
document.getElementById('darkModeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
});
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// SHARE CV
function shareCV() {
  const url = location.href;
  if (navigator.share) {
    navigator.share({ title: 'CV Fakih', url });
  } else {
    navigator.clipboard.writeText(url);
    alert('Link disalin: ' + url);
  }
}