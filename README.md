# WhatsApp Messaging with MySQL and WaConsole

Aplikasi ini digunakan untuk mengirim pesan WhatsApp secara otomatis menggunakan data dari tabel di database MySQL. Aplikasi ini memanfaatkan layanan [WaConsole](https://waconsole.apipedia.id) untuk pengiriman pesan dan mencatat laporan hasil pengiriman dalam format CSV.

## Fitur
- Mengambil data penerima dan pesan dari tabel di database MySQL.
- Mengirim pesan WhatsApp menggunakan layanan WaConsole.
- Mencatat laporan pengiriman dalam format CSV, yang berisi informasi penerima, pesan, status, dan JSON respons mentah.
- Menutup aplikasi secara otomatis setelah pengiriman pesan selesai.

## Persiapan

### 1. Instalasi Dependensi
Pastikan Anda telah menginstal Node.js dan npm. Lalu, instal dependensi yang diperlukan dengan perintah berikut:

```bash
npm install mysql2 axios dotenv
```

### 2. Konfigurasi File .env
Buat file `.env` di direktori root aplikasi Anda dan isi dengan konfigurasi berikut (gunakan struktur contoh pada .env.example):

```plaintext
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=mysql_apipedia
APP_KEY=XXXXXX
AUTH_KEY=XXXXX
```

Sesuaikan nilai `DB_HOST`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` dengan informasi database MySQL Anda. Gantilah `APP_KEY` dan `AUTH_KEY` dengan nilai API key dan auth key yang didapatkan dari WaConsole.

## Struktur Database

Pastikan database MySQL Anda memiliki tabel `send_message` dengan struktur sebagai berikut:

```sql
CREATE TABLE `mysql_apipedia`.`send_message` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `penerima` VARCHAR(50) NOT NULL,
    `pesan` TEXT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
```

Anda juga bisa menambahkan data dummy ke dalam tabel ini untuk pengujian, seperti contoh berikut:

```sql
INSERT INTO `send_message` (`id`, `penerima`, `pesan`) VALUES (NULL, '628998937095', 'test');
```

## Cara Kerja

1. Aplikasi membaca data penerima dan pesan dari tabel `send_message` di MySQL.
2. Untuk setiap baris data, aplikasi mengirim pesan WhatsApp menggunakan API dari WaConsole.
3. Status pengiriman (berhasil/gagal) dicatat dalam file `report.csv` bersama dengan respons JSON mentah dari API.
4. Setelah semua pesan terkirim, aplikasi menutup koneksi database dan otomatis berhenti.

## Menjalankan Aplikasi

Untuk menjalankan aplikasi, gunakan perintah berikut:

```bash
node server.js
```

Setelah proses selesai, Anda dapat memeriksa hasil pengiriman di file `report.csv` yang akan berisi laporan dengan format:

| penerima        | pesan   | status | raw_json          |
|-----------------|---------|--------|--------------------|

Contoh laporan:

```csv
penerima,pesan,status,raw_json
628998937095,test,Sukses,"{""message"":""Sent successfully""}"
628998937095,test 2,Gagal,"{""error"":""Invalid recipient""}"
```

## Teknologi yang Digunakan
- **Node.js**: Runtime untuk menjalankan aplikasi JavaScript.
- **MySQL**: Database untuk menyimpan informasi penerima dan pesan.
- **WaConsole API**: API untuk mengirim pesan WhatsApp.
- **Axios**: Library HTTP client untuk melakukan request API.

## Catatan
Pastikan Anda memiliki API key yang valid dari WaConsole untuk menghindari kesalahan pengiriman. Jika terjadi error, pesan akan dicatat dalam laporan CSV untuk evaluasi lebih lanjut.
