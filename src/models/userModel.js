const db = require('../config/database');

const findByEmail = async (email) => {
    const [rows] = await db.query(
        `SELECT u.id, u.nama, u.email, u.password, r.nama_role AS role
         FROM users u
         JOIN roles r ON r.id = u.role_id
         WHERE u.email = ?`,
        [email]
    );
    return rows[0];
};

const create = async ({ nama, email, password }) => {
    const [result] = await db.query(
        'INSERT INTO users (nama, email, password) VALUES (?, ?, ?)',
        [nama, email, password]
    );
    return result.insertId;
};

module.exports = { findByEmail, create };