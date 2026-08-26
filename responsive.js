// Shared touch/keyboard refinements; no customer data leaves this page.
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  const closeMenu = () => {
    links?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menu');
  };
  if (toggle?.hasAttribute('data-internal-menu')) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    links.addEventListener('click', closeMenu);
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && links?.classList.contains('open')) {
      closeMenu(); toggle.focus();
    }
  });
  document.addEventListener('click', event => { if (!event.target.closest('nav')) closeMenu(); });
  matchMedia('(max-width: 900px)').addEventListener('change', closeMenu);
  const names = { 'qty-minus': 'Diminuir quantidade', 'qty-plus': 'Aumentar quantidade',
    'nome-input': 'Nome dos pets', 'frase-input': 'Frase especial', 'data-input': 'Data da homenagem', 'obs-input': 'Observações do pedido' };
  for (const [id, name] of Object.entries(names)) document.getElementById(id)?.setAttribute('aria-label', name);
  document.getElementById('qty-display')?.setAttribute('aria-live', 'polite');
  const syncSelections = () => {
    document.querySelectorAll('.elem-card, .cor-btn, .toggle-btn').forEach(button => {
      button.setAttribute('aria-pressed', String(button.classList.contains('selected') || button.classList.contains('active')));
      if (button.matches('.elem-card, .cor-btn')) button.disabled = !!button.closest('.disabled');
    });
  };
  const customizer = document.getElementById('personalize');
  if (customizer) {
    new MutationObserver(syncSelections).observe(customizer, { subtree: true, attributes: true, attributeFilter: ['class'] });
    syncSelections();
  }
})();
