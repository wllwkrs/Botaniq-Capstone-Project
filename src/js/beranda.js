import Map from './map.js';
import 'leaflet/dist/leaflet.css';
import '../css/beranda.css';
// import '../img/profile.jpeg';
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    const BASE_API_URL = 'https://previously-notable-hound.ngrok-free.app'; 
   
    if (!token) {
        alert("Token tidak ditemukan. Silakan login ulang.");
        window.location.href = "login.html"; 
        return;
    }

    fetch(`${BASE_API_URL}/profile`, { 
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
        }
    })
    .then(res => {
        if (!res.ok) {
            if (res.status === 401) {
                alert("Sesi Anda telah berakhir, silakan login ulang.");
                localStorage.removeItem("token");
                window.location.href = "login.html";
            }
            throw new Error(`Gagal mengambil profil: ${res.statusText}`);
        }
        return res.json();
    })
    .then(data => {
        const profile = data.data || {}; 
        const nama = profile.nama || "Pengguna";
        document.getElementById("greeting").textContent = `Selamat Datang ${nama} 👋`;

        const profileImageUrl = profile.foto ? `${BASE_API_URL}/uploads/${profile.foto}` : "assets/img/profile.jpeg";
        document.querySelectorAll(".profile-circle img").forEach(img => { 
            img.src = profileImageUrl;
        });
        document.querySelectorAll(".profile-avatar-card").forEach(img => {
            img.src = profileImageUrl;
        });
    })
    .catch(err => {
        console.error("Gagal ambil data user atau profil:", err);
        document.getElementById("greeting").textContent = "Gagal memuat profil ❌";
        document.querySelectorAll(".profile-circle img, .profile-avatar-card").forEach(img => {
            img.src = "assets/img/profile.jpeg"; // Path ke gambar default 
        });
    });
   
   
    // Toggle Password Visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Mobile Sidebar Toggle
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    function toggleSidebar(state) {
        mobileSidebar.classList.toggle('open', state);
        overlay.style.display = state ? 'block' : 'none';
        body.classList.toggle('sidebar-open', state);
    }

    mobileMenuIcon.addEventListener('click', () => toggleSidebar(true));
    closeSidebar.addEventListener('click', () => toggleSidebar(false));
    overlay.addEventListener('click', () => toggleSidebar(false));

    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleSidebar(false));
    });

    Map.build('#map', { locate: true, zoom: 13 })
      .then(instance => {
          console.log('Peta berhasil dimuat');

          
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                  position => {
                      const userCoordinate = [position.coords.latitude, position.coords.longitude];
                      const markerOptions = { alt: "Posisi Saya" };
                      const popupOptions = { content: "Anda berada di sini!" };

                      instance.addMarker(userCoordinate, markerOptions, popupOptions);
                      console.log(`Marker ditambahkan pada lokasi pengguna: ${userCoordinate}`);
                  },
                  error => {
                      console.error("Gagal mendapatkan lokasi pengguna:", error);
                  }
              );
          } else {
              console.warn("Geolocation tidak didukung oleh browser ini.");
          }
      })
      .catch(err => {
          console.error('Gagal memuat peta:', err);
      });

    // Navigasi halaman
    document.getElementById("profileImage")?.addEventListener("click", function() {
        window.location.href = "profile-revisi.html";
    });
    document.getElementById("profile")?.addEventListener("click", function() {
        window.location.href = "profile-revisi.html";
    });
    document.getElementById("beranda")?.addEventListener("click", function() {
        window.location.href = "beranda.html";
    });
    document.getElementById("manajemen").addEventListener("click", function() {
    window.location.href = "manajemen-kebun.html";
    });
    document.getElementById("rekomendasi").addEventListener("click", function() {
    window.location.href = "list-rekomendasi.html";
    });
});