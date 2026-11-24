console.log("TES EXPRESS DIMULAI");

const express = require('express');

console.log("Express berhasil dipanggil!");

const app = express();

app.listen(3000, () => {
    console.log("Server berhasil berjalan!");
});