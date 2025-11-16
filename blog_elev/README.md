# Blog Fakih (Eleventy)

Ini adalah blog sederhana menggunakan Eleventy (11ty). Struktur berada di `d:\program\blog_elev`.

Quick start (Windows):

1. Pastikan Node.js terinstall (v16+).
2. Buka PowerShell di folder `d:\program\blog_elev`.
3. Jalankan:

```powershell
npm install
npm run start
```

4. Buka http://localhost:8080 (11ty default port saat serve).

Build untuk deploy:

```powershell
npm run build
```

Hasil build ada di folder `_site`.

RSS Feed:
- Akan tersedia di `_site/rss.xml` setelah build/serve.

Deploy Options:
- GitHub Pages: push repo, set `gh-pages` branch to serve `_site` (use action or build locally and push).
- Netlify: drag & drop `_site` or connect repo and set build command `npm run build` with publish folder `_site`.

Automatic GitHub Pages deploy (provided):

1. Commit and push this repository to GitHub (branch `main`).
2. The workflow `.github/workflows/gh-pages.yml` will run on push and publish the generated site to the `gh-pages` branch using `peaceiris/actions-gh-pages`.
3. In your repository settings -> Pages, set the site source to the `gh-pages` branch (if not automatically configured).

Notes:
- Edit/add post di `src/posts/` sebagai Markdown files named `YYYY-MM-DD-title.md`.
- Static assets dapat diletakkan di `d:\program\blog_elev\assets` dan akan ditransfer ke output.

### Run without npm (prebuilt)

Jika `npm` tidak tersedia di mesin Anda, gunakan folder `_site` yang sudah berisi versi statis situs:

```powershell
cd d:\program\blog_elev\_site
python -m http.server 8000

# lalu buka http://localhost:8000
```

### Push `_site` to GitHub Pages (local, without npm)

Jika Anda ingin mengunggah `_site` ke branch `gh-pages` dari mesin lokal tanpa build tools, ada `push_site.ps1` helper:

```powershell
# dari root repo
.\blog_elev\push_site.ps1 -siteDir "blog_elev\_site" -branch "gh-pages"
```

Script ini membuat commit snapshot dari `_site` dan memaksa push ke `gh-pages` (pastikan Anda memiliki akses write ke repo dan Git tersedia).

### Netlify CMS (admin)

Netlify CMS files berada di `admin/`. Untuk mengaktifkanNetlify CMS di Netlify:

1. Deploy repository ke Netlify (connect repo).
2. Enable *Identity* in Site settings → Identity → Enable Identity.
3. In Identity, Enable *Git Gateway* and follow prompts to create a Git provider connection.
4. Confirm `admin/config.yml` settings match your repo/branch paths. The CMS will be available at `https://<your-site>/admin`.

Jika Anda ingin saya bantu langkah-by-step untuk Netlify CMS setup (screen-by-screen), beri tahu dan saya akan buat panduan terperinci.
