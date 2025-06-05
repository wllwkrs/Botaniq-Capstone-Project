import '../css/style.css';
document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {

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
document.getElementById("signup-button").addEventListener("click", function() {
    window.location.href = "register.html";
});
document.getElementById("signin-button").addEventListener("click", function() {
    window.location.href = "login.html";
});