import { getCurrentFilters, showCards, lastUsedFilters } from './cards.js';

function showDeck() {
  const deckView = document.getElementById('deckView');
  if (!deckView) return;

  const deck = JSON.parse(localStorage.getItem('deck')) || [];
  const validCards = deck.filter(card => typeof card === 'object' && card.id);

  if (validCards.length === 0) {
    deckView.innerHTML = `<p class="error">No hay cartas en tu mazo aún.</p>`;
    return;
  }

  const deckHTML = validCards.map(card => `
    <div class="card-item deck-card" data-id="${card.id}">
      <img src="${card.img}" alt="${card.name}">
      <p><strong>${card.name}</strong></p>
      <button class="remove-from-deck">❌ Eliminar</button>
    </div>
  `).join('');

  deckView.innerHTML = `<div class="card-list deck-list">${deckHTML}</div>`;

  document.querySelectorAll('.remove-from-deck').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.parentElement.dataset.id);
      let deck = JSON.parse(localStorage.getItem('deck')) || [];
      deck = deck.filter(card => card.id !== id);
      localStorage.setItem('deck', JSON.stringify(deck));
      showDeck();
      showCards(lastUsedFilters);
    });
  });
}

const clearBtn = document.getElementById('clearFiltersBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    ['cardSearch', 'rarityFilter', 'alphaFilter', 'typeFilter', 'elixirFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    const clearedFilters = getCurrentFilters();
    showCards(clearedFilters);
  });
}

const viewDeckBtn = document.getElementById('viewDeckBtn');
if (viewDeckBtn) {
  viewDeckBtn.addEventListener('click', showDeck);
}

export { showDeck };
