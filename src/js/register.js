import '../css/register.css';

document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("Semua field harus diisi.");
        return;
    }

    if (password.length < 8) {
        alert("Password harus minimal 8 karakter.");
        return;
    }

    try {
        const response = await fetch("https://previously-notable-hound.ngrok-free.app/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                nama: name,
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Registrasi berhasil!");
            window.location.href = "login.html";
        } else {
            alert(result.message || "Registrasi gagal.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat registrasi.");
    }
});