import { showDeck } from './deck.js';
import { showCardDetails } from './modal.js';

// 🔠 Diccionarios
const rarityMap = {
  common: 'Común',
  rare: 'Rara',
  epic: 'Épica',
  legendary: 'Legendaria',
  champion: 'Campeón'
};

function inferCardType(name) {
  const nameLower = name.toLowerCase();

  const spells = [
    'arrows', 'zap', 'rocket', 'lightning', 'poison', 'fireball',
    'clone', 'rage', 'tornado',  'mirror',
    'the log', 'freeze', 'earthquake',
    'healing spell', 'wild goblins', 'giant snowball', 'void', 'goblin curse', 'vines'
    
  ];

  const buildings = [
    'cannon', 'mortar', 'inferno tower', 'bomb tower', 'tesla',
    'elixir collector', 'x-bow', 'tombstone', 
    'goblin hut', 'goblin drill', 'barbarian hut'
  ];

  if (spells.includes(nameLower)) return 'Hechizo';
  if (buildings.includes(nameLower)) return 'Estructura';
  return 'Tropa';
}

function getCurrentFilters() {
  return {
    searchTerm: document.getElementById('cardSearch').value.trim().toLowerCase(),
    rarity: document.getElementById('rarityFilter').value,
    alpha: document.getElementById('alphaFilter').value,
    type: document.getElementById('typeFilter')?.value || '',
    elixirValue: document.getElementById('elixirFilter').value
  };
}

let lastUsedFilters = getCurrentFilters();

async function showCards(filters = getCurrentFilters()) {
  lastUsedFilters = { ...filters };
  const resultBox = document.getElementById('result');
  const { searchTerm, rarity, alpha, type, elixirValue } = filters;
  resultBox.innerHTML = 'Cargando cartas...';

  try {
    const res = await fetch('/api/cards');
    const cards = await res.json();

    let deck = JSON.parse(localStorage.getItem('deck')) || [];
    deck = deck.filter(card => typeof card === 'object' && card.id);
    localStorage.setItem('deck', JSON.stringify(deck));

    const filtered = cards.filter(card => {
      const name = card.name.toLowerCase();
      const tipo = inferCardType(card.name);
      const nameMatch = name.includes(searchTerm);
      const rarityMatch = rarity ? card.rarity === rarity : true;
      const alphaMatch = alpha ? name.startsWith(alpha.toLowerCase()) : true;
      const typeMatch = type ? tipo === type : true;
      const elixirMatch = elixirValue
        ? elixirValue === "9"
          ? card.elixirCost >= 9
          : card.elixirCost === parseInt(elixirValue)
        : true;

      return nameMatch && rarityMatch && alphaMatch && typeMatch && elixirMatch;
    });

    const cardsHTML = filtered.length > 0
      ? filtered.map(card => {
          const imgUrl = card.iconUrls?.medium || '';
          const tipo = inferCardType(card.name);
          const rarezaTraducida = rarityMap[card.rarity.toLowerCase()] || card.rarity;
          const isInDeck = deck.some(c => c.id === card.id);

          return `
            <div class="card-item" data-name="${card.name}">
              <img src="${imgUrl}" alt="${card.name}">
              <p><strong>${card.name}</strong></p>
              <small>${rarezaTraducida} – ${tipo}</small>
              <button class="add-to-deck ${isInDeck ? 'added' : ''}" 
                data-id="${card.id}" 
                data-name="${card.name}" 
                data-img="${imgUrl}">
                ${isInDeck ? 'Agregado' : 'Agregar al mazo'}
              </button>
            </div>
          `;
        }).join('')
      : `<p class="error">No se encontraron cartas que coincidan con ese nombre, rareza, tipo, letra o elixir.</p>`;

    resultBox.innerHTML = `<div class="card-list">${cardsHTML}</div>`;

    document.querySelectorAll('.add-to-deck').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const name = btn.dataset.name;
        const img = btn.dataset.img;

        let deck = JSON.parse(localStorage.getItem('deck')) || [];
        const exists = deck.some(card => card.id === id);

        if (!exists) {
          deck.push({ id, name, img });
          localStorage.setItem('deck', JSON.stringify(deck));
          btn.textContent = '✅ Agregado';
          btn.classList.add('added');
          showDeck();
        }
      });
    });

    document.querySelectorAll('.card-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-deck')) return;
        const name = item.getAttribute('data-name');
        if (!name || name === 'null') return;
        showCardDetails(name);
      });
    });

  } catch (err) {
    console.error('Error al cargar cartas:', err);
    resultBox.innerHTML = `<p class="error">No se pudieron cargar las cartas</p>`;
  }
}

function populateAlphaFilter() {
  const alphaFilter = document.getElementById('alphaFilter');
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letters.forEach(letter => {
    const option = document.createElement('option');
    option.value = letter.toLowerCase();
    option.textContent = letter;
    alphaFilter.appendChild(option);
  });
}

const searchBtn = document.getElementById('searchCardsBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const filters = getCurrentFilters();
    showCards(filters);
  });
}

populateAlphaFilter();

export {
  showCards,
  inferCardType,
  rarityMap,
  getCurrentFilters,
  lastUsedFilters
};
