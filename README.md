# scahp

Isi root repo ini adalah **hasil build statis** (`index.html`, `assets/`) yang di-serve langsung oleh GitHub Pages dari branch `main`.

Source code aplikasinya ada di folder [`/app`](./app) (React + Vite + Tailwind).

## Development

```bash
cd app
npm install
npm run dev
```

## Deploy ulang ke Pages

Repo ini pakai GitHub Pages source **"Deploy from a branch: main"** (bukan GitHub Actions), jadi tidak ada auto-build. Setiap ada perubahan, build manual lalu salin hasilnya ke root:

```bash
cd app
npm run build
cd ..
rm -rf assets index.html favicon.svg icons.svg
cp -r app/dist/. .
git add -A
git commit -m "Deploy: <deskripsi perubahan>"
git push
```
