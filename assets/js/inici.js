const featuredIds = [4, 14, 15];

document.addEventListener('DOMContentLoaded', () => {
  window.cardsAPI.fetchCards((data) => {
    const list = (data || []).filter((card) => featuredIds.includes(card.id));
    const ordered = featuredIds.map((id) => list.find((card) => card.id === id)).filter(Boolean);
    window.cardsAPI.renderCards('home-recommendations', ordered);
  });
});
