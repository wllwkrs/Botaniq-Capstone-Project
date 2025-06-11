import '../css/list-rekomendasi.css';

let allPlants = [];
let filteredPlants = [];
let currentIndex = 0;
let suhu = null;
const itemsPerPage = 3;
let initialFiltered = [];

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
    .then(res => res.json())
    .then(data => {
        const profile = data.data || {};
        const profileImageUrl = profile.foto ? `${BASE_API_URL}/uploads/${profile.foto}` : "assets/img/profile.jpeg";

        document.querySelectorAll(".profile-circle img").forEach(img => img.src = profileImageUrl);
        document.querySelectorAll(".profile-avatar-card").forEach(img => img.src = profileImageUrl);
    })
    .catch(err => {
        console.error("Gagal ambil data user:", err);
    });

    // Ambil lokasi dan cuaca
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const API_KEY = 'a290da4bf85a0b886d5b613a2dbecd23';
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=id`;

            try {
                const response = await fetch(weatherUrl);
                const data = await response.json();

                suhu = data.main.temp;
                const kondisiCuaca = data.weather[0].main;

                let climate = "Tropical";
                if (kondisiCuaca.includes("Snow")) climate = "Polar";
                else if (kondisiCuaca.includes("Rain")) climate = "Tropical";
                else if (kondisiCuaca.includes("Clear") || kondisiCuaca.includes("Clouds")) climate = "Subtropical";

                console.log("Suhu:", suhu, "| Climate:", climate);

                // Kirim ke ML
                const mlRes = await fetch("https://intimate-admittedly-kangaroo.ngrok-free.app/predict/lokasi", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ climate, temperature: suhu })
                });

                const mlData = await mlRes.json();
                console.log("Rekomendasi dari ML:", mlData);
                const rekomendasiNamaTanaman = mlData.recommendations || [];

                // console.log("Rekomendasi dari ML:", rekomendasiNamaTanaman);

                // Ambil semua data tanaman dari database
                const plantRes = await fetch(`${BASE_API_URL}/plants`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true"
                    }
                });

                const plantData = await plantRes.json();
                allPlants = plantData.data || [];

                // Debug nama latin untuk dicocokkan
                const rekomendasiLower = rekomendasiNamaTanaman.map(n => n.trim().toLowerCase());
                console.log("Nama latin dari ML:", rekomendasiLower);
                console.log("Nama latin dari DB:", allPlants.map(p => p.latin?.trim().toLowerCase()));

                // Coba log perbandingan untuk cek kecocokan
                rekomendasiLower.forEach(nameFromML => {
                    allPlants.forEach(plant => {
                        const dbName = plant.latin?.trim().toLowerCase();
                        if (dbName === nameFromML) {
                            console.log("COCOK:", dbName, "<==>", nameFromML);
                        }
                    });
                });

   filteredPlants = rekomendasiLower.map(nameFromML => {
    return allPlants.find(plant => 
        typeof plant.latin === 'string' && 
        plant.latin.trim().toLowerCase() === nameFromML
    );
}).filter(Boolean);

initialFiltered = [...filteredPlants]; // Simpan untuk fallback
renderPlants();
             
//                 filteredPlants = rekomendasiLower.map(nameFromML => {
//     return allPlants.find(plant => 
//         typeof plant.latin === 'string' && 
//         plant.latin.trim().toLowerCase() === nameFromML
//     );
// }).filter(Boolean); // Filter out any null values if not found

//                 console.log("Filtered Plants (match ML):", filteredPlants);

//                 renderPlants();
            } catch (err) {
                console.error("Gagal ambil data cuaca atau tanaman:", err);
            }
        });
    }

function getPlantFromDBByLatin(latin) {
    const target = latin.trim().toLowerCase();
    return allPlants.find(p => p.latin?.trim().toLowerCase() === target) || null;
}


async function getWikipediaImage(plantName, latinName) {
    const tryFetch = async (title) => {
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=300&origin=*`;
        try {
            const res = await fetch(apiUrl);
            const data = await res.json();
            const pages = data.query.pages;
            const page = Object.values(pages)[0];
            return page.thumbnail?.source || null;
        } catch (err) {
            console.error("Gagal ambil gambar Wikipedia untuk", title, err);
            return null;
        }
    };

    return await tryFetch(plantName) || await tryFetch(latinName) || "assets/img/no-picture.jpeg";
}

async function renderPlants() {
    const container = document.getElementById('plantContainer');
    container.innerHTML = '';

    const slice = filteredPlants.slice(currentIndex, currentIndex + itemsPerPage);
    const cardPromises = slice.map(async plant => {
        const imageUrl = await getWikipediaImage(plant.PlantName, plant.latin);
        return `
            <div class="recommendation-card">
                <div class="plant-details"><h3>${plant.latin}</h3></div>
                <div class="plant-image"><img src="${imageUrl}" alt="Plant Image"></div>
                <div class="card-actions">
                    <button class="action-button">Tanam dan Pantau</button>
                </div>
                <div class="plant-details">
                    <p>Suhu: ${suhu !== null ? suhu + "°C" : "N/A"}</p>
                    <p>Category: ${plant.category}</p>
                    <p>Soil: ${plant.Soil}</p>
                    <p>Climate: ${plant.climate}</p>
                    <p>use: ${plant.use}</p>
                    <p>Insect: ${plant.insect}</p>
                    <p>Family: ${plant.family?.trim()}</p>
                    <p>Temperatur: ${plant.temp_avg}</p>             
                </div>
            </div>`;
    });

    const cardsHTML = await Promise.all(cardPromises);
    container.innerHTML = cardsHTML.join('');
}

const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', async () => {
        console.log("Tombol NEXT diklik");
        if (currentIndex + itemsPerPage < filteredPlants.length) {
            currentIndex += itemsPerPage;
            console.log("Next ke index:", currentIndex);
            await renderPlants();
        } else {
            console.log("Tidak bisa next, sudah akhir");
        }
    });

    prevBtn.addEventListener('click', async () => {
        console.log("Tombol PREV diklik");
        if (currentIndex - itemsPerPage >= 0) {
            currentIndex -= itemsPerPage;
            console.log("Prev ke index:", currentIndex);
            await renderPlants();
        } else {
            console.log("Tidak bisa prev, sudah awal");
        }
    });
} else {
    console.error("Tombol next/prev tidak ditemukan di DOM!");
}



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

    function applyFilters() {
        const growth = document.querySelector('#growth');
        const soil = document.querySelector('#soil');
        const sunlight = document.querySelector('#sunlight');
        const watering = document.querySelector('#watering');
        const fertilizer = document.querySelector('#fertilizer');
        const keyword = document.querySelector('.search-bar input').value.trim().toLowerCase();

        filteredPlants = allPlants.filter(plant => {
            return (!growth.value || plant.Growth === growth.value) &&
                (!soil.value || plant.Soil === soil.value) &&
                (!sunlight.value || (plant.Sunlight ?? '').toLowerCase() === sunlight.value.toLowerCase()) &&
                (!watering.value || (plant.Watering ?? '').toLowerCase().includes(watering.value.toLowerCase())) &&
                (!fertilizer.value || (plant.FertilizationType ?? '').toLowerCase() === fertilizer.value.toLowerCase()) &&
                (!keyword || (plant.PlantName ?? '').toLowerCase().includes(keyword));
        });

        currentIndex = 0;
        renderPlants();
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
    