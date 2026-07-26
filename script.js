const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav-links');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
const themeToggle = document.querySelector('.theme-toggle');
const rootElement = document.documentElement;

document.body.classList.add('motion-ready');

function updateThemeToggle() {
  const isLight = rootElement.dataset.theme === 'light';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? 'Aktifkan dark mode' : 'Aktifkan light mode');
}

updateThemeToggle();

themeToggle.addEventListener('click', () => {
  const nextTheme = rootElement.dataset.theme === 'light' ? 'dark' : 'light';
  rootElement.classList.add('theme-transition');
  rootElement.dataset.theme = nextTheme;

  try {
    localStorage.setItem('ryan-portfolio-theme', nextTheme);
  } catch {
    // Website tetap bisa mengganti tema meskipun penyimpanan browser diblokir.
  }

  updateThemeToggle();
  window.setTimeout(() => rootElement.classList.remove('theme-transition'), 460);
});

const siteLoader = document.querySelector('.site-loader');

if (siteLoader) {
  const loaderProgress = siteLoader.querySelector('.loader-progress');
  const loaderNumber = siteLoader.querySelector('.loader-readout b');
  const loaderMessage = siteLoader.querySelector('.loader-message');
  const loaderDuration = prefersReducedMotion ? 260 : 1850;
  const loaderStartedAt = performance.now();
  const loaderMessages = [
    'Booting interface modules',
    'Connecting monitoring nodes',
    'Synchronizing project data',
    'Interface ready'
  ];
  let pageReady = document.readyState === 'complete';
  let loaderFinished = false;

  document.body.classList.add('loader-active');
  window.addEventListener('load', () => {
    pageReady = true;
  }, { once: true });

  function finishLoader() {
    if (loaderFinished) return;
    loaderFinished = true;
    siteLoader.style.setProperty('--loader-progress', '100%');
    loaderProgress.setAttribute('aria-valuenow', '100');
    loaderNumber.textContent = '100';
    loaderMessage.textContent = loaderMessages[3];
    siteLoader.classList.add('is-complete');

    window.setTimeout(() => {
      siteLoader.classList.add('is-closing');
    }, prefersReducedMotion ? 40 : 230);

    window.setTimeout(() => {
      siteLoader.classList.add('is-hidden');
      document.body.classList.remove('loader-active');
    }, prefersReducedMotion ? 110 : 1050);
  }

  function updateLoader(now) {
    const elapsed = now - loaderStartedAt;
    let progress = Math.min((elapsed / loaderDuration) * 100, pageReady ? 100 : 92);

    if (!pageReady && elapsed > 2600) {
      progress = Math.min(100, 92 + ((elapsed - 2600) / 500) * 8);
    }

    const roundedProgress = Math.round(progress);
    siteLoader.style.setProperty('--loader-progress', `${progress}%`);
    loaderProgress.setAttribute('aria-valuenow', String(roundedProgress));
    loaderNumber.textContent = String(roundedProgress);

    if (progress < 34) {
      loaderMessage.textContent = loaderMessages[0];
    } else if (progress < 68) {
      loaderMessage.textContent = loaderMessages[1];
    } else if (progress < 96) {
      loaderMessage.textContent = loaderMessages[2];
    }

    if (progress >= 100) {
      finishLoader();
      return;
    }

    window.requestAnimationFrame(updateLoader);
  }

  window.requestAnimationFrame(updateLoader);
}

const textTypeElement = document.querySelector('[data-text-type]');

if (textTypeElement) {
  let textValues;

  try {
    textValues = JSON.parse(textTypeElement.dataset.textValues);
  } catch {
    textValues = [textTypeElement.textContent.trim()];
  }

  if (!Array.isArray(textValues) || textValues.length === 0) {
    textValues = [textTypeElement.textContent.trim()];
  }

  if (prefersReducedMotion) {
    textTypeElement.textContent = textValues[0];
  } else {
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    textTypeElement.textContent = '';

    function runTextType() {
      const phrase = textValues[phraseIndex];

      if (!deleting) {
        characterIndex += 1;
        textTypeElement.textContent = phrase.slice(0, characterIndex);

        if (characterIndex >= phrase.length) {
          deleting = true;
          window.setTimeout(runTextType, 1550);
          return;
        }

        window.setTimeout(runTextType, 54 + Math.random() * 36);
        return;
      }

      characterIndex -= 1;
      textTypeElement.textContent = phrase.slice(0, characterIndex);

      if (characterIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % textValues.length;
        window.setTimeout(runTextType, 320);
        return;
      }

      window.setTimeout(runTextType, 28 + Math.random() * 22);
    }

    window.setTimeout(runTextType, siteLoader ? 2100 : 420);
  }
}

const wibClock = document.querySelector('[data-wib-clock]');
const wibTime = document.querySelector('[data-wib-time]');
const wibDate = document.querySelector('[data-wib-date]');

function updateWibTime() {
  const now = new Date();
  const timeText = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).format(now);
  const shortTimeText = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).format(now);
  const dateText = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(now);

  if (wibClock) {
    wibClock.textContent = `${timeText} WIB`;
    wibClock.dateTime = now.toISOString();
  }
  if (wibTime) wibTime.textContent = shortTimeText;
  if (wibDate) wibDate.textContent = dateText;
}

updateWibTime();
window.setInterval(updateWibTime, 1000);

const desktopWindow = document.querySelector('.desktop-window');
const desktopStage = document.querySelector('.desktop-stage');

if (desktopWindow && desktopStage) {
  const workstationApps = {
    profile: {
      label: 'PROFILE.EXE',
      index: 'PROFILE / 001',
      title: 'Ryan Nur Efendy',
      subtitle: 'Network Operation Center',
      description: 'NOC di Digital Nusantara yang berfokus pada monitoring bandwidth, perangkat jaringan, pelayanan pelanggan, troubleshooting, dan pengembangan sistem operasional.',
      image: '',
      tags: ['NOC', 'Monitoring', 'Troubleshooting', 'Digital Nusantara'],
      href: '#tentang',
      linkText: 'OPEN PROFILE'
    },
    grafana: {
      label: 'GRAFANA.MONITOR',
      index: 'PROJECT / 001',
      title: 'Network Monitoring Dashboard',
      subtitle: '11 Server Monitoring',
      description: 'Dashboard Grafana untuk memantau traffic bandwidth MikroTik, CPU, RAM, storage, status port, serta kondisi sebelas server dalam satu pusat monitoring.',
      image: 'grafana-dashboard.png',
      tags: ['Grafana', 'Prometheus', 'Proxmox', 'MikroTik'],
      href: '#project-grafana',
      linkText: 'OPEN PROJECT'
    },
    absensi: {
      label: 'ABSENSI.APP',
      index: 'PROJECT / 002',
      title: 'Web Absensi Karyawan',
      subtitle: 'Attendance Management System',
      description: 'Aplikasi absensi karyawan berbasis web server Ubuntu di Proxmox, dilengkapi akun karyawan dan admin, jadwal shift, selfie, lokasi GPS, serta pencatatan waktu server.',
      image: 'web-absensi-admin.png',
      tags: ['Ubuntu', 'Proxmox', 'MySQL', 'JavaScript'],
      href: '#project-absensi',
      linkText: 'OPEN PROJECT'
    },
    gudang: {
      label: 'GUDANG_DNS.APP',
      index: 'PROJECT / 003',
      title: 'Gudang DNS',
      subtitle: 'Inventory Management System',
      description: 'Sistem inventori berbasis role untuk mengelola barang, stok, permintaan teknisi, persetujuan, gudang, dan penempatan tim lapangan.',
      image: 'gudang-dns-admin.png',
      tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Docker'],
      href: '#project-gudang',
      linkText: 'OPEN PROJECT'
    },
    topology: {
      label: 'NETWORK.FLOW',
      index: 'SYSTEM / 004',
      title: 'Network Topology',
      subtitle: 'Monitoring Data Flow',
      description: 'Alur monitoring dimulai dari perangkat MikroTik, dikumpulkan melalui Prometheus, dijalankan pada lingkungan Proxmox, kemudian divisualisasikan melalui Grafana.',
      image: '',
      tags: ['MikroTik', 'Prometheus', 'Proxmox', 'Grafana'],
      href: '#proyek',
      linkText: 'VIEW WORKFLOW'
    },
    skills: {
      label: 'STACK.TERMINAL',
      index: 'SYSTEM / 005',
      title: 'Skills & Technology',
      subtitle: 'Network × Server × Web',
      description: 'Daily stack untuk mengoperasikan jaringan dan membangun aplikasi: MikroTik, Winbox, OLT/OTB, PuTTY, Grafana, Prometheus, Proxmox, Ubuntu, Next.js, TypeScript, PostgreSQL, dan Docker.',
      image: '',
      tags: ['Network', 'Server', 'Frontend', 'Backend'],
      href: '#pengalaman',
      linkText: 'OPEN TECHNOLOGY'
    },
    contact: {
      label: 'CONTACT.MAIL',
      index: 'SYSTEM / 006',
      title: 'Let’s Connect',
      subtitle: 'Open for Collaboration',
      description: 'Hubungi Ryan untuk berdiskusi mengenai network monitoring, operasional NOC, pengembangan dashboard, atau sistem internal berbasis web.',
      image: '',
      tags: ['Email', 'Collaboration', 'Indonesia'],
      href: 'mailto:ryannur003@gmail.com',
      linkText: 'SEND EMAIL'
    }
  };

  const appButtons = [...document.querySelectorAll('[data-open-app], [data-dock-app]')];
  const windowLabel = desktopWindow.querySelector('[data-window-label]');
  const windowImage = desktopWindow.querySelector('[data-window-image]');
  const windowPlaceholder = desktopWindow.querySelector('[data-window-placeholder]');
  const windowIndex = desktopWindow.querySelector('[data-window-index]');
  const windowTitle = desktopWindow.querySelector('[data-window-title]');
  const windowSubtitle = desktopWindow.querySelector('[data-window-subtitle]');
  const windowDescription = desktopWindow.querySelector('[data-window-description]');
  const windowTags = desktopWindow.querySelector('[data-window-tags]');
  const windowLink = desktopWindow.querySelector('[data-window-link]');
  const windowHandle = desktopWindow.querySelector('[data-window-handle]');
  const closeWindowButton = desktopWindow.querySelector('[data-window-action="close"]');
  const minimizeWindowButton = desktopWindow.querySelector('[data-window-action="minimize"]');
  const maximizeWindowButton = desktopWindow.querySelector('[data-window-action="maximize"]');
  let activeApp = '';
  let draggingWindow = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  appButtons.forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
  });

  function resetWindowPosition() {
    desktopWindow.style.left = '';
    desktopWindow.style.top = '';
    desktopWindow.style.right = '';
    desktopWindow.style.bottom = '';
    desktopWindow.style.removeProperty('transform');
  }

  function setActiveApp(appName) {
    appButtons.forEach((button) => {
      const buttonApp = button.dataset.openApp || button.dataset.dockApp;
      const isActive = buttonApp === appName;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function openWorkstationApp(appName) {
    const app = workstationApps[appName];
    if (!app) return;

    activeApp = appName;
    windowLabel.textContent = app.label;
    windowIndex.textContent = app.index;
    windowTitle.textContent = app.title;
    windowSubtitle.textContent = app.subtitle;
    windowDescription.textContent = app.description;
    windowLink.href = app.href;
    windowLink.firstChild.textContent = `${app.linkText} `;
    windowTags.replaceChildren();

    app.tags.forEach((tag) => {
      const tagElement = document.createElement('span');
      tagElement.textContent = tag;
      windowTags.append(tagElement);
    });

    if (app.image) {
      windowImage.src = app.image;
      windowImage.alt = `Preview ${app.title}`;
      windowImage.hidden = false;
      windowPlaceholder.hidden = true;
    } else {
      windowImage.removeAttribute('src');
      windowImage.alt = '';
      windowImage.hidden = true;
      windowPlaceholder.hidden = false;
      windowPlaceholder.querySelector('span').textContent = appName === 'contact' ? '@' : 'RN';
      windowPlaceholder.querySelector('small').textContent = app.label;
    }

    desktopWindow.classList.remove('minimized', 'maximized', 'dragging');
    resetWindowPosition();
    desktopWindow.classList.add('open');
    desktopWindow.setAttribute('aria-hidden', 'false');
    maximizeWindowButton.setAttribute('aria-label', 'Maximize window');
    setActiveApp(appName);
    closeWindowButton.focus({ preventScroll: true });
  }

  function closeWorkstationWindow() {
    desktopWindow.classList.remove('open', 'minimized', 'maximized', 'dragging');
    desktopWindow.setAttribute('aria-hidden', 'true');
    resetWindowPosition();
    setActiveApp('');
    activeApp = '';
  }

  appButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const appName = button.dataset.openApp || button.dataset.dockApp;
      openWorkstationApp(appName);
    });
  });

  closeWindowButton.addEventListener('click', closeWorkstationWindow);

  minimizeWindowButton.addEventListener('click', () => {
    desktopWindow.classList.add('minimized');
    desktopWindow.setAttribute('aria-hidden', 'true');
  });

  maximizeWindowButton.addEventListener('click', () => {
    const isMaximized = desktopWindow.classList.toggle('maximized');
    desktopWindow.classList.remove('minimized');
    maximizeWindowButton.setAttribute('aria-label', isMaximized ? 'Restore window' : 'Maximize window');
  });

  windowLink.addEventListener('click', () => {
    if (windowLink.getAttribute('href').startsWith('#')) {
      closeWorkstationWindow();
    }
  });

  windowHandle.addEventListener('pointerdown', (event) => {
    if (!hasFinePointer || event.target.closest('button') || desktopWindow.classList.contains('maximized')) return;

    const windowBounds = desktopWindow.getBoundingClientRect();
    const stageBounds = desktopStage.getBoundingClientRect();
    draggingWindow = true;
    dragOffsetX = event.clientX - windowBounds.left;
    dragOffsetY = event.clientY - windowBounds.top;
    desktopWindow.style.left = `${windowBounds.left - stageBounds.left}px`;
    desktopWindow.style.top = `${windowBounds.top - stageBounds.top}px`;
    desktopWindow.style.transform = 'none';
    desktopWindow.classList.add('dragging');
    windowHandle.setPointerCapture(event.pointerId);
  });

  windowHandle.addEventListener('pointermove', (event) => {
    if (!draggingWindow) return;

    const stageBounds = desktopStage.getBoundingClientRect();
    const windowBounds = desktopWindow.getBoundingClientRect();
    const nextLeft = Math.min(
      Math.max(event.clientX - stageBounds.left - dragOffsetX, 0),
      Math.max(stageBounds.width - windowBounds.width, 0)
    );
    const nextTop = Math.min(
      Math.max(event.clientY - stageBounds.top - dragOffsetY, 0),
      Math.max(stageBounds.height - windowBounds.height, 0)
    );

    desktopWindow.style.left = `${nextLeft}px`;
    desktopWindow.style.top = `${nextTop}px`;
  });

  function finishWindowDrag(event) {
    if (!draggingWindow) return;
    draggingWindow = false;
    desktopWindow.classList.remove('dragging');
    if (windowHandle.hasPointerCapture(event.pointerId)) {
      windowHandle.releasePointerCapture(event.pointerId);
    }
  }

  windowHandle.addEventListener('pointerup', finishWindowDrag);
  windowHandle.addEventListener('pointercancel', finishWindowDrag);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && desktopWindow.classList.contains('open')) {
      closeWorkstationWindow();
    }
  });
}

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

const magicBento = document.querySelector('.magic-bento');

if (magicBento && hasFinePointer && !prefersReducedMotion) {
  const bentoCards = [...magicBento.querySelectorAll('.capability-card')];
  const particleColors = ['#39d9ff', '#4b8cff', '#6bea9a', '#8d82ff'];

  bentoCards.forEach((card) => {
    const glow = document.createElement('span');
    glow.className = 'magic-glow';
    glow.setAttribute('aria-hidden', 'true');
    card.prepend(glow);

    card.addEventListener('pointerenter', (event) => {
      const bounds = card.getBoundingClientRect();
      const originX = event.clientX - bounds.left;
      const originY = event.clientY - bounds.top;

      for (let index = 0; index < 7; index += 1) {
        const particle = document.createElement('i');
        const angle = (Math.PI * 2 * index) / 7 + Math.random() * 0.45;
        const distance = 24 + Math.random() * 54;
        particle.className = 'magic-particle';
        particle.style.left = `${originX}px`;
        particle.style.top = `${originY}px`;
        particle.style.setProperty('--particle-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--particle-y', `${Math.sin(angle) * distance}px`);
        particle.style.setProperty('--particle-size', `${2 + Math.random() * 3}px`);
        particle.style.setProperty('--particle-color', particleColors[index % particleColors.length]);
        card.append(particle);
        particle.addEventListener('animationend', () => particle.remove(), { once: true });
      }
    });

    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      const normalizedX = localX / bounds.width - 0.5;
      const normalizedY = localY / bounds.height - 0.5;

      card.style.setProperty('--cap-x', `${localX}px`);
      card.style.setProperty('--cap-y', `${localY}px`);
      card.style.setProperty('--magic-rotate-x', `${normalizedY * -6}deg`);
      card.style.setProperty('--magic-rotate-y', `${normalizedX * 7}deg`);
      card.style.setProperty('--magic-shift-x', `${normalizedX * 5}px`);
      card.style.setProperty('--magic-shift-y', `${normalizedY * 4 - 5}px`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--magic-rotate-x', '0deg');
      card.style.setProperty('--magic-rotate-y', '0deg');
      card.style.setProperty('--magic-shift-x', '0px');
      card.style.setProperty('--magic-shift-y', '0px');
    });
  });

  magicBento.addEventListener('pointermove', (event) => {
    const gridBounds = magicBento.getBoundingClientRect();
    magicBento.style.setProperty('--bento-x', `${event.clientX - gridBounds.left}px`);
    magicBento.style.setProperty('--bento-y', `${event.clientY - gridBounds.top}px`);
    magicBento.style.setProperty('--bento-opacity', '1');

    bentoCards.forEach((card) => {
      const bounds = card.getBoundingClientRect();
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      const distance = Math.hypot(
        event.clientX - (bounds.left + bounds.width / 2),
        event.clientY - (bounds.top + bounds.height / 2)
      );
      const glowStrength = Math.max(0, 1 - distance / 420);

      card.style.setProperty('--magic-x', `${localX}px`);
      card.style.setProperty('--magic-y', `${localY}px`);
      card.style.setProperty('--magic-glow-opacity', String(glowStrength * 0.95));
    });
  });

  magicBento.addEventListener('pointerleave', () => {
    magicBento.style.setProperty('--bento-opacity', '0');
    bentoCards.forEach((card) => {
      card.style.setProperty('--magic-glow-opacity', '0');
    });
  });
}

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
  document.querySelectorAll('.hero-console, .roadmap-card').forEach((card) => {
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
    const cards = [...gallery.querySelectorAll('.gallery-image')];
    const controls = [...gallery.querySelectorAll('[data-slide]')];
    let currentSlide = 0;
    let autoplay;
    let swapTimer;
  
    function showSlide(index, animate = true) {
      const nextSlide = (index + cards.length) % cards.length;
      const outgoingCard = cards[currentSlide];

      if (animate && nextSlide !== currentSlide && !prefersReducedMotion) {
        outgoingCard.classList.add('is-swapping-out');
        window.clearTimeout(swapTimer);
        swapTimer = window.setTimeout(() => {
          outgoingCard.classList.remove('is-swapping-out');
        }, 620);
      }

      currentSlide = nextSlide;

      cards.forEach((card, cardIndex) => {
        const depth = (cardIndex - currentSlide + cards.length) % cards.length;
        const visibleDepth = Math.min(depth, 3);
        const positions = [
          { x: '0%', y: '0%', z: '80px', scale: 1, rotate: '0deg', opacity: 1 },
          { x: '7%', y: '-7%', z: '30px', scale: 0.94, rotate: '2.5deg', opacity: 0.9 },
          { x: '13%', y: '-12%', z: '0px', scale: 0.88, rotate: '5deg', opacity: 0.64 },
          { x: '17%', y: '-16%', z: '-20px', scale: 0.83, rotate: '7deg', opacity: 0.25 }
        ];
        const position = positions[visibleDepth];

        card.style.setProperty('--swap-x', position.x);
        card.style.setProperty('--swap-y', position.y);
        card.style.setProperty('--swap-z-depth', position.z);
        card.style.setProperty('--swap-scale', position.scale);
        card.style.setProperty('--swap-rotate', position.rotate);
        card.style.setProperty('--swap-opacity', depth > 3 ? 0 : position.opacity);
        card.style.setProperty('--swap-z', cards.length - depth);
        card.classList.toggle('active', depth === 0);
        card.setAttribute('aria-hidden', String(depth !== 0));
      });

      controls.forEach((control, controlIndex) => {
        const isActive = controlIndex === currentSlide;
        control.classList.toggle('active', isActive);
        control.setAttribute('aria-pressed', String(isActive));
      });
  }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      window.clearInterval(autoplay);
      autoplay = window.setInterval(() => {
        showSlide(currentSlide + 1);
      }, 5200);
    }
  
  controls.forEach((control, index) => {
    control.addEventListener('click', () => {
      showSlide(index);
        startAutoplay();
      });
    });

    cards.forEach((card, index) => {
      card.addEventListener('click', (event) => {
        if (index === currentSlide) return;
        event.stopPropagation();
        showSlide(index);
        startAutoplay();
      });
    });
  
    gallery.addEventListener('pointerenter', () => window.clearInterval(autoplay));
    gallery.addEventListener('pointerleave', startAutoplay);
    gallery.addEventListener('focusin', () => window.clearInterval(autoplay));
    gallery.addEventListener('focusout', startAutoplay);
    showSlide(0, false);
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
    const activeImage =
      visual.querySelector('.gallery-image.active img') ||
      visual.querySelector('img.gallery-image.active') ||
      visual.querySelector('img');
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
