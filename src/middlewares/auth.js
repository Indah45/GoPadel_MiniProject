const jwt = require('jsonwebtoken');

const fail = (res, status, code, message) =>
    res.status(status).json({ success: false, error: { code, message } });

// Cek token: gagal -> 401
const authenticate = (req, res, next) => {
    const header = req.headers.authorization || '';
    const [tipe, token] = header.split(' ');
    if (tipe !== 'Bearer' || !token)
        return fail(res, 401, 'UNAUTHORIZED', 'Token tidak ditemukan');
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return fail(res, 401, 'UNAUTHORIZED', 'Token tidak valid atau kedaluwarsa');
    }
};

// Cek role: tidak punya izin -> 403
const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
        return fail(res, 403, 'FORBIDDEN', 'Anda tidak memiliki akses');
    next();
};

module.exports = { authenticate, authorize };