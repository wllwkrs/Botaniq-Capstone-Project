import '../css/list-rekomendasi.css';
let allPlants = []; // Semua data dari API
let filteredPlants = []; // Data hasil filter/pencarian
let currentIndex = 0;
let suhu = null;
const itemsPerPage = 3;

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    const BASE_API_URL = 'https://previously-notable-hound.ngrok-free.app'; 

    if (!token) {
        alert("Token tidak ditemukan. Silakan login ulang.");
        window.location.href = "login.html"; 
        return;
    } 

    // Ambil profil pengguna
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
            img.src = "assets/img/profile.jpeg";
        });
    });

    // Ambil lokasi dan cuaca
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);

                const API_KEY = 'a290da4bf85a0b886d5b613a2dbecd23';
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=id`;

                fetch(weatherUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.main || !data.weather || !data.weather[0]) {
                            throw new Error("Data cuaca tidak lengkap atau salah.");
                        }

                         suhu = data.main.temp;
                        const kelembapan = data.main.humidity;
                        const tekanan = data.main.pressure;
                        const kecepatanAngin = data.wind.speed;
                        const kondisiCuaca = data.weather[0].description;
                        const namaKota = data.name;
                        const iconCode = data.weather[0].icon;
                        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                        console.log(`Suhu: ${suhu}°C`);
                        console.log(`Kelembapan: ${kelembapan}%`);
                        console.log(`Tekanan udara: ${tekanan} hPa`);
                        console.log(`Kecepatan angin: ${kecepatanAngin} m/s`);
                        console.log(`Cuaca: ${kondisiCuaca}`);
                        // console.log(`Lokasi: ${namaKota}`);

                        // Tampilkan info cuaca jika ingin
                        // document.getElementById("weather-info").innerHTML = ...
                    })
                    .catch(error => {
                        console.error("Gagal mengambil data cuaca:", error);
                    });
            },
            function (error) {
                console.error('Gagal mendapatkan lokasi:', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        console.error('Geolocation tidak didukung browser ini.');
    }

    async function fetchPlants() {
    try {
        const response = await fetch('https://previously-notable-hound.ngrok-free.app/plantswithjoinfamily', {
            method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
        }
        }); // Ganti URL
        const result = await response.json();
        allPlants = result.data || [];
        filteredPlants = allPlants;
        renderPlants();
    } catch (error) {
        console.error('Gagal fetch data:', error);
    }
}

function renderPlants() {
    const container = document.getElementById('plantContainer');
    container.innerHTML = '';
    const slice = filteredPlants.slice(currentIndex, currentIndex + itemsPerPage);
    slice.forEach(plant => {
        container.innerHTML += `
        <div class="recommendation-card">
            <div class="plant-details"><h3>${plant.PlantName}</h3></div>
            <div class="plant-image"><img src="assets/img/a50f38827a2283b25d9640bc9572da77 1.png" alt="Plant Image"></div>
            <div class="card-actions">
                <button class="action-button">Tanam dan Pantau</button>
            </div>
            <div class="plant-details">
                <p>Suhu: ${suhu !== null ? suhu + "°C" : "N/A"}</p>
                <p>Plant Name: ${plant.PlantName}</p>
                <p>Growth: ${plant.Growth}</p>
                <p>Soil: ${plant.Soil}</p>
                <p>Sunlight: ${plant.Sunlight}</p>
                <p>Watering: ${plant.Watering}</p>
                <p>Fertilization Type: ${plant.FertilizationType}</p>
                <p>Family: ${plant.family.trim()}</p>
                <p>Temperatur: ${plant.temp_avg}</p>
                
            </div>
        </div>`;
    });
}

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex + itemsPerPage < filteredPlants.length) {
        currentIndex += itemsPerPage;
        renderPlants();
    }
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex - itemsPerPage >= 0) {
        currentIndex -= itemsPerPage;
        renderPlants();
    }
});

document.querySelectorAll('.filter-select').forEach(select => {
    select.addEventListener('change', applyFilters);
});

document.querySelectorAll('.clear-filter').forEach(btn => {
    btn.addEventListener('click', e => {
        e.target.previousElementSibling.value = '';
        applyFilters();
    });
});

document.querySelector('.search-bar button').addEventListener('click', () => {
    applyFilters();
});

// function applyFilters() {
//     const [growth, soil, sunlight, watering, fertilizer] = document.querySelectorAll('.filter-select');
//     const keyword = document.querySelector('.search-bar input').value.toLowerCase();

//     filteredPlants = allPlants.filter(plant => {
//         return (!growth.value || plant.Growth === growth.value) &&
//                (!soil.value || plant.Soil === soil.value) &&
//                (!sunlight.value || plant.Sunlight === sunlight.value) &&
//                (!watering.value || plant.Watering.toLowerCase().includes(watering.value)) &&
//                (!fertilizer.value || plant.FertilizationType === fertilizer.value) &&
//                (!keyword || plant.PlantName.toLowerCase().includes(keyword));
//     });

//     currentIndex = 0;
//     renderPlants();
// }
function applyFilters() {
    const growth = document.querySelector('#growth');
    const soil = document.querySelector('#soil');
    const sunlight = document.querySelector('#sunlight');
    const watering = document.querySelector('#watering');
    const fertilizer = document.querySelector('#fertilizer');
    const keyword = document.querySelector('.search-bar input').value.trim().toLowerCase();

    filteredPlants = allPlants.filter(plant => {
        const growthMatch = !growth.value || plant.Growth === growth.value;
        const soilMatch = !soil.value || plant.Soil === soil.value;
        const sunlightMatch = !sunlight.value || (plant.Sunlight ?? '').toLowerCase() === sunlight.value.toLowerCase();
        const wateringMatch = !watering.value || (plant.Watering ?? '').toLowerCase().includes(watering.value.toLowerCase());
        const fertilizerMatch = !fertilizer.value || (plant.FertilizationType ?? '').toLowerCase() === fertilizer.value.toLowerCase();
        const keywordMatch = !keyword || (plant.PlantName ?? '').toLowerCase().includes(keyword);

        return growthMatch && soilMatch && sunlightMatch && wateringMatch && fertilizerMatch && keywordMatch;
    });

    currentIndex = 0;
    renderPlants();
}

fetchPlants();


    // Toggle password visibility
    
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
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
        body.style.overflow = 'hidden';
    }

    function closeSidebarMenu() {
        mobileSidebar.style.left = '-250px';
        overlay.style.display = 'none';
        body.classList.remove('sidebar-open');
        body.style.overflow = '';
    }

    if (mobileMenuIcon) mobileMenuIcon.addEventListener('click', openSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarMenu);
    if (overlay) overlay.addEventListener('click', closeSidebarMenu);

    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeSidebarMenu);
    });

    // Navigasi ke halaman lain
    const tanamBtn = document.getElementById("tanam");
    if (tanamBtn) {
        tanamBtn.addEventListener("click", function () {
            window.location.href = "detail-kebun.html";
        });
    }

    const profileImage = document.getElementById("profileImage");
    if (profileImage) {
        profileImage.addEventListener("click", function () {
            window.location.href = "profile-revisi.html";
        });
    }
});
