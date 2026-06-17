document.addEventListener('DOMContentLoaded', () => {
  loadComponent('nav', document.getElementById('nav-placeholder'));
});

async function loadComponent(name, target) {
  if (!target) return;
  const response = await fetch(`/components/${name}.html`);
  const html = await response.text();
  target.innerHTML = html;
  setActiveNav();
  initRollingText();
}

function setActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.remove('nav__link--active');
    if (link.dataset.nav === page) {
      link.classList.add('nav__link--active');
    }
  });
}
