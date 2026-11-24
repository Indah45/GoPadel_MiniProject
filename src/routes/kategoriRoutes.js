const express = require('express');
const router = express.Router();

const kategoriController = require('../controllers/kategoriController');

// READ - Menampilkan semua kategori
router.get('/', kategoriController.getAll);

// READ - Menampilkan detail kategori
router.get('/:id', kategoriController.getById);

// CREATE - Menambahkan kategori
router.post('/', kategoriController.create);

// UPDATE - Memperbarui kategori
router.put('/:id', kategoriController.update);

// DELETE - Menghapus kategori
router.delete('/:id', kategoriController.remove);

module.exports = router;