(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('#mobile-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  const dialog = document.querySelector('#contact-dialog');
  let opener = null;

  menuToggle.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuToggle.setAttribute('aria-expanded', String(!menu.hidden));
    menuToggle.querySelector('span').textContent = menu.hidden ? '+' : '×';
  });

  document.addEventListener('click', (event) => {
    const contact = event.target.closest('[data-contact]');
    if (contact) {
      opener = contact;
      if (!menu.hidden) {
        menu.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.querySelector('span').textContent = '+';
      }
      dialog.showModal();
      return;
    }
    if (event.target.closest('#mobile-menu a')) {
      menu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.querySelector('span').textContent = '+';
    }
  });

  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));

  const form = document.querySelector('#contact-form');
  const whatsapp = document.querySelector('#whatsapp-send');
  const phone = form.elements.phone;
  const message = () => {
    const data = new FormData(form);
    const get = (key) => String(data.get(key) || '').trim();
    const date = get('date');
    return [
      'Olá, Cordiona Fandangueira! Gostaria de consultar disponibilidade e orçamento para um evento.', '',
      `Nome: ${get('name')}`, `WhatsApp: ${get('phone')}`, `Cidade/Estado: ${get('city')}`,
      `Data: ${date ? date.split('-').reverse().join('/') : 'A combinar'}`,
      `Tipo de evento: ${get('type')}`, `Público estimado: ${get('audience') || 'A definir'}`,
      `Local e detalhes: ${get('details') || 'A combinar'}`
    ].join('\n');
  };
  const updateMessage = () => {
    const text = message();
    document.querySelector('#message-preview').textContent = text;
    whatsapp.href = `https://wa.me/5541997790087?text=${encodeURIComponent(text)}`;
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Informe um telefone com DDD.');
  };
  form.addEventListener('input', updateMessage);
  form.addEventListener('change', updateMessage);
  whatsapp.addEventListener('click', (event) => { updateMessage(); if (!form.reportValidity()) event.preventDefault(); });
  form.addEventListener('submit', (event) => { event.preventDefault(); updateMessage(); if (form.reportValidity()) whatsapp.click(); });
  updateMessage();

  const revealItems = document.querySelectorAll('.reveal');
  if (reduce.matches) revealItems.forEach((element) => element.classList.add('in-view'));
  else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } });
    }, { threshold: .15 });
    revealItems.forEach((element, index) => { element.style.transitionDelay = `${Math.min(index * 45, 180)}ms`; observer.observe(element); });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      menu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.querySelector('span').textContent = '+';
      menuToggle.focus();
    }
  });
})();
