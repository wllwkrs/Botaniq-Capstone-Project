import '../css/detail-kebun.css';
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    const BASE_API_URL = 'https://previously-notable-hound.ngrok-free.app'; 
    if (!token) {
        alert("Token not found. Please log in again.");
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
                alert("Your session has expired. Please log in again.");
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
        console.error("Failed to fetch user or profile data:", err);
        document.getElementById("greeting").textContent = "Failed to load profile ❌";
        document.querySelectorAll(".profile-circle img, .profile-avatar-card").forEach(img => {
            img.src = "assets/img/profile.jpeg"; // Path ke gambar default 
        });
    });

    // Ambil parameter 'plant' dari URL dan tampilkan di judul
    const urlParams = new URLSearchParams(window.location.search);
    const plantName = urlParams.get('plant');
    if (plantName) {
        const decodedName = decodeURIComponent(plantName);
        const titleEl = document.getElementById('plant-title');
        const backLinkTextEl = document.getElementById('plant-back-link-text');
        if (titleEl) titleEl.textContent = decodedName;
        if (backLinkTextEl) backLinkTextEl.textContent = decodedName;
    }

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);

            // Tampilkan kondisi terkini berdasarkan lokasi
            handleLocationBasedCondition(latitude, longitude);
        },
        function (error) {
            console.error('Failed to get location:', error.message);
        }
    );
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

// Tanggal real-time
function updateScheduleDate() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    const scheduleDate = document.getElementById('schedule-date');
    if (scheduleDate) scheduleDate.textContent = `${dayName}, ${date} ${monthName} ${year}`;
}
updateScheduleDate();
setInterval(updateScheduleDate, 1000 * 60);

// Fungsi aktivitas manual
function getActivities() {
    const plantName = new URLSearchParams(window.location.search).get('plant') || 'default';
    return JSON.parse(localStorage.getItem('activities_' + plantName)) || [];
}
function saveActivities(activities) {
    const plantName = new URLSearchParams(window.location.search).get('plant') || 'default';
    localStorage.setItem('activities_' + plantName, JSON.stringify(activities));
}
function renderActivities() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    activityList.innerHTML = '';
    const activities = getActivities();
    activities.forEach((act, idx) => {
        const li = document.createElement('li');
        li.style.listStyle = 'none';
        li.innerHTML = `
            <div class="schedule-item" style="display:flex;align-items:center;gap:10px;">
                <div class="time" style="min-width:48px;text-align:right;">${act.time}</div>
                <div class="vertical-line" style="width:4px;height:32px;background:#129990;border-radius:2px;"></div>
                <div class="event-description" style="background:#e6f6f5;padding:8px 18px;border-radius:8px;flex:1;display:flex;align-items:center;justify-content:space-between;">
                    <p style="margin:0;">${act.desc}</p>
                    <button class="delete-activity-btn" data-idx="${idx}" style="margin-left:12px;background:#fff;border:1px solid #129990;color:#129990;border-radius:4px;padding:2px 8px;cursor:pointer;">Delete</button>
                </div>
            </div>
        `;
        activityList.appendChild(li);
    });
    // Event listener untuk hapus
    document.querySelectorAll('.delete-activity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            const activities = getActivities();
            activities.splice(idx, 1);
            saveActivities(activities);
            renderActivities();
        });
    });
}
document.getElementById('add-activity-btn')?.addEventListener('click', function() {
    const input = document.getElementById('new-activity-input');
    if (input && input.value.trim()) {
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        const activities = getActivities();
        activities.push({ time, desc: input.value.trim() });
        saveActivities(activities);
        input.value = '';
        renderActivities();
    }
});
renderActivities();

// === Integrasi API Machine Learning untuk Perbarui Kondisi Tanaman ===
function getPlantName() {
    const input = document.getElementById('plant-name-input');
    if (input && input.value.trim()) {
        return input.value.trim();
    }
    // fallback ke URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('plant') || '';
}

async function fetchMLPrediction(plantName) {
    const res = await fetch('https://intimate-admittedly-kangaroo.ngrok-free.app/predict/kebun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_tanaman: plantName })
    });
    if (!res.ok) throw new Error('Gagal mendapatkan prediksi');
    return await res.json();
}

async function handlePredict() {
    const plantName = getPlantName();
    if (!plantName) {
        alert('Plant name must be provided!');
        return;
    }
    const resultDiv = document.getElementById('ml-result');
    resultDiv.innerHTML = 'Loading...';
    try {
        const data = await fetchMLPrediction(plantName);
        resultDiv.innerHTML = `
            <p><strong>Plant Function:</strong> ${data['Fungsi Tanaman']}</p>
            <p><strong>Light Type:</strong> ${data['Jenis Cahaya']}</p>
            <p><strong>Watering Pattern:</strong> ${data['Pola Penyiraman']}</p>
            <p><strong>Insects:</strong> ${data['Serangga']}</p>
            <p><strong>Fertilizer Type:</strong> ${data['Tipe Pupuk']}</p>
        `;
    } catch (err) {
        resultDiv.innerHTML = 'Failed to load prediction.';
    }
}

document.getElementById('predict-btn')?.addEventListener('click', handlePredict);

// Auto-load prediksi jika nama tanaman ada di URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('plant')) {
    const input = document.getElementById('plant-name-input');
    if (input) input.value = urlParams.get('plant');
    handlePredict();
}

// async function fetchCurrentCondition(latitude, longitude) {
//     const response = await fetch('https://intimate-admittedly-kangaroo.ngrok-free.app/predict/location', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ latitude, longitude })
//     });

//     if (!response.ok) throw new Error('Gagal mengambil kondisi berdasarkan lokasi');
//     return await response.json();
// }

async function handleLocationBasedCondition(latitude, longitude) {
    const kondisiDiv = document.getElementById('kondisi');
    kondisiDiv.innerHTML = 'Loading current condition...';

    const API_KEY = 'a290da4bf85a0b886d5b613a2dbecd23'; // Gantilah dengan API key kamu
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=id`;

    try {
        const res = await fetch(weatherUrl);
        if (!res.ok) throw new Error('Gagal memuat data cuaca');

        const weather = await res.json();
        const suhu = weather.main.temp;
        const kelembaban = weather.main.humidity;
        const kondisiCuaca = weather.weather[0].main;

        let climate = "Tropical";
        if (kondisiCuaca.includes("Snow")) climate = "Polar";
        else if (kondisiCuaca.includes("Rain")) climate = "Tropical";
        else if (["Clear", "Clouds"].includes(kondisiCuaca)) climate = "Subtropical";
        else climate = "Temperate";

        kondisiDiv.innerHTML = `
            <p><strong>Temperature:</strong> ${suhu.toFixed(1)}°C</p>
            <p><strong>Humidity:</strong> ${kelembaban}%</p>
            <p><strong>Weather:</strong> ${kondisiCuaca}</p>
            <p><strong>Climate:</strong> ${climate}</p>
        `;
    } catch (err) {
        console.error('Gagal memuat kondisi cuaca:', err);
        kondisiDiv.innerHTML = 'Unable to load location condition.';
    }
}

