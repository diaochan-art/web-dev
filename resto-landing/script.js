// ==================== STOCK MENU ====================
const stock = {
  'Mie Goreng': 10,
  'Mie Kuah': 8,
  'Es Teh': 15,
  'Mie Spesial + Es Teh (Promo)': 5
};

// UPDATE STOCK UI SAAT PAGE LOAD
function updateStockUI() {
  document.querySelectorAll('.card, .special-promo .pesan-btn').forEach(btn => {
    const itemName = btn.getAttribute('data-item') || 
                     btn.closest('.card')?.querySelector('h3')?.textContent ||
                     btn.closest('.promo-info')?.querySelector('h3')?.textContent;
    if (itemName && stock[itemName] !== undefined) {
      const stockLeft = stock[itemName];
      const parent = btn.closest('.card') || btn.closest('.promo-info');
      let badge = parent.querySelector('.stock-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'stock-badge';
        parent.appendChild(badge);
      }
      if (stockLeft <= 0) {
        btn.disabled = true;
        btn.textContent = 'Habis!';
        btn.style.background = '#999';
        badge.textContent = 'STOCK HABIS';
        badge.style.background = '#ff3b30';
      } else if (stockLeft <= 3) {
        badge.textContent = `Sisa ${stockLeft}!`;
        badge.style.background = '#ff9500';
      } else {
        badge.remove();
      }
    }
  });
}

// ==================== LEVEL PEDAS SLIDER ====================
const pedas = document.getElementById('pedas');
const levelText = document.getElementById('level-text');
const levels = ['Level 0 - Aman 😇', 'Level 1 - Biasa 😊', 'Level 2 - Nendang 🔥', 'Level 3 - Gila! 🤪', 'Level 4 - Neraka 😈', 'Level 5 - Dewa!! 👑'];
if (pedas && levelText) {
  pedas.addEventListener('input', () => levelText.textContent = levels[pedas.value]);
}

// ==================== KERANJANG SYSTEM ====================
let keranjang = [];
const keranjangEl = document.getElementById('keranjang');
const itemCount = document.getElementById('item-count');
const totalHarga = document.getElementById('total-harga');
const keranjangList = document.getElementById('keranjang-list');

function addToCart(item, price) {
  if (stock[item] <= 0) {
    alert(`Maaf, ${item} sudah habis! 😭`);
    return;
  }
  const existing = keranjang.find(i => i.item === item);
  if (existing) {
    if (existing.qty >= stock[item]) {
      alert(`Stock ${item} tinggal ${stock[item]}! Gak bisa nambah lagi.`);
      return;
    }
    existing.qty += 1;
  } else {
    keranjang.push({ item, price, qty: 1 });
  }
  stock[item] -= 1; // KURANGI STOCK
  updateKeranjang();
  updateStockUI();
}

function changeQty(index, change) {
  const item = keranjang[index];
  const newQty = item.qty + change;
  if (newQty > stock[item.item] + item.qty) {
    alert(`Stock ${item.item} gak cukup!`);
    return;
  }
  if (newQty <= 0) {
    removeItem(index);
  } else {
    const diff = change > 0 ? change : -change;
    stock[item.item] += change < 0 ? diff : -diff;
    item.qty = newQty;
    updateKeranjang();
    updateStockUI();
  }
}

function removeItem(index) {
  const item = keranjang[index];
  stock[item.item] += item.qty; // KEMBALIKAN STOCK
  keranjang.splice(index, 1);
  updateKeranjang();
  updateStockUI();
}

function updateKeranjang() {
  if (keranjang.length === 0) {
    keranjangEl.style.display = 'none';
    return;
  }
  keranjangEl.style.display = 'block';
  itemCount.textContent = keranjang.reduce((sum, i) => sum + i.qty, 0);
  const total = keranjang.reduce((sum, i) => sum + (i.price * i.qty), 0);
  totalHarga.textContent = `Rp ${total.toLocaleString('id-ID')}`;

  keranjangList.innerHTML = '';
  keranjang.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'keranjang-item';
    div.innerHTML = `
      <div class="item-name">${item.item}</div>
      <div class="qty-control">
        <button onclick="changeQty(${index}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>
      <div class="item-price">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</div>
      <span class="hapus" onclick="removeItem(${index})">×</span>
    `;
    keranjangList.appendChild(div);
  });
}

// ==================== COUNTDOWN PROMO ====================
const countdownEl = document.getElementById('timer');
if (countdownEl) {
  const promoEnd = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
  const updateCountdown = () => {
    const distance = promoEnd - new Date().getTime();
    if (distance < 0) {
      countdownEl.textContent = "Promo Habis! 😭";
      return;
    }
    const days = Math.floor(distance / (86400000));
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    countdownEl.textContent = `${days}d ${hours}j ${minutes}m`;
  };
  updateCountdown();
  setInterval(updateCountdown, 60000);
}

// ==================== NOTIF ADMIN + AUTO REPLY ====================
document.getElementById('checkout-wa')?.addEventListener('click', () => {
  const adminWA = "628123456789"; // NOMOR ADMIN
  const customerWA = prompt("Masukkan nomor WA kamu (untuk konfirmasi):", "62");
  if (!customerWA || customerWA.length < 10) {
    alert("Nomor WA wajib diisi!");
    return;
  }

  let total = 0;
  let messageCustomer = "✅ *Pesanan Mie Fakih Diterima!*\n\n";
  let messageAdmin = "🔔 *ORDER BARU MASUK!*\n\n";

  keranjang.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    const line = `• ${item.item} x${item.qty} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    messageCustomer += line;
    messageAdmin += line;
  });

  const level = levelText ? levelText.textContent : "Tidak dipilih";
  messageCustomer += `\n🔥 Level Pedas: ${level}\n💰 Total: Rp ${total.toLocaleString('id-ID')}\n\nEstimasi siap: 15 menit\nTerima kasih! 🙌`;
  messageAdmin += `\n🔥 Level: ${level}\n💰 Total: Rp ${total.toLocaleString('id-ID')}\n📱 Customer: ${customerWA}\n⏰ ${new Date().toLocaleString('id-ID')}`;

  // KIRIM KE CUSTOMER
  setTimeout(() => {
    window.open(`https://wa.me/${customerWA}?text=${encodeURIComponent(messageCustomer)}`, '_blank');
  }, 500);

  // KIRIM KE ADMIN
  setTimeout(() => {
    window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(messageAdmin)}`, '_blank');
  }, 1000);

  // RESET KERANJANG
  keranjang = [];
  updateKeranjang();
  updateStockUI();
  alert("Pesanan terkirim! Cek WA ya bro 😎");
});

// ==================== BIND BUTTON + INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  // MENU GRID
  document.querySelectorAll('.card').forEach((card, i) => {
    const btn = card.querySelector('.pesan-btn');
    const items = ['Mie Goreng', 'Mie Kuah', 'Es Teh'];
    const prices = [15000, 12000, 5000];
    if (btn) {
      btn.setAttribute('data-item', items[i]);
      btn.onclick = () => addToCart(items[i], prices[i]);
    }
  });

  // PROMO
  const promoBtn = document.querySelector('.special-promo .pesan-btn');
  if (promoBtn) {
    promoBtn.setAttribute('data-item', 'Mie Spesial + Es Teh (Promo)');
    promoBtn.onclick = () => addToCart('Mie Spesial + Es Teh (Promo)', 20000);
  }
  // DI CHECKOUT
document.getElementById('checkout-wa').addEventListener('click', () => {
  const total = keranjang.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('qris-total').textContent = `Rp ${total.toLocaleString()}`;
  document.getElementById('qris-popup').style.display = 'block';
});

function closeQRIS() {
  document.getElementById('qris-popup').style.display = 'none';
  keranjang = [];
  updateKeranjang();
}

  updateStockUI();
});