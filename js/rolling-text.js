class RollingText {
  constructor(el, options = {}) {
    this.el = el;
    this.text = options.text || el.textContent.trim();
    this.trigger = options.trigger || el.dataset.rollingTrigger || 'hover';
    this.isAnimating = false;
    this.pendingDown = false;

    this.build();
    this.bind();
  }

  build() {
    this.el.setAttribute('aria-label', this.text);
    this.el.innerHTML = '';

    for (let i = 0; i < this.text.length; i++) {
      const ch = this.text[i];
      const charEl = document.createElement('span');
      charEl.classList.add('rolling-text__char');
      charEl.setAttribute('aria-hidden', 'true');

      if (ch === ' ') {
        charEl.classList.add('rolling-text__char--space');
        this.el.appendChild(charEl);
        continue;
      }

      const inner = document.createElement('span');
      inner.classList.add('rolling-text__inner');
      inner.style.transitionDelay = `${i * 20}ms`;

      const top = document.createElement('span');
      top.textContent = ch;
      const bottom = document.createElement('span');
      bottom.textContent = ch;

      inner.appendChild(top);
      inner.appendChild(bottom);
      charEl.appendChild(inner);
      this.el.appendChild(charEl);
    }
  }

  bind() {
    if (this.trigger === 'hover') {
      this.el.addEventListener('mouseenter', () => this.rollUp());
      this.el.addEventListener('mouseleave', () => this.requestDown());
      this.el.addEventListener('focus', () => this.rollUp());
      this.el.addEventListener('blur', () => this.requestDown());
    } else {
      this.el.addEventListener('click', () => {
        if (!this.isAnimating) this.rollUp();
      });
    }
  }

  rollUp() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.pendingDown = false;
    this.el.classList.add('is-rolling');

    const maxDelay = this.text.length * 20;
    const duration = parseFloat(getComputedStyle(this.el).getPropertyValue('--rolling-duration')) * 1000 || 400;

    setTimeout(() => {
      this.isAnimating = false;
      if (this.pendingDown) {
        this.pendingDown = false;
        this.rollDown();
      }
    }, maxDelay + duration + 50);
  }

  requestDown() {
    if (this.isAnimating) {
      this.pendingDown = true;
    } else {
      this.rollDown();
    }
  }

  rollDown() {
    this.el.classList.remove('is-rolling');
  }
}

function initRollingText() {
  document.querySelectorAll('[data-rolling-text]').forEach(el => {
    new RollingText(el);
  });
}
