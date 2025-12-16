const products = [
  {
    id: 'set-cups',
    name: 'Zestaw filiżanek pastelowych',
    price: 320,
    description: 'Komplet dwóch filiżanek z talerzykami, ręcznie malowany pastelowymi szkliwami.',
    image: 'set_cups.jpg',
    badge: 'Nowość',
    category: 'Zestawy',
  },
  {
    id: 'cup-amber',
    name: 'Kubek Amber',
    price: 120,
    description: 'Kubek o organicznym kształcie z plamami szkliwa w kolorach miodu i błękitu.',
    image: 'cup1.jpg',
    badge: 'Ostatnia sztuka',
    category: 'Kubki',
  },
  {
    id: 'cup-ocean',
    name: 'Kubek Ocean',
    price: 115,
    description: 'Lekki kubek ze szkliwem inspirowanym falą i plażą, idealny na kawę lub herbatę.',
    image: 'cup2.jpg',
    category: 'Kubki',
  },
  {
    id: 'butter-dish',
    name: 'Maselnica Słoneczna',
    price: 210,
    description: 'Drewniana podstawa i ceramiczna kopuła z ręcznie malowanym wzorem.',
    image: 'butterholder1.jpg',
    badge: 'Bestseller',
    category: 'Maselnice',
  },
  {
    id: 'butter-forest',
    name: 'Maselnica Leśna',
    price: 215,
    description: 'Głęboki odcień zieleni z kremowym szkliwem, pasuje do rustykalnych kuchni.',
    image: 'butterholder2.jpg',
    category: 'Maselnice',
  },
  {
    id: 'butter-indigo',
    name: 'Maselnica Indigo',
    price: 215,
    description: 'Połączenie granatu i bieli z delikatnymi refleksami, dwukrotnie wypalana.',
    image: 'butterholder3.jpg',
    category: 'Maselnice',
  },
  {
    id: 'lighthouse-amber',
    name: 'Lampion Latarnia',
    price: 260,
    description: 'Ceramiczna latarnia w odcieniach bursztynu. Pięknie rozprasza światło świec.',
    image: 'lighthouse1.jpg',
    category: 'Lampiony',
  },
  {
    id: 'lighthouse-blue',
    name: 'Lampion Bałtycki',
    price: 260,
    description: 'Latarnia inspirowana morską bryzą, szkliwo w odcieniach turkusu i błękitu.',
    image: 'lighthouse2.jpg',
    category: 'Lampiony',
  },
  {
    id: 'serving-set',
    name: 'Zestaw deserowy',
    price: 380,
    description: 'Duży talerz i miseczka w szkliwach inspirowanych pieczonymi jabłkami.',
    image: 'set.jpg',
    category: 'Zestawy',
  },
  {
    id: 'plate-handpainted',
    name: 'Talerz z dekoracją kwiatową',
    price: 190,
    description: 'Ręcznie malowany motyw kwiatów, idealny na słodkie śniadania.',
    image: 'set_plate1.jpg',
    category: 'Talerze',
  },
  {
    id: 'mug-big',
    name: 'Duży kubek do latte',
    price: 140,
    description: 'Pojemny kubek z szerokim uchem, szkliwo o ciepłym, kremowym odcieniu.',
    image: 'set_cupbig.jpg',
    category: 'Kubki',
  },
];

const cart = [];
const productGrid = document.getElementById('product-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutForm = document.getElementById('checkout-form');
const checkoutMessage = document.getElementById('checkout-message');
const categoryFilters = document.getElementById('category-filters');
const sortSelect = document.getElementById('sort-select');
const modal = document.getElementById('product-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('product-modal-title');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalCategory = document.getElementById('modal-category');
const modalAddButton = document.getElementById('modal-add');

let activeCategory = 'Wszystko';
let lastViewedProduct = null;

function formatPrice(value) {
  return `${value.toFixed(2)} zł`;
}

function renderFilters() {
  const categories = ['Wszystko', ...new Set(products.map((product) => product.category))];
  categoryFilters.innerHTML = '';

  categories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `chip ${category === activeCategory ? 'chip--active' : ''}`;
    button.dataset.category = category;
    button.textContent = category;
    categoryFilters.appendChild(button);
  });
}

function sortProducts(list, sortKey) {
  const sorted = [...list];
  if (sortKey === 'price-asc') return sorted.sort((a, b) => a.price - b.price);
  if (sortKey === 'price-desc') return sorted.sort((a, b) => b.price - a.price);
  return sorted;
}

function renderProducts() {
  productGrid.innerHTML = '';
  const filtered = products.filter((product) => activeCategory === 'Wszystko' || product.category === activeCategory);
  const sorted = sortProducts(filtered, sortSelect.value);

  sorted.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="price-row">
        <h3>${product.name}</h3>
        ${product.badge ? `<span class="tag">${product.badge}</span>` : ''}
      </div>
      <p>${product.description}</p>
      <div class="price-row">
        <span class="price">${formatPrice(product.price)}</span>
        <button class="button primary" data-add="${product.id}">Dodaj do koszyka</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

function findProduct(id) {
  return products.find((product) => product.id === id);
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  updateCart();
  openCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  updateCart();
}

function removeFromCart(productId) {
  const index = cart.findIndex((entry) => entry.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
  }
  updateCart();
}

function renderCartItems() {
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'cart-item';
    empty.innerHTML = '<p class="muted">Koszyk jest pusty. Dodaj swój ulubiony produkt.</p>';
    cartItems.appendChild(empty);
    return;
  }

  cart.forEach((entry) => {
    const product = findProduct(entry.id);
    const item = document.createElement('li');
    item.className = 'cart-item';
    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <h4>${product.name}</h4>
        <p class="muted">${product.description}</p>
        <div class="qty" data-id="${entry.id}">
          <button type="button" data-action="decrease">-</button>
          <span>${entry.quantity}</span>
          <button type="button" data-action="increase">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <p class="price-small">${formatPrice(product.price * entry.quantity)}</p>
        <button class="icon-button" data-remove="${entry.id}">Usuń</button>
      </div>
    `;
    cartItems.appendChild(item);
  });
}

function updateCartSummary() {
  const total = cart.reduce((sum, entry) => {
    const product = findProduct(entry.id);
    return sum + product.price * entry.quantity;
  }, 0);
  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = cart.reduce((sum, entry) => sum + entry.quantity, 0);
}

function updateCart() {
  renderCartItems();
  updateCartSummary();
}

function openCart() {
  cartDrawer.classList.add('active');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawer.classList.remove('active');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function openModal(productId) {
  const product = findProduct(productId);
  if (!product) return;
  lastViewedProduct = product;
  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = formatPrice(product.price);
  modalCategory.textContent = product.category;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  lastViewedProduct = null;
}

function handleProductGridClick(event) {
  const button = event.target.closest('button[data-add]');
  if (button) {
    addToCart(button.dataset.add);
    return;
  }

  const card = event.target.closest('.product-card');
  if (card) {
    openModal(card.dataset.id);
  }
}

function handleCartClick(event) {
  const removeButton = event.target.closest('button[data-remove]');
  if (removeButton) {
    removeFromCart(removeButton.dataset.remove);
    return;
  }

  const qtyControl = event.target.closest('.qty');
  if (!qtyControl) return;
  const productId = qtyControl.dataset.id;
  const action = event.target.dataset.action;
  if (action === 'increase') changeQuantity(productId, 1);
  if (action === 'decrease') changeQuantity(productId, -1);
}

function handleCheckout(event) {
  event.preventDefault();
  if (cart.length === 0) {
    checkoutMessage.textContent = 'Dodaj produkty do koszyka, aby złożyć zamówienie.';
    checkoutMessage.style.color = '#b76e42';
    return;
  }

  const formData = new FormData(checkoutForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const address = formData.get('address');
  const notes = formData.get('notes');
  const summary = cart
    .map((entry) => {
      const product = findProduct(entry.id);
      return `${product.name} x${entry.quantity}`;
    })
    .join(', ');

  checkoutMessage.textContent = `${name}, dziękujemy! Wysłaliśmy potwierdzenie na ${email}. Adres: ${address}. Zamówienie: ${summary}${notes ? `. Uwagi: ${notes}` : ''}`;
  checkoutMessage.style.color = 'var(--success)';
  checkoutForm.reset();
  cart.length = 0;
  updateCart();
}

function init() {
  renderFilters();
  renderProducts();
  productGrid.addEventListener('click', handleProductGridClick);
  cartItems.addEventListener('click', handleCartClick);
  document.getElementById('open-cart').addEventListener('click', openCart);
  document.getElementById('close-cart').addEventListener('click', closeCart);
  cartDrawer.addEventListener('click', (event) => {
    if (event.target === cartDrawer) closeCart();
  });
  checkoutForm.addEventListener('submit', handleCheckout);

  categoryFilters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    renderProducts();
  });

  sortSelect.addEventListener('change', renderProducts);

  document.getElementById('close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  modalAddButton.addEventListener('click', () => {
    if (!lastViewedProduct) return;
    addToCart(lastViewedProduct.id);
    closeModal();
  });
}

document.addEventListener('DOMContentLoaded', init);
