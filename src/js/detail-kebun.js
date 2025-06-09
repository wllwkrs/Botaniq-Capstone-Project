import '../css/detail-kebun.css';
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


    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);

                // Simpan lokasi di localStorage / kirim ke backend / tampilkan
            },
            function (error) {
                console.error('Gagal mendapatkan lokasi:', error.message);
            }
        );
    } else {
        console.error('Geolocation tidak didukung browser ini.');
    }
    
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            // toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // toggle the eye icon
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

    // You can add form submission handling here if needed
    // const loginForm = document.getElementById('loginForm');
    // if (loginForm) {
    //     loginForm.addEventListener('submit', function (event) {
    //         event.preventDefault();
    //         // Handle login logic here
    //         console.log('Form submitted');
    //     });
    // }
}); 

document.addEventListener('DOMContentLoaded', function() {
    // Select the container where the calendar will be displayed
    const calendarContainer = document.querySelector('.calendar-container');

    // Initialize your chosen calendar library here.
    // This is a placeholder. Replace with the actual initialization code for your library.
    if (calendarContainer) {
        // Example using a hypothetical library:
        // new MyCalendarLibrary(calendarContainer, { options });

        // Or if the library uses a different initialization method:
        // MyCalendarLibrary.init(calendarContainer, { options });

        console.log('Calendar container found, ready to initialize calendar.');
        // Add your calendar initialization code here.
        const options = { // You can customize options here
            date: {
                selectedDates: ['2027-02-03'] // Highlight February 3rd, 2027
            }
        };
        const calendar = new VanillaCalendar(calendarContainer, options);
        calendar.init();

    } else {
        console.error('Calendar container not found.');
    }
});
