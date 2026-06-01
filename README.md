# EcoLens Express Backend

Backend RESTful API untuk aplikasi EcoLens, yaitu aplikasi yang membantu pengguna mengetahui estimasi emisi karbon (CO2 footprint) dari makanan yang dikonsumsi melalui teknologi AI.

Dibangun menggunakan Express.js dengan database MySQL, dan terintegrasi dengan AI service berbasis FastAPI yang menjalankan model klasifikasi gambar makanan.


## Persyaratan

Pastikan Node.js versi 18 ke atas sudah terinstall. Bisa didownload di https://nodejs.org.


## Instalasi

Clone repository ini lalu masuk ke foldernya.

```bash
git clone https://github.com/rekzydwi/BackEnd-Ecolens-Express.git
cd BackEnd-Ecolens-Express
```

Install semua dependencies.

```bash
npm install
```

Salin file `.env.example` menjadi `.env` lalu sesuaikan isinya.

```bash
cp .env.example .env
```

Pastikan database `ecolens` sudah dibuat di MySQL sebelum menjalankan server. Tabel akan otomatis terbuat saat server pertama kali dijalankan.

Jalankan server.

```bash
npm run dev
```


## Konfigurasi Environment

Isi file `.env` sesuai konfigurasi yang digunakan. Jangan cantumkan nilai asli credential ke repository, gunakan `.env.example` sebagai panduannya.
PORT=3000
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=ecolens
JWT_SECRET=
JWT_EXPIRES_IN=1h
FASTAPI_URL=

## Endpoint

**Autentikasi**

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | /auth/register | Daftar akun baru |
| POST | /auth/login | Login dan dapatkan token |
| GET | /auth/me | Ambil data profil (butuh token) |
| POST | /auth/logout | Logout (butuh token) |

**Riwayat Scan**

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | /result | Simpan hasil scan CO2 (butuh token) |
| GET | /result | Ambil ringkasan riwayat 7 hari (butuh token) |

**Analisis CO2**

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | /static-analysis | Analisis gambar makanan, kirim sebagai form-data dengan field `gambar` |


## Catatan

Endpoint `/static-analysis` membutuhkan AI service FastAPI yang sedang berjalan. Pastikan nilai `FASTAPI_URL` di `.env` sudah diisi dengan URL yang benar.

Untuk fitur kamera realtime, frontend terhubung langsung ke AI service via WebSocket tanpa melewati backend ini.

Password pengguna dienkripsi menggunakan bcrypt sebelum disimpan ke database.


## Struktur Proyek