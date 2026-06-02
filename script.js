// ==========================================
// 1. LOGIKA SISTEM UTAMA (JAM DIGITAL)
// ==========================================
function updateClock() {
    const timeElement = document.getElementById('current-time');
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// Fungsi Buka-Tutup Aplikasi
function openApp(appId) {
    const appWindow = document.getElementById(appId);
    if (appWindow) {
        appWindow.classList.remove('hidden');
    }
}

function closeApp(appId) {
    const appWindow = document.getElementById(appId);
    if (appWindow) {
        appWindow.classList.add('hidden');
        
        // Opsional: Jika aplikasi video ditutup, otomatis pause videonya agar suaranya mati
        if(appId === 'app-video') {
            const videoRenderer = document.getElementById('video-renderer');
            if(videoRenderer) videoRenderer.pause();
        }
    }
}

// ==========================================
// 2. LOGIKA UPLOAD & RENDER VIDEO (BARU)
// ==========================================
document.getElementById('video-input').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Ambil file pertama yang diupload
    const videoRenderer = document.getElementById('video-renderer');
    const videoPlaceholder = document.getElementById('video-placeholder');

    if (file) {
        // Buat objek URL sementara dari file lokal yang diupload
        const blobURL = URL.createObjectURL(file);

        // Pasang file video ke src renderer
        videoRenderer.src = blobURL;

        // Tampilkan elemen video, sembunyikan placeholder tulisan kosong
        videoRenderer.classList.remove('hidden');
        videoPlaceholder.classList.add('hidden');

        // Otomatis putar video setelah berhasil dimuat
        videoRenderer.load();
        videoRenderer.play();
    }
});
