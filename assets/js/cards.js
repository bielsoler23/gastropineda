const fetchCards = (cb) => {
  fetch('data/cards.json')
    .then((r) => r.json())
    .then(cb)
    .catch(() => cb([]));
};

const renderCards = (containerId, cards) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!cards || cards.length === 0) {
    container.innerHTML = '<p>Cap resultat.</p>';
    return;
  }

  container.innerHTML = cards
    .map((r) => `
      <article class="card" data-id="${r.id}">
        <a href="details.html?slug=${r.slug}" aria-label="${r.nom}">
          <img src="${r.imatge}" alt="${r.nom}">
          <div class="content">
            <div class="row">
              <h3 title="${r.nom}">${r.nom}</h3>
            </div>
            <p class="desc">${r.descripcio || ''}</p>
            <div class="tags">${(r.tipus || []).map((t) => `<span class="tag">${t}</span>`).join('')}</div>
            <div class="price-badge">${r.preu}</div>
          </div>
        </a>
      </article>
    `)
    .join('');
};

window.cardsAPI = { fetchCards, renderCards };
