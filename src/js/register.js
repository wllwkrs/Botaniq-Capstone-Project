import '../css/register.css';

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const passwordFeedback = document.getElementById("password-feedback");
    const registerButton = document.querySelector(".login-button");

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/\\><,])(?!.*\s).{8,}$/;

    // Tampilkan/Sembunyikan Password
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";

            togglePassword.classList.toggle("fa-eye");
            togglePassword.classList.toggle("fa-eye-slash");
        });
    }

    // Validasi Password
    function validatePassword() {
        const value = passwordInput.value;
        const isValid = passwordRegex.test(value);

        if (isValid) {
            passwordFeedback.classList.remove("invalid");
            passwordFeedback.style.color = "#666"; // warna netral
        } else {
            passwordFeedback.classList.add("invalid");
            passwordFeedback.style.color = "red";
        }

        checkFormValidity();
    }

    // Cek apakah seluruh form valid
    function checkFormValidity() {
        const isFormValid = registerForm.checkValidity();
        registerButton.disabled = !isFormValid;
    }

    passwordInput.addEventListener("input", validatePassword);

    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!name || !email || !password) {
            alert("Semua field harus diisi.");
            return;
        }

        if (password.length < 8) {
            alert("Password harus minimal 8 karakter.");
            return;
        }

        validatePassword(); // Validasi sebelum submit

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
});
