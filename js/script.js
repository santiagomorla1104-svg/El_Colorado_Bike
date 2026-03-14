// Datos de productos
const products = [
    {
        id: 1,
        name: 'Bicicleta Jafi Challenger 29',
        price: 2000,
        category: 'mtb',
        description: 'Bicicleta de montana 1x12 con frenos hidráulicos, suspensión de aire y ruedas de 29 pulgadas',
        image: 'images/products/jafi-29.svg'
    },
    {
        id: 2,
        name: 'Bielas Jafi Hollowtech 34T',
        price: 200,
        category: 'ruta',
        description: 'Bielas de montaña ultraligera y resistente',
        image: 'images/products/bielas_jafi.svg'
    },
    {
        id: 3,
        name: 'Llanta Chaoyang MTB 29x2.2',
        price: 135,
        category: 'componentes',
        description: 'Llanta resistente para tubeless',
        image: 'images/products/llanta-tubeless.svg'
    },
    {
        id: 4,
        name: 'Asiento antiprostático Rockbros',
        price: 35,
        category: 'componentes',
        description: 'Asiento antiprostático para bicicleta',
        image: 'images/products/asiento-rockbros.svg'
    },
    {
        id: 5,
        name: 'Suspensión Tanke 120mm',
        price: 450,
        category: 'componentes',
        description: 'Suspensión delantera de 120mm para MTB, ajustable y ligera',
        image: 'images/products/suspension-tanke.svg'
    },
    {
        id: 6,
        name: 'Tornillos tornasolados para potencia',
        price: 30,
        category: 'componentes',
        description: 'Tornillos para potencia de bicicleta',
        image: 'images/products/ztto-tornillos.svg'
    },
    {
        id: 7,
        name: 'Extractor de eje sellado',
        price: 40,
        category: 'Herramientas',
        description: 'Extractor de eje sellado para bicicletas de montaña',
        image: 'images/products/extractorsellado.svg'
    },
    {
        id: 8,
        name: 'Potencia Tornasolada Lunje',
        price: 80,
        category: 'componentes',
        description: 'Potencia tornasolada de aluminio para MTB',
        image: 'images/products/potenciatornasol.svg'
    },
    {
        id: 9,
        name: 'Manubrio Lunje 780mm',
        price: 55,
        category: 'componentes',
        description: 'Manubrio de aluminio de 780mm para MTB, ergonómico y resistente',
        image: 'images/products/lunje-manubrio.svg'
    },
    {
        id: 10,
        name: 'Manubrio Lunje 780mm con diseño',
        price: 80,
        category: 'componentes',
        description: 'Manubrio de aluminio de 780mm para MTB, ergonómico y resistente',
        image: 'images/products/lunje-diseño.svg'
    },
    {
        id: 11,
        name: 'Bottom bracket sellado RIRO',
        price: 50,
        category: 'componentes',
        description: 'Bottom bracket sellado para bicicleta con sistema de eje de 24mm, compatible con cuadros de MTB y ruta',
        image: 'images/products/bottom-riro.svg'
    },
    {
        id: 12,
        name: 'Cadena Sram PC-830 8 velocidades',
        price: 80,
        category: 'componentes',
        description: 'Cadena de 8 velocidades para bicicleta',
        image: 'images/products/sram-8v.svg'
    },
    {
        id: 13,
        name: 'Manubrio Lunje 780mm con diseño',
        price: 80,
        category: 'MTB',
        description: 'Manubrio de aluminio de 780mm para MTB, ergonómico y resistente',
        image: 'images/products/lunje-diseño.svg'
    },
];

let cart = [];
let currentFilter = 'todos';
let currentQuery = '';
let currentSort = 'default';
const whatsappPhone = '51906414352';

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');
const searchInput = document.getElementById('searchInput');

function init() {
    loadCartFromStorage();
    setupEventListeners();
    renderProducts();
    updateCartUI();
}

function setupEventListeners() {
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
    }

    if (closeCart && cartModal) {
        closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
    }

    if (cartModal) {
        cartModal.addEventListener('click', event => {
            if (event.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }

    if (productsGrid) {
        productsGrid.addEventListener('click', event => {
            const addButton = event.target.closest('.btn-add-cart');
            if (!addButton) return;

            const productId = Number(addButton.dataset.productId);
            if (!Number.isNaN(productId)) {
                addToCart(productId);
            }
        });
    }

    if (cartItems) {
        cartItems.addEventListener('click', event => {
            const removeButton = event.target.closest('.cart-item-remove');
            if (!removeButton) return;

            const productId = Number(removeButton.dataset.productId);
            if (!Number.isNaN(productId)) {
                removeFromCart(productId);
            }
        });

        cartItems.addEventListener('input', event => {
            const quantityInput = event.target.closest('.cart-quantity-input');
            if (!quantityInput) return;

            const productId = Number(quantityInput.dataset.productId);
            const quantity = Number(quantityInput.value);
            if (!Number.isNaN(productId)) {
                updateQuantity(productId, quantity);
            }
        });
    }

    if (searchInput) {
        const debouncedSearch = debounce(() => {
            currentQuery = searchInput.value.toLowerCase().trim();
            renderProducts();
        }, 220);

        searchInput.addEventListener('input', debouncedSearch);
        searchInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                currentQuery = searchInput.value.toLowerCase().trim();
                renderProducts();
            }
        });
    }

    // Animacion de transicion entre paginas internas
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname !== window.location.hostname) return;

        link.addEventListener('click', event => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || link.hasAttribute('target')) return;

            event.preventDefault();
            document.body.style.animation = 'pageExit 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            setTimeout(() => {
                window.location.href = href;
            }, 700);
        });
    });
}

function getFilteredProducts() {

    let filtered = products.filter(product => {

        const categoryMatch =
            currentFilter === 'todos' || product.category === currentFilter;

        const queryMatch =
            !currentQuery ||
            product.name.toLowerCase().includes(currentQuery) ||
            product.description.toLowerCase().includes(currentQuery);

        return categoryMatch && queryMatch;

    });

    if (currentSort === "asc") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (currentSort === "desc") {
        filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;

}

function renderProducts() {
    if (!productsGrid) return;

    const filteredProducts = getFilteredProducts();

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-results">No se encontraron productos</p>';
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => {
        const fallback = getProductFallbackImage(product);
        const imageUrl = product.image || fallback;

        return `
            <article class="product-card">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" onerror="this.src='${fallback}'">
                </div>
                <div class="product-info">
                    <span class="product-category">${escapeHtml(product.category)}</span>
                    <h3 class="product-name">${escapeHtml(product.name)}</h3>
                    <p class="product-description">${escapeHtml(product.description)}</p>
                    <div class="product-price">S/ ${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn-add-cart" data-product-id="${product.id}">Carrito</button>
                        <a href="${getWhatsappLink(product)}" target="_blank" rel="noopener" class="btn-whatsapp">WhatsApp</a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function getWhatsappLink(product) {
    const message = encodeURIComponent(
        `Hola, me interesa el siguiente producto:%0A%0A*${product.name}*%0APrecio: S/ ${product.price.toFixed(2)}`
    );

    return `https://web.whatsapp.com/send?phone=${whatsappPhone}&text=${message}`;
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCartToStorage();
    updateCartUI();
    showNotification(`${product.name} anadido al carrito`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(entry => entry.id === productId);
    if (!item) return;

    const parsedQuantity = Math.max(1, Number.isFinite(quantity) ? Math.floor(quantity) : 1);
    item.quantity = parsedQuantity;
    saveCartToStorage();
    updateCartUI();
}

function updateCartUI() {
    if (!cartCount || !cartItems || !totalPrice) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = String(totalItems);

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito esta vacio</p>';
    } else {
        cartItems.innerHTML = cart.map(item => {
            const fallback = getProductFallbackImage(item);
            const imageUrl = item.image || fallback;

            return `
                <div class="cart-item">
                    <img class="cart-item-image" src="${imageUrl}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" onerror="this.src='${fallback}'">
                    <div class="cart-item-info">
                        <h4>${escapeHtml(item.name)}</h4>
                        <div class="cart-item-controls">
                            <input
                                class="cart-quantity-input"
                                type="number"
                                min="1"
                                value="${item.quantity}"
                                data-product-id="${item.id}"
                            >
                            <span class="cart-item-price">S/ ${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-product-id="${item.id}" aria-label="Eliminar ${escapeHtml(item.name)}">x</button>
                </div>
            `;
        }).join('');
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPrice.textContent = total.toFixed(2);
    updateWhatsappLink(total);
}

function updateWhatsappLink(total) {

    const whatsappLink = document.querySelector('.btn-primary');
    if (!whatsappLink) return;

    if (cart.length === 0) {

        let message = "Hola, me gustaría comprar productos de su tienda.";
        whatsappLink.href = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
        return;
    }

    let message = "Descarrilados Bike - Compra\n\n";

    cart.forEach(item => {
        message += `${item.name} (x${item.quantity}) - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\nTOTAL: S/ ${total.toFixed(2)}`;

    whatsappLink.href = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    if (!saved) return;

    try {
        cart = JSON.parse(saved);
    } catch {
        cart = [];
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add('is-visible');
    });

    setTimeout(() => {
        notification.classList.remove('is-visible');
        setTimeout(() => notification.remove(), 220);
    }, 1800);
}

function searchProducts() {
    if (!searchInput) return;
    currentQuery = searchInput.value.toLowerCase().trim();
    renderProducts();
}

function filterByCategory(category) {
    currentFilter = category;
    if (searchInput) {
        searchInput.value = '';
    }
    currentQuery = '';
    renderProducts();
}

function getProductFallbackImage(product) {
    const categoryNames = {
        mtb: 'MTB',
        ruta: 'RUTA',
        componentes: 'COMPONENTES',
        herramientas: 'ACCESORIOS'
    };

    const label = categoryNames[product.category] || 'PRODUCTO';
    const text = encodeURIComponent(label);
    const name = encodeURIComponent(product.name.slice(0, 26));
    const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 700 420'>
            <defs>
                <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0%' stop-color='#096CC8'/>
                    <stop offset='100%' stop-color='#0B83F4'/>
                </linearGradient>
            </defs>
            <rect width='700' height='420' fill='url(#g)'/>
            <circle cx='90' cy='80' r='120' fill='rgba(255,255,255,0.14)'/>
            <circle cx='610' cy='350' r='140' fill='rgba(255,255,255,0.08)'/>
            <text x='40' y='230' font-size='64' font-family='Arial, sans-serif' font-weight='700' fill='white'>${text}</text>
            <text x='40' y='290' font-size='24' font-family='Arial, sans-serif' fill='rgba(255,255,255,0.88)'>${name}</text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function debounce(fn, waitMs) {
    let timeoutId;
    return function debounced(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), waitMs);
    };
}

const preview = document.getElementById("productPreview");
const previewImg = document.getElementById("previewImg");
const previewName = document.getElementById("previewName");
const previewPrice = document.getElementById("previewPrice");
const previewDescription = document.getElementById("previewDescription");

const previewAddCart = document.getElementById("previewAddCart");
const previewWhatsapp = document.getElementById("previewWhatsapp");
const closePreview = document.getElementById("closePreview");

let currentPreviewProduct = null;

if (productsGrid) {

    productsGrid.addEventListener("click", (event) => {

        const card = event.target.closest(".product-card");

        if (!card) return;

        if (event.target.closest(".btn-add-cart") || event.target.closest(".btn-whatsapp")) {
            return;
        }

        const name = card.querySelector(".product-name").innerText;

        const product = products.find(p => p.name === name);

        if (!product) return;

        currentPreviewProduct = product;

        previewImg.src = product.image;
        previewName.innerText = product.name;
        previewPrice.innerText = "S/ " + product.price.toFixed(2);
        previewDescription.innerText = product.description;

        previewWhatsapp.href =
        `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
            `Hola, me interesa este producto:\n\n${product.name}\nPrecio: S/ ${product.price}`
        )}`;

        preview.classList.add("active");

    });

}

if (closePreview) {

    closePreview.onclick = () => {
        preview.classList.remove("active");
    };

}

if (previewAddCart) {

    previewAddCart.onclick = () => {

        if (!currentPreviewProduct) return;

        addToCart(currentPreviewProduct.id);

    };

}

/* cerrar tocando fuera */

preview.addEventListener("click", (e) => {

    if (e.target === preview) {

        preview.classList.remove("active");

    }

});

function sortByPrice() {

    const sortSelect = document.getElementById("priceSort");

    currentSort = sortSelect.value;

    renderProducts();

}

document.addEventListener('DOMContentLoaded', init);
