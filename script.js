const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav-links');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

document.body.classList.add('motion-ready');

if (!prefersReducedMotion && hasFinePointer) {
  let pointerFrame;

  window.addEventListener('pointermove', (event) => {
    window.cancelAnimationFrame(pointerFrame);
    pointerFrame = window.requestAnimationFrame(() => {
      document.body.style.setProperty('--mouse-x', `${event.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${event.clientY}px`);
    });
  }, { passive: true });
}

if (!prefersReducedMotion && hasFinePointer) {
  const cursor = document.createElement('span');
  const cursorRing = document.createElement('span');
  cursor.className = 'ux-cursor';
  cursorRing.className = 'ux-cursor-ring';
  cursor.setAttribute('aria-hidden', 'true');
  cursorRing.setAttribute('aria-hidden', 'true');
  document.body.append(cursor, cursorRing);
  document.body.classList.add('ux-cursor-enabled');

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;

  function renderCustomCursor() {
    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;
    cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    window.requestAnimationFrame(renderCustomCursor);
  }

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.classList.add('visible');
    cursorRing.classList.add('visible');
  }, { passive: true });

  document.addEventListener('pointerover', (event) => {
    const isInteractive = event.target.closest('a, button, .project-visual, .tech-item, .skill-card');
    cursorRing.classList.toggle('hovering', Boolean(isInteractive));
  });

  document.documentElement.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
    cursorRing.classList.remove('visible');
  });

  renderCustomCursor();
}

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? '×' : '☰';
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      window.setTimeout(() => {
        entry.target.style.transitionDelay = '0ms';
      }, 850);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  if (!prefersReducedMotion) {
    element.style.transitionDelay = `${(index % 3) * 90}ms`;
  }
  revealObserver.observe(element);
});

document.querySelectorAll('[data-counter]').forEach((counter) => {
  const target = Number(counter.dataset.counter);

  if (prefersReducedMotion || !Number.isFinite(target)) {
    counter.textContent = String(target);
    return;
  }

  const counterObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;

    const startedAt = performance.now();
    const duration = 1100;

    function updateCounter(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * easedProgress));

      if (progress < 1) {
        window.requestAnimationFrame(updateCounter);
      }
    }

    window.requestAnimationFrame(updateCounter);
    counterObserver.disconnect();
  }, { threshold: 0.65 });

  counterObserver.observe(counter);
});

const progressBar = document.querySelector('.scroll-progress');

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const sectionMap = new Map(
  sectionLinks.map((link) => [link.getAttribute('href').slice(1), link])
);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      sectionLinks.forEach((link) => link.classList.remove('active'));
      sectionMap.get(entry.target.id)?.classList.add('active');
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

const techShowcase = document.querySelector('.tech-showcase');

if (techShowcase && hasFinePointer) {
  techShowcase.addEventListener('pointermove', (event) => {
    const bounds = techShowcase.getBoundingClientRect();
    techShowcase.style.setProperty('--tech-x', `${event.clientX - bounds.left}px`);
    techShowcase.style.setProperty('--tech-y', `${event.clientY - bounds.top}px`);
  });
}

document.querySelectorAll('.interactive-panel').forEach((panel) => {
  if (!hasFinePointer) return;

  panel.addEventListener('pointermove', (event) => {
    const bounds = panel.getBoundingClientRect();
    panel.style.setProperty('--panel-x', `${event.clientX - bounds.left}px`);
    panel.style.setProperty('--panel-y', `${event.clientY - bounds.top}px`);
  });
});

document.querySelectorAll('.capability-card').forEach((card) => {
  if (!hasFinePointer) return;

  card.addEventListener('pointermove', (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--cap-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--cap-y', `${event.clientY - bounds.top}px`);
  });
});

if (!prefersReducedMotion && hasFinePointer) {
  document.querySelectorAll('.project-visual').forEach((visual) => {
    visual.addEventListener('pointermove', (event) => {
      const bounds = visual.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const xPercent = (x / bounds.width) * 100;
      const yPercent = (y / bounds.height) * 100;
      const shadowX = ((x / bounds.width) - 0.5) * 18;
      const shadowY = ((y / bounds.height) - 0.5) * 18;

      visual.style.setProperty('--cursor-x', `${xPercent}%`);
      visual.style.setProperty('--cursor-y', `${yPercent}%`);
      visual.style.setProperty('--shadow-x', `${shadowX}px`);
      visual.style.setProperty('--shadow-y', `${shadowY}px`);
      visual.style.setProperty('--shadow-strength', '.24');
      visual.classList.add('cursor-shadow');
    });

    visual.addEventListener('pointerleave', () => {
      visual.style.setProperty('--shadow-strength', '0');
      visual.classList.remove('cursor-shadow');
    });
  });
}

if (!prefersReducedMotion && hasFinePointer) {
  document.querySelectorAll('.hero-console, .skill-card, .roadmap-card').forEach((card) => {
    card.classList.add('tilt-card');

    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

if (!prefersReducedMotion && hasFinePointer) {
  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect();
      const magneticX = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
      const magneticY = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
      button.style.setProperty('--magnet-x', `${magneticX}px`);
      button.style.setProperty('--magnet-y', `${magneticY}px`);
    });

    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--magnet-x', '0px');
      button.style.setProperty('--magnet-y', '0px');
    });
  });
}

document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const images = [...gallery.querySelectorAll('.gallery-image')];
  const controls = [...gallery.querySelectorAll('[data-slide]')];
  let currentSlide = 0;
  let autoplay;

  function showSlide(index) {
    currentSlide = index;
    images.forEach((image, imageIndex) => {
      image.classList.toggle('active', imageIndex === index);
    });
    controls.forEach((control, controlIndex) => {
      const isActive = controlIndex === index;
      control.classList.toggle('active', isActive);
      control.setAttribute('aria-pressed', String(isActive));
    });
  }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    window.clearInterval(autoplay);
    autoplay = window.setInterval(() => {
      showSlide((currentSlide + 1) % images.length);
    }, 5200);
  }

  controls.forEach((control, index) => {
    control.addEventListener('click', () => {
      showSlide(index);
      startAutoplay();
    });
  });

  gallery.addEventListener('pointerenter', () => window.clearInterval(autoplay));
  gallery.addEventListener('pointerleave', startAutoplay);
  gallery.addEventListener('focusin', () => window.clearInterval(autoplay));
  gallery.addEventListener('focusout', startAutoplay);
  startAutoplay();
});

const projectLightbox = document.createElement('div');
projectLightbox.className = 'project-lightbox';
projectLightbox.setAttribute('role', 'dialog');
projectLightbox.setAttribute('aria-modal', 'true');
projectLightbox.setAttribute('aria-hidden', 'true');
projectLightbox.setAttribute('aria-label', 'Preview proyek');
projectLightbox.innerHTML = `
  <div class="lightbox-panel">
    <button class="lightbox-close" type="button" aria-label="Tutup preview proyek">&times;</button>
    <div class="lightbox-head">
      <div>
        <p class="lightbox-index"></p>
        <h3 class="lightbox-title"></h3>
      </div>
      <p class="lightbox-hint">ESC TO CLOSE / FULL PROJECT VIEW</p>
    </div>
    <div class="lightbox-media">
      <img src="" alt="">
    </div>
  </div>
`;
document.body.append(projectLightbox);

const lightboxClose = projectLightbox.querySelector('.lightbox-close');
const lightboxImage = projectLightbox.querySelector('.lightbox-media img');
const lightboxTitle = projectLightbox.querySelector('.lightbox-title');
const lightboxIndex = projectLightbox.querySelector('.lightbox-index');
let lightboxTrigger = null;
let lightboxResetTimer;

function closeProjectLightbox() {
  if (!projectLightbox.classList.contains('open')) return;
  projectLightbox.classList.remove('open');
  projectLightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  lightboxResetTimer = window.setTimeout(() => {
    lightboxImage.removeAttribute('src');
  }, 420);
  lightboxTrigger?.focus();
}

function openProjectLightbox(visual) {
  const projectCard = visual.closest('.project-card');
  const activeImage = visual.querySelector('.gallery-image.active') || visual.querySelector('img');
  if (!projectCard || !activeImage) return;

  window.clearTimeout(lightboxResetTimer);
  lightboxTrigger = visual;
  lightboxImage.src = activeImage.currentSrc || activeImage.src;
  lightboxImage.alt = activeImage.alt;
  lightboxTitle.textContent = projectCard.querySelector('.project-info h3')?.textContent || 'Project Preview';
  lightboxIndex.textContent = projectCard.querySelector('.project-index')?.textContent || 'PROJECT VIEW';
  projectLightbox.classList.add('open');
  projectLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  lightboxClose.focus();
}

document.querySelectorAll('.project-visual').forEach((visual) => {
  const projectTitle = visual.closest('.project-card')?.querySelector('.project-info h3')?.textContent;
  visual.setAttribute('role', 'button');
  visual.setAttribute('tabindex', '0');
  visual.setAttribute('aria-label', `Buka tampilan penuh ${projectTitle || 'proyek'}`);

  visual.addEventListener('click', (event) => {
    if (event.target.closest('[data-slide]')) return;
    openProjectLightbox(visual);
  });

  visual.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openProjectLightbox(visual);
  });
});

lightboxClose.addEventListener('click', closeProjectLightbox);
projectLightbox.addEventListener('click', (event) => {
  if (event.target === projectLightbox) closeProjectLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeProjectLightbox();
});

const copyButton = document.querySelector('.copy-email');
const toast = document.querySelector('.toast');

copyButton.addEventListener('click', async () => {
  const email = copyButton.dataset.email;

  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const temporaryInput = document.createElement('textarea');
    temporaryInput.value = email;
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand('copy');
    temporaryInput.remove();
  }

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});
