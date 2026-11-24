const db = require('../config/database');

// Membuat pemesanan
const create = async (data) => {
    const {
        user_id,
        nama_lapangan,
        tanggal,
        jam_mulai,
        durasi,
        total_harga
    } = data;

    const [result] = await db.query(
        `INSERT INTO pemesanan
        (user_id, nama_lapangan, tanggal, jam_mulai, durasi, total_harga)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            user_id,
            nama_lapangan,
            tanggal,
            jam_mulai,
            durasi,
            total_harga
        ]
    );

    return result;
};

// Menampilkan pemesanan berdasarkan pengguna
const findByUserId = async (user_id) => {
    const [rows] = await db.query(
        'SELECT * FROM pemesanan WHERE user_id = ? ORDER BY created_at DESC',
        [user_id]
    );

    return rows;
};

// Menampilkan detail pemesanan berdasarkan ID dan pengguna
const findById = async (id, user_id) => {
    const [rows] = await db.query(
        'SELECT * FROM pemesanan WHERE id = ? AND user_id = ?',
        [id, user_id]
    );

    return rows[0];
};

// Membatalkan pemesanan
const cancel = async (id, user_id) => {
    const [result] = await db.query(
        `UPDATE pemesanan
         SET status = 'Dibatalkan'
         WHERE id = ? AND user_id = ? AND status = 'Menunggu'`,
        [id, user_id]
    );

    return result;
};

module.exports = {
    create,
    findByUserId,
    findById,
    cancel
};