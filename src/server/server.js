const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('API Padel Berhasil Berjalan!');
});

app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});