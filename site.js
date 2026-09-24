(() => {
  const root = document.documentElement;
  const body = document.body;
  const site = document.querySelector('.portal-site');
  const welcome = document.querySelector('.welcome-screen');
  const content = document.querySelector('.portal-content');
  const menuButton = document.querySelector('.portal-menu-toggle');
  const nav = document.querySelector('#site-nav');
  const paper = document.querySelector('.event-paper');
  const monthHeading = document.querySelector('.month-name h3');
  const busCards = [...document.querySelectorAll('.bus-frame')];
  const busCounter = document.querySelector('.bus-count');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ambientVideo = document.querySelector('.welcome-video iframe[data-autoplay-src]');
  if (!prefersReducedMotion.matches && ambientVideo) ambientVideo.src = ambientVideo.dataset.autoplaySrc;
  let month = (() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); })();
  let currentBus = 0;
  let touchStartX = null;
  let transitionTimer;

  const formatMonth = (date) => new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
  if (monthHeading) monthHeading.textContent = formatMonth(month);

  const setMenu = (open) => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    const glyph = menuButton.querySelector('[aria-hidden="true"]');
    if (glyph) glyph.textContent = open ? '×' : '☰';
    nav.classList.toggle('nav-open', open);
  };

  const enterSite = (targetId) => {
    if (!welcome || !content || content.dataset.entered === 'true') return;
    content.dataset.entered = 'true';
    content.inert = false;
    content.setAttribute('aria-hidden', 'false');
    content.classList.add('content-revealed');
    welcome.classList.add('welcome-exit');
    welcome.setAttribute('aria-hidden', 'true');
    welcome.setAttribute('inert', '');
    if (ambientVideo) ambientVideo.src = 'about:blank';
    site?.classList.add('is-entered');
    root.classList.add('is-entered');
    body.classList.remove('portal-entry-locked');
    setMenu(false);
    window.scrollTo(0, 0);
    if (targetId) window.setTimeout(() => document.getElementById(targetId)?.scrollIntoView({
      behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start',
    }), prefersReducedMotion.matches ? 0 : 350);
  };

  document.querySelectorAll('[data-enter]').forEach((button) => button.addEventListener('click', () => enterSite()));
  document.querySelectorAll('[data-enter-target]').forEach((buttonOrLink) => {
    buttonOrLink.addEventListener('click', (event) => {
      const target = buttonOrLink.dataset.enterTarget;
      if (content?.dataset.entered !== 'true') {
        event.preventDefault();
        enterSite(target);
      } else if (buttonOrLink instanceof HTMLAnchorElement && target) {
        event.preventDefault();
        setMenu(false);
        document.getElementById(target)?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      } else if (target) {
        document.getElementById(target)?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
  });
  document.querySelector('.portal-brand')?.addEventListener('click', (event) => {
    if (content?.dataset.entered !== 'true') { event.preventDefault(); enterSite(); }
  });
  document.querySelector('.portal-skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    enterSite('music');
  });

  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  const showMonth = (amount) => {
    if (!paper || !monthHeading) return;
    const next = amount > 0;
    month = new Date(month.getFullYear(), month.getMonth() + amount, 1);
    monthHeading.textContent = formatMonth(month);
    paper.classList.remove('turn-next', 'turn-previous');
    window.clearTimeout(transitionTimer);
    if (prefersReducedMotion.matches) { paper.classList.add('turn-none'); return; }
    paper.classList.remove('turn-none');
    void paper.offsetWidth;
    paper.classList.add(next ? 'turn-next' : 'turn-previous');
    transitionTimer = window.setTimeout(() => {
      paper.classList.remove('turn-next', 'turn-previous');
      paper.classList.add('turn-none');
    }, 520);
  };
  paper?.querySelector('.month-next')?.addEventListener('click', () => showMonth(1));
  paper?.querySelector('.month-prev')?.addEventListener('click', () => showMonth(-1));
  paper?.addEventListener('keydown', (event) => {
    if (event.target !== paper && event.target instanceof HTMLElement && event.target.closest('button, a')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); showMonth(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showMonth(-1); }
  });
  paper?.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0]?.clientX ?? null; }, { passive: true });
  paper?.addEventListener('touchend', (event) => {
    const end = event.changedTouches[0]?.clientX;
    if (touchStartX === null || end === undefined) return;
    const delta = end - touchStartX;
    if (Math.abs(delta) > 48) showMonth(delta < 0 ? 1 : -1);
    touchStartX = null;
  }, { passive: true });

  const showBus = (index) => {
    if (!busCards.length) return;
    currentBus = (index + busCards.length) % busCards.length;
    busCards.forEach((card, cardIndex) => {
      const visible = cardIndex === currentBus;
      card.classList.toggle('bus-current', visible);
      card.setAttribute('aria-hidden', String(!visible));
      card.querySelectorAll('a').forEach((link) => { link.tabIndex = visible ? 0 : -1; });
    });
    if (busCounter) busCounter.innerHTML = `0${currentBus + 1} <i>/</i> 0${busCards.length}`;
  };
  showBus(0);
  document.querySelector('.bus-next')?.addEventListener('click', () => showBus(currentBus + 1));
  document.querySelector('.bus-prev')?.addEventListener('click', () => showBus(currentBus - 1));
  const busGallery = document.querySelector('.bus-showcase');
  busGallery?.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0]?.clientX ?? null; }, { passive: true });
  busGallery?.addEventListener('touchend', (event) => {
    const end = event.changedTouches[0]?.clientX;
    if (touchStartX === null || end === undefined) return;
    const delta = end - touchStartX;
    if (Math.abs(delta) > 48) showBus(currentBus + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
  busGallery?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') showBus(currentBus + 1);
    if (event.key === 'ArrowLeft') showBus(currentBus - 1);
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  const initialTarget = window.location.hash.slice(1);
  if (['music', 'agenda', 'estrada', 'banda', 'estrutura'].includes(initialTarget)) enterSite(initialTarget);
})();
