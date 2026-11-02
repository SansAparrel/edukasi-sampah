#TokoOnline

class kasir:
    #konstruktor
    def __init__(self, nama_barang, harga, jumlah):
        self.nama_barang = nama_barang
        self.harga = harga
        self.jumlah = jumlah
    #menghitung total barang
    def total_barang(self):
        return self.harga * self.jumlah
    #menghitung kembalian&bayar
    def bayar(self, uang):
        total = self.total_barang()

        if uang >= total:
            print('Total Belanja', total)
            print('Uang Pembayaran', uang)
            print('Kembalian', uang - total)
        else:
            print('Uang Pembayaran Kurang!')
            print('Kekurangan', total - uang)
    #menampilkan informasi barang
    def tampilkan_barang(self):
        print('Nama Barang', self.nama_barang)
        print('Harga Barang', self.harga)
        print('Jumlah Barang', self.jumlah)
        print('Total Harga', self.total_barang())

#objek barang
barang1 = kasir('pensil', 3000, 3)
# Menampilkan barang
barang1.tampilkan_barang()