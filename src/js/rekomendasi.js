import '../css/rekomendasi.css';

document.addEventListener('DOMContentLoaded', function () {
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
        if (mobileSidebar) {
            mobileSidebar.style.left = '0';
        }
        if (overlay) {
            overlay.style.display = 'block';
        }
        if (body) {
            body.classList.add('sidebar-open');
            body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open
        }
    }

    function closeSidebarMenu() {
        if (mobileSidebar) {
            mobileSidebar.style.left = '-250px';
        }
        if (overlay) {
            overlay.style.display = 'none';
        }
        if (body) {
            body.classList.remove('sidebar-open');
            body.style.overflow = ''; // Restore scrolling
        }
    }

    // Open sidebar when clicking the menu icon
    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', openSidebar);
    }

    // Close sidebar when clicking the close button
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarMenu);
    }

    // Close sidebar when clicking the overlay
    if (overlay) {
        overlay.addEventListener('click', closeSidebarMenu);
    }

    // Close sidebar when clicking a navigation link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    if (mobileNavLinks) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeSidebarMenu);
        });
    }

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
document.getElementById("beranda").addEventListener("click", function() {
    window.location.href = "beranda.html";
});