# Meme Dash

Cara menjalankan lokal (Windows PowerShell):

1. Buka PowerShell di folder `d:\program\meme-dash`.
2. Jalankan server sederhana:

```powershell
python -m http.server 8000
```

3. Buka browser ke `http://localhost:8000`.

Kontrol:

- Panah kiri / kanan: pindah lane
- Spasi (Space): lompat
- Ketuk layar: swipe kiri/kanan untuk pindah lane, geser ke atas untuk lompat

Catatan:

- Jika gambar Doge tidak muncul, game tetap dapat dimainkan (ada fallback canvas).
- Untuk mode offline, Service Worker sudah dikonfigurasi untuk cache file dasar.

Enjoy! 🐶