// Shared local preference. No analytics or data requests.
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const buttons = [...document.querySelectorAll('[data-motion-toggle]')];
  let paused = false;
  try { paused = localStorage.getItem('arteari-motion-paused') === 'true'; } catch {}
  const sync = () => {
    const effectivePause = paused || reduce.matches;
    root.toggleAttribute('data-motion-paused', effectivePause);
    buttons.forEach(button => {
      button.disabled = reduce.matches;
      button.setAttribute('aria-pressed', String(effectivePause));
      const label = reduce.matches ? 'Movimento reduzido' : paused ? 'Ativar animações' : 'Pausar animações';
      button.querySelector('[data-motion-label]').textContent = label;
      button.setAttribute('aria-label', label);
    });
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('arteari-motion-paused', String(paused)); } catch {}
    sync();
  }));
  reduce.addEventListener('change', sync);
  document.addEventListener('visibilitychange', () => root.toggleAttribute('data-page-hidden', document.hidden));
  root.toggleAttribute('data-page-hidden', document.hidden);
  sync();
})();
