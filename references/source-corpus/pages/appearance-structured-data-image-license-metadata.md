---
url: https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata
title: "Metadata gambar di Google Gambar"
fetched_at: 2026-05-16T16:53:08.012Z
seed: false
---

# Metadata gambar di Google Gambar

Source: https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata

- 
 
 
 
 
 
 
 
 Beranda
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Kirim masukan
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Metadata gambar di Google Gambar

 
 
 Saat Anda menentukan metadata gambar, Google Gambar dapat menampilkan detail selengkapnya tentang gambar tersebut,
 seperti siapa pembuatnya, bagaimana penggunaannya, dan informasi kredit. Misalnya, dengan menyertakan informasi
 pemberian lisensi, gambar dapat memenuhi syarat untuk mendapatkan badge Lisensi, yang menyediakan link menuju
 lisensi dan detail selengkapnya tentang penggunaan gambar tersebut.

 

# 
 Ketersediaan fitur

 
 Fitur ini tersedia di perangkat seluler dan desktop, serta dalam semua bahasa dan di semua wilayah tempat Google
 Penelusuran tersedia.

# 
 Menyiapkan halaman web dan gambar

 
 Untuk memastikan Google dapat menemukan dan mengindeks gambar:

 
 
- Pastikan halaman yang berisi gambar dapat diakses dan dilihat tanpa perlu menggunakan akun
 atau login. 
 
- Pastikan Googlebot dapat mengakses halaman yang berisi gambar. Artinya, halaman tidak
 diblokir oleh file robots.txt atau tag meta robots .
 Anda dapat melihat semua halaman yang diblokir di situs pada
 Laporan Pengindeksan Halaman ,
 atau menguji halaman tertentu menggunakan Alat Inspeksi URL .
 
 
- Ikuti Dasar-Dasar Penelusuran 
 untuk memastikan Google dapat menemukan konten Anda. 
 
- Ikuti praktik terbaik SEO gambar . 
 
- Agar Google tetap dapat mengetahui setiap perubahan, sebaiknya Anda
 mengirimkan peta situs .
 Anda dapat mengotomatiskan proses ini dengan
 Search Console Sitemap API . 

# 
 Menambahkan data terstruktur atau metadata foto IPTC

 
 Untuk memberi tahu Google tentang metadata gambar Anda, tambahkan data terstruktur atau metadata foto IPTC ke setiap
 gambar di situs Anda. Jika Anda memiliki gambar yang sama di beberapa halaman, tambahkan data terstruktur
 atau metadata foto IPTC ke setiap gambar di setiap halaman tempatnya muncul.

 
 Ada dua cara untuk menambahkan metadata foto ke gambar. Anda hanya perlu memberi
 Google satu bentuk informasi agar memenuhi syarat untuk mendapatkan peningkatan seperti badge Lisensi, dan cukup menggunakan
 salah satu metode berikut:

 
 
- Data terstruktur : Data terstruktur merupakan keterkaitan antara
 gambar dan halaman yang menampilkannya dengan markup. Anda harus menambahkan data terstruktur
 setiap kali suatu gambar digunakan, meskipun gambarnya sama. 
 
- Metadata foto IPTC : Metadata foto IPTC disematkan
 ke dalam gambar itu sendiri. Gambar dan metadatanya tetap utuh meskipun berpindah dari satu halaman
 ke halaman lain. Anda hanya perlu menyematkan metadata foto IPTC sekali per gambar. 

 Jika Anda memilih untuk menggunakan metadata foto IPTC dan data
 terstruktur, kemudian terjadi pertentangan informasi antara keduanya, Google akan menggunakan informasi
 data terstruktur.

 
 Diagram berikut menunjukkan bagaimana informasi lisensi dapat dimunculkan di Google Gambar:

 
 
 
- URL ke halaman yang menjelaskan lisensi yang mengatur penggunaan gambar. Tentukan informasi
 ini dengan properti license Schema.org atau kolom IPTC Web Statement
 of Rights. 
 
- URL ke halaman yang menjelaskan tempat pengguna bisa menemukan informasi tentang cara mendapatkan lisensi untuk
 menggunakan gambar tersebut. Tentukan informasi ini dengan properti acquireLicensePage Schema.org atau
 kolom Licensor URL IPTC (milik Licensor ). 

# 
 Data terstruktur

 
 Salah satu cara memberi tahu Google tentang metadata gambar Anda adalah dengan menambahkan kolom data terstruktur. Data
 terstruktur adalah format standar untuk memberikan informasi tentang sebuah halaman dan mengelompokkan
 isinya. Jika Anda baru mengenal data terstruktur, Anda dapat mempelajari lebih lanjut
 cara kerja data terstruktur .

 
 Berikut adalah ringkasan tentang cara membuat, menguji, dan merilis data terstruktur.

 
 
- Tambahkan properti wajib . Berdasarkan
 format yang Anda gunakan, pelajari tempat menyisipkan
 data terstruktur di halaman .
 
 Menggunakan CMS? Menggunakan plugin yang terintegrasi ke CMS Anda mungkin akan lebih mudah.
 

 Menggunakan JavaScript? Pelajari cara
 membuat data terstruktur
 menggunakan JavaScript .

 
 
- Ikuti Pedoman data terstruktur umum . 
 
- Validasi kode Anda menggunakan
 Pengujian Hasil Multimedia . 
 
- Deploy beberapa halaman yang menyertakan data terstruktur dan gunakan Alat Inspeksi URL untuk menguji cara Google melihat halaman tersebut. Pastikan halaman Anda dapat
 diakses oleh Google dan tidak diblokir oleh file robots.txt, tag noindex , atau
 persyaratan login. Jika halaman tidak bermasalah, Anda dapat
 meminta Google untuk meng-crawl ulang URL Anda .
 Tunggu hingga crawling dan pengindeksan ulang selesai. Perlu diingat bahwa Google
 mungkin memerlukan waktu beberapa hari untuk menemukan dan meng-crawl halaman setelah Anda memublikasikannya.

 
 
- Agar Google tetap mengetahui setiap perubahan pada masa mendatang, sebaiknya
 kirimkan peta situs .
 Anda dapat mengotomatiskan proses ini dengan
 Search Console Sitemap API . 

# 
 Contoh

# 
 Satu gambar

 
 Berikut contoh halaman dengan satu gambar.

 
 
 

# 
 JSON-LD
 

 <html>
 <head>
 <title>Black labrador puppy</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "ImageObject",
 "contentUrl": "https://example.com/photos/1x1/black-labrador-puppy.jpg",
 "license": "https://example.com/license",
 "acquireLicensePage": "https://example.com/how-to-use-my-images",
 "creditText": "Labrador PhotoLab",
 "creator": {
 "@type": "Person",
 "name": "Brixton Brownstone"
 },
 "copyrightNotice": "Clara Kent"
 }
 </script>
 </head>
 <body>
 <img alt="Black labrador puppy" src="https://example.com/photos/1x1/black-labrador-puppy.jpg">
 <p><a href="https://example.com/license">License</a></p>
 <p><a href="https://example.com/how-to-use-my-images">How to use my images</a></p>
 <p><b>Photographer</b>: Brixton Brownstone</p>
 <p><b>Copyright</b>: Clara Kent</p>
 <p><b>Credit</b>: Labrador PhotoLab</p>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Black labrador puppy</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "ImageObject",
 "contentUrl": "https://example.com/photos/1x1/black-labrador-puppy.jpg",
 "license": "https://example.com/license",
 "acquireLicensePage": "https://example.com/how-to-use-my-images",
 "creditText": "Labrador PhotoLab",
 "creator": {
 "@type": "Person",
 "name": "Brixton Brownstone"
 },
 "copyrightNotice": "Clara Kent"
 }
 </script>
 </head>
 <body>
 <img alt="Black labrador puppy" src="https://example.com/photos/1x1/black-labrador-puppy.jpg">
 <p><a href="https://example.com/license">License</a></p>
 <p><a href="https://example.com/how-to-use-my-images">How to use my images</a></p>
 <p><b>Photographer</b>: Brixton Brownstone</p>
 <p><b>Copyright</b>: Clara Kent</p>
 <p><b>Credit</b>: Labrador PhotoLab</p>
 </body>
</html>
 
 

 
 

# 
 RDFa
 

 <html>
 <head>
 <title>Black labrador puppy</title>
 </head>
 <body>
 <div vocab="https://schema.org/" typeof="ImageObject">
 <img alt="Black labrador puppy" property="contentUrl" src="https://example.com/photos/1x1/black-labrador-puppy.jpg" /><br>
 <span property="license"> https://example.com/license</span><br>
 <span property="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span rel="schema:creator">
 <span typeof="schema:Person">
 <span property="schema:name" content="Brixton Brownstone"></span>
 </span>
 </span>
 <span property="copyrightNotice">Clara Kent</span><br>
 <span property="creditText">Labrador PhotoLab</span><br>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Black labrador puppy</title>
 </head>
 <body>
 <div vocab="https://schema.org/" typeof="ImageObject">
 <img alt="Black labrador puppy" property="contentUrl" src="https://example.com/photos/1x1/black-labrador-puppy.jpg" /><br>
 <span property="license"> https://example.com/license</span><br>
 <span property="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span rel="schema:creator">
 <span typeof="schema:Person">
 <span property="schema:name" content="Brixton Brownstone"></span>
 </span>
 </span>
 <span property="copyrightNotice">Clara Kent</span><br>
 <span property="creditText">Labrador PhotoLab</span><br>
 </div>
 </body>
</html>
 
 

 
 

# 
 Microdata
 

 <html>
 <head>
 <title>Black labrador puppy</title>
 </head>
 <body>
 <div itemscope itemtype="https://schema.org/ImageObject">
 <img alt="Black labrador puppy" itemprop="contentUrl" src="https://example.com/photos/1x1/black-labrador-puppy.jpg" />
 <span itemprop="license"> https://example.com/license</span><br>
 <span itemprop="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span itemprop="creator" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Brixton Brownstone" />
 </span>
 <span itemprop="copyrightNotice">Clara Kent</span>
 <span itemprop="creditText">Labrador PhotoLab</span>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Black labrador puppy</title>
 </head>
 <body>
 <div itemscope itemtype="https://schema.org/ImageObject">
 <img alt="Black labrador puppy" itemprop="contentUrl" src="https://example.com/photos/1x1/black-labrador-puppy.jpg" />
 <span itemprop="license"> https://example.com/license</span><br>
 <span itemprop="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span itemprop="creator" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Brixton Brownstone" />
 </span>
 <span itemprop="copyrightNotice">Clara Kent</span>
 <span itemprop="creditText">Labrador PhotoLab</span>
 </div>
 </body>
</html>
 
 

# 
 Satu gambar dalam tag srcset 

 
 Berikut contoh gambar dengan satu gambar dalam tag srcset .

 
 
 

# 
 JSON-LD
 

 <html>
 <head>
 <title>Black labrador puppy</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "ImageObject",
 "contentUrl": "https://example.com/photos/320/black-labrador-puppy-800w.jpg",
 "license": "https://example.com/license",
 "acquireLicensePage": "https://example.com/how-to-use-my-images",
 "creditText": "Labrador PhotoLab",
 "creator": {
 "@type": "Person",
 "name": "Brixton Brownstone"
 },
 "copyrightNotice": "Clara Kent"
 }
 </script>
 </head>
 <body>
 <img srcset="https://example.com/photos/320/black-labrador-puppy-320w.jpg 320w,
 https://example.com/photos/480/black-labrador-puppy-480w.jpg 480w,
 https://example.com/photos/800/black-labrador-puppy-800w.jpg 800w"
 sizes="(max-width: 320px) 280px,
 (max-width: 480px) 440px,
 800px"
 src="https://example.com/photos/320/black-labrador-puppy-800w.jpg"
 alt="Black labrador puppy"><br>
 <p><a href="https://example.com/license">License</a></p>
 <p><a href="https://example.com/how-to-use-my-images">How to use my images</a></p>
 <p><b>Photographer</b>: Brixton Brownstone</p>
 <p><b>Copyright</b>: Clara Kent</p>
 <p><b>Credit</b>: Labrador PhotoLab</p>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Black labrador puppy</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org/",
 "@type": "ImageObject",
 "contentUrl": "https://example.com/photos/320/black-labrador-puppy-800w.jpg",
 "license": "https://example.com/license",
 "acquireLicensePage": "https://example.com/how-to-use-my-images",
 "creditText": "Labrador PhotoLab",
 "creator": {
 "@type": "Person",
 "name": "Brixton Brownstone"
 },
 "copyrightNotice": "Clara Kent"
 }
 </script>
 </head>
 <body>
 <img srcset="https://example.com/photos/320/black-labrador-puppy-320w.jpg 320w,
 https://example.com/photos/480/black-labrador-puppy-480w.jpg 480w,
 https://example.com/photos/800/black-labrador-puppy-800w.jpg 800w"
 sizes="(max-width: 320px) 280px,
 (max-width: 480px) 440px,
 800px"
 src="https://example.com/photos/320/black-labrador-puppy-800w.jpg"
 alt="Black labrador puppy"><br>
 <p><a href="https://example.com/license">License</a></p>
 <p><a href="https://example.com/how-to-use-my-images">How to use my images</a></p>
 <p><b>Photographer</b>: Brixton Brownstone</p>
 <p><b>Copyright</b>: Clara Kent</p>
 <p><b>Credit</b>: Labrador PhotoLab</p>
 </body>
</html>
 
 

 
 

# 
 RDFa
 

 <html>
 <head>
 <title>Black labrador puppy</title>
 </head>
 <body>
 <div vocab="https://schema.org/" typeof="ImageObject">
 <img property="contentUrl"
 srcset="https://example.com/photos/320/black-labrador-puppy-320w.jpg 320w,
 https://example.com/photos/480/black-labrador-puppy-480w.jpg 480w,
 https://example.com/photos/800/black-labrador-puppy-800w.jpg 800w"
 sizes="(max-width: 320px) 280px,
 (max-width: 480px) 440px,
 800px"
 src="https://example.com/photos/320/black-labrador-puppy-800w.jpg"
 alt="Black labrador puppy">
 <span property="license">https://example.com/license</span>
 <span property="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span rel="schema:creator">
 <span typeof="schema:Person">
 <span property="schema:name" content="Brixton Brownstone"></span>
 </span>
 </span>
 <span property="copyrightNotice">Clara Kent</span>
 <span property="creditText">Labrador PhotoLab</span>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Black labrador puppy</title>
 </head>
 <body>
 <div vocab="https://schema.org/" typeof="ImageObject">
 <img property="contentUrl"
 srcset="https://example.com/photos/320/black-labrador-puppy-320w.jpg 320w,
 https://example.com/photos/480/black-labrador-puppy-480w.jpg 480w,
 https://example.com/photos/800/black-labrador-puppy-800w.jpg 800w"
 sizes="(max-width: 320px) 280px,
 (max-width: 480px) 440px,
 800px"
 src="https://example.com/photos/320/black-labrador-puppy-800w.jpg"
 alt="Black labrador puppy">
 <span property="license">https://example.com/license</span>
 <span property="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span rel="schema:creator">
 <span typeof="schema:Person">
 <span property="schema:name" content="Brixton Brownstone"></span>
 </span>
 </span>
 <span property="copyrightNotice">Clara Kent</span>
 <span property="creditText">Labrador PhotoLab</span>
 </div>
 </body>
</html>
 
 

 
 

# 
 Microdata
 

 <html>
 <head>
 <title>Black labrador puppy</title>
 </head>
 <body>
 <div itemscope itemtype="https://schema.org/ImageObject">
 <img itemprop="contentUrl"
 srcset="https://example.com/photos/320/black-labrador-puppy-320w.jpg 320w,
 https://example.com/photos/480/black-labrador-puppy-480w.jpg 480w,
 https://example.com/photos/800/black-labrador-puppy-800w.jpg 800w"
 sizes="(max-width: 320px) 280px,
 (max-width: 480px) 440px,
 800px"
 src="https://example.com/photos/320/black-labrador-puppy-800w.jpg"
 alt="Black labrador puppy">
 <span itemprop="license">https://example.com/license</span>
 <span itemprop="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span itemprop="creator" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Brixton Brownstone" />
 </span>
 <span itemprop="copyrightNotice">Clara Kent</span>
 <span itemprop="creditText">Labrador PhotoLab</span>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Black labrador puppy</title>
 </head>
 <body>
 <div itemscope itemtype="https://schema.org/ImageObject">
 <img itemprop="contentUrl"
 srcset="https://example.com/photos/320/black-labrador-puppy-320w.jpg 320w,
 https://example.com/photos/480/black-labrador-puppy-480w.jpg 480w,
 https://example.com/photos/800/black-labrador-puppy-800w.jpg 800w"
 sizes="(max-width: 320px) 280px,
 (max-width: 480px) 440px,
 800px"
 src="https://example.com/photos/320/black-labrador-puppy-800w.jpg"
 alt="Black labrador puppy">
 <span itemprop="license">https://example.com/license</span>
 <span itemprop="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span itemprop="creator" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Brixton Brownstone" />
 </span>
 <span itemprop="copyrightNotice">Clara Kent</span>
 <span itemprop="creditText">Labrador PhotoLab</span>
 </div>
 </body>
</html>
 
 

# 
 Beberapa gambar di satu halaman

 
 Berikut contoh halaman dengan beberapa gambar.

 
 
 

# 
 JSON-LD
 

 <html>
 <head>
 <title>Photos of black labradors</title>
 <script type="application/ld+json">
 [{
 "@context": "https://schema.org/",
 "@type": "ImageObject",
 "contentUrl": "https://example.com/photos/1x1/black-labrador-puppy.jpg",
 "license": "https://example.com/license",
 "acquireLicensePage": "https://example.com/how-to-use-my-images",
 "creditText": "Labrador PhotoLab",
 "creator": {
 "@type": "Person",
 "name": "Brixton Brownstone"
 },
 "copyrightNotice": "Clara Kent"
 },
 {
 "@context": "https://schema.org/",
 "@type": "ImageObject",
 "contentUrl": "https://example.com/photos/1x1/adult-black-labrador.jpg",
 "license": "https://example.com/license",
 "acquireLicensePage": "https://example.com/how-to-use-my-images",
 "creditText": "Labrador PhotoLab",
 "creator": {
 "@type": "Person",
 "name": "Brixton Brownstone"
 },
 "copyrightNotice": "Clara Kent"
 }]
 </script>
 </head>
 <body>
 <h2>Black labrador puppy</h2>
 <img alt="Black labrador puppy" src="https://example.com/photos/1x1/black-labrador-puppy.jpg">
 <p><a href="https://example.com/license">License</a></p>
 <p><a href="https://example.com/how-to-use-my-images">How to use my images</a></p>
 <p><b>Photographer</b>: Brixton Brownstone</p>
 <p><b>Copyright</b>: Clara Kent</p>
 <p><b>Credit</b>: Labrador PhotoLab</p>
 <h2>Adult black labrador</h2>
 <img alt="Adult black labrador" src="https://example.com/photos/1x1/adult-black-labrador.jpg">
 <p><a href="https://example.com/license">License</a></p>
 <p><a href="https://example.com/how-to-use-my-images">How to use my images</a></p>
 <p><b>Photographer</b>: Brixton Brownstone</p>
 <p><b>Copyright</b>: Clara Kent</p>
 <p><b>Credit</b>: Labrador PhotoLab</p>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Photos of black labradors</title>
 <script type="application/ld+json">
 [{
 "@context": "https://schema.org/",
 "@type": "ImageObject",
 "contentUrl": "https://example.com/photos/1x1/black-labrador-puppy.jpg",
 "license": "https://example.com/license",
 "acquireLicensePage": "https://example.com/how-to-use-my-images",
 "creditText": "Labrador PhotoLab",
 "creator": {
 "@type": "Person",
 "name": "Brixton Brownstone"
 },
 "copyrightNotice": "Clara Kent"
 },
 {
 "@context": "https://schema.org/",
 "@type": "ImageObject",
 "contentUrl": "https://example.com/photos/1x1/adult-black-labrador.jpg",
 "license": "https://example.com/license",
 "acquireLicensePage": "https://example.com/how-to-use-my-images",
 "creditText": "Labrador PhotoLab",
 "creator": {
 "@type": "Person",
 "name": "Brixton Brownstone"
 },
 "copyrightNotice": "Clara Kent"
 }]
 </script>
 </head>
 <body>
 <h2>Black labrador puppy</h2>
 <img alt="Black labrador puppy" src="https://example.com/photos/1x1/black-labrador-puppy.jpg">
 <p><a href="https://example.com/license">License</a></p>
 <p><a href="https://example.com/how-to-use-my-images">How to use my images</a></p>
 <p><b>Photographer</b>: Brixton Brownstone</p>
 <p><b>Copyright</b>: Clara Kent</p>
 <p><b>Credit</b>: Labrador PhotoLab</p>
 <h2>Adult black labrador</h2>
 <img alt="Adult black labrador" src="https://example.com/photos/1x1/adult-black-labrador.jpg">
 <p><a href="https://example.com/license">License</a></p>
 <p><a href="https://example.com/how-to-use-my-images">How to use my images</a></p>
 <p><b>Photographer</b>: Brixton Brownstone</p>
 <p><b>Copyright</b>: Clara Kent</p>
 <p><b>Credit</b>: Labrador PhotoLab</p>
 </body>
</html>
 
 

 
 

# 
 RDFa
 

 <html>
 <head>
 <title>Photos of black labradors</title>
 </head>
 <body>
 <div vocab="https://schema.org/" typeof="ImageObject">
 <h2 property="name">Black labrador puppy</h2>
 <img alt="Black labrador puppy" property="contentUrl" src="https://example.com/photos/1x1/black-labrador-puppy.jpg" /><br>
 <span property="license"> https://example.com/license</span>
 <span property="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span rel="schema:creator">
 <span typeof="schema:Person">
 <span property="schema:name" content="Brixton Brownstone"></span>
 </span>
 </span>
 <span property="copyrightNotice">Clara Kent</span>
 <span property="creditText">Labrador PhotoLab</span>
 </div>
 <br>
 <div vocab="https://schema.org/" typeof="ImageObject">
 <h2 property="name">Adult black labrador</h2>
 <img alt="Adult black labrador" property="contentUrl" src="https://example.com/photos/1x1/adult-black-labrador.jpg" />
 <span property="license"> https://example.com/license</span>
 <span property="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span rel="schema:creator">
 <span typeof="schema:Person">
 <span property="schema:name" content="Brixton Brownstone"></span>
 </span>
 </span>
 <span property="copyrightNotice">Clara Kent</span>
 <span property="creditText">Labrador PhotoLab</span>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Photos of black labradors</title>
 </head>
 <body>
 <div vocab="https://schema.org/" typeof="ImageObject">
 <h2 property="name">Black labrador puppy</h2>
 <img alt="Black labrador puppy" property="contentUrl" src="https://example.com/photos/1x1/black-labrador-puppy.jpg" /><br>
 <span property="license"> https://example.com/license</span>
 <span property="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span rel="schema:creator">
 <span typeof="schema:Person">
 <span property="schema:name" content="Brixton Brownstone"></span>
 </span>
 </span>
 <span property="copyrightNotice">Clara Kent</span>
 <span property="creditText">Labrador PhotoLab</span>
 </div>
 <br>
 <div vocab="https://schema.org/" typeof="ImageObject">
 <h2 property="name">Adult black labrador</h2>
 <img alt="Adult black labrador" property="contentUrl" src="https://example.com/photos/1x1/adult-black-labrador.jpg" />
 <span property="license"> https://example.com/license</span>
 <span property="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span rel="schema:creator">
 <span typeof="schema:Person">
 <span property="schema:name" content="Brixton Brownstone"></span>
 </span>
 </span>
 <span property="copyrightNotice">Clara Kent</span>
 <span property="creditText">Labrador PhotoLab</span>
 </div>
 </body>
</html>
 
 

 
 

# 
 Microdata
 

 <html>
 <head>
 <title>Photos of black labradors</title>
 </head>
 <body>
 <div itemscope itemtype="https://schema.org/ImageObject">
 <h2 itemprop="name">Black labrador puppy</h2>
 <img alt="Black labrador puppy" itemprop="contentUrl" src="https://example.com/photos/1x1/black-labrador-puppy.jpg" />
 <span itemprop="license"> https://example.com/license</span>
 <span itemprop="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span itemprop="creator" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Brixton Brownstone" />
 </span>
 <span itemprop="copyrightNotice">Clara Kent</span><br>
 <span itemprop="creditText">Labrador PhotoLab</span><br>
 </div>
 <br>
 <h2 itemprop="name">Adult black labrador</h2>
 <div itemscope itemtype="https://schema.org/ImageObject">
 <img alt="Adult black labrador" itemprop="contentUrl" src="https://example.com/photos/1x1/adult-black-labrador.jpg" />
 <span itemprop="license"> https://example.com/license</span>
 <span itemprop="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span itemprop="creator" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Brixton Brownstone" />
 </span>
 <span itemprop="copyrightNotice">Clara Kent</span>
 <span itemprop="creditText">Labrador PhotoLab</span>
 </div>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Photos of black labradors</title>
 </head>
 <body>
 <div itemscope itemtype="https://schema.org/ImageObject">
 <h2 itemprop="name">Black labrador puppy</h2>
 <img alt="Black labrador puppy" itemprop="contentUrl" src="https://example.com/photos/1x1/black-labrador-puppy.jpg" />
 <span itemprop="license"> https://example.com/license</span>
 <span itemprop="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span itemprop="creator" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Brixton Brownstone" />
 </span>
 <span itemprop="copyrightNotice">Clara Kent</span><br>
 <span itemprop="creditText">Labrador PhotoLab</span><br>
 </div>
 <br>
 <h2 itemprop="name">Adult black labrador</h2>
 <div itemscope itemtype="https://schema.org/ImageObject">
 <img alt="Adult black labrador" itemprop="contentUrl" src="https://example.com/photos/1x1/adult-black-labrador.jpg" />
 <span itemprop="license"> https://example.com/license</span>
 <span itemprop="acquireLicensePage">https://example.com/how-to-use-my-images</span>
 <span itemprop="creator" itemtype="https://schema.org/Person" itemscope>
 <meta itemprop="name" content="Brixton Brownstone" />
 </span>
 <span itemprop="copyrightNotice">Clara Kent</span>
 <span itemprop="creditText">Labrador PhotoLab</span>
 </div>
 </body>
</html>
 
 

# 
 Definisi jenis data terstruktur

 
 Definisi lengkap ImageObject tersedia di
 schema.org/ImageObject .
 Properti yang didukung Google adalah sebagai berikut:

 
 
 
 Properti wajib 

 
 
 
 contentUrl 
 
 URL 

 
 URL ke konten gambar yang sebenarnya. Google menggunakan contentUrl untuk menentukan
 gambar mana yang terkait dengan metadata foto.
 

 
 Google juga mendukung properti url untuk menentukan URL gambar jika Anda tidak
 menyertakan contentUrl . Meskipun properti url tidak benar-benar akurat
 dan kami merekomendasikan penggunaan contentUrl sebagai gantinya, markup yang sudah
 ada mungkin masih menggunakan url .
 

 
 

 
 creator , creditText , copyrightNotice , atau license 
 Selain contentUrl , Anda harus menyertakan salah satu properti berikut:

 
 
- creator 
 
- creditText 
 
- copyrightNotice 
 
- license 
 

 Setelah Anda menyertakan salah satu properti ini, tiga properti lainnya
 akan direkomendasikan dalam Pengujian Hasil Multimedia.

 
 

 

 
 
 
 Properti yang direkomendasikan 

 
 
 
 acquireLicensePage 
 
 URL 

 
 URL ke halaman tempat pengguna bisa menemukan informasi tentang cara mendapatkan lisensi untuk menggunakan gambar tersebut. Berikut ini beberapa contohnya:
 

 
 
- 
 Halaman penyelesaian izin pemakaian gambar tempat pengguna dapat memilih resolusi atau
 hak penggunaan yang diinginkan
 
 
- Halaman umum yang menjelaskan cara menghubungi Anda 
 

 
 

 
 creator 
 
 Organization 
 atau Person 

 
 Pembuat gambar. Pembuat ini biasanya fotografer, tetapi bisa juga perusahaan atau organisasi (jika diperlukan).
 

 
 

 
 creator.name 
 
 Text 

 
 Nama pembuat.
 

 
 

 
 creditText 
 
 Text 

 
 Nama orang dan/atau organisasi yang tercantum dalam kredit gambar saat dipublikasikan.
 

 
 

 
 copyrightNotice 
 
 Text 

 
 Pemberitahuan hak cipta untuk mengklaim kekayaan intelektual foto ini. Properti
 ini menunjukkan siapa pemilik hak cipta foto saat ini.
 

 
 

 
 license 
 
 URL 

 
 URL ke halaman yang menjelaskan lisensi yang mengatur penggunaan gambar. Misalnya, halaman
 dapat berupa halaman persyaratan dan ketentuan yang Anda miliki di situs Anda. Jika ada, halaman ini juga dapat berupa halaman Lisensi Creative Commons (misalnya, BY-NC 4.0 ).
 

 
 Jika menggunakan data terstruktur untuk menentukan gambar, Anda harus menyertakan properti license 
 agar gambar Anda memenuhi syarat untuk ditampilkan dengan badge Lisensi. Sebaiknya
 tambahkan juga properti acquireLicensePage jika Anda memiliki informasi tersebut.
 

 
 

 

# Metadata foto IPTC

 
 Atau, Anda dapat menyematkan
 metadata foto IPTC 
 langsung dalam gambar. Sebaiknya gunakan
 software pengelolaan metadata untuk mengelola metadata gambar Anda .
 Tabel berikut berisi properti yang diekstrak Google:

 
 
 
 Properti yang direkomendasikan 

 
 
 
 
 Pemberitahuan Hak Cipta 
 
 
 
 Pemberitahuan hak cipta untuk mengklaim kekayaan intelektual foto ini. Properti ini menunjukkan
 siapa pemilik hak cipta foto saat ini.
 

 
 

 
 
 Pembuat 
 
 
 
 Pembuat gambar. Properti ini biasanya berisi nama fotografer, tetapi dapat berupa
 nama perusahaan atau organisasi (jika diperlukan).
 

 
 

 
 
 Baris Kredit 
 
 
 
 Nama orang dan/atau organisasi yang tercantum dalam kredit gambar saat dipublikasikan.
 

 
 

 
 
 Jenis Sumber Digital 
 
 
 
 Jenis sumber digital yang digunakan untuk membuat gambar. Google mendukung
 NewsCodes IPTC berikut:
 

 
 
- trainedAlgorithmicMedia :
 Gambar dibuat dengan algoritma menggunakan model yang diambil dari sampel konten. 
 
- compositeSynthetic :
 Gambar merupakan campuran atau gabungan yang mencakup setidaknya satu elemen sintetis. 
 
- algorithmicMedia :
 Gambar dibuat murni oleh algoritma dan tidak didasarkan pada sampel data pelatihan apa pun
 (misalnya, gambar yang dibuat oleh software menggunakan formula matematika). 
 
- compositeWithTrainedAlgorithmicMedia :
 Gambar merupakan gabungan media algoritma terlatih dengan beberapa media lain, seperti
 dengan operasi inpainting atau outpainting. 
 

 
 

 
 
 Licensor URL 
 
 
 
 URL ke halaman tempat pengguna bisa menemukan informasi tentang cara mendapatkan lisensi untuk menggunakan gambar tersebut. Licensor URL 
 harus
 berupa properti
 objek Licensor ,
 bukan properti objek gambar. Berikut beberapa contohnya:
 

 
 
- Halaman penyelesaian izin pemakaian gambar tempat pengguna dapat memilih resolusi tertentu 
 
- Halaman umum yang menjelaskan cara menghubungi Anda 
 

 
 

 
 
 Web Statement of Rights 
 
 
 
 URL ke halaman yang menjelaskan lisensi yang mengatur penggunaan gambar, dan informasi
 hak lainnya (opsional). Misalnya, halaman ini dapat berupa halaman persyaratan dan ketentuan yang
 Anda miliki di situs Anda. Jika ada, halaman ini juga dapat berupa halaman Lisensi Creative Commons
 (misalnya,
 BY-NC 4.0 ).
 

 
 Anda harus menyertakan kolom Web Statement of Rights agar gambar Anda memenuhi syarat untuk
 ditampilkan dengan badge lisensi. Sebaiknya tambahkan juga kolom
 Licensor URL jika Anda memiliki informasi tersebut.
 

 
 

 

# Cara metadata C2PA dapat muncul di hasil Google Penelusuran

 
 Jika gambar berisi metadata
 C2PA ,
 Google dapat mengekstrak detail tersebut dan dapat menampilkan informasi di
 fitur " Info
 tentang gambar ini ", seperti cara gambar dibuat atau apakah gambar diedit dengan alat AI.
 Metadata ini berasal dari
 penanda tangan ,
 yang biasanya berupa aplikasi, perangkat, atau layanan (misalnya, software pengeditan foto, kamera
 itu sendiri, atau layanan lain yang mengubah atau membuat gambar) yang memenuhi kondisi berikut:

 
 
- Aplikasi, perangkat, atau layanan telah mengadopsi C2PA versi 2.1 atau yang lebih baru. 
 
- Manifes gambar harus ditandatangani oleh sertifikat dari Certificate Authority di
 Daftar
 Kepercayaan C2PA .
 

# Pemecahan masalah

 Penting : Google tidak menjamin bahwa data terstruktur atau metadata foto
 IPTC pasti akan muncul di hasil penelusuran. Untuk mengetahui daftar alasan umum yang mungkin menyebabkan Google tidak
 menampilkan data terstruktur di hasil penelusuran, lihat Pedoman Data Terstruktur Umum .

 
 Jika Anda kesulitan menerapkan metadata gambar untuk Google Gambar, berikut beberapa referensi
 yang mungkin dapat membantu Anda.

 Jika Anda menggunakan sistem pengelolaan konten (CMS) atau situs Anda ditangani oleh orang lain,
 minta bantuan kepada mereka. Pastikan untuk meneruskan pesan Search Console yang menjelaskan masalah tersebut kepada mereka.

 
 
- Untuk pertanyaan tentang fitur, tinjau
 FAQ terkait Lisensi Gambar di Google Gambar . 
 
- Anda mungkin mengalami error pada data terstruktur. Periksa
 daftar error data terstruktur . 
 
- Jika terdapat tindakan manual data terstruktur yang berlaku pada halaman Anda, data terstruktur pada
 halaman itu akan diabaikan (meskipun halaman masih bisa muncul di hasil Google Penelusuran). Untuk memperbaiki
 masalah data terstruktur ,
 gunakan Laporan Tindakan Manual .
 
 
- Tinjau pedoman lagi
 untuk mengidentifikasi apakah konten Anda tidak mematuhi pedoman.
 Masalah itu mungkin disebabkan oleh konten yang berisi spam atau penggunaan markup yang berisi spam.
 Namun, masalahnya mungkin bukan pada sintaksis, sehingga Pengujian Hasil Multimedia tidak akan dapat
 mengidentifikasi masalah tersebut.

 
 
- Memecahkan masalah hasil kaya tidak ada/penurunan jumlah hasil kaya . 
 
- Untuk pertanyaan umum terkait crawling dan pengindeksan, lihat
 FAQ crawling dan pengindeksan Google Penelusuran .
 Tunggu hingga crawling dan pengindeksan ulang selesai. Perlu diingat bahwa Google
 mungkin memerlukan waktu beberapa hari untuk menemukan dan meng-crawl halaman setelah Anda memublikasikannya.

 
 
- Ajukan pertanyaan pada Waktu Konsultasi Pusat Google Penelusuran . 
 
- Posting pertanyaan di forum Pusat Google Penelusuran .
 Untuk bantuan terkait metadata foto IPTC, Anda dapat
 memposting pertanyaan di forum ini . 

# Bolehkah menghapus metadata gambar?

 Menghapus metadata gambar dapat mengurangi ukuran file gambar, sehingga halaman web dapat dimuat lebih cepat. Namun,
 berhati-hatilah, karena menghapus metadata dapat dianggap ilegal di wilayah hukum tertentu. Metadata
 gambar menyediakan informasi hak cipta dan pemberian lisensi gambar secara online. Google merekomendasikan
 agar setidaknya Anda tetap mempertahankan metadata penting terkait informasi dan
 identifikasi hak gambar. Misalnya, jika memungkinkan, sebaiknya pertahankan kolom
 kreator ,
 keterangan pemilik foto ,
 dan pemberitahuan hak cipta 
 pada metadata IPTC untuk memberikan atribusi yang tepat.

 
 
 

 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 

 
 
 
 Kirim masukan
