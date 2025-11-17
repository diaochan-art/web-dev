// ========== LOADER ==========
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }, 1500);
});

// ========== DARK MODE ==========
const toggle = document.getElementById('darkModeToggle');

if (toggle) {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    toggle.textContent = isDark ? '☀️' : '🌙 ';
  });

  // Apply saved dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    toggle.textContent = '☀️';
  }
}

// ========== PESAN VIA WHATSAPP ==========
document.querySelectorAll('.resto-cta').forEach(btn => {
  btn.addEventListener('click', () => {
    const phone = '6283899610929'; // GANTI NOMOR WA LU!
    const message = 'Halo Mie Fakih! Saya mau pesan:';
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  });
});
