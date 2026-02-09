document.addEventListener('DOMContentLoaded', () => {
  const SITE_BASE = 'https://bielsoler23.github.io/GastroPineda';
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) return;

  fetch('data/details.json')
    .then((res) => res.json())
    .then((data) => {
      const restaurant = data.find((r) => r.slug === slug);
      if (!restaurant) return;

      const container = document.getElementById('restaurant');
      if (!container) return;
      container.dataset.id = restaurant.id;

      const contact = restaurant.contacte || {};
      const contactItems = [];
      if (contact.web) {
        contactItems.push(
          `<li>Web: <a href="${contact.web}" target="_blank" rel="noopener">${contact.web}</a></li>`
        );
      }
      if (contact.telefon) {
        contactItems.push(`<li>Tel: <a href="tel:${contact.telefon}">${contact.telefon}</a></li>`);
      }
      if (contact.email) {
        contactItems.push(
          `<li>Email: <a href="mailto:${contact.email}">${contact.email}</a></li>`
        );
      }

      const images = restaurant.imatges || [];
      const hasImages = images.length > 0;

      const mapsLink = restaurant.maps_url
        ? restaurant.maps_url.replace('&output=embed', '')
        : `https://www.google.com/maps?q=${encodeURIComponent(restaurant.nom + ' Pineda de Mar')}`;
      const priceLevel = restaurant.preu?.nivell ? '€'.repeat(restaurant.preu.nivell) : '';
      const canonicalUrl = `${SITE_BASE}/details.html?slug=${restaurant.slug}`;

      document.title = `GastroPineda · ${restaurant.nom}`;

      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        descriptionMeta.setAttribute(
          'content',
          `${restaurant.nom} a Pineda de Mar. ${restaurant.descripcio_llarga}`
        );
      }

      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
      }

      container.innerHTML = `
        <section class="search-hero">
          <h1>${restaurant.nom}</h1>
        </section>

        <section class="section-box">
          <div class="details-grid">
            <div class="details-left">
              ${
                hasImages
                  ? `
                <div class="gallery">
                  <div class="gallery-main">
                    <button class="gallery-btn prev" aria-label="Anterior">‹</button>
                    <img id="main-img" src="${images[0]}" alt="${restaurant.nom}" loading="lazy">
                    <button class="gallery-btn next" aria-label="Següent">›</button>
                  </div>
                  <div class="gallery-thumbs">
                    ${images
                      .map(
                        (img, index) =>
                          `<button class="thumb" data-index="${index}" aria-label="Imatge ${index + 1}"><img src="${img}" alt="${restaurant.nom}"></button>`
                      )
                      .join('')}
                  </div>
                </div>
                `
                  : '<p class="muted">Sense imatges disponibles.</p>'
              }

              <div class="description">
                <p>${restaurant.descripcio_llarga}</p>
              </div>

              <p class="meta"><strong>Tipus:</strong> ${restaurant.tipus.join(', ')} · <strong>Preu:</strong> ${restaurant.preu.rang}${priceLevel ? ` (${priceLevel})` : ''}</p>
            </div>

            <aside class="details-right">
              <h3>Ubicació</h3>
              <div class="map">
                <iframe src="${restaurant.maps_url}" width="100%" height="300" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
              <p><a href="${mapsLink}" target="_blank" rel="noopener" class="btn btn-maps">Obrir en Google Maps</a></p>

              <h3>Horari</h3>
              <p>${restaurant.horari}</p>

              <h3>Contacte</h3>
              <ul>${contactItems.join('') || '<li>No disponible</li>'}</ul>

              <h3>Servei(s)</h3>
              <div class="chips">${(restaurant.serveis || []).map((s) => `<span class="chip">${s}</span>`).join('')}</div>
            </aside>
          </div>
        </section>
      `;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Restaurant',
            name: restaurant.nom,
            description: restaurant.descripcio_llarga,
            url: canonicalUrl,
            image: images.map((img) => `${SITE_BASE}/${img}`),
            priceRange: restaurant.preu?.rang,
            servesCuisine: restaurant.tipus,
            telephone: contact.telefon || undefined,
            email: contact.email || undefined,
            sameAs: contact.web ? [contact.web] : undefined,
            hasMap: mapsLink,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Pineda de Mar',
              addressRegion: 'Barcelona',
              addressCountry: 'ES'
            }
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Inici',
                item: `${SITE_BASE}/index.html`
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Restaurants',
                item: `${SITE_BASE}/restaurants.html`
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: restaurant.nom,
                item: canonicalUrl
              }
            ]
          }
        ]
      };

      const schemaScriptId = 'restaurant-schema';
      const existingSchema = document.getElementById(schemaScriptId);
      const schemaScript = existingSchema || document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = schemaScriptId;
      schemaScript.textContent = JSON.stringify(jsonLd);
      if (!existingSchema) {
        document.head.appendChild(schemaScript);
      }

      if (!hasImages) return;

      const mainImg = document.getElementById('main-img');
      const thumbs = Array.from(document.querySelectorAll('.thumb'));
      const prevBtn = document.querySelector('.gallery-btn.prev');
      const nextBtn = document.querySelector('.gallery-btn.next');
      let current = 0;

      const setCurrent = (index) => {
        current = (index + images.length) % images.length;
        mainImg.src = images[current];
        thumbs.forEach((thumb) => {
          thumb.classList.toggle('active', Number(thumb.dataset.index) === current);
        });
      };

      prevBtn.addEventListener('click', () => setCurrent(current - 1));
      nextBtn.addEventListener('click', () => setCurrent(current + 1));
      thumbs.forEach((btn) => btn.addEventListener('click', () => setCurrent(Number(btn.dataset.index))));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      });

      setCurrent(0);
    });
});
