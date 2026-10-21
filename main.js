const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú');
      navigation.classList.remove('is-open');
    });
  });
}

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const serviceCards = [...document.querySelectorAll('.service-card[data-category]')];
const serviceCount = document.querySelector('#service-count');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    serviceCards.forEach((card) => {
      card.hidden = selected !== 'todos' && card.dataset.category !== selected;
      if (!card.hidden) card.classList.add('is-visible');
    });

    document.querySelectorAll('[data-group-list]').forEach((group) => {
      group.hidden = group.querySelectorAll('.service-card:not([hidden])').length === 0;
    });
    document.querySelectorAll('[data-group-label]').forEach((label) => {
      label.hidden = selected !== 'todos' && label.dataset.groupLabel !== selected;
    });

    const visibleCount = serviceCards.filter((card) => !card.hidden).length;
    if (serviceCount) serviceCount.textContent = `${String(visibleCount).padStart(2, '0')} ${visibleCount === 1 ? 'servicio' : 'servicios'}`;
  });
});

const serviceSelect = document.querySelector('#service-select');
document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    if (serviceSelect) serviceSelect.value = link.dataset.service;
  });
});

const form = document.querySelector('#inquiry-form');
const result = document.querySelector('#form-result');
const copyButton = document.querySelector('#copy-button');
const whatsappSubmit = document.querySelector('#whatsapp-submit');
let preparedMessage = '';

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  preparedMessage = [
    'Hola, JML Consulting. Quisiera consultar por uno de sus servicios.',
    `Servicio: ${data.get('service')}`,
    `Nombre: ${data.get('name')}`,
    `Contacto: ${data.get('contact')}`,
    `Consulta: ${data.get('case')}`,
  ].join('\n');

  result.textContent = 'Tu mensaje está listo. Al abrir WhatsApp podrás revisarlo y decidir si lo envías. Este sitio no almacena tu consulta.';
  result.hidden = false;
  whatsappSubmit.href = `https://wa.me/50255443870?text=${encodeURIComponent(preparedMessage)}`;
  whatsappSubmit.hidden = false;
  copyButton.hidden = false;
});

copyButton?.addEventListener('click', async () => {
  if (!preparedMessage) return;
  try {
    await navigator.clipboard.writeText(preparedMessage);
    copyButton.innerHTML = 'Consulta copiada <span aria-hidden="true">✓</span>';
  } catch {
    const fallback = document.createElement('textarea');
    fallback.value = preparedMessage;
    fallback.setAttribute('readonly', '');
    fallback.style.position = 'fixed';
    fallback.style.opacity = '0';
    document.body.append(fallback);
    fallback.select();
    const copied = document.execCommand('copy');
    fallback.remove();
    copyButton.innerHTML = copied ? 'Consulta copiada <span aria-hidden="true">✓</span>' : 'No se pudo copiar; selecciona y copia los datos del formulario.';
  }
});

const year = document.querySelector('#current-year');
if (year) year.textContent = String(new Date().getFullYear());

const revealTargets = document.querySelectorAll('.section-heading, .service-explorer, .service-group-label, .service-card, .process-step');
if ('IntersectionObserver' in window && revealTargets.length) {
  document.body.classList.add('js-ready');
  revealTargets.forEach((element) => element.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -18px 0px' });
  revealTargets.forEach((element) => observer.observe(element));
}
