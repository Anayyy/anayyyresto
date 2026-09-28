let ingredients = [];
let logs = [];
let processedPOIds = new Set();
let financialChart = null;

let salesCount = parseInt(localStorage.getItem('daily_sales_count') || '0');
let dailyRevenue = parseFloat(localStorage.getItem('daily_revenue') || '0');
let dailyHPP = parseFloat(localStorage.getItem('daily_hpp') || '0');
let dailyRestockCost = parseFloat(localStorage.getItem('daily_restock_cost') || '0');

let menuItems = [
    {
        id: 'm1',
        name: 'Beef Teriyaki Rice Bowl',
        category: 'Makanan',
        price: 45000,
        image: '/images/menu/beef_bowl.jpg',
        recipe: [
            { ingredientId: 1, qty: 0.12 },
            { ingredientId: 2, qty: 0.15 },
            { ingredientId: 3, qty: 0.02 },
            { ingredientId: 5, qty: 0.03 }
        ]
    },
    {
        id: 'm2',
        name: 'Nasi Goreng Sapi Spesial',
        category: 'Makanan',
        price: 38000,
        image: '/images/menu/nasi_goreng.jpg',
        recipe: [
            { ingredientId: 1, qty: 0.08 },
            { ingredientId: 2, qty: 0.18 },
            { ingredientId: 4, qty: 1.0 },
            { ingredientId: 6, qty: 0.01 }
        ]
    },
    {
        id: 'm3',
        name: 'Ayam Goreng Mentega',
        category: 'Makanan',
        price: 35000,
        image: '/images/menu/ayam_mentega.jpg',
        recipe: [
            { ingredientId: 7, qty: 0.25 },
            { ingredientId: 3, qty: 0.03 },
            { ingredientId: 8, qty: 0.02 },
            { ingredientId: 6, qty: 0.01 }
        ]
    },
    {
        id: 'm4',
        name: 'Chicken Katsu Curry',
        category: 'Makanan',
        price: 42000,
        image: '/images/menu/chicken_katsu.jpg',
        recipe: [
            { ingredientId: 7, qty: 0.20 },
            { ingredientId: 2, qty: 0.15 },
            { ingredientId: 4, qty: 1.0 },
            { ingredientId: 3, qty: 0.04 }
        ]
    },
    {
        id: 'm5',
        name: 'Es Teh Manis Jumbo',
        category: 'Minuman',
        price: 8000,
        image: '/images/menu/es_teh.jpg',
        recipe: [
            { ingredientId: 9, qty: 0.01 },
            { ingredientId: 10, qty: 0.03 }
        ]
    },
    {
        id: 'm6',
        name: 'Lemon Tea Cold',
        category: 'Minuman',
        price: 15000,
        image: '/images/menu/lemon_tea.jpg',
        recipe: [
            { ingredientId: 9, qty: 0.01 },
            { ingredientId: 10, qty: 0.02 },
            { ingredientId: 11, qty: 0.05 }
        ]
    },
    {
        id: 'm7',
        name: 'Es Kopi Susu Aren',
        category: 'Minuman',
        price: 22000,
        image: '/images/menu/kopi_susu.jpg',
        recipe: [
            { ingredientId: 12, qty: 0.02 },
            { ingredientId: 13, qty: 0.12 },
            { ingredientId: 14, qty: 0.03 }
        ]
    },
    {
        id: 'm8',
        name: 'Matcha Latte Ice',
        category: 'Minuman',
        price: 25000,
        image: '/images/menu/matcha_latte.jpg',
        recipe: [
            { ingredientId: 15, qty: 0.015 },
            { ingredientId: 13, qty: 0.15 },
            { ingredientId: 10, qty: 0.01 }
        ]
    },
    {
        id: 'm9',
        name: 'Air Mineral Le Minerale',
        category: 'Minuman',
        price: 6000,
        image: '/images/menu/air_mineral.jpg',
        recipe: [
            { ingredientId: 16, qty: 1.0 }
        ]
    }
];

let cart = [];

function formatIDR(val) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

const apiHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
};

async function loadDataFromDB() {
    try {
        const resIng = await fetch('/api/ingredients', { headers: apiHeaders });
        ingredients = await resIng.json();

        const resLog = await fetch('/api/logs', { headers: apiHeaders });
        logs = await resLog.json();

        window.renderStokTable();
        window.renderMenuGrid();
        window.renderLogs();
    } catch (err) {
        console.error("Gagal memuat data dari database:", err);
    }
}

function renderChart() {
    const ctx = document.getElementById('financialChart');
    if (!ctx) return;

    const netProfit = dailyRevenue - dailyHPP - dailyRestockCost;

    if (financialChart) {
        financialChart.destroy();
    }

    financialChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Omset Penjualan', 'HPP Terjual', 'Pengeluaran Restock/PO', 'Laba Bersih'],
            datasets: [{
                label: 'Jumlah (Rp)',
                data: [dailyRevenue, dailyHPP, dailyRestockCost, netProfit],
                backgroundColor: [
                    'rgba(34, 211, 238, 0.8)',
                    'rgba(203, 213, 225, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                    netProfit >= 0 ? 'rgba(52, 211, 153, 0.8)' : 'rgba(239, 68, 68, 0.8)'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(51, 65, 85, 0.3)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { display: false }
                }
            }
        }
    });
}

function updateMetrics() {
    const totalVal = ingredients.reduce((acc, item) => acc + (parseFloat(item.stock) * parseFloat(item.price)), 0);
    const criticals = ingredients.filter(i => parseFloat(i.stock) <= parseFloat(i.min));

    const elTotalVal = document.getElementById('metric-total-val');
    const elSalesCount = document.getElementById('metric-sales-count');
    const elDailyRevenue = document.getElementById('metric-daily-revenue');
    const elDailyHPP = document.getElementById('metric-daily-hpp');
    const elDailyRestock = document.getElementById('metric-daily-restock');
    const elDailyProfit = document.getElementById('metric-daily-profit');
    const badgePO = document.getElementById('badge-po');

    if (elTotalVal) elTotalVal.innerText = formatIDR(totalVal);
    if (elSalesCount) elSalesCount.innerText = salesCount;
    if (elDailyRevenue) elDailyRevenue.innerText = formatIDR(dailyRevenue);
    if (elDailyHPP) elDailyHPP.innerText = formatIDR(dailyHPP);
    if (elDailyRestock) elDailyRestock.innerText = formatIDR(dailyRestockCost);

    const netProfit = dailyRevenue - dailyHPP - dailyRestockCost;
    if (elDailyProfit) {
        elDailyProfit.innerText = formatIDR(netProfit);
        if (netProfit >= 0) {
            elDailyProfit.className = "text-lg font-bold text-emerald-400 mt-1";
        } else {
            elDailyProfit.className = "text-lg font-bold text-rose-400 mt-1";
        }
    }

    if (badgePO) {
        if (criticals.length > 0) {
            badgePO.innerText = criticals.length;
            badgePO.classList.remove('hidden');
        } else {
            badgePO.classList.add('hidden');
        }
    }

    renderChart();
}

window.resetDailyFinancials = function() {
    if (confirm("Apakah Anda yakin ingin mereset Total Transaksi, Omset, Restock, dan Laba Bersih Harian menjadi 0?")) {
        salesCount = 0;
        dailyRevenue = 0;
        dailyHPP = 0;
        dailyRestockCost = 0;

        localStorage.setItem('daily_sales_count', '0');
        localStorage.setItem('daily_revenue', '0');
        localStorage.setItem('daily_hpp', '0');
        localStorage.setItem('daily_restock_cost', '0');

        updateMetrics();
        alert("Laporan transaksi harian berhasil direset.");
    }
};

window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-amber-500', 'text-slate-950', 'font-semibold');
        el.classList.add('text-slate-400');
    });

    const activeTab = document.getElementById(`tab-${tabName}`);
    const activeBtn = document.getElementById(`btn-${tabName}`);

    if (activeTab) activeTab.classList.remove('hidden');
    if (activeBtn) {
        activeBtn.classList.add('bg-amber-500', 'text-slate-950', 'font-semibold');
        activeBtn.classList.remove('text-slate-400');
    }

    if (tabName === 'po') window.renderPOTable();
};

window.renderStokTable = function() {
    const searchInput = document.getElementById('search-stok');
    const catInput = document.getElementById('filter-kategori');
    const tbody = document.getElementById('stok-table-body');
    if (!tbody) return;

    const search = searchInput ? searchInput.value.toLowerCase() : '';
    const category = catInput ? catInput.value : 'ALL';
    tbody.innerHTML = '';

    ingredients.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search);
        const matchCat = category === 'ALL' || item.category === category;
        return matchSearch && matchCat;
    }).forEach(item => {
        const stockVal = parseFloat(item.stock);
        const minVal = parseFloat(item.min);
        const isCritical = stockVal <= minVal;
        
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-800/50';
        tr.innerHTML = `
            <td class="py-3.5 px-4 font-semibold text-white">${item.name}</td>
            <td class="py-3.5 px-4"><span class="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700">${item.category}</span></td>
            <td class="py-3.5 px-4 font-bold ${isCritical ? 'text-rose-400' : 'text-slate-200'}">${stockVal} ${item.unit}</td>
            <td class="py-3.5 px-4 text-slate-400">${minVal} ${item.unit}</td>
            <td class="py-3.5 px-4">${formatIDR(item.price)}</td>
            <td class="py-3.5 px-4">
                ${isCritical 
                    ? '<span class="bg-rose-500/20 text-rose-400 text-xs px-2.5 py-1 rounded-full font-bold border border-rose-500/30">Kritis</span>' 
                    : '<span class="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">Aman</span>'}
            </td>
            <td class="py-3.5 px-4 text-center">
                <button onclick="quickRestock(${item.id})" class="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-lg text-amber-400 font-bold mr-1 transition">+ Restock</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    updateMetrics();
};

window.quickRestock = async function(id) {
    const item = ingredients.find(i => i.id == id);
    if (!item) return;

    const qtyStr = prompt(`Tambah stok manual untuk ${item.name} (${item.unit}):`, "5");
    if (qtyStr !== null && qtyStr.trim() !== "" && !isNaN(qtyStr)) {
        const qty = parseFloat(qtyStr);
        const restockCost = qty * parseFloat(item.price);

        try {
            await fetch(`/api/ingredients/${id}/stock`, {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({ 
                    qty: qty, 
                    type: 'RESTOCK', 
                    reason: 'Manual Restock' 
                })
            });

            dailyRestockCost += restockCost;
            localStorage.setItem('daily_restock_cost', dailyRestockCost.toString());

            await loadDataFromDB();
            alert(`Restock berhasil! Total Biaya Restock (${formatIDR(restockCost)}) telah dipotong dari Laba Bersih Harian.`);
        } catch (e) {
            console.error("Error Restock:", e);
        }
    }
};

window.renderMenuGrid = function() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xl hover:border-slate-700 transition duration-300';
        card.innerHTML = `
            <div>
                <div class="h-44 w-full bg-slate-950 relative overflow-hidden cursor-pointer group" onclick="openImageModal('${item.image}', '${item.name}')">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400'">
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px]">
                        <i class="fa-solid fa-magnifying-glass-plus"></i> Lihat Foto Full
                    </div>
                    <span class="absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full font-bold backdrop-blur-md shadow-md ${item.category === 'Minuman' ? 'bg-cyan-500/80 text-white' : 'bg-amber-500/80 text-slate-950'}">${item.category}</span>
                </div>
                <div class="p-4">
                    <h4 class="font-bold text-white text-base leading-snug">${item.name}</h4>
                    <p class="text-amber-400 text-sm font-bold mt-1">${formatIDR(item.price)}</p>
                    <div class="mt-3 text-xs text-slate-400 border-t border-slate-800 pt-2.5">
                        <strong class="text-slate-300">Resep (BOM):</strong>
                        <ul class="list-disc pl-4 mt-1 space-y-0.5">
                            ${item.recipe.map(r => {
                                const ing = ingredients.find(i => i.id == r.ingredientId);
                                return `<li>${ing ? ing.name : 'Bahan'}: ${r.qty}${ing ? ing.unit : ''}</li>`;
                            }).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="p-4 pt-0">
                <button onclick="addToCart('${item.id}')" class="w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs py-2.5 rounded-xl border border-slate-700 hover:border-amber-500 transition duration-200">
                    + Tambah ke Pesanan
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
};

window.addToCart = function(menuId) {
    const existing = cart.find(c => c.menuId === menuId);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ menuId, qty: 1 });
    }
    window.renderCart();
};

window.renderCart = function() {
    const container = document.getElementById('cart-items');
    const btnCheckout = document.getElementById('btn-checkout');
    if (!container) return;
    container.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-500 italic text-center py-6">Belum ada menu dipilih</p>';
        if (btnCheckout) btnCheckout.disabled = true;
    } else {
        if (btnCheckout) btnCheckout.disabled = false;
        cart.forEach((item, index) => {
            const menu = menuItems.find(m => m.id === item.menuId);
            const subtotal = menu.price * item.qty;
            total += subtotal;
            totalItems += item.qty;

            const div = document.createElement('div');
            div.className = 'flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs';
            div.innerHTML = `
                <div>
                    <p class="font-semibold text-white">${menu.name}</p>
                    <p class="text-slate-400">${formatIDR(menu.price)} x ${item.qty}</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-200">${formatIDR(subtotal)}</span>
                    <button onclick="removeFromCart(${index})" class="text-rose-400 hover:text-rose-300 ml-1"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    document.getElementById('cart-item-count').innerText = `${totalItems} items`;
    document.getElementById('cart-subtotal').innerText = formatIDR(total);
    document.getElementById('cart-total').innerText = formatIDR(total);
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    window.renderCart();
};

window.processTransaction = async function() {
    const btnCheckout = document.getElementById('btn-checkout');
    const btnText = document.getElementById('btn-checkout-text');
    
    if (btnCheckout) btnCheckout.disabled = true;
    if (btnText) btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Memproses...';

    try {
        let transactionRevenue = 0;
        let transactionHPP = 0;
        let stockRequests = [];

        for (const cartItem of cart) {
            const menu = menuItems.find(m => m.id === cartItem.menuId);
            transactionRevenue += menu.price * cartItem.qty;

            for (const bom of menu.recipe) {
                const totalDeduction = -(bom.qty * cartItem.qty);
                const ing = ingredients.find(i => i.id == bom.ingredientId);
                if (ing) {
                    transactionHPP += (bom.qty * cartItem.qty) * parseFloat(ing.price);
                }

                stockRequests.push(
                    fetch(`/api/ingredients/${bom.ingredientId}/stock`, {
                        method: 'POST',
                        headers: apiHeaders,
                        body: JSON.stringify({ 
                            qty: totalDeduction, 
                            type: 'POS_DEDUCT', 
                            reason: `Order: ${menu.name} (x${cartItem.qty})` 
                        })
                    })
                );
            }
        }

        await Promise.all(stockRequests);

        salesCount += 1;
        dailyRevenue += transactionRevenue;
        dailyHPP += transactionHPP;

        localStorage.setItem('daily_sales_count', salesCount.toString());
        localStorage.setItem('daily_revenue', dailyRevenue.toString());
        localStorage.setItem('daily_hpp', dailyHPP.toString());

        cart = [];
        window.renderCart();
        await loadDataFromDB();
        alert('Transaksi Berhasil! Stok bahan dipotong secara instan & Laporan Keuangan diperbarui.');
    } catch (e) {
        console.error("Error Transaction:", e);
        alert("Terjadi kesalahan saat memproses stok.");
    } finally {
        if (btnText) btnText.innerText = 'Proses & Deduct Stok';
    }
};

window.renderLogs = function() {
    const tbody = document.getElementById('log-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    logs.forEach(l => {
        const tr = document.createElement('tr');
        const timeStr = l.created_at ? new Date(l.created_at).toLocaleTimeString() : (l.time || '');
        tr.innerHTML = `
            <td class="py-3 px-4 text-xs text-slate-400">${timeStr}</td>
            <td class="py-3 px-4">
                <span class="text-[10px] px-2.5 py-1 rounded-full font-bold ${
                    l.type === 'POS_DEDUCT' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    l.type === 'WASTE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }">${l.type}</span>
            </td>
            <td class="py-3 px-4 font-semibold text-slate-200">${l.ingredient}</td>
            <td class="py-3 px-4 font-bold ${String(l.qty).startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}">${l.qty}</td>
            <td class="py-3 px-4 text-slate-400 text-xs">${l.reason}</td>
        `;
        tbody.appendChild(tr);
    });
};

window.openModalWaste = function() {
    const select = document.getElementById('waste-ingredient-id');
    if (!select) return;
    select.innerHTML = '';
    ingredients.forEach(i => {
        select.innerHTML += `<option value="${i.id}">${i.name} (Sisa: ${i.stock} ${i.unit})</option>`;
    });
    const modal = document.getElementById('modal-waste');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.saveWaste = async function(e) {
    e.preventDefault();
    const ingId = document.getElementById('waste-ingredient-id').value;
    const qty = parseFloat(document.getElementById('waste-qty').value);
    const reason = document.getElementById('waste-reason').value;

    try {
        await fetch(`/api/ingredients/${ingId}/stock`, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify({ 
                qty: -qty, 
                type: 'WASTE', 
                reason: reason || 'Waste/Kerusakan' 
            })
        });

        await loadDataFromDB();
        window.closeModal('modal-waste');
    } catch (e) {
        console.error("Error Waste:", e);
    }
};

window.renderPOTable = function() {
    const tbody = document.getElementById('po-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    const criticals = ingredients.filter(i => parseFloat(i.stock) <= parseFloat(i.min));

    if (criticals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-6 text-slate-500 italic">Semua stok aman. Tidak ada usulan PO.</td></tr>';
        return;
    }

    criticals.forEach(i => {
        const suggestQty = Math.ceil((parseFloat(i.min) * 2) - parseFloat(i.stock));
        const estCost = suggestQty * parseFloat(i.price);
        const tr = document.createElement('tr');
        
        const isProcessed = processedPOIds.has(i.id);

        tr.innerHTML = `
            <td class="py-3 px-4 font-semibold text-white">${i.name}</td>
            <td class="py-3 px-4 text-rose-400 font-bold">${i.stock} ${i.unit}</td>
            <td class="py-3 px-4 text-emerald-400 font-bold">+${suggestQty} ${i.unit}</td>
            <td class="py-3 px-4 font-semibold">${formatIDR(estCost)}</td>
            <td class="py-3 px-4">
                ${isProcessed 
                    ? '<span class="bg-slate-800 text-amber-400 text-xs px-3 py-1 rounded-xl font-semibold border border-amber-500/30"><i class="fa-solid fa-spinner fa-spin mr-1"></i> PO Diproses</span>' 
                    : `<button onclick="approvePO(${i.id},${suggestQty})" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-xl font-semibold transition shadow-md shadow-emerald-600/20">Proses PO</button>`
                }
            </td>
        `;
        tbody.appendChild(tr);
    });
};

window.approvePO = async function(id, qty) {
    processedPOIds.add(id);
    window.renderPOTable();

    const ing = ingredients.find(i => i.id == id);
    const poCost = ing ? (qty * parseFloat(ing.price)) : 0;

    try {
        await fetch(`/api/ingredients/${id}/stock`, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify({ qty: qty, type: 'RESTOCK', reason: 'PO Supplier Processed' })
        });
        
        dailyRestockCost += poCost;
        localStorage.setItem('daily_restock_cost', dailyRestockCost.toString());

        await loadDataFromDB();
        processedPOIds.delete(id);
        alert(`PO Berhasil Diproses! Stok bertambah & Biaya PO (${formatIDR(poCost)}) telah dipotong dari Laba Bersih.`);
    } catch (e) {
        console.error("Error PO:", e);
        processedPOIds.delete(id);
        window.renderPOTable();
    }
};

window.openModalTambahBahan = function() {
    const modal = document.getElementById('modal-stok');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

window.saveIngredient = async function(e) {
    e.preventDefault();
    const newIng = {
        name: document.getElementById('input-nama').value,
        category: document.getElementById('input-kategori').value,
        unit: document.getElementById('input-satuan').value,
        stock: parseFloat(document.getElementById('input-stok').value),
        min: parseFloat(document.getElementById('input-min').value),
        price: parseFloat(document.getElementById('input-harga').value)
    };

    try {
        await fetch('/api/ingredients', {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify(newIng)
        });

        await loadDataFromDB();
        window.closeModal('modal-stok');
        document.getElementById('form-stok').reset();
    } catch (e) {
        console.error("Error Save Ingredient:", e);
    }
};

window.openImageModal = function(imageSrc, title) {
    const modal = document.getElementById('modal-image-lightbox');
    const img = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');

    if (modal && img && titleEl) {
        img.src = imageSrc;
        titleEl.innerText = title;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.closeImageModal = function() {
    const modal = document.getElementById('modal-image-lightbox');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

window.printPO = function() {
    window.print();
};

document.addEventListener('DOMContentLoaded', () => {
    loadDataFromDB();
});