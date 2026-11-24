const kategoriModel = require('../models/kategoriModel');

// Menampilkan semua kategori
const getAll = async (req, res, next) => {
    try {
        const data = await kategoriModel.getAll();

        res.status(200).json({
            message: 'Data kategori berhasil ditampilkan',
            data
        });
    } catch (error) {
        next(error);
    }
};

// Menampilkan kategori berdasarkan ID
const getById = async (req, res, next) => {
    try {
        const data = await kategoriModel.getById(req.params.id);

        if (!data) {
            return res.status(404).json({
                message: 'Kategori tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Detail kategori berhasil ditampilkan',
            data
        });
    } catch (error) {
        next(error);
    }
};

// Menambahkan kategori
const create = async (req, res, next) => {
    try {
        const { kode_kategori, nama_kategori } = req.body;

        if (!kode_kategori || !nama_kategori) {
            return res.status(400).json({
                message: 'Kode kategori dan nama kategori wajib diisi'
            });
        }

        const id = await kategoriModel.create({
            kode_kategori,
            nama_kategori
        });

        res.status(201).json({
            message: 'Kategori berhasil ditambahkan',
            id
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Kode kategori sudah terdaftar'
            });
        }

        next(error);
    }
};

// Mengubah kategori
const update = async (req, res, next) => {
    try {
        const { kode_kategori, nama_kategori } = req.body;

        if (!kode_kategori || !nama_kategori) {
            return res.status(400).json({
                message: 'Kode kategori dan nama kategori wajib diisi'
            });
        }

        const result = await kategoriModel.update(req.params.id, {
            kode_kategori,
            nama_kategori
        });

        if (!result) {
            return res.status(404).json({
                message: 'Kategori tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Kategori berhasil diperbarui'
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Kode kategori sudah terdaftar'
            });
        }

        next(error);
    }
};

// Menghapus kategori (Soft Delete)
const remove = async (req, res, next) => {
    try {
        const result = await kategoriModel.remove(req.params.id);

        if (!result) {
            return res.status(404).json({
                message: 'Kategori tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Kategori berhasil dihapus'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};