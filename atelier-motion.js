// Pause decorative motion in background tabs. Reduced motion is handled by CSS.
(() => {
  const root = document.documentElement;
  const syncVisibility = () => root.toggleAttribute('data-page-hidden', document.hidden);
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
})();
