# Milky Pro - Organic Dairy Farm & E-Commerce Web Application 🥛🌱

A modern, responsive, and fully wired Pro Web Application for organic dairy farms, milk suppliers, and farm agro-tourism. Built on top of Bootstrap 5, vanilla JavaScript, and CSS3 with local state persistence.

---

## 🚀 Pro Features & Enhancements

This template has been upgraded from a basic static HTML template into a full-featured web application with complete frontend interactivity, state management, and end-to-end user flows.

### 🛒 1. Complete E-Commerce & Shopping Cart Engine
- **Slide-Out Offcanvas Cart Drawer**: Accessible from any page via the navbar basket icon with dynamic badge counter (`.cart-count`).
- **Cart Management**: Add to cart, quantity stepper (`+` / `-`), remove items, clear cart, dynamic line totals.
- **Free Cold-Chain Delivery Progress**: Visual progress bar calculating remaining threshold for free delivery ($30.00 goal).
- **Promo Coupon System**:
  - `MILKY10`: 10% discount on entire order.
  - `FRESH20`: 20% discount on orders over $25.00.
  - `FREESHIP`: Free shipping voucher.
- **Dedicated Full Cart Page (`cart.html`)**: Detailed table view with order summary, shipping calculator, and continue shopping controls.
- **Persistent Storage**: Cart data seamlessly persists in `localStorage` across page navigations.

### 💳 2. Streamlined Checkout & Invoice Receipts (`checkout.html`)
- **Delivery Information Form**: Contact details, delivery address, delivery time slot selection (e.g. *Morning 7:00 AM - 10:00 AM*), and driver notes.
- **Multi-Payment Method Selector**:
  - Credit / Debit Card (Card number, expiry, CVV validation).
  - Cash on Doorstep Delivery (COD).
  - Mobile Money / Digital Wallet (M-Pesa, MTN, Airtel).
- **Instant Printable Order Confirmation Receipt**: Generates a verified unique order reference (e.g. `MLK-84920`), logs timestamp, customer details, and items.
- Automatically saves placed orders into local order history.

### 🚚 3. Cold-Chain Delivery Tracking Portal (`order-tracking.html`)
- **Live 5-Stage Stepper Progress Timeline**:
  1. *Order Placed & Morning Harvest Scheduled*
  2. *Bottled & Chilled at Creamery*
  3. *Dispatched in Refrigerated Vehicle*
  4. *Out for Doorstep Delivery*
  5. *Delivered to Doorstep Cooler Box*
- **Real-Time Cold-Chain Telemetry**: Live cargo temperature readings (e.g. *3.4°C Safe Range*), assigned van ID, driver hotline, and delivery time estimates.
- Integrated demo order lookup (`MLK-84920`).

### 🔍 4. Interactive Live Search Modal
- Accessible via the search magnifying icon on every page or keyboard shortcut.
- Instant search filter querying dairy products and farm services simultaneously with live thumbnails, prices, and direct links.
- Quick search tag pills for rapid discovery.

### 🥛 5. Dedicated Product Showcase & Quick View (`product-detail.html`)
- **Product Quick-View Modal**: View specs, price, batch origin, and nutrition pills directly from product cards without leaving the page.
- **Dedicated Product Details Page**: High-resolution gallery, nutrition facts grid (Calories, Protein, Dairy Fat, Calcium), ingredients, allergen notices, customer review breakdown, and related products grid.

### 🚜 6. Farm Tour & Experience Booking Engine (`book-tour.html`)
- Interactive reservation for:
  - Guided Farm Pasture Walk & Calf Feeding
  - Artisanal Cheese & Butter Workshop
  - School & Educational Visits
  - Cattle Genetics & Veterinary Consultations
- Date picker, time slot, and party size selectors.
- Generates a verified Booking Pass Reference (`BK-XXXX`) with printable visitor ticket modal.

### 💬 7. Active AJAX Contact Form (`contact.html`)
- Fully active, responsive contact form replacing inactive placeholders.
- Inquiry department routing (*Customer Support*, *Wholesale & Cafe Supply*, *Tour Bookings*, *Veterinary Care*).
- Form validation with simulated AJAX submission, loading spinner, and success alert banner.
- Stores messages locally for farm administration review.

### 🌟 8. Customer Testimonials & Review Submission (`testimonial.html`)
- Diverse authentic customer stories with 5-star ratings and verified buyer tags.
- Interactive "Write a Review" modal with interactive star rating selector and real-time review publishing.

### 🖼️ 9. Interactive Gallery Filtering (`gallery.html`)
- Smooth category filter pills (*All*, *Pasture & Cows*, *Milking Facility*, *Artisan Products*) with lightbox viewing integration.

### 📊 10. Quality Comparison & FAQ (`feature.html`)
- Transparent comparison matrix (*Milky Farm Milk vs. Commercial Supermarket Milk*).
- Collapsible FAQ accordion answering customer questions on pasteurization, cow diets, bottle swapping, and wholesale supply.

### 🔔 11. Toast Notification Center
- Slide-in floating toasts for cart updates, wishlist additions, form submissions, and coupon applications.

---

## 📂 Project Structure

```
dairy-website-template/
├── css/
│   ├── bootstrap.min.css       # Bootstrap 5 framework
│   ├── style.css               # Core template stylesheet
│   └── pro-features.css        # Milky Pro feature enhancements
├── js/
│   ├── pro-data.js             # Catalog data, services, reviews, coupons
│   ├── pro-app.js              # Application core, cart, checkout, booking, search
│   └── main.js                 # Carousel, counter, wow.js initialization
├── img/                        # High-resolution dairy farm assets
├── lib/                        # Wow, OwlCarousel, Lightbox, CounterUp
├── index.html                  # Homepage with hero carousel, products, and services
├── about.html                  # About farm heritage and holistic agriculture
├── service.html                # 6 dairy services with booking & detail modals
├── product.html                # Full catalog with category pills, sorting, and search
├── product-detail.html         # Individual product showcase with nutrition grid
├── cart.html                   # Dedicated cart table with shipping calculator
├── checkout.html               # Doorstep checkout with payment selector & receipt
├── order-tracking.html         # Cold-chain order tracking with 5-stage timeline
├── book-tour.html              # Farm tour reservation engine & pass generator
├── gallery.html                # Filterable photo gallery with Lightbox
├── feature.html                # Quality standards, comparison table, and FAQ
├── team.html                   # Team members, qualifications, and careers inquiry
├── testimonial.html            # Verified reviews and review submission modal
└── 404.html                    # 404 page with in-page search and shop links
```

---

## 💻 How to Run Locally

You can run this project with any local web server:

### Python:
```bash
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

### VS Code:
Right click `index.html` and choose **"Open with Live Server"**.

### Direct File Open:
Double-click `index.html` in your browser. All features (LocalStorage, cart, search, modals) work seamlessly.

---

## 📜 License & Attribution

- Template design originally by [HTML Codex](https://htmlcodex.com).
- Released under **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.
- Pro features, JavaScript application architecture, and e-commerce workflows added for production readiness.
