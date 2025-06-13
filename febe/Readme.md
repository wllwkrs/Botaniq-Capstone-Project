#  BotaniQ

**BotaniQ** adalah aplikasi web yang dirancang untuk membantu masyarakat kota dalam merawat dan mengelola tanaman dengan lebih cerdas dan efisien. Aplikasi ini menawarkan berbagai fitur seperti rekomendasi tanaman, manajemen kebun, jadwal perawatan, serta informasi kondisi tanaman terkini.

---

##  Fitur Utama
1. **Authetifikasi**
   Fitur Autentikasi di aplikasi BotaniQ berfungsi untuk mengamankan akses pengguna dan memastikan hanya pengguna yang terdaftar yang dapat menggunakan fitur-fitur utama aplikasi. Sistem ini dibangun menggunakan Node.js dan JSON Web Token (JWT) sebagai metode otorisasi.
1. **Rekomendasi Tanaman**  
   Memberikan rekomendasi tanaman yang cocok berdasarkan kondisi lingkungan pengguna seperti suhu dan iklim. Selain itu, pengguna juga dapat memilih tanaman sesuai keinginannya.

2. **Manajemen Kebun**  
   Pengguna dapat menambahkan tanaman ke kebun virtual mereka dan mengelola jadwal perawatan masing-masing tanaman.

3. **Detail Tanaman & Jadwal Perawatan**  
   Fitur untuk melihat detail tanaman tertentu serta menambahkan aktivitas perawatan seperti menyiram atau pemupukan.

##  Fitur Pelengkap

1. **Profil**
   Pengguna dapat melihat dan mengelola informasi akun mereka, seperti nama, foto profil, dan email. Fitur ini juga memungkinkan pengguna untuk melakukan edit profil agar data tetap terbarui.
3. **Beranda**
   Beranda menampilkan gambaran umum dari aplikasi BotaniQ. Di sini, pengguna dapat melihat lokasi terkini. Beranda berperan sebagai pusat navigasi utama setelah login.
5. **Landing Page**
   Halaman awal yang ditampilkan saat pengguna pertama kali mengunjungi aplikasi (belum login). Landing page berisi informasi singkat tentang apa itu BotaniQ, keunggulan fitur, serta tombol Login dan Register. Desain halaman ini dibuat menarik dan informatif agar pengguna tertarik untuk menggunakan aplikasi.
---

## Teknologi yang Digunakan

- **HTML5** – Struktur halaman web.
- **CSS3** – Styling halaman dan layout responsif.
- **JavaScript (ES6)** – Logika interaktif dan komunikasi dengan backend.
- **Node.js + Hapi.js** – Backend API, autentikasi, dan pengelolaan data pengguna.
- **Webpack** – Module bundler untuk mengoptimalkan dan menggabungkan asset.
- **Vanilla Calendar** – Komponen kalender interaktif untuk menjadwalkan perawatan tanaman.
- **Font Awesome** – Ikon UI modern.
- **Postman** – Testing dan dokumentasi REST API.
- **Figma** – Desain UI/UX awal sebelum pengembangan.
- **GitHub Pages** – Hosting front-end statis secara gratis.
- **Laragon** - Membuat Database.
- **NGROK** - deploy API



---

<h1>🚀 Menjalankan API Botaniq</h1>

<h3>1. Clone Repository</h3>
<pre><code>git clone https://github.com/wllwkrs/Botaniq-Capstone-Project.git
cd Botaniq-Capstone-Project/api_febe
</code></pre>

<h3>2. Install Dependencies</h3>
<pre><code>npm install
</code></pre>

<h3>3. Jalankan Server</h3>
<pre><code>node src/server.js
</code></pre>

<p>Pastikan server berjalan di <strong>port 5500</strong> dan tidak ada error.</p>

<hr />

<h2>🌐 Hosting API via Ngrok</h2>

<p><strong>Syarat:</strong> Sudah menginstal <a href="https://ngrok.com/download" target="_blank">Ngrok</a> dan login dengan akunmu.</p>

<h3>1. Hosting biasa (acak subdomain)</h3>
<pre><code>ngrok http 5500
</code></pre>

<h3>2. Hosting dengan subdomain khusus (misalnya: previously-notable-hound.ngrok-free.app)</h3>
<pre><code>
ngrok config add-authtoken &lt;your_token&gt;
ngrok http --domain=previously-notable-hound.ngrok-free.app 5500
</code></pre>
<p>Rubah URL API di code apabila kamu memiliki URL ngrok yang baru</p>
<p>Jika kamu mengalami kendala, seperti server tidak merespons atau ngrok gagal, silakan cek kembali port, koneksi, atau token.</p>


<h2>📦 Instalasi &amp; Setup Proyek (dengan Webpack)</h2>

<h3>1. Clone Repository</h3>
<pre><code>git clone https://github.com/wllwkrs/Botaniq-Capstone-Project.git
cd Botaniq-Capstone-Project/febe
</code></pre>

<h3>2. Install Dependencies</h3>
<pre><code>npm install
</code></pre>

<h3>3. Build Project dengan Webpack</h3>
<pre><code>npm run build
</code></pre>

<h3>4. Jalankan Project dengan Webpack</h3>
<pre><code>npm run start
</code></pre>

<h3>5. Akses Aplikasi</h3>
<p>Buka browser dan akses: <a href="http://localhost:8080" target="_blank">http://localhost:8080</a></p>




<h3> Alur Penggunaan Aplikasi</h3>

<ol>
  <li><strong>Landing Page</strong><br />
    Saat pertama kali membuka aplikasi, pengguna akan diarahkan ke halaman Landing Page. Di sini terdapat informasi singkat tentang BotaniQ dan tombol <code>Login</code> atau <code>Register</code>.
  </li>

  <li><strong>Login / Register</strong><br />
    Pengguna dapat membuat akun baru atau login dengan akun yang sudah terdaftar. Sistem autentikasi menggunakan JWT.
  </li>

  <li><strong>Beranda</strong><br />
    Setelah login berhasil, pengguna diarahkan ke halaman Beranda. Halaman ini menampilkan lokasi pengguna serta ringkasan fitur aplikasi seperti rekomendasi tanaman dan status kebun.
  </li>

  <li><strong>Rekomendasi Tanaman</strong><br />
    Pengguna dapat melihat tanaman yang direkomendasikan berdasarkan suhu atau iklim saat ini. Selain itu, pengguna juga bisa memilih tanaman berdasarkan filter seperti jenis atau famili.
  </li>

  <li><strong>Tambahkan ke Kebun</strong><br />
    Tanaman yang dipilih dapat ditambahkan ke kebun pribadi pengguna dengan menekan tombol <code>Grow and Track</code>.
  </li>

  <li><strong>Manajemen Kebun</strong><br />
    Di halaman ini, pengguna bisa melihat daftar tanaman yang telah mereka tambahkan. Setiap tanaman memiliki informasi nama dan gambar serta tombol untuk melihat atau mengatur jadwal perawatan.
  </li>

  <li><strong>Detail & Jadwal Perawatan Tanaman</strong><br />
    Saat pengguna mengklik salah satu tanaman di kebun, mereka diarahkan ke halaman detail. Di sini terdapat informasi lengkap tanaman serta fitur untuk menambahkan aktivitas perawatan seperti menyiram, memupuk, atau mengganti pot.
  </li>
</ol>


