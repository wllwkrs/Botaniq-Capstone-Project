// document.addEventListener("DOMContentLoaded", function () {

//         const token = localStorage.getItem("token");
//         fetch("https://previously-notable-hound.ngrok-free.app/profile", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             "ngrok-skip-browser-warning": "true"
//           },
//         })
//           .then((response) => {
//             if (!response.ok) {
//               throw new Error("Network response was not ok");
//             }
//             return response.json();
//           })
//           .then((data) => {
//             document.getElementById("nama").textContent = data.data.nama || "-";
//             document.getElementById("nama-profile").textContent = data.data.nama || "-";
//             document.getElementById("nama-detail").value = data.data.nama || "";
//             document.getElementById("alamat-detail").value = data.data.alamat || "";
//             document.getElementById("nama-personal").value = data.data.nama || "";
//             document.getElementById("email-personal").value = data.data.email || "";
//             document.getElementById("telepon-personal").value = data.data.telepon || "";
//             document.getElementById("email").textContent = data.data.email || "-";
//             document.getElementById("telepon").textContent = data.data.telepon || "-";
//             document.getElementById("alamat").textContent = data.data.alamat || "-";
//           })
//           .catch((error) => {
//             console.error("Error fetching profile:", error);
//             alert("Gagal memuat profil. Silakan coba lagi.");
//           });
//       });



document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Token tidak ditemukan, silakan login ulang.");
    return;
  }

  let userId = null;

  fetch("https://previously-notable-hound.ngrok-free.app/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true"
    }
  })
  .then((response) => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text); });
    }
    return response.json();
  })
  .then((data) => {
    const profile = data.data || {};
    userId = profile.id;

    document.getElementById("nama").textContent = profile.nama || "-";
    document.getElementById("nama-profile").textContent = profile.nama || "-";
    document.getElementById("email").textContent = profile.email || "-";
    document.getElementById("telepon").textContent = profile.telepon || "-";
    document.getElementById("alamat").textContent = profile.alamat || "-";

    document.getElementById("nama-detail").value = profile.nama || "";
    document.getElementById("alamat-detail").value = profile.alamat || "";
    document.getElementById("nama-personal").value = profile.nama || "";
    document.getElementById("email-personal").value = profile.email || "";
    document.getElementById("telepon-personal").value = profile.telepon || "";
  })
  .catch((error) => {
    console.error("Error fetching profile:", error);
    alert("Gagal memuat profil. Silakan login ulang.");
  });

  // Update General Profile
  document.getElementById("general-popup").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!userId) return alert("ID user tidak ditemukan");

    const updatedGeneral = {
      nama: document.getElementById("nama-detail").value.trim(),
      alamat: document.getElementById("alamat-detail").value.trim(),
    };

    fetch(`https://previously-notable-hound.ngrok-free.app/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify(updatedGeneral)
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => { throw new Error(text); });
      }
      return res.json();
    })
    .then(resData => {
      const prof = resData.data || {};
      document.getElementById("nama-profile").textContent = prof.nama || "-";
      document.getElementById("nama").textContent = prof.nama || "-";
      document.getElementById("alamat").textContent = prof.alamat || "-";
      document.getElementById("general-popup").classList.remove("active");
      alert("General profile berhasil diperbarui!");
    })
    .catch(err => {
      console.error("Error updating general:", err);
      alert("Gagal memperbarui general profile.");
    });
  });

  // Update Personal Profile
  document.getElementById("personal-popup").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!userId) return alert("ID user tidak ditemukan");

    const updatedPersonal = {
      nama: document.getElementById("nama-personal").value.trim(),
      email: document.getElementById("email-personal").value.trim(),
      telepon: document.getElementById("telepon-personal").value.trim()
    };

    fetch(`https://previously-notable-hound.ngrok-free.app/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify(updatedPersonal)
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => { throw new Error(text); });
      }
      return res.json();
    })
    .then(resData => {
      const prof = resData.data || {};
      document.getElementById("nama-profile").textContent = prof.nama || "-";
      document.getElementById("email").textContent = prof.email || "-";
      document.getElementById("telepon").textContent = prof.telepon || "-";
      document.getElementById("personal-popup").classList.remove("active");
      alert("Personal information berhasil diperbarui!");
    })
    .catch(err => {
      console.error("Error updating personal:", err);
      alert("Gagal memperbarui personal information.");
    });
  });

  // Popup Event Handler
  document.querySelectorAll('.edit-card-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const popupId = btn.getAttribute('data-popup') + '-popup';
      document.getElementById(popupId).classList.add('active');
    });
  });

  document.querySelectorAll('.close-popup, .cancel-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.edit-popup-overlay');
      if (overlay) overlay.classList.remove('active');
    });
  });

  document.querySelectorAll('.edit-popup-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
});


// document.addEventListener("DOMContentLoaded", function () {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     alert("Token tidak ditemukan, silakan login ulang.");
//     return;
//   }

//   let userId = null; // variabel untuk simpan id user

//   fetch("https://previously-notable-hound.ngrok-free.app/profile", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//       "ngrok-skip-browser-warning": "true"
//     },
//   })
//     .then((response) => {
//       if (!response.ok) throw new Error("Network response was not ok");
//       return response.json();
//     })
//     .then((data) => {
//       const profile = data.data || {};
//       userId = profile.id; // simpan id user di sini

//       // Jika input form memang input, isi value-nya juga
//       document.getElementById("nama").value = profile.nama || "";
//       document.getElementById("email").value = profile.email || "";
//       document.getElementById("telepon").value = profile.telepon || "";
//       document.getElementById("alamat").value = profile.alamat || "";
//     })
//     .catch((error) => {
//       console.error("Error fetching profile:", error);
//       alert("Gagal memuat profil. Silakan coba lagi.");
//     });

//   document.getElementById("profile-form").addEventListener("submit", function (e) {
//     e.preventDefault();

//     if (!userId) {
//       alert("ID user tidak ditemukan, silakan muat ulang halaman.");
//       return;
//     }

//     const formData = {
//       nama: document.getElementById("nama").value,
//       email: document.getElementById("email").value,
//       telepon: document.getElementById("telepon").value,
//       alamat: document.getElementById("alamat").value,
//     };

//     fetch(`https://previously-notable-hound.ngrok-free.app/users/${userId}`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     })
//       .then((response) => {
//         if (!response.ok) throw new Error("Network response was not ok");
//         return response.json();
//       })
//       .then((data) => {
//         alert("Profil berhasil diperbarui!");
//         window.location.href = "profile.html";
//       })
//       .catch((error) => {
//         console.error("Error updating profile:", error);
//         alert("Gagal memperbarui profil. Silakan coba lagi.");
//       });
//   });
// });
