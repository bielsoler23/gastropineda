document.addEventListener('DOMContentLoaded', () => {
  const SITE_BASE = 'https://bielsoler23.github.io/GastroPineda';
  const state = { cards: [] };

  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const clearButton = document.getElementById('clear-filters');

  const getSelectedValues = (type) =>
    Array.from(document.querySelectorAll(`.filter-checkbox[data-type="${type}"]:checked`))
      .map((el) => el.value);

  const render = (list) => window.cardsAPI.renderCards('cards-container', list);

  const filterResults = () => {
    const searchValue = (searchInput?.value || '').toLowerCase();
    const selectedTypes = getSelectedValues('tipus');
    const selectedPrices = getSelectedValues('preu');

    const filtered = state.cards.filter((card) => {
      const matchSearch =
        card.nom.toLowerCase().includes(searchValue) ||
        card.descripcio.toLowerCase().includes(searchValue);
      const matchType = selectedTypes.length === 0 || card.tipus.some((t) => selectedTypes.includes(t));
      const matchPrice = selectedPrices.length === 0 || selectedPrices.includes(card.preu);
      return matchSearch && matchType && matchPrice;
    });

    render(filtered);
  };

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  window.cardsAPI.fetchCards((data) => {
    state.cards = data;
    if (initialQuery) {
      filterResults();
    } else {
      render(data);
    }

    const itemList = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Restaurants a Pineda de Mar',
      itemListElement: (data || []).map((card, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Restaurant',
          name: card.nom,
          url: `${SITE_BASE}/details.html?slug=${card.slug}`
        }
      }))
    };

    const schemaScriptId = 'restaurants-itemlist-schema';
    const existingSchema = document.getElementById(schemaScriptId);
    const schemaScript = existingSchema || document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = schemaScriptId;
    schemaScript.textContent = JSON.stringify(itemList);
    if (!existingSchema) {
      document.head.appendChild(schemaScript);
    }
  });

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      filterResults();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterResults);
  }

  document.querySelectorAll('.filter-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', filterResults);
  });

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('.filter-checkbox').forEach((checkbox) => {
        checkbox.checked = false;
      });
      render(state.cards);
    });
  }
});
