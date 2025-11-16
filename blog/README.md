# Blog Fakih (statis)

Folder ini berisi blog statis sederhana.

Menjalankan lokal:

```powershell
cd d:\program\blog
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

Deploy cepat:
- GitHub Pages: push repo ke GitHub, enable GitHub Pages dari branch `main` (folder root atau `docs/`).
- Netlify: drag-and-drop folder `blog/` ke Netlify Drop.

Konten:
- `index.html` — daftar post
- `style.css` — styling
- `posts/` — setiap post sebagai file HTML

Mau saya hubungkan tombol `📝 Blog` di root `index.html` sekarang? (Saya akan update link ke `blog/` jika Anda setuju.)