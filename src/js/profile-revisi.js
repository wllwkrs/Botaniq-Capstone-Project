import '../css/profile.css';

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Token tidak ditemukan. Silakan login ulang.");
    return;
  }

  let userId = null;

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
  fetch("https://previously-notable-hound.ngrok-free.app/profile", {
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
function updateProfile(updatedData) {
  if (!userId) {
    alert("ID pengguna tidak ditemukan.");
    return Promise.reject("User ID null");
  }

  return fetch(`https://previously-notable-hound.ngrok-free.app/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true"
    },
    body: JSON.stringify(updatedData)
  })
    .then(res => {
      if (!res.ok) throw new Error("Gagal update profil");
      return res.json();
    })
    .then(() => {
      // Setelah update berhasil, ambil ulang profil lengkap
      return fetch("https://previously-notable-hound.ngrok-free.app/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        }
      });
    })
    .then(res => {
      if (!res.ok) throw new Error("Gagal mengambil profil setelah update");
      return res.json();
    })
    .then(data => {
      const updatedProfile = data.data || {};
      updateProfileUI(updatedProfile);
      fillEditForm(updatedProfile);
      alert("Profil berhasil diperbarui!");
      document.getElementById("popup-edit-profile").classList.remove("active");
    })
    .catch(err => {
      console.error("Gagal update atau ambil ulang profil:", err);
      alert("Gagal memperbarui profil.");
    });
}


  // Event listener untuk form general-popup (update nama, alamat)
  document.getElementById("general-popup").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedData = {
      nama: document.getElementById("nama-detail").value.trim(),
      alamat: document.getElementById("alamat-detail").value.trim(),
    };

    updateProfile(updatedData);
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

    updateProfile(updatedData);
  });

  // Event listener untuk form address-popup (update negara, kota)
  document.getElementById("address-popup").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedData = {
      negara: document.getElementById("negara-detail").value.trim(),
      kota: document.getElementById("kota-detail").value.trim()
    };

    updateProfile(updatedData);
  });
});
