# GastroPineda

Guia de restaurants a Pineda de Mar amb fitxes, filtres i detalls de cada local. Projecte web estatic orientat a SEO, amb dades en JSON i interficie clara.

## Contingut
- Llistat de restaurants amb cerca i filtres.
- Fitxa individual amb galeria, horari, contacte i mapa.
- Pagina de suggeriments amb formulari extern.
- Sitemap i robots.txt.

## Tecnologies
- HTML, CSS, JavaScript
- Dades en JSON
- Schema.org (WebSite, FAQ, ItemList, Restaurant, BreadcrumbList)

## Estructura
- `index.html`: pagina d’inici
- `restaurants.html`: llistat i filtres
- `details.html`: fitxa de restaurant (carrega per `slug`)
- `suggeriments.html`: formulari de suggeriments
- `assets/css`: estils
- `assets/js`: logica de la UI
- `data`: dades de restaurants

## Com funciona
- La pagina d’inici carrega recomanacions des de `data/cards.json`.
- El llistat filtra per text, tipus i preu.
- La fitxa llegeix `data/details.json` segons el parametre `slug` de la URL.

## Dades
Les dades son de caracter informatiu i poden variar. Si vols afegir o corregir un restaurant, utilitza la pagina de suggeriments.

## Autor
Biel Soler
