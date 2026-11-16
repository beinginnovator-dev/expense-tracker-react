(() => {
  const pages = [1, 2, 3, 4, 5, 6];
  let currentPage = 1, swipeEnabled = false, startX = 0, startY = 0;
  const originalShowPage = window.showPage;
  function applySwipeNavigation() {
    if (swipeEnabled) return;
    swipeEnabled = true; currentPage = 1;
    history.replaceState({ walletPage: currentPage }, '', '#wallet-page-1');
    const button = document.getElementById('applySwipeButton');
    if (button) { button.textContent = 'Swipe Navigation Applied ✓'; button.disabled = true; button.style.opacity = '0.7'; }
  }
  window.showPage = function(page) {
    currentPage = Number(page) || 1;
    if (swipeEnabled) history.pushState({ walletPage: currentPage }, '', '#wallet-page-' + currentPage);
    if (typeof originalShowPage === 'function') originalShowPage(currentPage);
  };
  window.addEventListener('popstate', event => {
    if (!swipeEnabled) return;
    const page = Number(event.state?.walletPage);
    if (pages.includes(page)) { currentPage = page; if (typeof originalShowPage === 'function') originalShowPage(currentPage); }
    else history.pushState({ walletPage: currentPage }, '', '#wallet-page-' + currentPage);
  });
  document.addEventListener('touchstart', event => {
    if (!swipeEnabled || event.touches.length !== 1) return;
    startX = event.touches[0].clientX; startY = event.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', event => {
    if (!swipeEnabled || !startX) return;
    const dx = event.changedTouches[0].clientX - startX;
    const dy = Math.abs(event.changedTouches[0].clientY - startY);
    startX = 0; startY = 0;
    if (dx < 80 || dy > Math.abs(dx)) return;
    if (currentPage > 1) window.showPage(currentPage - 1);
    else history.pushState({ walletPage: 1 }, '', '#wallet-page-1');
  }, { passive: true });
  function createApplyButton() {
    if (document.getElementById('applySwipeButton')) return;
    const button = document.createElement('button');
    button.id = 'applySwipeButton'; button.type = 'button'; button.textContent = 'Apply Swipe Navigation';
    button.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:10002;width:auto;padding:10px 14px;border:0;border-radius:10px;background:linear-gradient(135deg,#6D4C41,#8D6E63);color:#fff;font-size:12px;font-weight:800;box-shadow:0 4px 12px rgba(0,0,0,.25);cursor:pointer;';
    button.addEventListener('click', applySwipeNavigation); document.body.appendChild(button);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createApplyButton);
  else createApplyButton();
})();
