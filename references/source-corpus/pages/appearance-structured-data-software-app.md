---
url: https://developers.google.com/search/docs/appearance/structured-data/software-app
title: "Data terstruktur aplikasi software ( SoftwareApplication )"
fetched_at: 2026-05-16T16:53:18.928Z
seed: false
---

# Data terstruktur aplikasi software ( SoftwareApplication )

Source: https://developers.google.com/search/docs/appearance/structured-data/software-app

- 
 
 
 
 
 
 
 
 Beranda
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Search Central
 
 
 
 
 
 
 
 
- 
 
 
 

 
 
 
 
 
 
 
 Documentation
 
 
 
 
 
 
 

 
 
 
 
 
 
 

 
 

 
 
 
 Kirim masukan
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 

# Data terstruktur aplikasi software ( SoftwareApplication )

 
 Tambahkan markup ke informasi aplikasi software dalam isi halaman web untuk menampilkan detail aplikasi Anda dengan lebih baik
 pada hasil Google Penelusuran.

 
 
 
 
 Catatan : Tampilan sebenarnya di hasil penelusuran dapat berbeda. Anda dapat
 melihat pratinjau sebagian besar fitur dengan
 Pengujian Hasil Multimedia .
 

 
 
 
 
 

# 
 Cara menambahkan data terstruktur
 

 
 Data terstruktur adalah format terstandarisasi untuk memberikan informasi tentang suatu halaman dan mengelompokkan konten halaman
 tersebut. Jika Anda baru mengenal data terstruktur, Anda dapat mempelajari lebih lanjut
 cara kerja data terstruktur .
 

 
 Berikut adalah ringkasan tentang cara membuat, menguji, dan merilis data terstruktur.

 
 
- Tambahkan properti wajib . Berdasarkan
 format yang Anda gunakan, pelajari tempat menyisipkan data terstruktur di halaman .
 
 Menggunakan CMS? Menggunakan plugin yang terintegrasi ke CMS Anda mungkin akan lebih mudah.
 

 Menggunakan JavaScript? Pelajari cara
 membuat data terstruktur menggunakan JavaScript .

 
 
- Ikuti pedoman . 
 
- Validasi kode Anda menggunakan
 Pengujian Hasil Kaya 
 dan perbaiki setiap error kritis. Pertimbangkan juga untuk memperbaiki masalah non-kritis yang mungkin ditandai
 di alat tersebut, karena tindakan ini dapat membantu meningkatkan kualitas data terstruktur Anda (tetapi hal ini tidak diperlukan agar memenuhi syarat untuk hasil kaya). 
 
- Deploy beberapa halaman yang menyertakan data terstruktur dan gunakan Alat Inspeksi URL untuk menguji cara Google melihat halaman tersebut. Pastikan halaman Anda
 dapat diakses oleh Google dan tidak diblokir oleh file robots.txt, tag noindex , atau
 persyaratan login. Jika halaman tidak bermasalah, Anda dapat
 meminta Google meng-crawl ulang URL tersebut .
 Catatan : Tunggu beberapa saat hingga crawling dan pengindeksan ulang selesai. Perlu diingat bahwa
 Google mungkin memerlukan waktu beberapa hari untuk mencari dan meng-crawl halaman setelah Anda memublikasikannya.

 
 
- Agar Google tetap mengetahui setiap perubahan pada masa mendatang, sebaiknya
 kirimkan peta situs . Anda dapat mengotomatiskan proses ini dengan
 Search Console Sitemap API . 
 

 
 
 

# Contoh

 
 
 JSON-LD 
 Berikut adalah contoh aplikasi software di JSON-LD:

 <html>
 <head>
 <title>Angry Birds</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "SoftwareApplication",
 "name": "Angry Birds",
 "operatingSystem": "ANDROID",
 "applicationCategory": "GameApplication",
 "aggregateRating": {
 "@type": "AggregateRating",
 "ratingValue": 4.6,
 "ratingCount": 8864
 },
 "offers": {
 "@type": "Offer",
 "price": 1.00,
 "priceCurrency": "USD"
 }
 }
 </script>
 </head>
 <body>
 </body>
</html> 
 

 
 <html>
 <head>
 <title>Angry Birds</title>
 <script type="application/ld+json">
 {
 "@context": "https://schema.org",
 "@type": "SoftwareApplication",
 "name": "Angry Birds",
 "operatingSystem": "ANDROID",
 "applicationCategory": "GameApplication",
 "aggregateRating": {
 "@type": "AggregateRating",
 "ratingValue": 4.6,
 "ratingCount": 8864
 },
 "offers": {
 "@type": "Offer",
 "price": 1.00,
 "priceCurrency": "USD"
 }
 }
 </script>
 </head>
 <body>
 </body>
</html>
