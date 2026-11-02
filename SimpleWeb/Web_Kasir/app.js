(() => {
    "use strict";
  
    /* =====================================================================
       PENYIMPANAN
       Semua data disimpan di localStorage browser ini:
         kasir.akun        -> daftar akun (kata sandi disimpan sebagai hash)
         kasir.sesi        -> akun yang sedang login
         kasir.data.<user> -> barang dan transaksi milik tiap akun
       ===================================================================== */
    const KUNCI = {
      akun: "kasir.akun",
      sesi: "kasir.sesi",
      data: (u) => "kasir.data." + u,
    };
  
    function muat(kunci, awal) {
      try {
        const mentah = localStorage.getItem(kunci);
        return mentah ? JSON.parse(mentah) : awal;
      } catch {
        return awal;
      }
    }
  
    function simpan(kunci, nilai) {
      try {
        localStorage.setItem(kunci, JSON.stringify(nilai));
        return true;
      } catch {
        tampilPesan("Data gagal disimpan. Penyimpanan browser penuh atau dinonaktifkan.", "error");
        return false;
      }
    }
  
    /* =====================================================================
       UTILITAS
       ===================================================================== */
    const $ = (sel, akar = document) => akar.querySelector(sel);
    const $$ = (sel, akar = document) => [...akar.querySelectorAll(sel)];
    const rupiah = (n) => "Rp" + new Intl.NumberFormat("id-ID").format(n);
    const bulat = (v) => (/^\d+$/.test(String(v).trim()) ? Number(v) : null);
  
    function buat(tag, kelas, teks) {
      const el = document.createElement(tag);
      if (kelas) el.className = kelas;
      if (teks !== undefined) el.textContent = teks;
      return el;
    }
  
    let timerPesan;
    function tampilPesan(teks, jenis = "ok", target = "#pesan") {
      const p = $(target);
      p.textContent = teks;
      p.className = "pesan " + jenis;
      p.hidden = false;
      if (target === "#pesan") {
        clearTimeout(timerPesan);
        timerPesan = setTimeout(() => (p.hidden = true), 5000);
      }
    }
  
    /* Hash kata sandi: PBKDF2 (Web Crypto). Jika browser tidak menyediakannya
       (misalnya halaman dibuka lewat http biasa), dipakai hash sederhana. */
    const acakHex = (n) => {
      const b = new Uint8Array(n);
      (self.crypto || {}).getRandomValues
        ? crypto.getRandomValues(b)
        : b.forEach((_, i) => (b[i] = Math.floor(Math.random() * 256)));
      return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
    };
  
    async function hashSandi(sandi, garam) {
      if (self.crypto && crypto.subtle) {
        const enc = new TextEncoder();
        const kunci = await crypto.subtle.importKey("raw", enc.encode(sandi), "PBKDF2", false, ["deriveBits"]);
        const bits = await crypto.subtle.deriveBits(
          { name: "PBKDF2", salt: enc.encode(garam), iterations: 100000, hash: "SHA-256" },
          kunci,
          256
        );
        return [...new Uint8Array(bits)].map((x) => x.toString(16).padStart(2, "0")).join("");
      }
      let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
      for (const ch of garam + sandi) {
        const c = ch.charCodeAt(0);
        h1 = Math.imul(h1 ^ c, 2654435761);
        h2 = Math.imul(h2 ^ c, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
    }
  
    /* =====================================================================
       STATE
       ===================================================================== */
    let user = null;      // kunci akun yang sedang login (huruf kecil)
    let data = null;      // { barang, transaksi, idBarang, idTrx }
    const keranjang = new Map(); // id barang -> { nama, harga, stok, jumlah }
  
    const dataKosong = () => ({ barang: [], transaksi: [], idBarang: 1, idTrx: 1 });
    const simpanData = () => simpan(KUNCI.data(user), data);
  
    /* =====================================================================
       NAVIGASI
       ===================================================================== */
    const HALAMAN = ["auth", "kasir", "barang", "riwayat"];
  
    function pindah(nama) {
      $("#pesan").hidden = true;
      HALAMAN.forEach((h) => ($("#view-" + h).hidden = h !== nama));
      $("#bar").hidden = nama === "auth";
      $$("#nav button").forEach((b) => {
        if (b.dataset.view === nama) b.setAttribute("aria-current", "page");
        else b.removeAttribute("aria-current");
      });
      if (nama === "kasir") { sinkronKeranjang(); renderRak(); renderStruk(); }
      if (nama === "barang") renderBarang();
      if (nama === "riwayat") renderRiwayat();
      window.scrollTo(0, 0);
    }
  
    $("#nav").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-view]");
      if (b) pindah(b.dataset.view);
    });
    $("#ke-barang").addEventListener("click", () => pindah("barang"));
  
    /* =====================================================================
       AKUN: DAFTAR, MASUK, KELUAR
       ===================================================================== */
    const POLA_USERNAME = /^[A-Za-z0-9_]{3,30}$/;
  
    function modeAuth(daftar) {
      $("#form-masuk").hidden = daftar;
      $("#form-daftar").hidden = !daftar;
      $("#judul-auth").textContent = daftar ? "Buat akun toko" : "Masuk ke kasir";
      $("#teks-ganti").textContent = daftar ? "Sudah punya akun?" : "Belum punya akun?";
      $("#ganti-auth").textContent = daftar ? "Masuk" : "Buat akun";
    }
    $("#ganti-auth").addEventListener("click", () => modeAuth($("#form-daftar").hidden));
  
    function masuk(kunciAkun, namaTampil, akunBaru) {
      user = kunciAkun;
      data = muat(KUNCI.data(user), null) || dataKosong();
      simpan(KUNCI.sesi, user);
      $("#nama-user").textContent = namaTampil;
      keranjang.clear();
      pindah(akunBaru || data.barang.length === 0 ? "barang" : "kasir");
    }
  
    $("#form-daftar").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      const nama = f.username.value.trim();
      const sandi = f.password.value;
  
      if (!POLA_USERNAME.test(nama)) return tampilPesan("Nama pengguna 3-30 karakter: huruf, angka, atau garis bawah.", "error");
      if (sandi.length < 6) return tampilPesan("Kata sandi minimal 6 karakter.", "error");
      if (sandi !== f.konfirmasi.value) return tampilPesan("Konfirmasi kata sandi tidak sama.", "error");
  
      const akun = muat(KUNCI.akun, {});
      const kunci = nama.toLowerCase();
      if (akun[kunci]) return tampilPesan("Nama pengguna sudah dipakai. Pilih nama lain.", "error");
  
      const garam = acakHex(16);
      akun[kunci] = { nama, garam, hash: await hashSandi(sandi, garam) };
      if (!simpan(KUNCI.akun, akun)) return;
  
      f.reset();
      masuk(kunci, nama, true);
      tampilPesan("Akun dibuat. Mulai dengan menambahkan barang.", "ok");
    });
  
    $("#form-masuk").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      const kunci = f.username.value.trim().toLowerCase();
      const akun = muat(KUNCI.akun, {})[kunci];
      const hash = akun ? await hashSandi(f.password.value, akun.garam) : null;
      if (!akun || hash !== akun.hash) return tampilPesan("Nama pengguna atau kata sandi salah.", "error");
      f.reset();
      masuk(kunci, akun.nama, false);
    });
  
    $("#keluar").addEventListener("click", () => {
      try { localStorage.removeItem(KUNCI.sesi); } catch { /* abaikan */ }
      user = null;
      data = null;
      keranjang.clear();
      modeAuth(false);
      pindah("auth");
    });
  
    /* =====================================================================
       HALAMAN KASIR
       ===================================================================== */
    const grid = $("#grid");
    const elBayar = $("#bayar");
  
    const ambilBayar = () => Number(elBayar.value.replace(/\D/g, "")) || 0;
    const hitungTotal = () => {
      let t = 0;
      keranjang.forEach((it) => (t += it.harga * it.jumlah));
      return t;
    };
  
    /* Samakan keranjang dengan data barang terbaru (harga, stok, barang dihapus). */
    function sinkronKeranjang() {
      keranjang.forEach((it, id) => {
        const b = data.barang.find((x) => x.id === id);
        if (!b || b.stok < 1) return keranjang.delete(id);
        it.nama = b.nama;
        it.harga = b.harga;
        it.stok = b.stok;
        it.jumlah = Math.min(it.jumlah, b.stok);
      });
    }
  
    function renderRak() {
      const kata = $("#cari").value.trim().toLowerCase();
      grid.replaceChildren();
      const urut = [...data.barang].sort((a, b) => a.nama.localeCompare(b.nama, "id"));
      for (const b of urut) {
        if (kata && !b.nama.toLowerCase().includes(kata)) continue;
        const tombol = buat("button", "item");
        tombol.type = "button";
        tombol.dataset.id = b.id;
        tombol.disabled = b.stok <= 0;
        tombol.append(
          buat("span", "nama", b.nama),
          buat("span", "harga", rupiah(b.harga)),
          buat("span", "stok", b.stok > 0 ? "Stok " + b.stok : "Habis")
        );
        grid.appendChild(tombol);
      }
      $("#kosong-rak").hidden = data.barang.length > 0;
    }
  
    function tombolKecil(teks, label, aksi) {
      const b = buat("button", "kecil", teks);
      b.type = "button";
      b.setAttribute("aria-label", label);
      b.addEventListener("click", aksi);
      return b;
    }
  
    function ubahJumlah(id, selisih) {
      const it = keranjang.get(id);
      if (!it) return;
      const baru = it.jumlah + selisih;
      if (baru <= 0) keranjang.delete(id);
      else if (baru <= it.stok) it.jumlah = baru;
      renderStruk();
    }
  
    function renderStruk() {
      const daftar = $("#baris-struk");
      daftar.replaceChildren();
  
      if (keranjang.size === 0) {
        daftar.appendChild(buat("li", "kosong-struk", "Ketuk barang di sebelah kiri untuk menambahkannya."));
      }
      keranjang.forEach((it, id) => {
        const li = buat("li");
        const atur = buat("span", "atur");
        atur.append(
          tombolKecil("\u2212", "Kurangi " + it.nama, () => ubahJumlah(id, -1)),
          buat("span", "jml", it.jumlah),
          tombolKecil("+", "Tambah " + it.nama, () => ubahJumlah(id, 1))
        );
        li.append(buat("span", "n", it.nama), atur, buat("span", "sub", rupiah(it.harga * it.jumlah)));
        daftar.appendChild(li);
      });
  
      const total = hitungTotal();
      const bayar = ambilBayar();
      $("#total").textContent = rupiah(total);
      elBayar.value = bayar ? new Intl.NumberFormat("id-ID").format(bayar) : "";
  
      if (bayar >= total) {
        $("#label-kembali").textContent = "Kembalian";
        $("#kembali").textContent = rupiah(bayar - total);
      } else {
        $("#label-kembali").textContent = "Kurang";
        $("#kembali").textContent = rupiah(total - bayar);
      }
      $("#bayar-btn").disabled = keranjang.size === 0 || bayar < total;
    }
  
    grid.addEventListener("click", (e) => {
      const tombol = e.target.closest(".item");
      if (!tombol || tombol.disabled) return;
      const id = Number(tombol.dataset.id);
      const b = data.barang.find((x) => x.id === id);
      if (!b) return;
      const ada = keranjang.get(id);
      if (ada) {
        if (ada.jumlah < b.stok) ada.jumlah += 1;
      } else {
        keranjang.set(id, { nama: b.nama, harga: b.harga, stok: b.stok, jumlah: 1 });
      }
      $("#status").hidden = true;
      renderStruk();
    });
  
    $("#cari").addEventListener("input", renderRak);
    elBayar.addEventListener("input", renderStruk);
    $("#uang-pas").addEventListener("click", () => {
      elBayar.value = String(hitungTotal());
      renderStruk();
    });
    $("#kosongkan").addEventListener("click", () => {
      keranjang.clear();
      elBayar.value = "";
      $("#status").hidden = true;
      renderStruk();
    });
  
    $("#bayar-btn").addEventListener("click", () => {
      const total = hitungTotal();
      const bayar = ambilBayar();
      if (keranjang.size === 0) return;
      if (bayar < total) return tampilPesan("Uang bayar kurang dari total.", "error", "#status");
  
      // Pastikan stok masih cukup sebelum mengubah apa pun.
      for (const [id, it] of keranjang) {
        const b = data.barang.find((x) => x.id === id);
        if (!b || it.jumlah > b.stok) {
          return tampilPesan("Stok " + it.nama + " tidak cukup.", "error", "#status");
        }
      }
  
      const trx = {
        id: data.idTrx++,
        waktu: new Date().toLocaleString("id-ID"),
        total,
        bayar,
        kembalian: bayar - total,
        items: [],
      };
      keranjang.forEach((it, id) => {
        const b = data.barang.find((x) => x.id === id);
        b.stok -= it.jumlah;
        trx.items.push({ nama: it.nama, harga: it.harga, jumlah: it.jumlah });
      });
      data.transaksi.unshift(trx);
      data.transaksi = data.transaksi.slice(0, 300);
  
      if (!simpanData()) return;
      keranjang.clear();
      elBayar.value = "";
      renderRak();
      renderStruk();
      tampilPesan("Transaksi #" + trx.id + " tersimpan. Kembalian " + rupiah(trx.kembalian) + ".", "ok", "#status");
    });
  
    /* =====================================================================
       HALAMAN BARANG
       ===================================================================== */
    $("#form-barang").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const nama = f.nama.value.split(/\s+/).filter(Boolean).join(" ");
      const harga = bulat(f.harga.value);
      const stok = bulat(f.stok.value);
  
      if (nama.length < 1 || nama.length > 60) return tampilPesan("Nama barang wajib diisi (maksimal 60 karakter).", "error");
      if (harga === null) return tampilPesan("Harga harus berupa angka 0 atau lebih.", "error");
      if (stok === null) return tampilPesan("Stok harus berupa angka 0 atau lebih.", "error");
      if (data.barang.some((b) => b.nama.toLowerCase() === nama.toLowerCase())) {
        return tampilPesan(nama + " sudah ada di daftar barang.", "error");
      }
  
      data.barang.push({ id: data.idBarang++, nama, harga, stok });
      if (!simpanData()) return;
      f.reset();
      f.stok.value = 0;
      f.nama.focus();
      renderBarang();
      tampilPesan(nama + " ditambahkan.", "ok");
    });
  
    function renderBarang() {
      const isi = $("#isi-tabel");
      isi.replaceChildren();
      const urut = [...data.barang].sort((a, b) => a.nama.localeCompare(b.nama, "id"));
  
      for (const b of urut) {
        const tr = buat("tr");
        const inputHarga = buat("input");
        inputHarga.type = "number"; inputHarga.min = 0; inputHarga.value = b.harga;
        inputHarga.setAttribute("aria-label", "Harga " + b.nama);
        const inputStok = buat("input");
        inputStok.type = "number"; inputStok.min = 0; inputStok.value = b.stok;
        inputStok.setAttribute("aria-label", "Stok " + b.nama);
  
        const simpanBtn = buat("button", "sekunder", "Simpan");
        simpanBtn.type = "button";
        simpanBtn.addEventListener("click", () => {
          const h = bulat(inputHarga.value);
          const s = bulat(inputStok.value);
          if (h === null || s === null) return tampilPesan("Harga dan stok harus berupa angka 0 atau lebih.", "error");
          b.harga = h;
          b.stok = s;
          if (simpanData()) tampilPesan("Perubahan " + b.nama + " disimpan.", "ok");
        });
  
        const hapusBtn = buat("button", "bahaya", "Hapus");
        hapusBtn.type = "button";
        hapusBtn.addEventListener("click", () => {
          if (!confirm("Hapus " + b.nama + "?")) return;
          data.barang = data.barang.filter((x) => x.id !== b.id);
          if (simpanData()) {
            renderBarang();
            tampilPesan(b.nama + " dihapus.", "ok");
          }
        });
  
        const aksi = buat("div", "aksi-baris");
        aksi.append(simpanBtn, hapusBtn);
        const sel = (...anak) => { const td = buat("td"); td.append(...anak); return td; };
        tr.append(sel(b.nama), sel(inputHarga), sel(inputStok), sel(aksi));
        isi.appendChild(tr);
      }
      $("#wadah-tabel").hidden = data.barang.length === 0;
      $("#kosong-barang").hidden = data.barang.length > 0;
    }
  
    /* =====================================================================
       HALAMAN RIWAYAT
       ===================================================================== */
    function renderRiwayat() {
      const isi = $("#isi-riwayat");
      isi.replaceChildren();
  
      for (const t of data.transaksi.slice(0, 50)) {
        const kartu = buat("article", "catatan-struk");
  
        const kepala = buat("header");
        kepala.append(buat("strong", null, "Transaksi #" + t.id), buat("time", null, t.waktu));
  
        const daftar = buat("ul");
        for (const i of t.items) {
          const li = buat("li");
          li.append(buat("span", null, i.nama + " \u00d7 " + i.jumlah), buat("span", null, rupiah(i.harga * i.jumlah)));
          daftar.appendChild(li);
        }
  
        const ringkas = buat("dl");
        for (const [label, nilai] of [["Total", t.total], ["Bayar", t.bayar], ["Kembalian", t.kembalian]]) {
          const baris = buat("div");
          baris.append(buat("dt", null, label), buat("dd", null, rupiah(nilai)));
          ringkas.appendChild(baris);
        }
  
        kartu.append(kepala, daftar, ringkas);
        isi.appendChild(kartu);
      }
      $("#kosong-riwayat").hidden = data.transaksi.length > 0;
    }
  
    /* =====================================================================
       MULAI
       ===================================================================== */
    (function mulai() {
      const sesi = muat(KUNCI.sesi, null);
      const akun = sesi ? muat(KUNCI.akun, {})[sesi] : null;
      if (akun) masuk(sesi, akun.nama, false);
      else pindah("auth");
    })();
  })();