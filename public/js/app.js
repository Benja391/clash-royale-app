import './player.js';
import { showCards } from './cards.js';
import { showDeck } from './deck.js';
import { showCardDetails } from './modal.js';
import './auth.js';
import './theme.js';

window.addEventListener('DOMContentLoaded', () => {
  showCards(); // ✅ carga las cartas automáticamente al abrir la app
});
