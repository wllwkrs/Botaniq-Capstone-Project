
import '../css/rekomendasi.css';

let allPlants = [];
let filteredPlants = [];
let currentIndex = 0;
let suhu = null;
const itemsPerPage = 3;
let initialFiltered = [];
let historyRekomendasi = [];
let historyIndex = -1; // -1 artinya belum ada yang tersimpan



document.addEventListener('DOMContentLoaded', async function () {
    showLoading();
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Token not found. Please log in again.");
        window.location.href = "login.html";
        return;
    }

    try {
        const profileRes = await fetch(`${BASE_API_URL}/profile`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true"
            }
        });
        const profileData = await profileRes.json();
        const profile = profileData.data || {};
        const profileImageUrl = profile.foto ? `${BASE_API_URL}/uploads/${profile.foto}` : "assets/img/profile.jpeg";
        document.querySelectorAll(".profile-circle img").forEach(img => img.src = profileImageUrl);
        document.querySelectorAll(".profile-avatar-card").forEach(img => img.src = profileImageUrl);
    } catch (err) {
        console.error("Gagal ambil data user:", err);
    }

    try {
        const plantRes = await fetch(`${BASE_API_URL}/plants`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true"
            }
        });
        const plantData = await plantRes.json();
        allPlants = plantData.data || [];

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const API_KEY = 'a290da4bf85a0b886d5b613a2dbecd23';
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`;

                try {
                    const res = await fetch(weatherUrl);
                    const weather = await res.json();
                    suhu = weather.main.temp;
                    const kondisiCuaca = weather.weather[0].main;

                    let climate = "Tropical";
                    if (kondisiCuaca.includes("Snow")) climate = "Polar";
                    else if (kondisiCuaca.includes("Rain")) climate = "Tropical";
                    else if (["Clear", "Clouds"].some(x => kondisiCuaca.includes(x))) climate = "Subtropical";
                     console.log("Suhu:", suhu, "| Climate:", climate);

                    const mlRes = await fetch(`${ML_API_URL}/predict/lokasi`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ climate, temperature: suhu })
                    });

                    const mlData = await mlRes.json();
                    console.log("Rekomendasi dari ML:", mlData);

                    const rekomendasiLatin = mlData.recommendations || [];
                    const rekomendasiLower = rekomendasiLatin.map(n => n.trim().toLowerCase());
                    filteredPlants = rekomendasiLower.map(nameFromML => {
                        return allPlants.find(p => typeof p.latin === 'string' && p.latin.trim().toLowerCase() === nameFromML);
                    }).filter(Boolean);

                    if (filteredPlants.length > 0) {
                        if (historyIndex === -1 || JSON.stringify(filteredPlants) !== JSON.stringify(historyRekomendasi[historyIndex])) {
                            historyRekomendasi.push(filteredPlants);
                            historyIndex = historyRekomendasi.length - 1;
                        }
                    }
                    initialFiltered = [...filteredPlants];
                    renderPlants();
                } catch (err) {
                    console.error("Gagal ambil data cuaca atau tanaman:", err);
                }
            });
        }
    } catch (err) {
        console.error("Gagal ambil data tanaman dari database:", err);
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

    // document.querySelector('.search-bar button').addEventListener('click', applyFilters);

    async function applyFilters() {
        const growth = document.querySelector('#growth').value;
        const soil = document.querySelector('#soil').value;
        const sunlight = document.querySelector('#sunlight').value;
        const watering = document.querySelector('#watering').value;
        const fertilizer = document.querySelector('#fertilizer').value;

        const isFilterUsed = growth || soil || sunlight || watering || fertilizer;

        if (isFilterUsed) {
            showLoading();
            try {
                const response = await fetch(`${ML_API_URL}/predict/custom`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Growth: growth || "none",
                        Soil: soil || "none",
                        Sunlight: sunlight || "none",
                        Watering: watering || "none",
                        "Fertilization Type": fertilizer || "none",
                        reset: false
                    })
                });

                const result = await response.json();
                console.log("Rekomendasi dari ML:", result);
                const rekomendasi = result.recommendations || [];

                const res = await fetch(`${BASE_API_URL}/plantsandfamily`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                const fullData = (await res.json()).data || [];

                filteredPlants = rekomendasi.map(name => {
                    return fullData.find(p => p.PlantName.toLowerCase() === name.trim().toLowerCase());
                }).filter(Boolean);
            } catch (err) {
                console.error("Gagal ambil rekomendasi filter:", err);
                filteredPlants = [];
            }
        } else {
            filteredPlants = [...initialFiltered];
        }

        currentIndex = 0;
        await renderPlants();
    }

    
    const prevBtn = document.getElementById('prevBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', async () => {
            if (historyIndex > 0) {
                historyIndex -= 1;
                filteredPlants = historyRekomendasi[historyIndex];
                currentIndex = 0;
                await renderPlants();
            }
        });
    }


    document.getElementById('nextBtn')?.addEventListener('click', () => {
    updatePage(); 
    console.log("Rekomendasi ML terbaru (next):", filteredPlants.map(p => p.latin || p.PlantName));

});

document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));

// async function handleSearch(e) {
//     const keyword = e.target.value.toLowerCase().trim();
//     const token = localStorage.getItem("token");

    
//     if (!keyword) {
//         showLoading();
//         // Tampilkan ulang rekomendasi awal (berdasarkan lokasi)
//         filteredPlants = [...initialFiltered];
//         currentIndex = 0;
//         await renderPlants();
//         return;
//     }

//     try {
//         // Ambil dari kedua tabel
//         const [res1, res2] = await Promise.all([
//             fetch(`${BASE_API_URL}/plants`, {
//                 method: 'GET',
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "ngrok-skip-browser-warning": "true"
//                 }
//             }),
//             fetch(`${BASE_API_URL}/plantsandfamily`, {
//                 method: 'GET',
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "ngrok-skip-browser-warning": "true"
//                 }
//             })
//         ]);

//         const data1 = (await res1.json()).data || [];
//         const data2 = (await res2.json()).data || [];

//         // Gabungkan dan cari yang mengandung keyword di latin atau PlantName
//         const allResults = [...data1, ...data2];
//         filteredPlants = allResults.filter(p => {
//             const latin = p.latin?.toLowerCase() || '';
//             const plantName = p.PlantName?.toLowerCase() || '';
//             return latin.includes(keyword) || plantName.includes(keyword);
//         });

//         currentIndex = 0;
//         await renderPlants();
//     } catch (err) {
//         console.error("Gagal ambil atau filter data pencarian:", err);
//         filteredPlants = [];
//         await renderPlants();
//     }
// }

async function handleSearch(e) {
    const keyword = e.target.value.toLowerCase().trim();
    const token = localStorage.getItem("token");

    const plantContainer = document.getElementById('plantContainer');
    plantContainer.innerHTML = `
        <div class="loading-wrapper">
            <div class="spinner"></div>
            <p>Loading plant recommendations...</p>
        </div>
    `;

    if (!keyword) {
        try {
            // Ambil ulang rekomendasi by lokasi
            const res = await fetch(`${BASE_API_URL}/predict`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            });
            const result = await res.json();
            initialFiltered = result.data || [];
            filteredPlants = [...initialFiltered];
            currentIndex = 0;
            await renderPlants();
        } catch (err) {
            console.error("Gagal ambil ulang data lokasi:", err);
            plantContainer.innerHTML = `<p style="text-align:center;">Failed to load recommendation data</p>`;
        }
        return;
    }

    try {
        const [res1, res2] = await Promise.all([
            fetch(`${BASE_API_URL}/plants`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            }),
            fetch(`${BASE_API_URL}/plantsandfamily`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            })
        ]);

        const data1 = (await res1.json()).data || [];
        const data2 = (await res2.json()).data || [];

        const allResults = [...data1, ...data2];
        filteredPlants = allResults.filter(p => {
            const latin = p.latin?.toLowerCase() || '';
            const plantName = p.PlantName?.toLowerCase() || '';
            return latin.includes(keyword) || plantName.includes(keyword);
        });

        currentIndex = 0;
        await renderPlants();
    } catch (err) {
        console.error("Gagal ambil atau filter data pencarian:", err);
        filteredPlants = [];
        await renderPlants();
    }
}

function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

document.querySelector('.back-link').addEventListener('click', function (e) {
    e.preventDefault();
    history.back(); // atau history.go(-1);
});

    // Mobile Sidebar Toggle
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    function toggleSidebar(state) {
        mobileSidebar.classList.toggle('open', state);
        overlay.style.display = state ? 'block' : 'none';
        body.classList.toggle('sidebar-open', state);
    }

    mobileMenuIcon.addEventListener('click', () => toggleSidebar(true));
    closeSidebar.addEventListener('click', () => toggleSidebar(false));
    overlay.addEventListener('click', () => toggleSidebar(false));

    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleSidebar(false));
    });

});
function showLoading() {
    const container = document.getElementById('plantContainer');
    container.innerHTML = `
        <div class="loading-wrapper">
            <div class="spinner"></div>
            <p>Loading plant recommendations...</p>
        </div>
    `;
}

const BASE_API_URL = 'https://previously-notable-hound.ngrok-free.app';
const ML_API_URL = 'https://intimate-admittedly-kangaroo.ngrok-free.app';

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
            console.error("Failed to fetch Wikipedia image for", title, err);
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
        const imageUrl = await getWikipediaImage(plant.PlantName || plant.latin, plant.latin);
        const isFromFilter = !!plant.PlantName; // if PlantName exists, it's from /predict/custom


        return `
            <div class="recommendation-card">
                <div class="plant-details"><h3>${plant.PlantName || plant.latin}</h3></div>
                <div class="plant-image"><img src="${imageUrl}" alt="Plant Image"></div>
                <div class="card-actions">
                    <button class="action-button">Grow and Track</button>
                </div>
                <div class="plant-details">
                    <p>Suhu: ${suhu !== null ? suhu + "°C" : "N/A"}</p>
                    ${isFromFilter ? `
                        <p>Growth: ${plant.Growth || '-'}</p>
                        <p>Soil: ${plant.Soil || '-'}</p>
                        <p>Sunlight: ${plant.Sunlight || '-'}</p>
                        <p>Watering: ${plant.Watering || '-'}</p>
                        <p>Fertilization: ${plant.FertilizationType || '-'}</p>
                        <p>Family: ${plant.family || '-'}</p>
                    ` : `
                        <p>Category: ${plant.category}</p>
                        <p>Soil: ${plant.Soil}</p>
                        <p>Climate: ${plant.climate}</p>
                        <p>use: ${plant.use}</p>
                        <p>Insects: ${plant.insects}</p>
                        <p>Family: ${plant.family?.trim()}</p>
                        <p>Temperatur: ${plant.temp_avg}</p>
                    `}
                </div>
            </div>`;
            
    });

    const cardsHTML = await Promise.all(cardPromises);
    container.innerHTML = cardsHTML.join('');

    // Setelah menampilkan kartu
document.querySelectorAll('.action-button').forEach((btn, index) => {
    btn.addEventListener('click', async () => {
        const plant = filteredPlants[currentIndex + index];
        const token = localStorage.getItem("token");

        let url = "";
        let payload = {};

        if (plant.PlantName) {
            // Dari filter → ke /user_plantsandfamily
            url = `${BASE_API_URL}/user_plantsandfamily`;
            payload = {
                PlantName: plant.PlantName,
                Growth: plant.Growth,
                Soil: plant.Soil,
                Sunlight: plant.Sunlight,
                Watering: plant.Watering,
                FertilizationType: plant.FertilizationType,
                family: plant.family
            };
        } else if (plant.latin) {
            // Dari lokasi → ke /user_plants
            url = `${BASE_API_URL}/user_plants`;
            payload = {
                latin: plant.latin,
                category: plant.category,
                Soil: plant.Soil,
                climate: plant.climate,
                use: plant.use,
                insects: plant.insects,
                family: plant.family,
                temp_avg: plant.temp_avg,
                ideallight: plant.ideallight,
                toleratedlight: plant.toleratedlight,
                watering: plant.watering,
                tempmax_celsius: plant.tempmax_celsius,
                tempmin_celsius: plant.tempmin_celsius,
                combined: plant.combined
            };
        } else {
            console.error("Invalid plant data:", plant);
            return;
        }

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (res.ok) {
                window.location.href = "manajemen-kebun.html";
            } else {
                alert("Failed to save plant: " + result.message);
            }
        } catch (err) {
            console.error("Error saat menyimpan tanaman:", err);
            alert("An error occurred while saving the plant.");
        }
    });
});

}
window.updatePage = async function updatePage() {
    // Ambil ulang rekomendasi berdasarkan lokasi
    try {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const API_KEY = 'a290da4bf85a0b886d5b613a2dbecd23';
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`;

                const res = await fetch(weatherUrl);
                const weather = await res.json();
                suhu = weather.main.temp;
                const kondisiCuaca = weather.weather[0].main;

                let climate = "Tropical";
                if (kondisiCuaca.includes("Snow")) climate = "Polar";
                else if (kondisiCuaca.includes("Rain")) climate = "Tropical";
                else if (["Clear", "Clouds"].some(x => kondisiCuaca.includes(x))) climate = "Subtropical";

                showLoading();
                const mlRes = await fetch(`${ML_API_URL}/predict/lokasi`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ climate, temperature: suhu })
                });

                const mlData = await mlRes.json();
                const rekomendasiLatin = mlData.recommendations || [];
                const rekomendasiLower = rekomendasiLatin.map(n => n.trim().toLowerCase());
                
                filteredPlants = rekomendasiLower.map(nameFromML => {
                    return allPlants.find(p => typeof p.latin === 'string' && p.latin.trim().toLowerCase() === nameFromML);
                }).filter(Boolean);

                if (filteredPlants.length > 0) {
                    // Simpan ke history hanya jika berbeda dari sebelumnya
                    if (historyIndex === -1 || JSON.stringify(filteredPlants) !== JSON.stringify(historyRekomendasi[historyIndex])) {
                        historyRekomendasi.push(filteredPlants);
                        historyIndex = historyRekomendasi.length - 1;
                    }
                }

                initialFiltered = [...filteredPlants];
                currentIndex = 0;
                await renderPlants();

            });
        }
    } catch (err) {
        console.error("Gagal refresh rekomendasi:", err);
    }
    
};

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
