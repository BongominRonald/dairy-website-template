/**
 * Milky Pro - Application Core & Feature Integration
 * Coordinates Cart, Wishlist, Checkout, Tracking, Booking, Search, Reviews, and Contact Forms.
 */

window.MilkyApp = (function () {
    "use strict";

    const STORAGE_KEYS = {
        CART: "milky_cart_items",
        WISHLIST: "milky_wishlist_items",
        COUPON: "milky_applied_coupon",
        ORDERS: "milky_orders_history",
        BOOKINGS: "milky_tour_bookings",
        INQUIRIES: "milky_contact_inquiries",
        SUBSCRIBERS: "milky_newsletter_subs",
        REVIEWS: "milky_customer_reviews"
    };

    // State
    let cart = [];
    let wishlist = [];
    let appliedCoupon = null;

    // Load from LocalStorage
    function initStorage() {
        try {
            const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
            cart = storedCart ? JSON.parse(storedCart) : [];

            const storedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
            wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];

            const storedCoupon = localStorage.getItem(STORAGE_KEYS.COUPON);
            appliedCoupon = storedCoupon ? JSON.parse(storedCoupon) : null;
        } catch (e) {
            console.error("Storage initialization error", e);
            cart = [];
            wishlist = [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        } catch (e) {
            console.error("Failed to save cart", e);
        }
        updateBadges();
        renderCartDrawers();
        if (window.location.pathname.includes("cart.html")) {
            renderCartPage();
        }
        if (window.location.pathname.includes("checkout.html")) {
            renderCheckoutSummary();
        }
    }

    function saveWishlist() {
        try {
            localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
        } catch (e) {
            console.error("Failed to save wishlist", e);
        }
        updateBadges();
        renderWishlistDrawers();
        updateWishlistButtons();
    }

    // Toast Notification System
    function showToast(message, title = "Milky Farm", type = "success") {
        let container = document.getElementById("proToastContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "proToastContainer";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `pro-toast toast-${type}`;

        let icon = "bi-check-circle-fill text-success";
        if (type === "danger") icon = "bi-exclamation-octagon-fill text-danger";
        if (type === "warning") icon = "bi-exclamation-triangle-fill text-warning";
        if (type === "info") icon = "bi-info-circle-fill text-info";

        toast.innerHTML = `
            <div class="toast-icon"><i class="bi ${icon}"></i></div>
            <div class="toast-body-text">
                <strong class="d-block" style="font-size:0.95rem; color:#404A3D;">${title}</strong>
                <span>${message}</span>
            </div>
            <button type="button" class="toast-close" aria-label="Close">&times;</button>
        `;

        toast.querySelector(".toast-close").addEventListener("click", () => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(50px)";
            setTimeout(() => toast.remove(), 300);
        });

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = "0";
                toast.style.transform = "translateX(50px)";
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    // Cart Operations
    function addToCart(productId, quantity = 1, showFeedback = true) {
        const product = MilkyData.getProductById(productId);
        if (!product) return;

        const qty = parseInt(quantity, 10) || 1;
        const existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += qty;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                unit: product.unit,
                categoryLabel: product.categoryLabel,
                quantity: qty
            });
        }

        saveCart();

        if (showFeedback) {
            showToast(`${product.name} (x${qty}) added to your basket!`, "Added to Basket", "success");
            bumpCartBadge();
        }
    }

    function updateCartQuantity(productId, delta) {
        const item = cart.find(i => i.id === parseInt(productId, 10));
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId, false);
            showToast(`${item.name} removed from your basket.`, "Item Removed", "info");
        } else {
            saveCart();
        }
    }

    function removeFromCart(productId, notify = true) {
        const index = cart.findIndex(i => i.id === parseInt(productId, 10));
        if (index > -1) {
            const removed = cart.splice(index, 1)[0];
            saveCart();
            if (notify) {
                showToast(`${removed.name} removed from basket.`, "Item Removed", "info");
            }
        }
    }

    function clearCart() {
        cart = [];
        appliedCoupon = null;
        localStorage.removeItem(STORAGE_KEYS.COUPON);
        saveCart();
        showToast("Your shopping basket is now empty.", "Basket Cleared", "info");
    }

    function getCartTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discount = 0;
        let shipping = subtotal > 0 ? (subtotal >= 30.00 ? 0.00 : 5.00) : 0.00;

        if (appliedCoupon && MilkyData.getCoupons()[appliedCoupon]) {
            const couponInfo = MilkyData.getCoupons()[appliedCoupon];
            if (couponInfo.freeShipping) {
                shipping = 0.00;
            }
            if (couponInfo.discountPercent) {
                if (subtotal >= (couponInfo.minSpend || 0)) {
                    discount = (subtotal * couponInfo.discountPercent) / 100;
                }
            }
        }

        const tax = (subtotal - discount > 0) ? (subtotal - discount) * 0.05 : 0; // 5% agricultural sales tax
        const total = Math.max(0, subtotal - discount + shipping + tax);

        return {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            discount: discount.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            freeShippingThreshold: 30.00,
            freeShippingGap: Math.max(0, 30.00 - subtotal).toFixed(2),
            itemCount: cart.reduce((count, item) => count + item.quantity, 0)
        };
    }

    function applyCouponCode(code) {
        if (!code) return { success: false, message: "Please enter a valid coupon code." };
        const cleanCode = code.trim().toUpperCase();
        const couponData = MilkyData.getCoupons()[cleanCode];

        if (!couponData) {
            return { success: false, message: "Invalid promo code. Try MILKY10 or FRESH20." };
        }

        const totals = getCartTotals();
        if (couponData.minSpend && parseFloat(totals.subtotal) < couponData.minSpend) {
            return {
                success: false,
                message: `This coupon requires a minimum spend of $${couponData.minSpend.toFixed(2)}.`
            };
        }

        appliedCoupon = cleanCode;
        localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(appliedCoupon));
        saveCart();
        showToast(`Coupon ${cleanCode} applied successfully!`, "Discount Activated", "success");
        return { success: true, message: `Coupon ${cleanCode} applied: ${couponData.desc}` };
    }

    function removeCouponCode() {
        appliedCoupon = null;
        localStorage.removeItem(STORAGE_KEYS.COUPON);
        saveCart();
        showToast("Coupon removed.", "Coupon Removed", "info");
    }

    // Wishlist Operations
    function toggleWishlist(productId) {
        const id = parseInt(productId, 10);
        const product = MilkyData.getProductById(id);
        if (!product) return;

        const index = wishlist.indexOf(id);
        if (index > -1) {
            wishlist.splice(index, 1);
            showToast(`${product.name} removed from your favorites.`, "Favorites", "info");
        } else {
            wishlist.push(id);
            showToast(`${product.name} saved to your favorites!`, "Saved to Favorites", "success");
        }
        saveWishlist();
    }

    function isInWishlist(productId) {
        return wishlist.includes(parseInt(productId, 10));
    }

    // UI Updates
    function updateBadges() {
        const totals = getCartTotals();
        document.querySelectorAll(".cart-count").forEach(el => {
            el.textContent = totals.itemCount;
            el.style.display = totals.itemCount > 0 ? "inline-flex" : "none";
        });

        document.querySelectorAll(".wishlist-count").forEach(el => {
            el.textContent = wishlist.length;
            el.style.display = wishlist.length > 0 ? "inline-flex" : "none";
        });
    }

    function bumpCartBadge() {
        document.querySelectorAll(".cart-count").forEach(el => {
            el.classList.add("bump");
            setTimeout(() => el.classList.remove("bump"), 300);
        });
    }

    function updateWishlistButtons() {
        document.querySelectorAll("[data-wishlist-id]").forEach(btn => {
            const id = parseInt(btn.getAttribute("data-wishlist-id"), 10);
            if (isInWishlist(id)) {
                btn.classList.add("active");
                btn.setAttribute("title", "Remove from Favorites");
            } else {
                btn.classList.remove("active");
                btn.setAttribute("title", "Add to Favorites");
            }
        });
    }

    // Render Offcanvas Cart
    function renderCartDrawers() {
        const container = document.getElementById("offcanvasCartItems");
        if (!container) return;

        const totals = getCartTotals();
        const footer = document.getElementById("offcanvasCartFooter");

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-basket3 text-muted display-3 mb-3 d-block"></i>
                    <h5 class="text-dark">Your Basket is Empty</h5>
                    <p class="text-muted small">Explore our farm-fresh dairy products and treat your family to organic goodness.</p>
                    <a href="product.html" class="btn btn-secondary rounded-pill px-4 mt-2">Browse Dairy Products</a>
                </div>
            `;
            if (footer) footer.style.display = "none";
            return;
        }

        if (footer) footer.style.display = "block";

        let html = `
            <div class="free-shipping-progress">
                <div class="d-flex justify-content-between mb-1">
                    <span class="fw-semi-bold">${parseFloat(totals.freeShippingGap) <= 0 ? "🎉 Congratulations! You have Free Delivery!" : `Add $${totals.freeShippingGap} more for Free Cold-Chain Delivery`}</span>
                    <span>$30.00 Goal</span>
                </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${Math.min(100, (parseFloat(totals.subtotal) / 30) * 100)}%"></div>
                </div>
            </div>
            <div class="cart-items-wrapper">
        `;

        cart.forEach(item => {
            html += `
                <div class="cart-item-row">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="flex-grow-1">
                        <a href="product-detail.html?id=${item.id}" class="cart-item-title">${item.name}</a>
                        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} <small class="text-muted">($${item.price.toFixed(2)} / ${item.unit})</small></div>
                        <div class="mt-1 d-flex align-items-center gap-2">
                            <div class="qty-control">
                                <button type="button" class="qty-btn" onclick="MilkyApp.updateCartQuantity(${item.id}, -1)">-</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button type="button" class="qty-btn" onclick="MilkyApp.updateCartQuantity(${item.id}, 1)">+</button>
                            </div>
                            <button type="button" class="btn btn-link text-danger p-0 ms-auto small" onclick="MilkyApp.removeFromCart(${item.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;

        // Update totals in footer
        const subtotalEl = document.getElementById("drawerSubtotal");
        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal}`;

        const totalEl = document.getElementById("drawerTotal");
        if (totalEl) totalEl.textContent = `$${totals.total}`;
    }

    // Render Offcanvas Wishlist
    function renderWishlistDrawers() {
        const container = document.getElementById("offcanvasWishlistItems");
        if (!container) return;

        if (wishlist.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-heart text-muted display-3 mb-3 d-block"></i>
                    <h5 class="text-dark">No Favorites Saved</h5>
                    <p class="text-muted small">Save items you love so you can easily order them whenever you're ready.</p>
                    <a href="product.html" class="btn btn-primary rounded-pill px-4 mt-2">Explore Products</a>
                </div>
            `;
            return;
        }

        let html = `<div class="wishlist-items-wrapper">`;
        wishlist.forEach(id => {
            const product = MilkyData.getProductById(id);
            if (!product) return;

            html += `
                <div class="cart-item-row">
                    <img src="${product.img}" alt="${product.name}" class="cart-item-img">
                    <div class="flex-grow-1">
                        <a href="product-detail.html?id=${product.id}" class="cart-item-title">${product.name}</a>
                        <div class="cart-item-price">$${product.price.toFixed(2)} <span class="text-muted small">/ ${product.unit}</span></div>
                        <div class="mt-2 d-flex gap-2">
                            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3 py-1" onclick="MilkyApp.addToCart(${product.id}, 1); MilkyApp.toggleWishlist(${product.id});">
                                <i class="bi bi-cart-plus me-1"></i> Move to Basket
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger rounded-circle p-1" style="width:28px;height:28px;" onclick="MilkyApp.toggleWishlist(${product.id})">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;
    }

    // Quick View Modal
    function openQuickView(productId) {
        const product = MilkyData.getProductById(productId);
        if (!product) return;

        const modalEl = document.getElementById("quickViewModal");
        if (!modalEl) return;

        document.getElementById("qvImage").src = product.img;
        document.getElementById("qvTitle").textContent = product.name;
        document.getElementById("qvCategory").textContent = product.categoryLabel;
        document.getElementById("qvPrice").textContent = `$${product.price.toFixed(2)}`;
        document.getElementById("qvOldPrice").textContent = `$${product.oldPrice.toFixed(2)}`;
        document.getElementById("qvUnit").textContent = `(${product.unit})`;
        document.getElementById("qvOrigin").textContent = product.origin;
        document.getElementById("qvDescription").textContent = product.description;
        document.getElementById("qvIngredients").textContent = product.ingredients;

        // Nutrition Pills
        const nutContainer = document.getElementById("qvNutrition");
        if (nutContainer && product.nutrition) {
            nutContainer.innerHTML = `
                <div class="nutrition-pill">
                    <span class="nutrient-val">${product.nutrition.calories}</span>
                    <span class="nutrient-lbl">Calories</span>
                </div>
                <div class="nutrition-pill">
                    <span class="nutrient-val">${product.nutrition.protein}</span>
                    <span class="nutrient-lbl">Protein</span>
                </div>
                <div class="nutrition-pill">
                    <span class="nutrient-val">${product.nutrition.fat}</span>
                    <span class="nutrient-lbl">Dairy Fat</span>
                </div>
                <div class="nutrition-pill">
                    <span class="nutrient-val">${product.nutrition.calcium}</span>
                    <span class="nutrient-lbl">Calcium</span>
                </div>
            `;
        }

        // Stepper & Add to cart button
        const qtyInput = document.getElementById("qvQty");
        if (qtyInput) qtyInput.value = 1;

        const addBtn = document.getElementById("qvAddToCartBtn");
        if (addBtn) {
            addBtn.onclick = function () {
                const count = parseInt(qtyInput ? qtyInput.value : 1, 10);
                addToCart(product.id, count);
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
            };
        }

        const favBtn = document.getElementById("qvWishlistBtn");
        if (favBtn) {
            favBtn.setAttribute("data-wishlist-id", product.id);
            favBtn.onclick = function () {
                toggleWishlist(product.id);
                updateWishlistButtons();
            };
        }
        updateWishlistButtons();

        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    // Live Search Overlay
    function openSearchModal() {
        const overlay = document.getElementById("proSearchModal");
        if (!overlay) return;
        overlay.classList.add("show");
        const input = document.getElementById("proSearchInput");
        if (input) {
            input.value = "";
            input.focus();
            renderSearchResults("");
        }
    }

    function closeSearchModal() {
        const overlay = document.getElementById("proSearchModal");
        if (overlay) overlay.classList.remove("show");
    }

    function renderSearchResults(query) {
        const resultsBox = document.getElementById("proSearchResults");
        if (!resultsBox) return;

        if (!query || query.trim().length === 0) {
            resultsBox.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="bi bi-search fs-2 d-block mb-2 text-primary"></i>
                    <p class="mb-0">Type any keyword (e.g. <em>milk, cheese, yogurt, tour, butter</em>) to search products & services.</p>
                </div>
            `;
            return;
        }

        const matches = MilkyData.searchProducts(query);
        const serviceMatches = MilkyData.getServices().filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.shortDesc.toLowerCase().includes(query.toLowerCase())
        );

        if (matches.length === 0 && serviceMatches.length === 0) {
            resultsBox.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <p class="mb-1">No farm products or services found for "<strong>${query}</strong>".</p>
                    <small>Try searching for "whole milk", "cheddar", "butter", or "farm tour".</small>
                </div>
            `;
            return;
        }

        let html = ``;

        if (matches.length > 0) {
            html += `<h6 class="text-uppercase text-muted fs-7 mb-2 px-2">Dairy Products (${matches.length})</h6>`;
            matches.forEach(item => {
                html += `
                    <div class="search-result-item d-flex align-items-center justify-content-between">
                        <a href="product-detail.html?id=${item.id}" class="d-flex align-items-center text-decoration-none text-dark flex-grow-1" onclick="MilkyApp.closeSearchModal()">
                            <img src="${item.img}" alt="${item.name}">
                            <div class="ms-3">
                                <h6 class="mb-0 fs-6">${item.name}</h6>
                                <small class="text-primary fw-bold">$${item.price.toFixed(2)}</small>
                                <span class="badge bg-light text-dark ms-2">${item.categoryLabel}</span>
                            </div>
                        </a>
                        <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3 py-1 ms-2" onclick="MilkyApp.addToCart(${item.id}, 1); MilkyApp.closeSearchModal();">
                            <i class="bi bi-cart-plus me-1"></i> Add
                        </button>
                    </div>
                `;
            });
        }

        if (serviceMatches.length > 0) {
            html += `<h6 class="text-uppercase text-muted fs-7 mt-3 mb-2 px-2">Farm Services (${serviceMatches.length})</h6>`;
            serviceMatches.forEach(svc => {
                html += `
                    <div class="search-result-item d-flex align-items-center justify-content-between">
                        <a href="service.html" class="d-flex align-items-center text-decoration-none text-dark flex-grow-1" onclick="MilkyApp.closeSearchModal()">
                            <div class="btn-square bg-primary text-white rounded-circle me-3"><i class="fa ${svc.icon}"></i></div>
                            <div>
                                <h6 class="mb-0 fs-6">${svc.name}</h6>
                                <small class="text-muted">${svc.duration} &bull; ${svc.price}</small>
                            </div>
                        </a>
                        <a href="book-tour.html?service=${svc.id}" class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 ms-2" onclick="MilkyApp.closeSearchModal()">Book</a>
                    </div>
                `;
            });
        }

        resultsBox.innerHTML = html;
    }

    // Render Full Cart Page (cart.html)
    function renderCartPage() {
        const tableBody = document.getElementById("cartPageTableBody");
        const summaryCard = document.getElementById("cartPageSummary");
        if (!tableBody) return;

        const totals = getCartTotals();

        if (cart.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-5">
                        <i class="bi bi-cart-x display-4 text-muted d-block mb-3"></i>
                        <h5>Your Shopping Basket is Empty</h5>
                        <p class="text-muted">You haven't added any delicious dairy products yet.</p>
                        <a href="product.html" class="btn btn-secondary rounded-pill px-4 mt-2">Return to Shop</a>
                    </td>
                </tr>
            `;
            if (summaryCard) summaryCard.style.display = "none";
            return;
        }

        if (summaryCard) summaryCard.style.display = "block";

        let rows = "";
        cart.forEach(item => {
            const lineTotal = (item.price * item.quantity).toFixed(2);
            rows += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.img}" alt="${item.name}" class="rounded me-3" style="width: 70px; height: 70px; object-fit: cover;">
                            <div>
                                <a href="product-detail.html?id=${item.id}" class="fw-bold text-dark text-decoration-none d-block">${item.name}</a>
                                <small class="text-muted">${item.categoryLabel} &bull; ${item.unit}</small>
                            </div>
                        </div>
                    </td>
                    <td class="align-middle fw-semi-bold">$${item.price.toFixed(2)}</td>
                    <td class="align-middle">
                        <div class="qty-control">
                            <button type="button" class="qty-btn" onclick="MilkyApp.updateCartQuantity(${item.id}, -1)">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button type="button" class="qty-btn" onclick="MilkyApp.updateCartQuantity(${item.id}, 1)">+</button>
                        </div>
                    </td>
                    <td class="align-middle fw-bold text-primary">$${lineTotal}</td>
                    <td class="align-middle text-end">
                        <button type="button" class="btn btn-outline-danger btn-sm rounded-circle" onclick="MilkyApp.removeFromCart(${item.id})" title="Remove item">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = rows;

        // Update Summary Card
        document.getElementById("cpSubtotal").textContent = `$${totals.subtotal}`;
        document.getElementById("cpShipping").textContent = parseFloat(totals.shipping) === 0 ? "FREE" : `$${totals.shipping}`;
        document.getElementById("cpTax").textContent = `$${totals.tax}`;
        document.getElementById("cpTotal").textContent = `$${totals.total}`;

        const discountRow = document.getElementById("cpDiscountRow");
        if (discountRow) {
            if (parseFloat(totals.discount) > 0) {
                discountRow.style.display = "flex";
                document.getElementById("cpDiscount").textContent = `-$${totals.discount} (${appliedCoupon})`;
            } else {
                discountRow.style.display = "none";
            }
        }
    }

    // Render Checkout Page (checkout.html)
    function renderCheckoutSummary() {
        const listContainer = document.getElementById("checkoutItemsList");
        if (!listContainer) return;

        const totals = getCartTotals();
        if (cart.length === 0) {
            listContainer.innerHTML = `
                <div class="alert alert-warning">
                    Your cart is empty. Please <a href="product.html" class="alert-link">add dairy items</a> before checking out.
                </div>
            `;
            const submitBtn = document.getElementById("placeOrderBtn");
            if (submitBtn) submitBtn.disabled = true;
            return;
        }

        let html = "";
        cart.forEach(item => {
            html += `
                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                        <h6 class="my-0">${item.name} <small class="text-muted">x${item.quantity}</small></h6>
                        <small class="text-muted">${item.unit}</small>
                    </div>
                    <span class="text-primary fw-semi-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });
        listContainer.innerHTML = html;

        document.getElementById("coSubtotal").textContent = `$${totals.subtotal}`;
        document.getElementById("coShipping").textContent = parseFloat(totals.shipping) === 0 ? "FREE" : `$${totals.shipping}`;
        document.getElementById("coTax").textContent = `$${totals.tax}`;
        document.getElementById("coTotal").textContent = `$${totals.total}`;

        const discountRow = document.getElementById("coDiscountRow");
        if (discountRow) {
            if (parseFloat(totals.discount) > 0) {
                discountRow.style.display = "flex";
                document.getElementById("coDiscount").textContent = `-$${totals.discount}`;
            } else {
                discountRow.style.display = "none";
            }
        }
    }

    // Place Order Handler
    function handlePlaceOrder(formEl) {
        if (!formEl.checkValidity()) {
            formEl.reportValidity();
            return;
        }

        if (cart.length === 0) {
            showToast("Your basket is empty. Please add items first.", "Cart Empty", "danger");
            return;
        }

        const totals = getCartTotals();
        const formData = new FormData(formEl);

        const orderId = "MLK-" + Math.floor(100000 + Math.random() * 900000);
        const orderRecord = {
            orderId: orderId,
            createdAt: new Date().toISOString(),
            dateFormatted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
            customer: {
                firstName: formData.get("firstName"),
                lastName: formData.get("lastName"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                address: formData.get("address"),
                city: formData.get("city"),
                notes: formData.get("notes") || "None",
                deliverySlot: formData.get("deliverySlot") || "Morning 7:00 AM - 10:00 AM"
            },
            paymentMethod: formData.get("paymentMethod") || "Credit / Debit Card",
            items: [...cart],
            totals: totals,
            status: "Processing & Farm Packing",
            trackingStep: 2,
            temperatureLog: "3.8°C Cold-Chain Certified"
        };

        // Save order to history
        try {
            const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
            orders.unshift(orderRecord);
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        } catch (e) {
            console.error(e);
        }

        // Clear cart
        cart = [];
        appliedCoupon = null;
        localStorage.removeItem(STORAGE_KEYS.CART);
        localStorage.removeItem(STORAGE_KEYS.COUPON);
        updateBadges();

        // Render Receipt Modal
        renderOrderReceipt(orderRecord);
    }

    function renderOrderReceipt(order) {
        let modalEl = document.getElementById("orderConfirmationModal");
        if (!modalEl) {
            window.location.href = `order-tracking.html?orderId=${order.orderId}`;
            return;
        }

        document.getElementById("rcptOrderId").textContent = order.orderId;
        document.getElementById("rcptDate").textContent = order.dateFormatted;
        document.getElementById("rcptName").textContent = `${order.customer.firstName} ${order.customer.lastName}`;
        document.getElementById("rcptAddress").textContent = `${order.customer.address}, ${order.customer.city}`;
        document.getElementById("rcptSlot").textContent = order.customer.deliverySlot;
        document.getElementById("rcptPayment").textContent = order.paymentMethod;
        document.getElementById("rcptTotal").textContent = `$${order.totals.total}`;

        const itemsBox = document.getElementById("rcptItems");
        if (itemsBox) {
            let h = "";
            order.items.forEach(it => {
                h += `
                    <li class="list-group-item d-flex justify-content-between align-items-center py-2 px-0">
                        <span>${it.name} (x${it.quantity})</span>
                        <span class="fw-semi-bold">$${(it.price * it.quantity).toFixed(2)}</span>
                    </li>
                `;
            });
            itemsBox.innerHTML = h;
        }

        const trackLink = document.getElementById("rcptTrackLink");
        if (trackLink) {
            trackLink.href = `order-tracking.html?orderId=${order.orderId}`;
        }

        const bsModal = new bootstrap.Modal(modalEl, { backdrop: "static" });
        bsModal.show();
    }

    // Order Tracking Logic
    function trackOrder(orderIdInput) {
        if (!orderIdInput) return null;
        const cleanId = orderIdInput.trim().toUpperCase();

        try {
            const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
            const found = orders.find(o => o.orderId.toUpperCase() === cleanId);
            if (found) return found;
        } catch (e) {
            console.error(e);
        }

        // Demo sample order fallback if user tests with default demo ID
        if (cleanId === "MLK-84920" || cleanId.startsWith("MLK-")) {
            return {
                orderId: cleanId,
                createdAt: new Date().toISOString(),
                dateFormatted: "Today, Morning Batch",
                customer: {
                    firstName: "Ronald",
                    lastName: "Bongomin",
                    email: "abonga029@gmail.com",
                    phone: "+012 345 6789",
                    address: "742 Evergreen Meadow Way",
                    city: "Dairy Valley",
                    deliverySlot: "Morning Cold-Chain (7:00 AM - 10:00 AM)"
                },
                paymentMethod: "Card Ending in •••• 4242",
                items: [
                    { name: "Pure Farm Fresh Whole Milk", quantity: 3, price: 4.50, unit: "1 Liter" },
                    { name: "Artisan Aged Farmhouse Cheddar", quantity: 1, price: 9.75, unit: "250g" },
                    { name: "Golden Sweet Churned Butter", quantity: 2, price: 6.20, unit: "250g" }
                ],
                totals: { subtotal: "35.65", shipping: "0.00", discount: "0.00", tax: "1.78", total: "37.43" },
                status: "Out for Doorstep Delivery",
                trackingStep: 4,
                temperatureLog: "3.4°C Cold-Chain Verified (Insulated Van #04)"
            };
        }

        return null;
    }

    // Farm Tour & Service Booking Handler
    function handleBookingSubmit(formEl) {
        if (!formEl.checkValidity()) {
            formEl.reportValidity();
            return false;
        }

        const formData = new FormData(formEl);
        const bookingId = "BK-" + Math.floor(1000 + Math.random() * 9000);

        const booking = {
            id: bookingId,
            service: formData.get("serviceType") || "Farm Tour & Milking Experience",
            date: formData.get("bookingDate"),
            timeSlot: formData.get("timeSlot") || "10:00 AM - 12:00 PM",
            guests: formData.get("guests") || "2 Adults",
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            notes: formData.get("notes") || "None",
            createdAt: new Date().toISOString()
        };

        try {
            const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || "[]");
            bookings.unshift(booking);
            localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        } catch (e) {
            console.error(e);
        }

        // Show confirmation
        const resultModal = document.getElementById("bookingResultModal");
        if (resultModal) {
            document.getElementById("bkResId").textContent = booking.id;
            document.getElementById("bkResService").textContent = booking.service;
            document.getElementById("bkResDate").textContent = `${booking.date} at ${booking.timeSlot}`;
            document.getElementById("bkResGuests").textContent = `${booking.guests} (Lead: ${booking.name})`;

            const bsModal = new bootstrap.Modal(resultModal);
            bsModal.show();
        } else {
            showToast(`Farm booking confirmed! Pass #${booking.id} sent to ${booking.email}`, "Booking Confirmed", "success");
        }

        formEl.reset();
        return false;
    }

    // Contact Form AJAX Handler
    function handleContactSubmit(formEl) {
        if (!formEl.checkValidity()) {
            formEl.reportValidity();
            return false;
        }

        const submitBtn = formEl.querySelector("button[type='submit']");
        const originalText = submitBtn ? submitBtn.innerHTML : "Send Message";

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Sending Message...`;
        }

        const formData = new FormData(formEl);
        const inquiry = {
            id: "INQ-" + Date.now(),
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone") || "N/A",
            department: formData.get("department") || "General Inquiries",
            subject: formData.get("subject"),
            message: formData.get("message"),
            submittedAt: new Date().toISOString()
        };

        setTimeout(() => {
            try {
                const inqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || "[]");
                inqs.unshift(inquiry);
                localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inqs));
            } catch (e) {
                console.error(e);
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }

            formEl.reset();

            showToast("Thank you! Your message has been sent to our farm management team. We will get back to you shortly.", "Inquiry Dispatched", "success");

            const alertBox = document.getElementById("contactSuccessAlert");
            if (alertBox) {
                alertBox.classList.remove("d-none");
                setTimeout(() => alertBox.classList.add("d-none"), 6000);
            }
        }, 800);

        return false;
    }

    // Newsletter Subscribe Handler
    function handleNewsletterSubmit(formEl) {
        const input = formEl.querySelector("input[type='email']") || formEl.querySelector("input[type='text']");
        if (!input || !input.value.trim()) {
            showToast("Please enter a valid email address.", "Newsletter", "warning");
            return false;
        }

        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Please enter a legitimate email address format.", "Invalid Email", "danger");
            return false;
        }

        try {
            const subs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS) || "[]");
            if (!subs.includes(email)) {
                subs.push(email);
                localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subs));
            }
        } catch (e) {
            console.error(e);
        }

        input.value = "";
        showToast("Welcome to the Milky Farm Community! Use coupon 'FRESH20' for 20% off your first delivery.", "Subscribed!", "success");
        return false;
    }

    // Review Submission
    function handleReviewSubmit(formEl) {
        if (!formEl.checkValidity()) {
            formEl.reportValidity();
            return false;
        }

        const formData = new FormData(formEl);
        const rating = parseInt(formData.get("rating") || "5", 10);
        const newReview = {
            id: Date.now(),
            name: formData.get("name"),
            role: formData.get("role") || "Verified Dairy Customer",
            rating: rating,
            date: "Just now",
            text: formData.get("reviewText"),
            avatar: "img/testimonial-1.jpg",
            verified: true
        };

        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || "[]");
            stored.unshift(newReview);
            localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(stored));
        } catch (e) {
            console.error(e);
        }

        showToast("Thank you for sharing your experience! Your review has been published.", "Review Submitted", "success");

        const modalEl = document.getElementById("leaveReviewModal");
        if (modalEl) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) bsModal.hide();
        }

        formEl.reset();

        // Refresh testimonials if on testimonial.html
        if (typeof renderCustomerReviewsList === "function") {
            renderCustomerReviewsList();
        }

        return false;
    }

    // Initialize On DOM Ready
    function init() {
        initStorage();
        updateBadges();
        renderCartDrawers();
        renderWishlistDrawers();
        updateWishlistButtons();

        // Wire Search Overlay
        document.querySelectorAll("[data-action='open-search']").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                openSearchModal();
            });
        });

        const searchClose = document.getElementById("closeSearchModalBtn");
        if (searchClose) searchClose.addEventListener("click", closeSearchModal);

        const searchInput = document.getElementById("proSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", e => {
                renderSearchResults(e.target.value);
            });
        }

        // Close search on Escape
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") closeSearchModal();
        });

        // Wire Cart Drawer Triggers
        document.querySelectorAll("[data-action='open-cart']").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                const cartDrawerEl = document.getElementById("offcanvasCart");
                if (cartDrawerEl) {
                    const bsOffcanvas = new bootstrap.Offcanvas(cartDrawerEl);
                    bsOffcanvas.show();
                }
            });
        });

        // Wire Wishlist Drawer Triggers
        document.querySelectorAll("[data-action='open-wishlist']").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                const wlDrawerEl = document.getElementById("offcanvasWishlist");
                if (wlDrawerEl) {
                    const bsOffcanvas = new bootstrap.Offcanvas(wlDrawerEl);
                    bsOffcanvas.show();
                }
            });
        });

        // Wire Newsletter Forms
        document.querySelectorAll(".newsletter-form").forEach(form => {
            form.addEventListener("submit", e => {
                e.preventDefault();
                handleNewsletterSubmit(form);
            });
        });

        // Auto-seed initial demo sample order if none exists
        try {
            const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
            if (orders.length === 0) {
                orders.push({
                    orderId: "MLK-84920",
                    createdAt: new Date().toISOString(),
                    dateFormatted: "Yesterday",
                    customer: {
                        firstName: "Ronald",
                        lastName: "Bongomin",
                        email: "abonga029@gmail.com",
                        phone: "+012 345 6789",
                        address: "742 Evergreen Meadow Way",
                        city: "Dairy Valley",
                        deliverySlot: "Morning Cold-Chain (7:00 AM - 10:00 AM)"
                    },
                    paymentMethod: "Credit Card (•••• 4242)",
                    items: [
                        { id: 1, name: "Pure Farm Fresh Whole Milk", quantity: 2, price: 4.50, unit: "1 Liter Bottle", img: "img/product-1.jpg" },
                        { id: 3, name: "Artisan Aged Farmhouse Cheddar", quantity: 1, price: 9.75, unit: "250g Block", img: "img/product-3.jpg" }
                    ],
                    totals: { subtotal: "18.75", shipping: "5.00", discount: "0.00", tax: "0.94", total: "24.69", itemCount: 3 },
                    status: "Out for Doorstep Delivery",
                    trackingStep: 4,
                    temperatureLog: "3.4°C Cold-Chain Inspected"
                });
                localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    return {
        addToCart: addToCart,
        updateCartQuantity: updateCartQuantity,
        removeFromCart: removeFromCart,
        clearCart: clearCart,
        getCartTotals: getCartTotals,
        applyCouponCode: applyCouponCode,
        removeCouponCode: removeCouponCode,
        toggleWishlist: toggleWishlist,
        isInWishlist: isInWishlist,
        openQuickView: openQuickView,
        openSearchModal: openSearchModal,
        closeSearchModal: closeSearchModal,
        showToast: showToast,
        renderCartPage: renderCartPage,
        renderCheckoutSummary: renderCheckoutSummary,
        handlePlaceOrder: handlePlaceOrder,
        trackOrder: trackOrder,
        handleBookingSubmit: handleBookingSubmit,
        handleContactSubmit: handleContactSubmit,
        handleNewsletterSubmit: handleNewsletterSubmit,
        handleReviewSubmit: handleReviewSubmit
    };
})();
