// Attach event listeners and fetch data
window.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const productsContainer = document.querySelector('.shop-section');
    const loginForm = document.querySelector('.form-box form');

    // Search for products
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetchProducts(query);
    });

    // Handle login
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleLogin();
        });
    }

    // Initial fetch of products
    fetchProducts('laptop');
});

// Fetch products from the backend
function fetchProducts(query) {
    fetch(`/api/products?query=${encodeURIComponent(query)}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return response.json();
        })
        .then((data) => {
            updateProductUI(data.fallback || data.products || []);
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
            updateProductUI([]); // Clear UI in case of error
        });
}

// Update the product UI dynamically
function updateProductUI(products) {
    const productsContainer = document.querySelector('.shop-section');
    productsContainer.innerHTML = ''; // Clear current products

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products found</p>';
        return;
    }

    products.forEach((product) => {
        const productBox = document.createElement('div');
        productBox.className = 'box';

        productBox.innerHTML = `
            <div class="box-img" style="background-image: url('${product.image || 'placeholder.jpg'}');"></div>
            <div class="box-content">
                <p>${product.name}</p>
                <p>$${product.price.toFixed(2)}</p>
            </div>
        `;

        productsContainer.appendChild(productBox);
    });
}

// Handle login functionality
function handleLogin() {
    const emailInput = document.querySelector('.input-feild input[type="text"]');
    const passwordInput = document.querySelector('.input-feild input[type="password"]');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Invalid email or password');
            }
            return response.json();
        })
        .then((data) => {
            alert(data.message); // Notify the user
            console.log('Logged in user:', data.user);
        })
        .catch((error) => {
            console.error('Login error:', error);
            alert('Login failed: Invalid email or password');
        });
}
