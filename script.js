const menuData = {
    makanan: [
        { name: "Ayam teriyaki", price: "Rp 35.000", rawPrice: 35000, cal: "450 kkal", img: "food1.jpg" },
        { name: "Chocolate Muffin", price: "Rp 85.000", rawPrice: 85000, cal: "700 kkal", img: "food2.jpg" },
        { name: "Potato fries and Double Cheese Burger", price: "Rp 45.000", rawPrice: 45000, cal: "550 kkal", img: "food3.jpg" },
        { name: "Chicken Salad", price: "Rp 55.000", rawPrice: 55000, cal: "620 kkal", img: "food4.jpg" },
    ],
    minuman: [
        { name: "Capuchino choco latte", price: "Rp 22.000", rawPrice: 22000, cal: "120 kkal", img: "drink1.jpg" },
        { name: "Matcha Latte", price: "Rp 28.000", rawPrice: 28000, cal: "180 kkal", img: "drink2.jpg" },
        { name: "Kopi gula aren", price: "Rp 25.000", rawPrice: 25000, cal: "210 kkal", img: "drink3.jpg" },
        { name: "Cendol matcha", price: "Rp 18.000", rawPrice: 18000, cal: "90 kkal", img: "drink4.jpg" },
        { name: "Caramel Machiato", price: "Rp 30.000", rawPrice: 30000, cal: "320 kkal", img: "drink5.jpg" }
    ]
};

let cart = [];

function scrollToSection(id) {
    const el = document.getElementById(id);
    const y = el.getBoundingClientRect().top + window.pageYOffset - 40;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

function loadMenu(category, element) {
    document.querySelectorAll('.cat-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');

    const menuSection = document.getElementById('menu-section');
    const menuGrid = document.getElementById('menu-grid');
    const titleText = document.getElementById('menu-title-text');

    document.getElementById('status-section').classList.add('hidden-section');

    menuGrid.innerHTML = ''; 
    const items = menuData[category];
    titleText.innerText = category === 'makanan' ? "Makanan Lezat" : "Minuman Segar";

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card reveal-animation';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="menu-img" onerror="this.src='https://via.placeholder.com/300x200/cccccc/999999?text=No+Image'">
            <div class="menu-info">
                <div class="menu-head">
                    <h4>${item.name}</h4>
                    <span class="price">${item.price}</span>
                </div>
                <button class="btn-add" onclick="addToCart('${item.name}', ${item.rawPrice})">
                    <i class="fas fa-plus"></i> Tambah
                </button>
            </div>
        `;
        menuGrid.appendChild(card);
    });

    menuSection.classList.remove('hidden-section');
    menuSection.classList.add('reveal-animation');
    
    setTimeout(() => {
        scrollToSection('menu-section');
    }, 100);
}

function addToCart(name, price) {
    cart.push({ name, price });
    
    updateCartBadge();

    const fab = document.getElementById('floating-cart');
    if(fab.classList.contains('hidden')) {
        fab.classList.remove('hidden');
    }

    showToast(`+ ${name} ditambahkan`);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    badge.innerText = cart.length;
}

function showToast(message) {
    const oldToast = document.getElementById('toast');
    const newToast = oldToast.cloneNode(true);
    oldToast.parentNode.replaceChild(newToast, oldToast);
    
    newToast.innerText = message;
    newToast.classList.remove('hidden');
    
    setTimeout(() => {
        newToast.classList.add('hidden');
    }, 2000);
}

function openCartModal() {
    const modal = document.getElementById('cart-modal');
    const container = document.getElementById('cart-items-container');
    const totalDisplay = document.getElementById('cart-total-display');

    container.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg" style="text-align:center; color:#999;">Keranjang kosong</p>';
    } else {
        cart.forEach((item, index) => {
            totalPrice += item.price;
            const row = document.createElement('div');
            row.className = 'cart-item-row';
            row.innerHTML = `
                <span>${item.name}</span>
                <span>Rp ${item.price.toLocaleString('id-ID')}</span>
            `;
            container.appendChild(row);
        });
    }

    totalDisplay.innerText = 'Rp ' + totalPrice.toLocaleString('id-ID');
    modal.classList.remove('hidden');
}

function closeCartModal() {
    document.getElementById('cart-modal').classList.add('hidden');
}

function processCheckout() {
    if (cart.length === 0) {
        alert("Keranjang kosong!");
        return;
    }

    closeCartModal();

    const statusSection = document.getElementById('status-section');
    const orderList = document.getElementById('final-order-list');
    const finalTotal = document.getElementById('final-total-price');
    const orderId = document.getElementById('order-id');

    orderList.innerHTML = '';
    let grandTotal = 0;

    cart.forEach(item => {
        grandTotal += item.price;
        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `<span>${item.name}</span> <span>Rp ${item.price.toLocaleString('id-ID')}</span>`;
        orderList.appendChild(div);
    });

    finalTotal.innerText = 'Rp ' + grandTotal.toLocaleString('id-ID');
    orderId.innerText = '#' + Math.floor(Math.random() * 9000 + 1000);

    resetTracker();
    statusSection.classList.remove('hidden-section');
    statusSection.classList.add('reveal-animation');

    setTimeout(() => {
        scrollToSection('status-section');
        runTrackerSimulation();
    }, 100);

    document.getElementById('floating-cart').classList.add('hidden');
    cart = [];
    updateCartBadge();
}

function resetTracker() {
    document.querySelectorAll('.track-step').forEach(step => step.classList.remove('active'));
    document.getElementById('track-fill').style.width = '0%';
    document.getElementById('status-desc').innerText = "Pesanan diterima dapur...";
}

function runTrackerSimulation() {
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];
    const fill = document.getElementById('track-fill');
    const text = document.getElementById('status-desc');

    setTimeout(() => {
        steps[0].classList.add('active');
        text.innerText = "Chef sedang memasak pesanan Anda...";
        fill.style.width = '35%';
    }, 500);

    setTimeout(() => {
        steps[1].classList.add('active');
        text.innerText = "Sedang menata hidangan...";
        fill.style.width = '70%';
    }, 3000);

    setTimeout(() => {
        steps[2].classList.add('active');
        text.innerText = "Pesanan Siap! Mohon menuju kasir.";
        fill.style.width = '100%';
    }, 6000);
}

function resetFlow() {
    scrollToSection('categories');
    setTimeout(() => {
         document.getElementById('status-section').classList.add('hidden-section');
         document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
    }, 800);
}