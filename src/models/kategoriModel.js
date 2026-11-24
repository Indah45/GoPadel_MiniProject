const db = require('../config/database');

// Menampilkan semua kategori
const getAll = async () => {
    const [rows] = await db.query(
        'SELECT * FROM kategori WHERE deleted_at IS NULL'
    );
    return rows;
};

// Menampilkan kategori berdasarkan ID
const getById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM kategori WHERE id = ? AND deleted_at IS NULL',
        [id]
    );
    return rows[0];
};

// Menambahkan kategori
const create = async (data) => {
    const [result] = await db.query(
        'INSERT INTO kategori (kode_kategori, nama_kategori) VALUES (?, ?)',
        [data.kode_kategori, data.nama_kategori]
    );
    return result.insertId;
};

// Mengubah kategori
const update = async (id, data) => {
    const [result] = await db.query(
        'UPDATE kategori SET kode_kategori = ?, nama_kategori = ? WHERE id = ? AND deleted_at IS NULL',
        [data.kode_kategori, data.nama_kategori, id]
    );
    return result.affectedRows;
};

// Menghapus kategori (Soft Delete)
const remove = async (id) => {
    const [result] = await db.query(
        'UPDATE kategori SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
        [id]
    );
    return result.affectedRows;
};

// Export semua fungsi
module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};