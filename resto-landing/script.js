// LEVEL PEDAS
const pedas = document.getElementById('pedas');
const levelText = document.getElementById('level-text');
const levels = ['Level 0 - Aman', 'Level 1 - Biasa', 'Level 2 - Nendang', 'Level 3 - Gila!', 'Level 4 - Neraka', 'Level 5 - Dewa!!'];
pedas.addEventListener('input', () => {
  levelText.textContent = levels[pedas.value];
});

// KERANJANG
let keranjang = [];
const keranjangFloat = document.querySelector('.keranjang-float');
const itemCount = document.getElementById('item-count');
const totalHarga = document.getElementById('total-harga');
const keranjangList = document.getElementById('keranjang-list');

document.querySelectorAll('.pesan-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.dataset.item;
    const price = parseInt(btn.dataset.price);
    keranjang.push({ item, price });
    updateKeranjang();
  });
});

function updateKeranjang() {
  if (keranjang.length === 0) {
    keranjangFloat.style.display = 'none';
    return;
  }
  keranjangFloat.style.display = 'block';
  itemCount.textContent = keranjang.length;
  const total = keranjang.reduce((sum, i) => sum + i.price, 0);
  totalHarga.textContent = `Rp ${total.toLocaleString()}`;

  keranjangList.innerHTML = '';
  keranjang.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'keranjang-item';
    div.innerHTML = `<span>${item.item}</span><span>Rp ${item.price.toLocaleString()}</span>`;
    keranjangList.appendChild(div);
  });
}

// CHECKOUT WA
document.getElementById('checkout-wa').addEventListener('click', () => {
  const phone = "628123456789"; // GANTI NOMOR LU
  let message = "Halo Mie Fakih! Saya mau pesan:\n";
  let total = 0;
  keranjang.forEach(item => {
    message += `- ${item.item}: Rp ${item.price.toLocaleString()}\n`;
    total += item.price;
  });
  message += `\nTotal: Rp ${total.toLocaleString()}\nLevel Pedas: ${levelText.textContent}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
});