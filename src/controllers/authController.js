const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const fail = (res, status, code, message, details) =>
    res.status(status).json({ success: false, error: { code, message, details } });

const register = async (req, res) => {
    const { nama, email, password } = req.body || {};
    const details = [];
    if (!nama) details.push({ field: 'nama', issue: 'Wajib diisi' });
    if (!email) details.push({ field: 'email', issue: 'Wajib diisi' });
    if (!password || password.length < 8)
        details.push({ field: 'password', issue: 'Minimal 8 karakter' });
    if (details.length)
        return fail(res, 400, 'VALIDATION_ERROR', 'Input tidak valid', details);

    if (await userModel.findByEmail(email))
        return fail(res, 409, 'CONFLICT', 'Email sudah terdaftar');

    const hash = await bcrypt.hash(password, 10);
    const id = await userModel.create({ nama, email, password: hash });
    res.status(201).json({
        success: true,
        data: { id, nama, email, role: 'user' }
    });
};

const login = async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password)
        return fail(res, 400, 'VALIDATION_ERROR', 'Email dan password wajib diisi');

    const user = await userModel.findByEmail(email);
    const cocok = user && (await bcrypt.compare(password, user.password));
    if (!cocok) return fail(res, 401, 'UNAUTHORIZED', 'Email atau password salah');

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    res.json({
        success: true,
        data: {
            token,
            user: { id: user.id, nama: user.nama, email: user.email, role: user.role }
        }
    });
};

const me = (req, res) => res.json({ success: true, data: req.user });

module.exports = { register, login, me };