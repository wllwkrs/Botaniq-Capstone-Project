import '../css/profile.css';

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Token tidak ditemukan. Silakan login ulang.");
    return;
  }

  let userId = null;
  const BASE_API_URL = 'https://previously-notable-hound.ngrok-free.app';

  // Fungsi untuk update tampilan profil di halaman
  function updateProfileUI(profile) {
    document.getElementById("nama-profile").textContent = profile.nama || "-";
    document.getElementById("nama-depan").textContent = profile.nama || "-";
    document.getElementById("nama-belakang").textContent = profile.nama_belakang || "-";
    document.getElementById("email").textContent = profile.email || "-";
    document.getElementById("telepon").textContent = profile.telepon || "-";
    document.getElementById("alamat").textContent = profile.alamat || "-";
    document.getElementById("negara").textContent = profile.negara || "-";
    document.getElementById("kota").textContent = profile.kota || "-";

    const profileImageUrl = profile.foto ? `${BASE_API_URL}/uploads/${profile.foto}` : "assets/img/profile.jpeg";
    document.querySelectorAll(".profile-avatar-card, #preview-profile-pic").forEach(img => {
      img.src = profileImageUrl;
    });
  }

  // Fungsi untuk mengisi form edit dengan data profil
  function fillEditForm(profile) {
    document.getElementById("nama-detail").value = profile.nama || "";
    document.getElementById("nama-depan-detail").value = profile.nama || "";
    document.getElementById("nama-belakang-detail").value = profile.nama_belakang || "";
    document.getElementById("alamat-detail").value = profile.alamat || "";
    document.getElementById("email-detail").value = profile.email || "";
    document.getElementById("telepon-detail").value = profile.telepon || "";
    document.getElementById("negara-detail").value = profile.negara || "";
    document.getElementById("kota-detail").value = profile.kota || "";
  }

  // Ambil data profil dari API
  fetch(`${BASE_API_URL}/profile`, { 
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true"
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Gagal mengambil profil");
    return res.json();
  })
  .then(data => {
    const profile = data.data || {};
    userId = profile.id;

    updateProfileUI(profile);
    fillEditForm(profile);
  })
  .catch(err => {
    console.error("Gagal mengambil profil:", err);
    alert("Gagal mengambil profil, silakan coba lagi.");
  });

  
  async function updateProfile(updatedData, file = null) {
    if (!userId) {
      alert("ID pengguna tidak ditemukan.");
      return Promise.reject("User ID null");
    }

    const bodyData = new FormData();
    for (const key in updatedData) {
      bodyData.append(key, updatedData[key]);
    }
    if (file) {
      bodyData.append("foto", file);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
      
    };

    try {
      const res = await fetch(`${BASE_API_URL}/users/${userId}`, {
        method: "PUT",
        headers: headers,
        body: bodyData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gagal update profil: ${res.status} - ${errorText}`);
      }

      
      const profileRes = await fetch(`${BASE_API_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        }
      });

      if (!profileRes.ok) {
        throw new Error("Gagal mengambil profil setelah update");
      }

      const data = await profileRes.json();
      const updatedProfile = data.data || {};
      updateProfileUI(updatedProfile);
      fillEditForm(updatedProfile);
      alert("Profil berhasil diperbarui!");
      document.getElementById("popup-edit-profile").classList.remove("active");
    } catch (err) {
      console.error("Gagal update atau ambil ulang profil:", err);
      alert(`Gagal memperbarui profil: ${err.message}`);
    }
  }

  
  document.getElementById("general-popup").addEventListener("submit", async function (e) {
    e.preventDefault();

    const updatedData = {
      nama: document.getElementById("nama-detail").value.trim(),
      alamat: document.getElementById("alamat-detail").value.trim(),
    };

    const file = document.getElementById("profile-pic-upload").files[0];

    updateProfile(updatedData, file);
  });

 
  document.getElementById("personal-popup").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedData = {
      nama: document.getElementById("nama-depan-detail").value.trim(),
      nama_belakang: document.getElementById("nama-belakang-detail").value.trim(),
      email: document.getElementById("email-detail").value.trim(),
      telepon: document.getElementById("telepon-detail").value.trim(),
    };

    updateProfile(updatedData); 
  });

 
  document.getElementById("address-popup").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedData = {
      negara: document.getElementById("negara-detail").value.trim(),
      kota: document.getElementById("kota-detail").value.trim()
    };

    updateProfile(updatedData); 
  });
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    function openSidebar() {
        mobileSidebar.style.left = '0';
        overlay.style.display = 'block';
        body.classList.add('sidebar-open');
        body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open
    }

    function closeSidebarMenu() {
        mobileSidebar.style.left = '-250px';
        overlay.style.display = 'none';
        body.classList.remove('sidebar-open');
        body.style.overflow = ''; // Restore scrolling
    }

    // Open sidebar when clicking the menu icon
    mobileMenuIcon.addEventListener('click', openSidebar);

    // Close sidebar when clicking the close button
    closeSidebar.addEventListener('click', closeSidebarMenu);

    // Close sidebar when clicking the overlay
    overlay.addEventListener('click', closeSidebarMenu);

    // Close sidebar when clicking a navigation link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeSidebarMenu);
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

document.querySelectorAll('.edit-popup-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        this.closest('.edit-popup-overlay').style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    });
});

