// --- Data (yours) ---
const clothingItems = [
  { id:1, title:"Professional Navy Blazer", description:"Classic navy blazer perfect for interviews and career fairs.", category:"outerwear", tags:["outerwear","blazers"], sizes:"XS, S, M, L, XL", colors:"Navy", available:true,  imageSrc:"../img/navy_blazer_image.jpg"},
  { id:2, title:"Black Dress Shoes", description:"Professional leather dress shoes in excellent condition.", category:"shoes", tags:["shoes","dress shoes"], sizes:"7, 8, 9, 10, 11", colors:"Black", available:true, imageSrc:"../img/black_shoes_image.jpg"},
  { id:3, title:"Charcoal Blazer", description:"Versatile charcoal blazer suitable for various professional settings.", category:"outerwear", tags:["outerwear","blazers"], sizes:"S, M, L, XL", colors:"Charcoal", available:false, imageSrc:"../img/charcoal_blazer_image.jpg"},
  { id:4, title:"Brown Oxford Shoes", description:"Classic brown oxford shoes for a sophisticated look.", category:"shoes", tags:["shoes","dress shoes"], sizes:"8, 9, 10, 11", colors:"Brown", available:true, imageSrc:"../img/brown_shoes_image.jpg"},
  { id:5, title:"White Button-Up Shirt", description:"Crisp white shirt, a wardrobe essential.", category:"shirts", tags:["shirts","tops"], sizes:"S, M, L", colors:"White", available:true, imageSrc:"../img/white_shirt_image.jpg"},
  { id:6, title:"Gray Slacks", description:"Comfortable and professional gray dress pants.", category:"bottoms", tags:["pants","slacks"], sizes:"30-38", colors:"Gray", available:true, imageSrc:"../img/gray_slacks_image.jpg"},
];

// --- DOM ---
const clothingGrid = document.getElementById('clothingGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const resultsCount = document.getElementById('resultsCount');

// --- Card template (availability pill matches screenshot) ---
function createCardHTML(item){
  const pillClass = item.available ? '' : 'unavailable-tag';
  const pillText  = item.available ? 'Available' : 'Unavailable';
  const bookLink  = item.available ? '<a href="/html/bookAppointment.html" class="book-appointment">Book Appointment</a>' : '';

  return `
    <div class="card">
      <div class="card-image-placeholder">
        <img src="${item.imageSrc}" alt="${item.title}">
        <span class="availability-tag ${pillClass}">${pillText}</span>
      </div>
      <h2 class="card-title">${item.title}</h2>
      <p class="card-description">${item.description}</p>

      <div class="tags">
        ${item.tags.map(t => `<span>${t}</span>`).join('')}
      </div>

      <div class="details">
        <p><strong>Sizes:</strong> ${item.sizes}</p>
        <p><strong>Colors:</strong> ${item.colors}</p>
      </div>

      ${bookLink}
    </div>
  `;
}

// --- Render + count line like screenshot ("Showing N of M items") ---
function renderClothingGrid(items){
  clothingGrid.innerHTML = items.map(createCardHTML).join('');
  resultsCount.textContent = `Showing ${items.length} of ${clothingItems.length} items`;
}

// --- Filters ---
function applyFilters(){
  const q   = (searchInput.value || '').toLowerCase();
  const cat = categoryFilter.value;
  const avail = availabilityFilter.value;

  const filtered = clothingItems.filter(it => {
    const matchesSearch =
      it.title.toLowerCase().includes(q) ||
      it.description.toLowerCase().includes(q) ||
      it.tags.some(t => t.toLowerCase().includes(q));

    const matchesCat = cat === 'all' || it.category === cat;

    let matchesAvail = true;
    if (avail === 'available') matchesAvail = it.available === true;
    if (avail === 'unavailable') matchesAvail = it.available === false;

    return matchesSearch && matchesCat && matchesAvail;
  });

  renderClothingGrid(filtered);
}

// --- Init (populate categories, wire events, initial render) ---
document.addEventListener('DOMContentLoaded', () => {
  const cats = [...new Set(clothingItems.map(i => i.category))].sort();
  cats.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c.charAt(0).toUpperCase() + c.slice(1);
    categoryFilter.appendChild(o);
  });

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  availabilityFilter.addEventListener('change', applyFilters);

  renderClothingGrid(clothingItems);
});
