/**
 * Milky Pro - Master Data & Catalog Engine
 * Contains products, services, coupons, reviews, and data helper functions.
 */

window.MilkyData = (function () {
    "use strict";

    const products = [
        {
            id: 1,
            name: "Pure Farm Fresh Whole Milk",
            category: "milk",
            categoryLabel: "Fresh Milk",
            price: 4.50,
            oldPrice: 6.00,
            unit: "1 Liter Bottle",
            img: "img/product-1.jpg",
            badge: "Best Seller",
            rating: 4.9,
            reviewsCount: 142,
            stock: 35,
            fatContent: "3.8% Full Cream",
            origin: "Green Valley Pastures - Barn 1",
            shortDesc: "100% pasture-grazed whole milk, gently pasteurized to lock in rich farm creaminess and essential vitamins.",
            description: "Our Pure Farm Fresh Whole Milk comes exclusively from our free-range Holstein-Friesian and Jersey cows grazing on clover-rich, pesticide-free green pastures. It undergoes minimal batch pasteurization to preserve the milk's wholesome flavor, natural enzymes, and creamy richness. Zero synthetic hormones, zero artificial additives.",
            nutrition: {
                calories: "148 kcal",
                fat: "8.0g",
                protein: "7.9g",
                calcium: "300mg",
                carbs: "11.5g"
            },
            ingredients: "100% Grade-A Whole Cow Milk, Vitamin D3.",
            freshnessDays: 10
        },
        {
            id: 2,
            name: "Prime Grass-Fed Organic Beef",
            category: "specials",
            categoryLabel: "Farm Specials",
            price: 18.50,
            oldPrice: 24.00,
            unit: "500g Vacuum Pack",
            img: "img/product-2.jpg",
            badge: "Organic",
            rating: 4.8,
            reviewsCount: 88,
            stock: 18,
            fatContent: "Lean 85/15",
            origin: "Highland Free-Range Range",
            shortDesc: "Tender, high-protein organic pasture beef cuts raised ethically with abundant sunlight and natural forage.",
            description: "Harvested from our ethically nurtured cattle roaming sunny hill pastures. Naturally rich in Omega-3 fatty acids, iron, and zinc. Vacuum-sealed at our cold-storage facility to guarantee peak freshness upon doorstep delivery.",
            nutrition: {
                calories: "250 kcal",
                fat: "15g",
                protein: "26g",
                iron: "3.2mg",
                carbs: "0g"
            },
            ingredients: "100% Organic Pasture-Raised Beef.",
            freshnessDays: 14
        },
        {
            id: 3,
            name: "Artisan Aged Farmhouse Cheddar",
            category: "cheese",
            categoryLabel: "Artisan Cheese",
            price: 9.75,
            oldPrice: 12.50,
            unit: "250g Block",
            img: "img/product-3.jpg",
            badge: "Award Winner",
            rating: 5.0,
            reviewsCount: 165,
            stock: 24,
            fatContent: "32% Fat",
            origin: "Cheddar Cave Batch #18",
            shortDesc: "Handcrafted farmstead cheddar slowly cave-aged for 18 months. Sharp, crumbly, and wonderfully complex.",
            description: "Crafted following century-old English farmhouse traditions. Curds are hand-milled, clothbound, and aged inside natural underground limestone caves. Possesses a delightful crystalline crunch, creamy butter undertones, and a sharp, memorable finish.",
            nutrition: {
                calories: "115 kcal",
                fat: "9.5g",
                protein: "7.1g",
                calcium: "205mg",
                carbs: "0.4g"
            },
            ingredients: "Cultured Unpasteurized Cow Milk, Natural Sea Salt, Vegetarian Rennet.",
            freshnessDays: 90
        },
        {
            id: 4,
            name: "Golden Sweet Churned Butter",
            category: "butter",
            categoryLabel: "Butter & Cream",
            price: 6.20,
            oldPrice: 8.00,
            unit: "250g Block",
            img: "img/product-4.jpg",
            badge: "Fresh Churned",
            rating: 4.9,
            reviewsCount: 110,
            stock: 40,
            fatContent: "82% Butterfat",
            origin: "Creamery Churning Unit A",
            shortDesc: "Rich European-style butter churned from spring meadow sweet cream with an intoxicating aroma.",
            description: "Our Golden Sweet Churned Butter is celebrated for its deep sunny hue and silky spreadability. With 82% pure butterfat, it provides incredible flakiness to pastries and an incomparable richness when melted on freshly toasted bread.",
            nutrition: {
                calories: "102 kcal",
                fat: "11.5g",
                protein: "0.1g",
                calcium: "3mg",
                carbs: "0.1g"
            },
            ingredients: "Pure Pasteurized Sweet Cream (Milk), Spring Water Salt (0.3%).",
            freshnessDays: 60
        },
        {
            id: 5,
            name: "Probiotic Greek-Style Yogurt",
            category: "yogurt",
            categoryLabel: "Yogurt & Cultured",
            price: 5.40,
            oldPrice: 7.00,
            unit: "500g Tub",
            img: "img/gallery-1.jpg",
            badge: "Live Cultures",
            rating: 4.8,
            reviewsCount: 76,
            stock: 30,
            fatContent: "5% Whole Milk",
            origin: "Artisan Fermentation Room 2",
            shortDesc: "Triple-strained velvety Greek yogurt brimming with active live gut-friendly probiotic cultures.",
            description: "Crafted from fresh whole milk and slowly strained through cotton cloths to remove excess whey, resulting in a dense, spoonable texture. Packed with 15g of natural protein per serving and zero thickeners, gums, or added sugars.",
            nutrition: {
                calories: "130 kcal",
                fat: "5.0g",
                protein: "15.0g",
                calcium: "250mg",
                carbs: "6.0g"
            },
            ingredients: "Grade-A Pasteurized Milk, Live Probiotic Cultures (L. Bulgaricus, S. Thermophilus, B. Lactis).",
            freshnessDays: 21
        },
        {
            id: 6,
            name: "Heavy Whipping Farmhouse Cream",
            category: "milk",
            categoryLabel: "Fresh Milk",
            price: 5.90,
            oldPrice: 7.50,
            unit: "500ml Bottle",
            img: "img/gallery-2.jpg",
            badge: "38% Cream",
            rating: 4.9,
            reviewsCount: 54,
            stock: 22,
            fatContent: "38% Milkfat",
            origin: "Farm Centrifuge Facility",
            shortDesc: "Unhomogenized luscious heavy cream that whips into billowy, stable clouds for baking and gourmet coffee.",
            description: "Separated fresh daily from morning milking batches. Thick enough to coat a spoon and completely free of carrageenan or stabilizers. Whips easily to stiff peaks in minutes or adds silky body to homemade soups and pasta sauces.",
            nutrition: {
                calories: "340 kcal",
                fat: "36.0g",
                protein: "2.8g",
                calcium: "65mg",
                carbs: "3.0g"
            },
            ingredients: "100% Fresh Sweet Cream (Milk).",
            freshnessDays: 14
        },
        {
            id: 7,
            name: "Free-Range Meadow Fresh Eggs",
            category: "specials",
            categoryLabel: "Farm Specials",
            price: 6.80,
            oldPrice: 8.50,
            unit: "12 Pack Carton",
            img: "img/gallery-3.jpg",
            badge: "Pasture Hen",
            rating: 4.9,
            reviewsCount: 130,
            stock: 50,
            fatContent: "5g Healthy Fat",
            origin: "Sunny Pasture Orchard",
            shortDesc: "Hand-gathered daily from free-roaming hens grazing open grassy orchards with deep amber yolks.",
            description: "Our hens roam outdoors across 10 acres of sunny herbal meadows every day. Fed non-GMO grains and natural foraging feeds, producing firm egg whites and rich, golden-orange yolks with exceptional baking performance.",
            nutrition: {
                calories: "72 kcal",
                fat: "5.0g",
                protein: "6.3g",
                calcium: "28mg",
                carbs: "0.4g"
            },
            ingredients: "100% Grade-A Pasture-Raised Chicken Eggs.",
            freshnessDays: 30
        },
        {
            id: 8,
            name: "Fresh Farmhouse Cottage Cheese",
            category: "cheese",
            categoryLabel: "Artisan Cheese",
            price: 5.50,
            oldPrice: 7.00,
            unit: "400g Tub",
            img: "img/gallery-4.jpg",
            badge: "High Protein",
            rating: 4.7,
            reviewsCount: 62,
            stock: 28,
            fatContent: "4% Small Curd",
            origin: "Dairy Vat #6",
            shortDesc: "Small-curd cottage cheese dressed in fresh sweet cream. Perfect for healthy snacks, bowls, and salads.",
            description: "Traditional small-curd cottage cheese with gentle salinity and tender curds bathed in fresh farm cream. Boasts 14g of slow-digesting micellar casein protein per serving, making it an ideal post-workout recovery breakfast.",
            nutrition: {
                calories: "105 kcal",
                fat: "4.0g",
                protein: "14.0g",
                calcium: "110mg",
                carbs: "3.5g"
            },
            ingredients: "Pasteurized Skim Milk, Cream, Sea Salt, Live Acidifying Cultures, Microbial Rennet.",
            freshnessDays: 18
        }
    ];

    const services = [
        {
            id: "animal-selection",
            name: "Best Animal Selection & Genetics",
            icon: "fa-paw",
            img: "img/service-1.jpg",
            shortDesc: "Expert livestock breed assessment, genetics consulting, and health profiling for dairy farmers.",
            fullDesc: "We provide comprehensive livestock breeding consultation, pedigree verification, and physical conformation evaluations. Whether you are expanding your herd or establishing a boutique dairy facility, our certified veterinary geneticists guide your herd optimization for maximum milk yield and long life.",
            duration: "2-4 Hours Onsite / Virtual",
            price: "Consultation from $150",
            features: [
                "Pedigree & Genetic Lineage Verification",
                "Herd Health & Disease Resistance Profiling",
                "Milk Fat & Protein Yield Optimization",
                "Comprehensive Breeding Blueprint"
            ]
        },
        {
            id: "breeding-veterinary",
            name: "Breeding & Veterinary Care",
            icon: "fa-stethoscope",
            img: "img/service-2.jpg",
            shortDesc: "Routine veterinary diagnostics, preventive vaccinations, nutrition plans, and 24/7 care.",
            fullDesc: "Our licensed veterinary staff provides round-the-clock livestock healthcare, nutritional balancing, fertility checks, and preventative medicine. We emphasize low-stress herd handling, natural preventative treatments, and pristine biometric monitoring.",
            duration: "Scheduled / 24/7 Emergency",
            price: "Monthly Packages from $220",
            features: [
                "Automated Biometric Health Telemetry",
                "Preventative Vaccination Schedules",
                "Custom Nutrition & Pasture Grazing Rations",
                "Certified Reproductive Management"
            ]
        },
        {
            id: "care-milking",
            name: "Hygienic Milking & Automation",
            icon: "fa-tint",
            img: "img/service-3.jpg",
            shortDesc: "Sanitary milk extraction systems, parlor automation calibration, and cold-chain sanitation.",
            fullDesc: "Optimizing milking systems is crucial for cow comfort and milk hygiene. We design, calibrate, and service robotic milking units, inline milk coolers, and teat-sanitation systems to ensure zero bacterial contamination and somatic cell compliance.",
            duration: "Site Audit & Setup",
            price: "Custom Project Quote",
            features: [
                "Clean-in-Place (CIP) Parlor Disinfection",
                "Pulsation & Vacuum Level Diagnostics",
                "Instant Bulk Tank Cold-Chain Cooling",
                "ISO 22000 Milk Safety Compliance"
            ]
        },
        {
            id: "farm-tours",
            name: "Educational Farm Tours & Milking Demos",
            icon: "fa-tractor",
            img: "img/banner-1.jpg",
            shortDesc: "Guided walking tours for families, schools, and tourists with hands-on butter churning and cow feeding.",
            fullDesc: "Step into our lush pastures! Experience firsthand how organic milk is produced, meet friendly dairy cows, feed newborn calves, try traditional butter churning, and savor freshly prepared artisanal cheeses under our rustic pergola.",
            duration: "1.5 - 2 Hours",
            price: "$15 per Adult / $8 Children",
            features: [
                "Guided Pasture & Barn Walking Tour",
                "Interactive Calf Bottle Feeding",
                "Hands-on Butter & Ice Cream Workshop",
                "Full Dairy Tasting Platter Included"
            ]
        },
        {
            id: "wholesale-supply",
            name: "Commercial & Cafe Bulk Supply",
            icon: "fa-truck",
            img: "img/banner-2.jpg",
            shortDesc: "Cold-chain wholesale delivery of premium barista milk, cheeses, and butter for cafes & culinary chefs.",
            fullDesc: "We supply renowned specialty coffee roasters, pastry kitchens, and five-star hotels with refrigerated daily deliveries. Our barista-specialty whole milk micro-foams to silky latte art perfection with consistent natural sweetness year-round.",
            duration: "Daily / Weekly Scheduled Delivery",
            price: "Volume Tiered Pricing",
            features: [
                "Refrigerated Temperature-Monitored Vans",
                "Custom Barista Whole & Skim Profiles",
                "Foodservice Butter Bricks & Wheels",
                "Dedicated B2B Account Manager"
            ]
        },
        {
            id: "milk-subscription",
            name: "Doorstep Milk Subscription Club",
            icon: "fa-calendar-check",
            img: "img/carousel-1.jpg",
            shortDesc: "Fresh morning glass-bottle milk deliveries straight to your home porch 2 or 3 times a week.",
            fullDesc: "Say goodbye to grocery store shelf milk. Receive fresh, cold-chain glass bottles delivered straight to your doorstep before 7:00 AM on Monday, Wednesday, and Friday. Swap returnable glass bottles sustainably!",
            duration: "Monthly Recurring",
            price: "From $35 / Month",
            features: [
                "Eco-Friendly Returnable Glass Bottles",
                "Morning Delivery Guaranteed Before 7:00 AM",
                "Pause or Modify Deliveries Anytime Online",
                "Includes Free Cooler Box on Sign-Up"
            ]
        }
    ];

    const coupons = {
        "MILKY10": { discountPercent: 10, minSpend: 10, desc: "10% Off Entire Order" },
        "FRESH20": { discountPercent: 20, minSpend: 25, desc: "20% Off Orders over $25" },
        "FREESHIP": { freeShipping: true, minSpend: 0, desc: "Free Cold-Chain Shipping" }
    };

    const initialTestimonials = [
        {
            id: 1,
            name: "Sarah Jenkins",
            role: "Pastry Chef & Bakery Owner",
            avatar: "img/testimonial-1.jpg",
            rating: 5,
            date: "September 15, 2026",
            text: "The golden sweet churned butter and heavy whipping cream from Milky have completely elevated our croissants and pastries. The natural 82% butterfat provides flakes that are simply unmatched. Our customers notice the difference immediately!",
            verified: true
        },
        {
            id: 2,
            name: "Michael Sterling",
            role: "Family Subscriber, New York",
            avatar: "img/testimonial-2.jpg",
            rating: 5,
            date: "September 8, 2026",
            text: "We switched to Milky's home milk subscription four months ago. Fresh glass bottles arrive on our porch by 6:30 AM without fail. My kids never used to drink milk, and now they ask for seconds every morning. Remarkable freshness!",
            verified: true
        },
        {
            id: 3,
            name: "Elena Rostova",
            role: "Artisan Fromager & Food Critic",
            avatar: "img/testimonial-3.jpg",
            rating: 5,
            date: "August 29, 2026",
            text: "Their 18-month cave-aged farmhouse cheddar has won blind tastings against international contenders. The balance of acidity, sharpness, and rich pasture notes shows deep respect for traditional cheesemaking.",
            verified: true
        },
        {
            id: 4,
            name: "David Chen",
            role: "Dairy Farm Entrepreneur",
            avatar: "img/testimonial-4.jpg",
            rating: 5,
            date: "August 12, 2026",
            text: "The veterinary genetics and milking parlor consultation provided by the Milky team transformed our farm operations. Our herd health indices improved by 35% in six months. Invaluable professional partnership.",
            verified: true
        }
    ];

    return {
        getProducts: function () {
            return products;
        },
        getProductById: function (id) {
            return products.find(p => p.id === parseInt(id, 10));
        },
        getProductsByCategory: function (category) {
            if (!category || category === "all") return products;
            return products.filter(p => p.category === category);
        },
        searchProducts: function (query) {
            if (!query) return [];
            const q = query.toLowerCase().trim();
            return products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.categoryLabel.toLowerCase().includes(q) ||
                p.shortDesc.toLowerCase().includes(q) ||
                p.ingredients.toLowerCase().includes(q)
            );
        },
        getServices: function () {
            return services;
        },
        getServiceById: function (id) {
            return services.find(s => s.id === id);
        },
        getCoupons: function () {
            return coupons;
        },
        getInitialTestimonials: function () {
            return initialTestimonials;
        }
    };
})();
