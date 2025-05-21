// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        description: "High-quality wireless headphones with noise cancellation",
        image: "https://via.placeholder.com/300x200?text=Headphones"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        description: "Feature-rich smartwatch with health tracking",
        image: "https://via.placeholder.com/300x200?text=Smart+Watch"
    },
    {
        id: 3,
        name: "Laptop Backpack",
        price: 49.99,
        description: "Durable laptop backpack with multiple compartments",
        image: "https://via.placeholder.com/300x200?text=Backpack"
    },
    {
        id: 4,
        name: "Coffee Maker",
        price: 79.99,
        description: "Programmable coffee maker with thermal carafe",
        image: "https://via.placeholder.com/300x200?text=Coffee+Maker"
    }
];

// Function to create product cards
function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h2 class="product-title">${product.name}</h2>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
}

// Function to display products
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Function to handle adding items to cart
function addToCart(productId) {
    alert(`Product ${productId} added to cart!`);
    // Add your cart functionality here
}

// Initialize the product display when the DOM is loaded
document.addEventListener('DOMContentLoaded', displayProducts); 