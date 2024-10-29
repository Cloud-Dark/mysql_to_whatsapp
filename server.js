require('dotenv').config();
const mysql = require('mysql2');
const axios = require('axios');
const fs = require('fs');

// Konfigurasi database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Nama file laporan CSV
const reportFile = 'report.csv';

// Menulis header CSV
fs.writeFileSync(reportFile, 'penerima,pesan,status,raw_json\n');

// Fungsi untuk mencatat laporan ke CSV
function logReport(penerima, pesan, status, rawJson) {
  const logEntry = `"${penerima}","${pesan}","${status}","${JSON.stringify(rawJson).replace(/"/g, '""')}"\n`;
  fs.appendFileSync(reportFile, logEntry, (err) => {
    if (err) throw err;
  });
}

// Fungsi untuk mengirim pesan
async function sendMessage(to, message) {
  try {
    const response = await axios.post('https://waconsole.apipedia.id/api/create-message', {
      appkey: process.env.APP_KEY,
      authkey: process.env.AUTH_KEY,
      to: to,
      message: message,
    });
    console.log(`Pesan terkirim ke ${to}: ${message}`);
    logReport(to, message, 'Sukses', response.data);
  } catch (error) {
    console.error(`Gagal mengirim pesan ke ${to}: ${message}`, error.message);
    logReport(to, message, 'Gagal', error.response ? error.response.data : error.message);
  }
}

// Ambil data dari tabel dan kirim pesan
function sendMessages() {
  db.query('SELECT penerima, pesan FROM send_message', async (error, results) => {
    if (error) {
      return console.error('Gagal mengambil data dari database:', error);
    }

    for (const row of results) {
      await sendMessage(row.penerima, row.pesan);
    }

    // Tutup koneksi database dan aplikasi setelah semua pesan dikirim
    db.end();
    console.log('Laporan CSV disimpan di', reportFile);
    process.exit();
  });
}

// Jalankan fungsi pengiriman pesan
sendMessages();
