import '../css/login.css';

document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email dan password harus diisi.");
    return;
  }

  try {
    const response = await fetch("https://previously-notable-hound.ngrok-free.app/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }) 
    });

    const contentType = response.headers.get("Content-Type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Respon bukan JSON:", text);
      alert("Server mengembalikan format tidak valid.");
      return;
    }

    const result = await response.json();
    console.log("Login Response:", result);

    if (response.ok) {
      alert("Login berhasil!");

      if(result.token) {
        localStorage.setItem("token", result.token);
        window.location.href = "beranda.html";
      } else {
        alert("Token tidak ditemukan di response.");
      }

    } else {
      alert(result.message || "Login gagal.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan saat login.");
  }
});
