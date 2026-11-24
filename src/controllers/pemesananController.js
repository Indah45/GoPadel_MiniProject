const pemesananModel = require('../models/pemesananModel');

const fail = (res, status, code, message) =>
    res.status(status).json({
        success: false,
        error: { code, message }
    });

// Membuat pemesanan
const create = async (req, res) => {
    try {
        const {
            nama_lapangan,
            tanggal,
            jam_mulai,
            durasi
        } = req.body;
        
        console.log('DATA PEMESANAN:', req.body);

        if (!nama_lapangan || !tanggal || !jam_mulai || !durasi) {
            return fail(res, 400, 'VALIDATION_ERROR', 'Semua data wajib diisi');
        }

        const hargaPerJam = {
            'Lapangan Reguler': 100000,
            'Lapangan Premium': 150000,
            'Lapangan VIP': 200000
        };

        const harga = hargaPerJam[nama_lapangan];

        if (!harga) {
            return fail(res, 400, 'INVALID_COURT', 'Jenis lapangan tidak valid');
        }

        const lama = Number(durasi);

        if (!Number.isInteger(lama) || lama < 1 || lama > 5) {
            return fail(res, 400, 'INVALID_DURATION', 'Durasi harus 1 sampai 5 jam');
        }

        const total_harga = harga * lama;

        const result = await pemesananModel.create({
            user_id: req.user.id,
            nama_lapangan,
            tanggal,
            jam_mulai,
            durasi: lama,
            total_harga
        });

        res.status(201).json({
            success: true,
            message: 'Pemesanan berhasil dibuat',
            data: {
                id: result.insertId,
                nama_lapangan,
                tanggal,
                jam_mulai,
                durasi: lama,
                total_harga
            }
        });

    } catch (error) {
        console.error(error);
        return fail(res, 500, 'SERVER_ERROR', 'Terjadi kesalahan pada server');
    }
};

// Melihat riwayat pemesanan
const getMyOrders = async (req, res) => {
    try {
        const data = await pemesananModel.findByUserId(req.user.id);

        res.json({
            success: true,
            message: 'Riwayat pemesanan berhasil ditampilkan',
            data
        });

    } catch (error) {
        console.error(error);
        return fail(res, 500, 'SERVER_ERROR', 'Gagal mengambil riwayat pemesanan');
    }
};

// Melihat detail pemesanan
const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;

        if (!Number.isInteger(Number(id))) {
            return fail(res, 400, 'INVALID_ID', 'ID pemesanan tidak valid');
        }

        const data = await pemesananModel.findById(id, req.user.id);

        if (!data) {
            return fail(res, 404, 'NOT_FOUND', 'Pemesanan tidak ditemukan');
        }

        res.json({
            success: true,
            message: 'Detail pemesanan berhasil ditampilkan',
            data
        });

    } catch (error) {
        console.error(error);
        return fail(res, 500, 'SERVER_ERROR', 'Gagal mengambil detail pemesanan');
    }
};

// Membatalkan pemesanan
const cancelOrder = async (req, res) => {
    try {
        const id = req.params.id;

        if (!Number.isInteger(Number(id))) {
            return fail(res, 400, 'INVALID_ID', 'ID pemesanan tidak valid');
        }

        const result = await pemesananModel.cancel(id, req.user.id);

        if (result.affectedRows === 0) {
            return fail(
                res,
                404,
                'NOT_FOUND',
                'Pemesanan tidak ditemukan atau tidak dapat dibatalkan'
            );
        }

        res.json({
            success: true,
            message: 'Pemesanan berhasil dibatalkan'
        });

    } catch (error) {
        console.error(error);
        return fail(res, 500, 'SERVER_ERROR', 'Gagal membatalkan pemesanan');
    }
};

module.exports = {
    create,
    getMyOrders,
    getOrderById,
    cancelOrder
};