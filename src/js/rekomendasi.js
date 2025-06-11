
    


import '../css/list-rekomendasi.css';

let allPlants = [];
let filteredPlants = [];
let currentIndex = 0;
let suhu = null;
const itemsPerPage = 3;
let initialFiltered = [];
let historyRekomendasi = [];
let historyIndex = -1; // -1 artinya belum ada yang tersimpan


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
        const imageUrl = await getWikipediaImage(plant.PlantName || plant.latin, plant.latin);
        const isFromFilter = !!plant.PlantName; // if PlantName exists, it's from /predict/custom

        return `
            <div class="recommendation-card">
                <div class="plant-details"><h3>${plant.PlantName || plant.latin}</h3></div>
                <div class="plant-image"><img src="${imageUrl}" alt="Plant Image"></div>
                <div class="card-actions">
                    <button class="action-button">Tanam dan Pantau</button>
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
                        <p>Insect: ${plant.insect}</p>
                        <p>Family: ${plant.family?.trim()}</p>
                        <p>Temperatur: ${plant.temp_avg}</p>
                    `}
                </div>
            </div>`;
    });

    const cardsHTML = await Promise.all(cardPromises);
    container.innerHTML = cardsHTML.join('');
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


document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Token tidak ditemukan. Silakan login ulang.");
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

    document.querySelector('.search-bar button').addEventListener('click', applyFilters);

    async function applyFilters() {
        const growth = document.querySelector('#growth').value;
        const soil = document.querySelector('#soil').value;
        const sunlight = document.querySelector('#sunlight').value;
        const watering = document.querySelector('#watering').value;
        const fertilizer = document.querySelector('#fertilizer').value;

        const isFilterUsed = growth || soil || sunlight || watering || fertilizer;

        if (isFilterUsed) {
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
});