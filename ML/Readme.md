<h1 align="center">Machine Learning Models in BotaniQ</h1>

---

## Machine Learning Model

Aplikasi BotaniQ menggunakan tiga jenis model machine learning yang dirancang untuk memberikan pengalaman pengguna yang personal, adaptif, dan bermanfaat dalam pengelolaan tanaman dan kebun.

### 1. Rekomendasi by Lokasi
Memberikan rekomendasi tanaman yang cocok berdasarkan lokasi dan kondisi cuaca pengguna.  
- **Pendekatan**: Content-Based Filtering menggunakan TensorFlow Classifier (MLP)  
- **Input**: Lokasi pengguna (suhu dan iklim)  
- **Output**: Daftar tanaman yang sesuai dengan kondisi lingkungan pengguna  

### 2. Rekomendasi by Custom
Menghasilkan rekomendasi tanaman sesuai dengan preferensi atau kriteria yang dipilih oleh pengguna.  
- **Pendekatan**: Content-Based Filtering menggunakan TensorFlow Classifier (MLP)  
- **Input**: Preferensi pengguna seperti pertumbuhan, pencahayaan, penyiraman, jenis pupuk  
- **Output**: Rekomendasi tanaman yang relevan dengan preferensi pengguna  

### 3. Model Manajemen Kebun
Memberikan rekomendasi perawatan berdasarkan jenis tanaman yang dipilih pengguna untuk dikembangkan.  
- **Pendekatan**: Content-Based Filtering dengan arsitektur TensorFlow MLP Encoder-Decoder  
- **Input**: Nama tanaman, kondisi lingkungan (suhu, cahaya, kelembaban), dan riwayat perawatan  
- **Output**: Jadwal dan tips perawatan yang dipersonalisasi, seperti pola penyiraman, jenis pupuk, dan potensi hama  

---

<h2 align="center">How to use?</h2>

##

<h3>Clone This Repository</h3>

###

<h3>Setting Virtual Environment</h3>

###

```
python -m venv botaiq
```

<h4>Install Library</h4>

```
pip install -r requirenments.txt
```

<h4>Registered environment as kernel in jupyter notebook</h4>

```
python -m ipykernel install --user --name=botaniq --display-name "botaniq"
```

###

<h3>Open jupyter file</h3>

```
jupyter notebook
```

##

<h3>Build Machine Learning Model</h3>

##

<h4>ML Model Rekomendasi by Lokasi</h4>

Use `RekomendasibyLokasi.py` to create model plant recommendation by location

```
python3 Modelling/RecommendasibyLokasi/RecommendasibyLokasi.py
```

###

<h4>ML Model Rekomendasi by Custom</h4>

Use `rekomendasibyCustom.py` to create model plant recommendation by custom

```
python3 Modelling/RecommendasibyCustom/RecommendasibyCustom.py
```

###

<h4>ML Model Manajemen Kebun</h4>

Use `ManajemenKebun.py` to create model garden management

```
python3 Modelling/Manajemen Kebun/ManajemenKebun.py
```

##
<h3>Serve Model</h3>

Using `api_model.py` to start server
```
python3 API/api_model.py
```
