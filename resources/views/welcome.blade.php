<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anayyy Resto - Management & POS System</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen relative bg-fixed bg-cover bg-center" style="background-image: linear-gradient(to bottom, rgba(15, 23, 42, 0.93), rgba(15, 23, 42, 0.97)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920');">

    <header class="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
            <div class="flex items-center space-x-3">
                <div class="bg-amber-500 p-2.5 rounded-xl text-slate-950 font-bold shadow-lg shadow-amber-500/20">
                    <i class="fa-solid font-bold fa-utensils text-lg"></i>
                </div>
                <div>
                    <h1 class="font-bold text-xl leading-none text-white tracking-wide">Anayyy Resto</h1>
                    <span class="text-xs text-amber-400/80 font-medium">Inventory, BOM & Financial Dashboard</span>
                </div>
            </div>
            
            <nav class="flex space-x-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
                <button onclick="switchTab('stok')" id="btn-stok" class="tab-btn px-4 py-2 rounded-lg text-sm font-medium transition bg-amber-500 text-slate-950 font-semibold">
                    <i class="fa-solid fa-boxes-stacked mr-1.5"></i> Master Stok
                </button>
                <button onclick="switchTab('kasir')" id="btn-kasir" class="tab-btn px-4 py-2 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white">
                    <i class="fa-solid fa-cash-register mr-1.5"></i> Kasir (BOM)
                </button>
                <button onclick="switchTab('log')" id="btn-log" class="tab-btn px-4 py-2 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white">
                    <i class="fa-solid fa-list-check mr-1.5"></i> Waste & Log
                </button>
                <button onclick="switchTab('po')" id="btn-po" class="tab-btn px-4 py-2 rounded-lg text-sm font-medium transition text-slate-400 hover:text-white relative">
                    <i class="fa-solid fa-truck-ramps-box mr-1.5"></i> Purchase Order
                    <span id="badge-po" class="hidden absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </button>
            </nav>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">

        <!-- Financial Dashboard -->
        <div class="flex flex-col gap-3 mb-6">
            <div class="flex justify-between items-center px-1">
                <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider">Ringkasan Keuangan Harian</h2>
                <button onclick="resetDailyFinancials()" class="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5">
                    <i class="fa-solid fa-rotate-left"></i> Reset Transaksi Harian
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <div class="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
                    <span class="text-xs text-slate-400 font-medium">Nilai Inventaris Stok</span>
                    <p class="text-lg font-bold text-amber-400 mt-1" id="metric-total-val">Rp 0</p>
                </div>
                <div class="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
                    <span class="text-xs text-slate-400 font-medium">Total Transaksi</span>
                    <p class="text-lg font-bold text-white mt-1" id="metric-sales-count">0</p>
                </div>
                <div class="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
                    <span class="text-xs text-slate-400 font-medium">Omset / Pendapatan</span>
                    <p class="text-lg font-bold text-cyan-400 mt-1" id="metric-daily-revenue">Rp 0</p>
                </div>
                <div class="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
                    <span class="text-xs text-slate-400 font-medium">Modal Terjual (HPP)</span>
                    <p class="text-lg font-bold text-slate-300 mt-1" id="metric-daily-hpp">Rp 0</p>
                </div>
                <div class="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
                    <span class="text-xs text-slate-400 font-medium">Pengeluaran Restock/PO</span>
                    <p class="text-lg font-bold text-rose-400 mt-1" id="metric-daily-restock">Rp 0</p>
                </div>
                <div class="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
                    <span class="text-xs text-slate-400 font-medium">Estimasi Laba Bersih</span>
                    <p class="text-lg font-bold text-emerald-400 mt-1" id="metric-daily-profit">Rp 0</p>
                </div>
            </div>

            <!-- Visual Chart Dashboard -->
            <div class="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl mt-2">
                <h3 class="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <i class="fa-solid fa-chart-pie text-amber-500"></i> Visualisasi Arus Kas & Komposisi Laba
                </h3>
                <div class="h-56 w-full relative">
                    <canvas id="financialChart"></canvas>
                </div>
            </div>
        </div>

        <section id="tab-stok" class="tab-content">
            <div class="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-2xl">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <input type="text" id="search-stok" oninput="renderStokTable()" placeholder="Cari bahan baku..." class="bg-slate-950 border border-slate-800 text-sm rounded-xl px-3.5 py-2 w-full md:w-64 focus:outline-none focus:border-amber-500">
                        <select id="filter-kategori" onchange="renderStokTable()" class="bg-slate-950 border border-slate-800 text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-500">
                            <option value="ALL">Semua Kategori</option>
                            <option value="Daging">Daging</option>
                            <option value="Sembako">Sembako</option>
                            <option value="Bumbu/Cairan">Bumbu/Cairan</option>
                            <option value="Sayur">Sayur</option>
                        </select>
                    </div>
                    <button onclick="openModalTambahBahan()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm w-full md:w-auto transition shadow-lg shadow-amber-500/20">
                        <i class="fa-solid fa-plus mr-1"></i> Tambah Bahan
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-slate-300">
                        <thead class="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th class="py-3.5 px-4">Nama Bahan</th>
                                <th class="py-3.5 px-4">Kategori</th>
                                <th class="py-3.5 px-4">Stok Saat Ini</th>
                                <th class="py-3.5 px-4">Batas Min</th>
                                <th class="py-3.5 px-4">Harga / Satuan</th>
                                <th class="py-3.5 px-4">Status</th>
                                <th class="py-3.5 px-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="stok-table-body" class="divide-y divide-slate-800/60">
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <section id="tab-kasir" class="tab-content hidden">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-4">
                    <h2 class="text-lg font-bold flex items-center gap-2 text-white">
                        <i class="fa-solid fa-utensils text-amber-500"></i> Pilih Menu Restoran
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="menu-grid">
                    </div>
                </div>

                <div class="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 h-fit shadow-2xl sticky top-24">
                    <h3 class="font-bold text-base border-b border-slate-800 pb-3 mb-4 flex justify-between items-center text-white">
                        <span>Pesanan Baru</span>
                        <span class="text-xs text-slate-400" id="cart-item-count">0 items</span>
                    </h3>
                    <div id="cart-items" class="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
                        <p class="text-xs text-slate-500 italic text-center py-6">Belum ada menu dipilih</p>
                    </div>
                    <div class="border-t border-slate-800 pt-3 space-y-2 mb-4 text-sm">
                        <div class="flex justify-between text-slate-400">
                            <span>Subtotal</span>
                            <span id="cart-subtotal">Rp 0</span>
                        </div>
                        <div class="flex justify-between font-bold text-lg text-white">
                            <span>Total</span>
                            <span id="cart-total" class="text-amber-400">Rp 0</span>
                        </div>
                    </div>
                    <button onclick="processTransaction()" id="btn-checkout" disabled class="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-3 rounded-xl text-sm transition flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/20">
                        <i class="fa-solid fa-circle-check"></i> <span id="btn-checkout-text">Proses & Deduct Stok</span>
                    </button>
                </div>
            </div>
        </section>

        <section id="tab-log" class="tab-content hidden">
            <div class="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-2xl">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold text-white">Riwayat Transaksi & Waste Log</h2>
                    <button onclick="openModalWaste()" class="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition">
                        <i class="fa-solid fa-dumpster mr-1"></i> Catat Waste/Kerusakan
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-slate-300">
                        <thead class="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th class="py-3.5 px-4">Waktu</th>
                                <th class="py-3.5 px-4">Tipe</th>
                                <th class="py-3.5 px-4">Bahan Baku</th>
                                <th class="py-3.5 px-4">Jumlah Terpotong</th>
                                <th class="py-3.5 px-4">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody id="log-table-body" class="divide-y divide-slate-800/60">
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <section id="tab-po" class="tab-content hidden">
            <div class="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-5 space-y-4 shadow-2xl">
                <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                        <h2 class="text-lg font-bold text-white">Purchase Order (Bahan Kritis)</h2>
                        <p class="text-xs text-slate-400">Otomatisasi pengadaan bahan baku yang stoknya di bawah minimum threshold.</p>
                    </div>
                    <button onclick="printPO()" class="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-2 rounded-xl border border-slate-700">
                        <i class="fa-solid fa-print mr-1"></i> Cetak Draft PO
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-slate-300">
                        <thead class="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th class="py-3.5 px-4">Bahan</th>
                                <th class="py-3.5 px-4">Stok Sekarang</th>
                                <th class="py-3.5 px-4">Saran Restock</th>
                                <th class="py-3.5 px-4">Estimasi Biaya</th>
                                <th class="py-3.5 px-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="po-table-body" class="divide-y divide-slate-800/60">
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

    </main>

    <!-- Modal Tambah Bahan -->
    <div id="modal-stok" class="fixed inset-0 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4 z-50">
        <div class="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-md p-6 shadow-2xl">
            <h3 class="font-bold text-lg mb-4 text-white">Tambah Bahan Baku</h3>
            <form id="form-stok" onsubmit="saveIngredient(event)" class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Nama Bahan</label>
                    <input type="text" id="input-nama" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">Kategori</label>
                        <select id="input-kategori" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                            <option value="Daging">Daging</option>
                            <option value="Sembako">Sembako</option>
                            <option value="Bumbu/Cairan">Bumbu/Cairan</option>
                            <option value="Sayur">Sayur</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">Satuan</label>
                        <input type="text" id="input-satuan" placeholder="kg, gr, pcs, L" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">Jumlah Stok Initial</label>
                        <input type="number" step="0.01" id="input-stok" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">Batas Minimal</label>
                        <input type="number" step="0.01" id="input-min" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Harga per Satuan (Rp)</label>
                    <input type="number" id="input-harga" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" onclick="closeModal('modal-stok')" class="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300">Batal</button>
                    <button type="submit" class="px-4 py-2 text-xs rounded-xl bg-amber-500 font-bold text-slate-950">Simpan</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Catat Waste -->
    <div id="modal-waste" class="fixed inset-0 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4 z-50">
        <div class="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-md p-6 shadow-2xl">
            <h3 class="font-bold text-lg mb-4 text-white">Catat Waste / Stok Rusak</h3>
            <form id="form-waste" onsubmit="saveWaste(event)" class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Pilih Bahan Baku</label>
                    <select id="waste-ingredient-id" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Jumlah Terbuang/Rusak</label>
                    <input type="number" step="0.01" id="waste-qty" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Keterangan / Alasan</label>
                    <textarea id="waste-reason" placeholder="Kutuan, Kadaluarsa, Tumpah..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none h-20"></textarea>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" onclick="closeModal('modal-waste')" class="px-4 py-2 text-xs rounded-xl bg-slate-800 text-slate-300">Batal</button>
                    <button type="submit" class="px-4 py-2 text-xs rounded-xl bg-rose-600 font-bold text-white">Kurangi Stok</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Lightbox Image -->
    <div id="modal-image-lightbox" class="fixed inset-0 bg-black/90 backdrop-blur-md hidden items-center justify-center p-4 z-[100]" onclick="closeImageModal()">
        <div class="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center justify-center" onclick="event.stopPropagation()">
            <button onclick="closeImageModal()" class="absolute -top-10 right-0 text-white hover:text-amber-400 text-2xl font-bold transition flex items-center gap-1">
                <i class="fa-solid fa-xmark"></i> Tutup
            </button>
            <img id="lightbox-img" src="" alt="Menu Full" class="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-slate-700">
            <h3 id="lightbox-title" class="text-white font-bold text-lg mt-3 text-center"></h3>
        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>