const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav-links');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
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

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
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
