# Resume Proyek Aplikasi Kuesioner AHP e-Audit

## Tujuan Proyek

Proyek ini membangun website kuesioner berbasis **Analytic Hierarchy Process (AHP)** untuk penelitian:

**Pemilihan Data Analytics Stack untuk e-Audit dalam Pemeriksaan Pajak**

Aplikasi ditujukan untuk responden pakar/praktisi yang memiliki pengalaman di bidang pemeriksaan pajak, e-Audit, data analytics, sistem informasi, atau pengembangan aplikasi pendukung pemeriksaan.

## Sumber Kebutuhan

Kebutuhan aplikasi disusun berdasarkan dokumen:

`Kerangka_Konsepsual_Kuesioner_AHP_eAudit.docx`

Dokumen tersebut memuat kerangka konseptual, definisi operasional, metode penelitian, rancangan kuesioner, struktur AHP, dan arahan implementasi web.

## Struktur AHP

### Level 1: Tujuan

Menentukan data analytics stack yang paling tepat untuk mendukung pelaksanaan e-Audit dalam pemeriksaan pajak.

### Level 2: Kriteria

Terdapat 6 kriteria utama:

1. K1 - Data Connectivity and Ingestion
2. K2 - Data Preparation and Management
3. K3 - Audit Analytics and Testing Capability
4. K4 - Advanced Analytics Capability
5. K5 - Reporting and Audit Communication
6. K6 - Governance, Security, and Operational Feasibility

### Level 3: Subkriteria

Terdapat 18 subkriteria, masing-masing 3 subkriteria untuk setiap kriteria utama.

### Level 4: Alternatif

Terdapat 4 alternatif data analytics stack:

1. A - Spreadsheet-centric lightweight stack
2. B - Low-code analytics stack
3. C - Script-assisted open analytics stack
4. D - Reporting-oriented hybrid stack

## Fitur Utama Website

Aplikasi berbentuk wizard multi-step dengan bagian berikut:

1. Landing page / pengantar penelitian
2. Persetujuan responden
3. Profil responden
4. Panduan skala AHP
5. Validasi kriteria
6. Validasi subkriteria
7. Validasi alternatif
8. Perbandingan berpasangan antarkriteria
9. Perbandingan berpasangan antarsubkriteria
10. Perbandingan berpasangan alternatif terhadap setiap subkriteria
11. Pertanyaan terbuka
12. Review jawaban
13. Submit berhasil

## Jumlah Pertanyaan Pairwise

Aplikasi menghasilkan perbandingan berpasangan secara otomatis:

- 15 perbandingan antarkriteria
- 18 perbandingan antarsubkriteria
- 108 perbandingan alternatif terhadap subkriteria

Total perbandingan AHP: **141 pertanyaan pairwise**.

## Fitur Teknis

Aplikasi mendukung:

- Skala Saaty 1-9
- Penyimpanan nilai reciprocal AHP
- Autosave ke LocalStorage
- Resume pengisian dari browser yang sama
- Export data ke JSON
- Export data ke CSV
- Perhitungan bobot AHP
- Perhitungan consistency ratio
- Peringatan jika consistency ratio melebihi batas yang diterima
- Submit data ke Google Sheets melalui Google Apps Script
- Tampilan responsif desktop dan mobile

## Integrasi Google Sheets

Aplikasi menyediakan fitur pengiriman data ke Google Sheets menggunakan Google Apps Script Web App.

File script yang tersedia:

- `google_apps_script.js` dari repository GitHub
- `google-apps-script.js` dari implementasi tambahan lokal

Cara umum penggunaan:

1. Buat Google Sheet baru.
2. Buka menu **Extensions > Apps Script**.
3. Tempel salah satu script Google Apps Script.
4. Deploy sebagai **Web app**.
5. Set akses menjadi **Anyone with the link**.
6. Salin URL Web App.
7. Masukkan URL tersebut ke bagian submit/review aplikasi.

## Teknologi

Stack aplikasi:

- React
- Vite
- Tailwind CSS
- Lucide React
- LocalStorage
- Google Apps Script untuk integrasi Google Sheets

## Cara Menjalankan

Install dependency:

```powershell
npm.cmd install
```

Jalankan dev server:

```powershell
npm.cmd run dev -- --host 0.0.0.0 --port 5173
```

Buka aplikasi:

```text
http://localhost:5173
```

Build production:

```powershell
npm.cmd run build
```

Preview production build:

```powershell
npm.cmd run preview
```

## Catatan Perbaikan Blank Screen

Setelah sinkronisasi dari repository GitHub `ryanagatha/apps_kuesioner`, halaman sempat blank karena error runtime dari Vite dev client:

```text
ReferenceError: __BUNDLED_DEV__ is not defined
```

Perbaikan dilakukan dengan menurunkan versi dependency:

```json
"vite": "^7.3.5",
"@vitejs/plugin-react": "^5.0.0"
```

Setelah dependency diperbarui dan dev server direstart, aplikasi berhasil tampil kembali di:

```text
http://localhost:5173
```

Build production juga berhasil.

## Status Terakhir

Status proyek saat resume ini dibuat:

- Aplikasi sudah tersedia di workspace.
- Dependency sudah terpasang.
- Dev server berjalan di port 5173.
- Halaman landing sudah berhasil dirender.
- Build production berhasil.
- Integrasi Google Sheets tersedia melalui file Apps Script.

