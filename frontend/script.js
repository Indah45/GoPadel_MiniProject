const API_URL = 'http://localhost:3000/api/v1/auth';
const PEMESANAN_URL = 'http://localhost:3000/api/v1/pemesanan';

// Membuka form Login
function bukaLogin() {
tutupModal();
document.getElementById('loginModal').style.display = 'flex';
}

// Membuka form Register
function bukaRegister() {
tutupModal();
document.getElementById('registerModal').style.display = 'flex';
}

// Menutup semua modal
function tutupModal() {
document.getElementById('loginModal').style.display = 'none';
document.getElementById('registerModal').style.display = 'none';
}

// Register
document.getElementById('registerForm').addEventListener('submit', async function(e) {
e.preventDefault();

const nama = document.getElementById('registerNama').value;
const email = document.getElementById('registerEmail').value;
const password = document.getElementById('registerPassword').value;

try {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nama, email, password })
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error?.message || 'Pendaftaran gagal');
        return;
    }

    alert('Pendaftaran berhasil! Silakan login.');
    document.getElementById('registerForm').reset();
    bukaLogin();

} catch (error) {
    alert('Tidak dapat terhubung ke server.');
    console.error(error);
}

});

// Login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
e.preventDefault();

const email = document.getElementById('loginEmail').value;
const password = document.getElementById('loginPassword').value;

try {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error?.message || 'Login gagal');
        return;
    }

    localStorage.setItem('token', result.data.token);
    localStorage.setItem('user', JSON.stringify(result.data.user));

    alert('Login berhasil! Selamat datang di GoPadel.');

    tutupModal();
    document.getElementById('loginForm').reset();

    updateNavbar();

} catch (error) {
    alert('Tidak dapat terhubung ke server.');
    console.error(error);
}

});

// Memilih dan memesan lapangan
async function pesanLapangan(namaLapangan) {
const token = localStorage.getItem('token');

if (!token) {
    alert('Silakan login terlebih dahulu untuk memesan lapangan.');
    bukaLogin();
    return;
}

const tanggal = prompt('Masukkan tanggal pemesanan (YYYY-MM-DD):');
if (!tanggal) return;

const jam_mulai = prompt('Masukkan jam mulai (HH:MM):');
if (!jam_mulai) return;

const durasi = prompt('Masukkan durasi bermain (1-5 jam):');
if (!durasi) return;

try {
    const response = await fetch(PEMESANAN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nama_lapangan: namaLapangan,
            tanggal: tanggal,
            jam_mulai: jam_mulai,
            durasi: Number(durasi)
        })
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error?.message || 'Pemesanan gagal');
        return;
    }

    alert('Pemesanan berhasil dibuat!');

} catch (error) {
    console.error(error);
    alert('Tidak dapat terhubung ke server.');
}

}

// Mengatur tampilan navbar
function updateNavbar() {
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const guestButtons = document.getElementById('guestButtons');
const userButtons = document.getElementById('userButtons');
const welcomeUser = document.getElementById('welcomeUser');
const menuRiwayat = document.getElementById('menuRiwayat');

if (token && user) {
    guestButtons.style.display = 'none';
    userButtons.style.display = 'flex';
    menuRiwayat.style.display = 'block';
    welcomeUser.textContent = 'Halo, ' + user.nama;
} else {
    guestButtons.style.display = 'flex';
    userButtons.style.display = 'none';
    menuRiwayat.style.display = 'none';
    document.getElementById('riwayat').style.display = 'none';
}

}

// Logout
function logout() {
localStorage.removeItem('token');
localStorage.removeItem('user');

alert('Anda berhasil logout dari GoPadel.');
updateNavbar();

}

// Menampilkan riwayat pemesanan
async function tampilkanRiwayat() {
const token = localStorage.getItem('token');
const riwayat = document.getElementById('riwayat');
const daftar = document.getElementById('daftarRiwayat');

if (!token) {
    alert('Silakan login terlebih dahulu.');
    bukaLogin();
    return;
}

riwayat.style.display = 'block';
daftar.innerHTML = '<p>Memuat riwayat pemesanan...</p>';

try {
    const response = await fetch(PEMESANAN_URL, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const result = await response.json();

    if (!response.ok) {
        daftar.innerHTML = '<p>Gagal mengambil riwayat pemesanan.</p>';
        return;
    }

    if (!result.data || result.data.length === 0) {
        daftar.innerHTML = '<p>Belum ada riwayat pemesanan.</p>';
        return;
    }

    daftar.innerHTML = result.data.map(item => `
        <div class="court-card">
            <h3>${item.nama_lapangan}</h3>
            <p>Tanggal: ${item.tanggal}</p>
            <p>Jam Mulai: ${String(item.jam_mulai).substring(0, 5)}</p>
            <p>Durasi: ${item.durasi} jam</p>
            <p>Total Harga: Rp ${Number(item.total_harga).toLocaleString('id-ID')}</p>
            <p>Status: ${item.status}</p>

            <button onclick="lihatDetail(${item.id})">
                Detail Pemesanan
            </button>

            ${item.status === 'Menunggu' ? `
                <button onclick="batalkanPemesanan(${item.id})">
                    Batalkan Pemesanan
                </button>
            ` : ''}
        </div>
    `).join('');

} catch (error) {
    console.error(error);
    daftar.innerHTML = '<p>Tidak dapat terhubung ke server.</p>';
}

}

// Menampilkan detail pemesanan
async function lihatDetail(id) {
const token = localStorage.getItem('token');

try {
    const response = await fetch(`${PEMESANAN_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const result = await response.json();

    if (!response.ok) {
        alert('Gagal mengambil detail pemesanan.');
        return;
    }

    const item = result.data;

    alert(
        'DETAIL PEMESANAN\n\n' +
        'Nama Lapangan: ' + item.nama_lapangan + '\n' +
        'Tanggal: ' + item.tanggal + '\n' +
        'Jam Mulai: ' + String(item.jam_mulai).substring(0, 5) + '\n' +
        'Durasi: ' + item.durasi + ' jam\n' +
        'Total Harga: Rp ' + Number(item.total_harga).toLocaleString('id-ID') + '\n' +
        'Status: ' + item.status
    );

} catch (error) {
    console.error(error);
    alert('Tidak dapat terhubung ke server.');
}

}

// Membatalkan pemesanan
async function batalkanPemesanan(id) {
const token = localStorage.getItem('token');

const konfirmasi = confirm(
    'Apakah kamu yakin ingin membatalkan pemesanan ini?'
);

if (!konfirmasi) return;

try {
    const response = await fetch(`${PEMESANAN_URL}/${id}/batal`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.error?.message || 'Gagal membatalkan pemesanan.');
        return;
    }

    alert('Pemesanan berhasil dibatalkan!');

    tampilkanRiwayat();

} catch (error) {
    console.error(error);
    alert('Tidak dapat terhubung ke server.');
}

}

// Memeriksa status login saat website dibuka
updateNavbar();