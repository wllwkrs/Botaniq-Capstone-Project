import Map from './map.js';
import 'leaflet/dist/leaflet.css';
import '../css/beranda.css';
// import '../img/profile.jpeg';
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    const BASE_API_URL = 'https://previously-notable-hound.ngrok-free.app'; 
   
    if (!token) {
        alert("Token not found. Please log in again.");
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
                alert("Your session has expired, please log in again.");
                localStorage.removeItem("token");
                window.location.href = "login.html";
            }
            throw new Error(`Failed to fetch profile: ${res.statusText}`);
        }
        return res.json();
    })
    .then(data => {
        const profile = data.data || {}; 
        const nama = profile.nama || "Pengguna";
        document.getElementById("greeting").textContent = `Welcome ${nama} 👋`;

        const profileImageUrl = profile.foto ? `${BASE_API_URL}/uploads/${profile.foto}` : "assets/img/profile.jpeg";
        document.querySelectorAll(".profile-circle img").forEach(img => { 
            img.src = profileImageUrl;
        });
        document.querySelectorAll(".profile-avatar-card").forEach(img => {
            img.src = profileImageUrl;
        });
    })
    .catch(err => {
        console.error("Failed to fetch user data or profile:", err);
        document.getElementById("greeting").textContent = "Failed to load profile ❌";
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
          console.log('Map successfully loaded');

          
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                  position => {
                      const userCoordinate = [position.coords.latitude, position.coords.longitude];
                      const markerOptions = { alt: "My Position" };
                      const popupOptions = { content: "You are here!" };

                      instance.addMarker(userCoordinate, markerOptions, popupOptions);
                      console.log(`Marker added at user's location: ${userCoordinate}`);
                  },
                  error => {
                      console.error("Failed to get user's location:", error);
                  }
              );
          } else {
              console.warn("Geolocation is not supported by this browser.");
          }
      })
      .catch(err => {
          console.error('Failed to load map:', err);
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
    window.location.href = "rekomendasi.html";
    });

    document.getElementById('logoutbtn').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('token'); // ganti 'token' sesuai nama penyimpananmu
    sessionStorage.removeItem('token');

    fetch(`${BASE_API_URL}/logout`, {  
        method: 'POST'
    }).then(res => res.json()).then(data => {
        console.log(data.message); 
       
        window.location.href = 'home.html'; 
    }).catch(err => {
        console.error('Logout error:', err);
        window.location.href = 'home.html'
    });
});

});