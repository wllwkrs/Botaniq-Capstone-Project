import '../css/manajemen-kebun.css';

const BASE_API_URL = 'https://previously-notable-hound.ngrok-free.app';
// const ML_API_URL = 'https://intimate-admittedly-kangaroo.ngrok-free.app';

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

async function fetchUserPlants(userId, token) {
    try {
        const [res1, res2] = await Promise.all([
            fetch(`${BASE_API_URL}/user_plants/${userId}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            }),
            fetch(`${BASE_API_URL}/user_plantsandfamily/${userId}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            })
        ]);

        const data1 = await res1.json();
        const data2 = await res2.json();

        return [
            ...(data1.data || []).map(plant => ({
                id: plant.id,
                name: plant.latin,
                imageKey: plant.latin,
                source: 'user_plants'
            })),
            ...(data2.data || []).map(plant => ({
                id: plant.id,
                name: plant.PlantName,
                imageKey: plant.PlantName,
                source: 'user_plantsandfamily'
            }))
        ];
    } catch (err) {
        console.error("Failed to fetch user's plant data:", err);
        return [];
    }
}

function createPlantCard(name, imageUrl, index, plantId, source, token) {
    const card = document.createElement('div');
    card.className = 'plant-card';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'archive-button';
    closeBtn.innerHTML = '&times;';
    closeBtn.title = 'Delete plant';
    closeBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // prevent triggering monitor button
        const confirmDelete = confirm("Are you sure you want to delete this plant?");
        if (!confirmDelete) return;

        const archiveUrl = `${BASE_API_URL}/${source}/archive/${plantId}`;
        try {
            const res = await fetch(archiveUrl, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true"
                }
            });
            const result = await res.json();
            if (res.ok) {
                alert("Plant successfully deleted.");
                card.remove(); // remove from UI
            } else {
                alert("Failed to delete: " + result.message);
            }
        } catch (err) {
            console.error("Error while deleting:", err);
            alert("An error occurred while deleting the plant.");
        }
    });

    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'plant-image';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = name;
    imgWrapper.appendChild(img);

    const title = document.createElement('h3');
    title.textContent = name;

    const button = document.createElement('button');
    button.className = 'monitor-button';
    button.id = `tanam${index}`;
    button.textContent = 'Monitor';
    button.addEventListener('click', () => {
        const encodedName = encodeURIComponent(name);
        window.location.href = `detail-kebun.html?plant=${encodedName}`;
    });

    card.appendChild(closeBtn);
    card.appendChild(imgWrapper);
    card.appendChild(title);
    card.appendChild(button);

    return card;
}

async function renderUserPlants(token) {
    const userId = localStorage.getItem('user_id');
    if (!userId) return console.error("User ID not found.");

    const container = document.getElementById("plantcontainer");
    const grid = document.createElement("div");
    grid.className = "plant-card-grid";

    loading.style.display = "block";

    const userPlants = await fetchUserPlants(userId, token);

    for (let i = 0; i < userPlants.length; i++) {
        const plant = userPlants[i];
        const imageUrl = await getWikipediaImage(plant.name, plant.imageKey);
        const card = createPlantCard(plant.name, imageUrl, i + 1, plant.id, plant.source, token);
        grid.appendChild(card);
    }

    const existingGrid = document.querySelector(".plant-card-grid");
    if (existingGrid) existingGrid.remove();
    container.appendChild(grid);

    loading.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
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
    .then(res => res.json())
    .then(data => {
        const profile = data.data || {};
        const profileImageUrl = profile.foto ? `${BASE_API_URL}/uploads/${profile.foto}` : "assets/img/profile.jpeg";
        document.querySelectorAll(".profile-circle img, .profile-avatar-card").forEach(img => {
            img.src = profileImageUrl;
        });
        if (profile.id) {
            localStorage.setItem("user_id", profile.id);
            renderUserPlants(token);
        }
    })
    .catch(err => {
        console.error("Failed to fetch user or profile data:", err);
    });

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

    mobileMenuIcon?.addEventListener('click', openSidebar);
    closeSidebar?.addEventListener('click', closeSidebarMenu);
    overlay?.addEventListener('click', closeSidebarMenu);

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', closeSidebarMenu);
    });

    document.getElementById("profileImage")?.addEventListener("click", function () {
        window.location.href = "profile-revisi.html";
    });

    document.getElementById('logoutbtn')?.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');

        fetch(`${BASE_API_URL}/logout`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            console.log(data.message);
            window.location.href = 'home.html';
        })
        .catch(err => {
            console.error('Logout error:', err);
            window.location.href = 'home.html';
        });
    });

    document.getElementById("beranda")?.addEventListener("click", function () {
        window.location.href = "beranda.html";
    });
});
