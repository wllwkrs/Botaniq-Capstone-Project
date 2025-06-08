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

    // Tampilkan foto profil dari API
    // --- PERBAIKAN 2: URL Foto Profil ---
    // Jika 'profile.foto' mengembalikan nama file (misal: "gambar.jpg"),
    // maka URL lengkapnya harus menjadi BASE_API_URL/uploads/gambar.jpg
    const profileImageUrl = profile.foto ? `${BASE_API_URL}/uploads/${profile.foto}` : "../img/profile.jpeg";
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
  fetch(`${BASE_API_URL}/profile`, { // --- PERBAIKAN 3: Gunakan BASE_API_URL ---
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
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

  // Fungsi umum untuk update profil via API
  async function updateProfile(updatedData, file = null) { // --- PERBAIKAN 4: Tambahkan parameter 'file' ---
    if (!userId) {
      alert("ID pengguna tidak ditemukan.");
      return Promise.reject("User ID null");
    }

    let bodyData;
    let headers = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    };

    if (file) {
      // Jika ada file, gunakan FormData dan masukkan semua data
      bodyData = new FormData();
      for (const key in updatedData) {
        bodyData.append(key, updatedData[key]);
      }
      bodyData.append("foto", file); // 'foto' harus sesuai dengan nama field di backend
      // Jangan set 'Content-Type' untuk FormData, browser akan mengaturnya otomatis
    } else {
      // Jika tidak ada file, kirim sebagai JSON
      bodyData = JSON.stringify(updatedData);
      headers["Content-Type"] = "application/json"; // Set Content-Type untuk JSON
    }

    try {
      const res = await fetch(`${BASE_API_URL}/users/${userId}`, { // --- PERBAIKAN 5: Gunakan BASE_API_URL dan rute PUT /users/{id} ---
        method: "PUT", // --- PERBAIKAN 6: Menggunakan metode PUT ---
        headers: headers,
        body: bodyData
      });

      if (!res.ok) {
        const errorText = await res.text(); // Ambil teks error dari respons
        throw new Error(`Gagal update profil: ${res.status} - ${errorText}`);
      }

      // Setelah update berhasil, ambil ulang profil lengkap
      const profileRes = await fetch(`${BASE_API_URL}/profile`, { // --- PERBAIKAN 7: Gunakan BASE_API_URL ---
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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


  // Event listener untuk form general-popup (update nama, alamat, dan foto)
  document.getElementById("general-popup").addEventListener("submit", async function (e) {
    e.preventDefault();

    const updatedData = {
      nama: document.getElementById("nama-detail").value.trim(),
      alamat: document.getElementById("alamat-detail").value.trim(),
    };

    const file = document.getElementById("profile-pic-upload").files[0];

    // --- PERBAIKAN 8: Panggil updateProfile dengan file ---
    updateProfile(updatedData, file); // Kirim updatedData dan file bersamaan
  });


  // Event listener untuk form personal-popup (update nama_belakang, email, telepon)
  document.getElementById("personal-popup").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedData = {
      nama: document.getElementById("nama-depan-detail").value.trim(),
      nama_belakang: document.getElementById("nama-belakang-detail").value.trim(),
      email: document.getElementById("email-detail").value.trim(),
      telepon: document.getElementById("telepon-detail").value.trim(),
    };

    updateProfile(updatedData); // Panggil tanpa file
  });

  // Event listener untuk form address-popup (update negara, kota)
  document.getElementById("address-popup").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedData = {
      negara: document.getElementById("negara-detail").value.trim(),
      kota: document.getElementById("kota-detail").value.trim()
    };

    updateProfile(updatedData); // Panggil tanpa file
  });
});