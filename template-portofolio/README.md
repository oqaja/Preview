# Template Portofolio Universal

Satu template untuk Video Editor, Graphic Designer, dan Writer. Bisa langsung di-deploy ke GitHub Pages tanpa build.

## Struktur file

```
index.html            ← semua isi (teks, karya, case study, kontak)
assets/css/style.css  ← tampilan (warna aksen di paling atas)
assets/js/main.js     ← filter & jendela karya (tidak perlu diubah)
assets/img/           ← gambar: karya-1.jpg … karya-5.jpg, case-study-1.jpg, foto-profil.jpg
```

## Pengaturan cepat per klien

| Yang diubah | Di mana |
| --- | --- |
| Mode terang / gelap | `index.html` baris `<html lang="id" data-theme="terang">` → `"gelap"` |
| Warna aksen | `assets/css/style.css`, variabel `--accent` (ada dua: mode terang dan gelap) |
| Nama, judul tab, deskripsi | `index.html`: `<title>`, meta description, header, dan hero |
| Foto & thumbnail | Timpa file di `assets/img/` dengan nama yang sama |
| CV | Upload PDF ke `assets/`, sesuaikan link "Unduh CV" (atau hapus barisnya) |

Nama panjang (lebih dari ~10 huruf per baris) bisa terlalu besar di hero. Kecilkan angka `17vw` di `.hero-name` pada style.css, misal jadi `13vw`.

## Tiga jenis kartu karya

Ganti tombol filter (`data-filter`) sesuai kategori klien, lalu pastikan `data-kategori` tiap karya sama persis.

**Video** (Editor)
```html
<article class="work" data-kategori="youtube" data-tipe="video" data-src="https://www.youtube.com/embed/ID_VIDEO">
```
- `ID_VIDEO` = kode di link YouTube (`youtube.com/watch?v=`**`abc123`**).
- Tambah kelas `vertikal` untuk Reels/TikTok/Shorts: `class="work vertikal"`.
- Video bukan di YouTube (Drive/IG)? Pakai tipe `gambar` dengan thumbnail, lalu tulis link-nya di deskripsi.

**Gambar** (Designer)
```html
<article class="work" data-kategori="branding" data-tipe="gambar" data-src="assets/img/karya-4.jpg">
```
- Hapus `<span class="play">` di kartu gambar.
- Untuk feed IG / poster tegak, tambahkan kelas `vertikal`.

**Tulisan** (Writer)
```html
<article class="work tulisan" data-kategori="copy-iklan" data-tipe="tulisan">
```
- Kutipan singkat di `<span class="excerpt">` tampil di kartu.
- Isi lengkap di dalam `<template>…</template>`, muncul saat kartu diklik.

## Case study

Salin seluruh blok `<article class="case">…</article>` untuk case study ke-2 dan ke-3. Isi empat langkahnya dari jawaban form discovery: Konteks, Tantangan, Proses, Hasil. Angka hasil paling penting taruh di `<span class="result-number">`.

## Checklist sebelum kirim preview

- [ ] Semua teks Raka Pratama sudah diganti
- [ ] Semua `ID_VIDEO` sudah diganti (atau kartunya dihapus)
- [ ] Gambar di bawah 1 MB
- [ ] Link email, WA (`wa.me/62…`), LinkedIn, Instagram benar
- [ ] Dicek di HP
- [ ] Banner preview dipasang (lihat preview-banner.html)
