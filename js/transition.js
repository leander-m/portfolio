const BLOCK_COUNT = 8;
const STAGGER = 30;
const ANIM_DURATION = 350;

function createTransitionOverlay() {
  const overlay = document.createElement('div');
  overlay.classList.add('page-transition');
  for (let i = 0; i < BLOCK_COUNT; i++) {
    const block = document.createElement('div');
    block.classList.add('page-transition__block');
    overlay.appendChild(block);
  }
  document.body.appendChild(overlay);
  return overlay;
}

function setStagger(overlay) {
  const blocks = overlay.querySelectorAll('.page-transition__block');
  blocks.forEach((block, i) => {
    block.style.animationDelay = `${i * STAGGER}ms`;
  });
}

function playReveal() {
  const overlay = createTransitionOverlay();
  const blocks = overlay.querySelectorAll('.page-transition__block');
  blocks.forEach((block) => {
    block.style.transform = 'translateY(0)';
  });

  requestAnimationFrame(() => {
    setStagger(overlay);
    overlay.classList.add('page-transition--enter');
  });

  const totalTime = ANIM_DURATION + (BLOCK_COUNT - 1) * STAGGER + 50;
  setTimeout(() => {
    overlay.remove();
  }, totalTime);
}

function navigateWithTransition(url) {
  const overlay = createTransitionOverlay();
  setStagger(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('page-transition--exit');
  });

  const totalTime = ANIM_DURATION + (BLOCK_COUNT - 1) * STAGGER + 50;
  setTimeout(() => {
    window.location.href = url;
  }, totalTime);
}

document.addEventListener('DOMContentLoaded', () => {
  playReveal();
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');

  if (link.target === '_blank') return;
  if (href.startsWith('mailto:')) return;
  if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;
  if (href === window.location.pathname) return;

  e.preventDefault();
  navigateWithTransition(href);
});
