// Product Database Mock
const productDatabase = {
    "oats": {
        name: "Whole Grain Rolled Oats",
        brand: "Organic Harvest",
        img: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
        grade: "A",
        score: 96,
        warning: false,
        warningText: "Clean product! No artificial preservatives or additives detected.",
        ingredients: [
            { name: "100% Organic Whole Grain Oats", status: "Natural / Clean" },
            { name: "Soluble Dietary Fiber", status: "Beneficial" }
        ],
        nutrition: {
            calories: "380 kcal",
            protein: "13.2 g",
            carbs: "67.5 g",
            fat: "6.8 g",
            sugar: "0.8 g",
            sodium: "4 mg"
        },
        swaps: [
            { name: "Steel Cut Organic Oats", benefit: "Higher fiber retention and lower glycemic index." }
        ]
    },
    "cola": {
        name: "Classic Sugary Cola",
        brand: "FizzCorp Beverages",
        img: "https://cdn-icons-png.flaticon.com/512/2474/2474490.png",
        grade: "E",
        score: 24,
        warning: true,
        warningText: "High refined sugar and artificial caramel color (E150d) linked to health concerns.",
        ingredients: [
            { name: "Carbonated Water", status: "Neutral" },
            { name: "High Fructose Corn Syrup", status: "High Sugar / Risky" },
            { name: "Caramel Color (E150d)", status: "Artificial Additive" },
            { name: "Phosphoric Acid", status: "Acidulant" },
            { name: "Caffeine", status: "Stimulant" }
        ],
        nutrition: {
            calories: "140 kcal",
            protein: "0 g",
            carbs: "39 g",
            fat: "0 g",
            sugar: "39 g",
            sodium: "45 mg"
        },
        swaps: [
            { name: "Sparkling Lemon Water", benefit: "Zero sugar, zero artificial additives, crisp refreshment." },
            { name: "Kombucha Tea", benefit: "Naturally fermented with probiotics and low sugar." }
        ]
    },
    "chips": {
        name: "Crispy Salted Potato Chips",
        brand: "CrunchySnacks Ltd.",
        img: "https://cdn-icons-png.flaticon.com/512/2553/2553642.png",
        grade: "D",
        score: 38,
        warning: true,
        warningText: "High in sodium and processed vegetable oils (Trans Fats).",
        ingredients: [
            { name: "Potatoes", status: "Natural" },
            { name: "Refined Palm Oil", status: "High Saturated Fat" },
            { name: "Iodized Salt", status: "High Sodium" },
            { name: "Flavor Enhancer (E621)", status: "MSG / Additive" }
        ],
        nutrition: {
            calories: "536 kcal",
            protein: "6.2 g",
            carbs: "52 g",
            fat: "34 g",
            sugar: "0.4 g",
            sodium: "580 mg"
        },
        swaps: [
            { name: "Baked Makhanas (Fox Nuts)", benefit: "Low calorie, high protein, and roasted without heavy oils." },
            { name: "Air-Popped Popcorn", benefit: "Whole grain snack with significantly lower fat content." }
        ]
    },
    "yogurt": {
        name: "Natural Greek Yogurt",
        brand: "DairyPure",
        img: "https://cdn-icons-png.flaticon.com/512/3050/3050190.png",
        grade: "A",
        score: 90,
        warning: false,
        warningText: "Excellent source of probiotics and high natural protein.",
        ingredients: [
            { name: "Pasteurized Skimmed Milk", status: "Natural" },
            { name: "Live & Active Bacterial Cultures", status: "Probiotic / Beneficial" }
        ],
        nutrition: {
            calories: "97 kcal",
            protein: "10 g",
            carbs: "4 g",
            fat: "4.5 g",
            sugar: "4 g",
            sodium: "40 mg"
        },
        swaps: [
            { name: "Plant-Based Almond Yogurt", benefit: "Dairy-free alternative with similar creamy texture." }
        ]
    }
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultContainer = document.getElementById('resultContainer');
const catalogGrid = document.getElementById('catalogGrid');

// Product UI Elements
const prodImg = document.getElementById('prodImg');
const prodGradeBadge = document.getElementById('prodGradeBadge');
const prodName = document.getElementById('prodName');
const prodBrand = document.getElementById('prodBrand');
const prodScore = document.getElementById('prodScore');
const scoreProgress = document.getElementById('scoreProgress');
const warningBox = document.getElementById('warningBox');
const warningText = document.getElementById('warningText');
const ingredientsList = document.getElementById('ingredientsList');
const nutritionGrid = document.getElementById('nutritionGrid');
const swapsList = document.getElementById('swapsList');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    setupEventListeners();
});

// Render Database Catalog
function renderCatalog() {
    catalogGrid.innerHTML = '';
    for (const [key, prod] of Object.entries(productDatabase)) {
        const card = document.createElement('div');
        card.className = 'catalog-card';
        card.innerHTML = `
            <img src="${prod.img}" alt="${prod.name}">
            <h4>${prod.name}</h4>
            <p class="brand-text">${prod.brand}</p>
            <div class="grade-badge grade-${prod.grade.toLowerCase()}" style="position:static; margin: 8px auto 0 auto;">${prod.grade}</div>
        `;
        card.addEventListener('click', () => {
            loadProduct(key);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        catalogGrid.appendChild(card);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Quick tag buttons
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productKey = btn.getAttribute('data-product');
            searchInput.value = btn.textContent;
            loadProduct(productKey);
        });
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            e.target.classList.add('active');
            const tabName = e.target.getAttribute('data-tab');
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
}

// Handle Search Input
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    // Simple keyword matching
    let foundKey = null;
    for (const key of Object.keys(productDatabase)) {
        if (query.includes(key) || productDatabase[key].name.toLowerCase().includes(query)) {
            foundKey = key;
            break;
        }
    }

    if (foundKey) {
        loadProduct(foundKey);
    } else {
        // Fallback default simulation for unknown items
        loadCustomProduct(query);
    }
}

// Load Product into View
function loadProduct(key) {
    const prod = productDatabase[key];
    if (!prod) return;

    prodImg.src = prod.img;
    prodName.textContent = prod.name;
    prodBrand.textContent = prod.brand;
    prodScore.textContent = prod.score;
    scoreProgress.style.width = `${prod.score}%`;

    // Grade Badge
    prodGradeBadge.textContent = prod.grade;
    prodGradeBadge.className = `grade-badge grade-${prod.grade.toLowerCase()}`;

    // Warning Box
    if (prod.warning) {
        warningBox.className = "warning-box";
        warningBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i><div><strong>Additive Alert:</strong> <span>${prod.warningText}</span></div>`;
    } else {
        warningBox.className = "warning-box clean";
        warningBox.innerHTML = `<i class="fa-solid fa-circle-check"></i><div><strong>Clean Choice:</strong> <span>${prod.warningText}</span></div>`;
    }

    // Ingredients List
    ingredientsList.innerHTML = '';
    prod.ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.className = 'ingredient-item';
        li.innerHTML = `<span>${ing.name}</span> <strong style="color:var(--text-muted);">${ing.status}</strong>`;
        ingredientsList.appendChild(li);
    });

    // Nutrition Grid
    nutritionGrid.innerHTML = '';
    for (const [nutKey, val] of Object.entries(prod.nutrition)) {
        const div = document.createElement('div');
        div.className = 'nutrition-card';
        div.innerHTML = `<h5>${nutKey.toUpperCase()}</h5><p>${val}</p>`;
        nutritionGrid.appendChild(div);
    }

    // Swaps List
    swapsList.innerHTML = '';
    prod.swaps.forEach(swap => {
        const div = document.createElement('div');
        div.className = 'swap-item';
        div.innerHTML = `
            <div class="swap-info">
                <h5><i class="fa-solid fa-arrow-trend-up"></i> ${swap.name}</h5>
                <p>${swap.benefit}</p>
            </div>
        `;
        swapsList.appendChild(div);
    });

    resultContainer.classList.remove('hidden');
}

// Fallback for custom searched items
function loadCustomProduct(query) {
    prodImg.src = "https://cdn-icons-png.flaticon.com/512/1046/1046784.png";
    prodName.textContent = query.charAt(0).toUpperCase() + query.slice(1);
    prodBrand.textContent = "Generic / Custom Scan";
    prodScore.textContent = "70";
    scoreProgress.style.width = "70%";

    prodGradeBadge.textContent = "C";
    prodGradeBadge.className = "grade-badge grade-c";

    warningBox.className = "warning-box";
    warningBox.innerHTML = `<i class="fa-solid fa-circle-info"></i><div><strong>AI Analysis:</strong> <span>Standard nutritional profile estimated based on similar packaged goods.</span></div>`;

    ingredientsList.innerHTML = `
        <li class="ingredient-item"><span>Primary Refined Ingredients</span> <strong style="color:var(--text-muted);">Standard</strong></li>
        <span class="brand-text" style="display:block; margin-top:8px;">Want to report an error or incorrect details? Use the WhatsApp support widget below!</span>
    `;

    nutritionGrid.innerHTML = `
        <div class="nutrition-card"><h5>CALORIES</h5><p>250 kcal</p></div>
        <div class="nutrition-card"><h5>PROTEIN</h5><p>5 g</p></div>
        <div class="nutrition-card"><h5>CARBS</h5><p>30 g</p></div>
        <div class="nutrition-card"><h5>FAT</h5><p>8 g</p></div>
    `;

    swapsList.innerHTML = `
        <div class="swap-item">
            <div class="swap-info">
                <h5><i class="fa-solid fa-arrow-trend-up"></i> Organic Alternative</h5>
                <p>Look for certified organic items with transparent ingredient lists.</p>
            </div>
        </div>
    `;

    resultContainer.classList.remove('hidden');
}