require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
const kategoriRoutes = require('./routes/kategoriRoutes');
const authRoutes = require('./routes/authRoutes');
const pemesananRoutes = require('./routes/pemesananRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Menampilkan halaman frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Halaman utama website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Routes
app.use('/api/v1/kategori', kategoriRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pemesanan', pemesananRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: 'Terjadi kesalahan pada server'
    });
});

// Menjalankan server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await db.query('SELECT 1');
        console.log('Database berhasil terhubung!');

        app.listen(PORT, () => {
            console.log('Server berjalan di port ' + PORT);
        });
    } catch (error) {
        console.error('Koneksi database gagal:', error.message);
    }
};

startServer();