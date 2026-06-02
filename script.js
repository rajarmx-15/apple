// ==========================================
// 1. LOGIKA UTAMA & SISTEM (JAM & JENDELA)
// ==========================================
function updateClock() {
    const timeElement = document.getElementById('current-time');
    const now = new Date();
    timeElement.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}
setInterval(updateClock, 1000); updateClock();

function openApp(appId) {
    document.getElementById(appId)?.classList.remove('hidden');
}

function closeApp(appId) {
    document.getElementById(appId)?.classList.add('hidden');
    if(appId === 'app-video') document.getElementById('video-renderer')?.pause();
}

// ==========================================
// 2. LOGIKA VIDEO PLAYER
// ==========================================
document.getElementById('video-input')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const vr = document.getElementById('video-renderer');
    const vp = document.getElementById('video-placeholder');
    if (file && vr && vp) {
        vr.src = URL.createObjectURL(file);
        vr.classList.remove('hidden'); vp.classList.add('hidden');
        vr.load(); vr.play();
        // Pause musik jika video dijalankan agar suara tidak tabrakan
        pauseMusic();
    }
});


// ==========================================
// 3. LOGIKA APPLE MUSIC SIMULATOR (BARU)
// ==========================================
// Daftar Track sampel menggunakan lagu royalti-free publik internet
const playlist = [
    {
        title: "Chill Lo-Fi Vibe",
        artist: "Lofi Creative",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Energetic Beats",
        artist: "Rock Studio",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    }
];

let currentSongIndex = 0;
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('btn-play');
const playIcon = document.getElementById('icon-play');
const musicCover = document.getElementById('music-cover');
const musicTitle = document.getElementById('music-title');
const musicArtist = document.getElementById('music-artist');
const progressBar = document.getElementById('music-progress');
const timeCurrent = document.getElementById('time-current');
const timeDuration = document.getElementById('time-duration');

// Memuat data lagu berdasarkan indeks aktif
function loadSong(index) {
    const song = playlist[index];
    audio.src = song.src;
    musicTitle.textContent = song.title;
    musicArtist.textContent = song.artist;
    musicCover.src = song.cover;
}

// Inisialisasi lagu pertama saat web dimuat
loadSong(currentSongIndex);

function togglePlay() {
    if (audio.paused) {
        // Matikan video jika sedang menyala agar suara bersih
        document.getElementById('video-renderer')?.pause();
        audio.play();
        playIcon.className = "fas fa-pause text-black";
        musicCover.classList.add('rotating', 'rounded-full'); // Ubah bentuk jadi piringan berputar
    } else {
        pauseMusic();
    }
}

function pauseMusic() {
    audio.pause();
    playIcon.className = "fas fa-play pl-1 text-black";
    musicCover.classList.remove('rotating');
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    togglePlay();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    togglePlay();
}

function playSelectSong(index) {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    togglePlay();
}

// Sinkronisasi Garis Waktu Jalannya Lagu (Progress Bar)
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        
        // Update teks menit berjalan
        let curMins = Math.floor(audio.currentTime / 60);
        let curSecs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        timeCurrent.textContent = `${curMins}:${curSecs}`;

        // Update total durasi lagu
        let durMins = Math.floor(audio.duration / 60);
        let durSecs = Math.floor(audio.duration % 60).toString().padStart(2, '0');
        timeDuration.textContent = `${durMins}:${durSecs}`;
    }
});

// Mengubah posisi lagu secara manual saat bar ditarik/diklik
progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

// Otomatis putar lagu selanjutnya jika lagu habis
audio.addEventListener('ended', nextSong);
