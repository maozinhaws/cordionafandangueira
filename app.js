(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 801px)');
  const menu = document.querySelector('#mobile-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  const contactDialog = document.querySelector('#contact-dialog');
  const intro = document.querySelector('#intro');
  const introVideo = document.querySelector('#intro-video');
  let opener = null;

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('span').textContent = '+';
  };

  menuToggle?.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuToggle.setAttribute('aria-expanded', String(!menu.hidden));
    menuToggle.querySelector('span').textContent = menu.hidden ? '+' : '×';
  });

  const dialogs = new Map([
    ['musica', document.querySelector('#detail-musica')],
    ['agenda', document.querySelector('#detail-agenda')],
    ['historia', document.querySelector('#detail-historia')]
  ]);

  function openDialog(dialog, source) {
    if (!dialog) return;
    opener = source || document.activeElement;
    closeMenu();
    dialog.showModal();
    document.body.classList.add('modal-open');
  }

  function closeDialog(dialog) {
    if (!dialog?.open) return;
    dialog.close();
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open]');
    if (trigger) {
      openDialog(dialogs.get(trigger.dataset.open), trigger);
      return;
    }
    const contact = event.target.closest('[data-contact]');
    if (contact) {
      openDialog(contactDialog, contact);
      return;
    }
    const close = event.target.closest('[data-close-detail]');
    if (close) {
      closeDialog(close.closest('dialog'));
      return;
    }
    if (event.target.closest('#mobile-menu button')) closeMenu();
  });

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.querySelector('.dialog-close')?.addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    });
    dialog.addEventListener('close', () => {
      if (![...document.querySelectorAll('dialog')].some(d => d.open)) document.body.classList.remove('modal-open');
      opener?.focus?.({ preventScroll: true });
    });
  });

  const memorialDialog = document.querySelector('#memorial-dialog');
  document.querySelector('#open-memorial')?.addEventListener('click', (event) => {
    closeDialog(document.querySelector('#detail-historia'));
    setTimeout(() => openDialog(memorialDialog, event.currentTarget), 120);
  });

  const finishIntro = () => {
    if (!intro || intro.classList.contains('is-done')) return;
    intro.classList.add('is-done');
    setTimeout(() => { intro.hidden = true; }, reduce.matches ? 0 : 550);
  };
  if (intro && introVideo) {
    if (reduce.matches) finishIntro();
    else {
      introVideo.play().catch(() => {});
      const fallback = setTimeout(finishIntro, 5000);
      introVideo.addEventListener('timeupdate', () => {
        if (introVideo.currentTime >= 5) { clearTimeout(fallback); finishIntro(); }
      });
      introVideo.addEventListener('ended', finishIntro);
      document.querySelector('#intro-skip')?.addEventListener('click', finishIntro);
    }
  }

  // Desktop wheel intent guard:
  // normalize deltaY, accumulate intent, allow max 1 section transition per gesture,
  // and lock transitions for ~620ms. Mobile/touch behavior is untouched.
  const sectionTargets = [document.querySelector('.hero'), document.querySelector('.proof-strip')].filter(Boolean);
  let wheelAccum = 0;
  let wheelLocked = false;
  let resetTimer = 0;
  const WHEEL_THRESHOLD = 180;
  const WHEEL_LOCK_MS = 620;

  function normalizeWheel(event) {
    let delta = event.deltaY;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= innerHeight;
    return Math.max(-120, Math.min(120, delta));
  }

  function nearestSectionIndex() {
    const y = scrollY + innerHeight * 0.45;
    let best = 0, dist = Infinity;
    sectionTargets.forEach((section, i) => {
      const d = Math.abs(section.offsetTop - y);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  }

  addEventListener('wheel', (event) => {
    if (!desktop.matches || reduce.matches || document.querySelector('dialog[open]')) return;
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { wheelAccum = 0; }, 220);
    if (wheelLocked) return;
    wheelAccum += normalizeWheel(event);
    if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

    const direction = Math.sign(wheelAccum);
    const current = nearestSectionIndex();
    const next = Math.max(0, Math.min(sectionTargets.length - 1, current + direction));
    wheelAccum = 0;
    if (next === current) return;

    event.preventDefault();
    wheelLocked = true;
    sectionTargets[next].scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { wheelLocked = false; }, WHEEL_LOCK_MS);
  }, { passive: false });

  const player = document.querySelector('#youtube-player');
  document.querySelectorAll('[data-youtube]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.youtube;
      if (player && id) player.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id);
      document.querySelectorAll('[data-youtube]').forEach(b => b.classList.toggle('is-active', b === button));
    });
  });

  document.querySelectorAll('.agenda-item').forEach((item) => {
    const title = item.dataset.eventTitle || 'Cordiona Fandangueira';
    const date = item.dataset.eventDate || '';
    const location = item.dataset.eventLocation || '';
    const compact = date.replace(/-/g, '');
    const next = compact ? String(Number(compact) + 1) : compact;
    const google = item.querySelector('[data-google-calendar]');
    if (google && compact) google.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) + '&dates=' + compact + '/' + next + '&location=' + encodeURIComponent(location);

    item.querySelector('[data-ics]')?.addEventListener('click', () => {
      if (!compact) return;
      const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Cordiona Fandangueira//Site//PT-BR','BEGIN:VEVENT','DTSTART;VALUE=DATE:' + compact,'DTEND;VALUE=DATE:' + next,'SUMMARY:' + title,'LOCATION:' + location,'END:VEVENT','END:VCALENDAR'].join('\r\n');
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = 'cordiona-' + date + '.ics'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 500);
    });
  });

  const form = document.querySelector('#contact-form');
  const whatsapp = document.querySelector('#whatsapp-send');
  if (form && whatsapp) {
    const phone = form.elements.phone;
    const message = () => {
      const data = new FormData(form), get = key => String(data.get(key) || '').trim(), date = get('date');
      return ['Olá, Cordiona Fandangueira! Gostaria de consultar disponibilidade e orçamento para um evento.','',`Nome: ${get('name')}`,`WhatsApp: ${get('phone')}`,`Cidade/Estado: ${get('city')}`,`Data: ${date ? date.split('-').reverse().join('/') : 'A combinar'}`,`Tipo de evento: ${get('type')}`,`Público estimado: ${get('audience') || 'A definir'}`,`Local e detalhes: ${get('details') || 'A combinar'}`].join('\n');
    };
    const updateMessage = () => {
      const text = message();
      document.querySelector('#message-preview').textContent = text;
      whatsapp.href = 'https://wa.me/5541997790087?text=' + encodeURIComponent(text);
      const digits = phone.value.replace(/\D/g, '');
      phone.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Informe um telefone com DDD.');
    };
    form.addEventListener('input', updateMessage);
    form.addEventListener('change', updateMessage);
    whatsapp.addEventListener('click', event => { updateMessage(); if (!form.reportValidity()) event.preventDefault(); });
    form.addEventListener('submit', event => { event.preventDefault(); updateMessage(); if (form.reportValidity()) whatsapp.click(); });
    updateMessage();
  }

  const revealItems = document.querySelectorAll('.reveal');
  if (reduce.matches) revealItems.forEach(element => element.classList.add('in-view'));
  else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } });
    }, { threshold: .15 });
    revealItems.forEach((element, index) => { element.style.transitionDelay = `${Math.min(index * 45, 180)}ms`; observer.observe(element); });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuToggle.focus(); }
  });
})();