// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  navToggle.classList.toggle('active');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// Header shrinks + gains shadow after a small scroll
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// CTD condition tabs
const tabs = document.querySelectorAll('.ctd-tab');
const panels = document.querySelectorAll('.ctd-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.ctd-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
  });
});

// Sliding nav underline
const navEl = document.querySelector('.main-nav');
if (navEl) {
  const indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  navEl.appendChild(indicator);
  const linkEls = navEl.querySelectorAll('a');
  const moveTo = (el) => {
    indicator.style.left = el.offsetLeft + 'px';
    indicator.style.width = el.offsetWidth + 'px';
  };
  const activeLink = navEl.querySelector('a.active');
  linkEls.forEach(link => {
    link.addEventListener('mouseenter', () => moveTo(link));
  });
  navEl.addEventListener('mouseleave', () => { if (activeLink) moveTo(activeLink); });
  if (activeLink) window.addEventListener('load', () => moveTo(activeLink));
}

// Cursor-follow glow behind hero card
const heroSection = document.getElementById('hero');
if (heroSection && window.matchMedia('(min-width:901px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const glow = document.createElement('div');
  glow.className = 'hero-cursor-glow';
  heroSection.prepend(glow);
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    glow.style.transform = `translate(${nx * 60}px, ${ny * 60}px)`;
  });
}

// Count-up animation for hero stats
const statEls = document.querySelectorAll('.hero-stats strong');
if (statEls.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const animateCount = (el) => {
    const text = el.textContent.trim();
    const match = text.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    const target = parseFloat(match[1]);
    const suffix = match[2];
    const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (target * eased).toFixed(decimals);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(step);
  };
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statIo.observe(el));
}

// Scroll-reveal for section headings and cards
const revealSelectors = '.section h2, .section-intro, .trio-item, .mv-card, .steps li, .ctd-tabs, .service-card, .team-card, .review-card, .info-list, .map-panel, .teaser-card';
const revealEls = document.querySelectorAll(revealSelectors);
revealEls.forEach((el, i) => {
  el.classList.add('reveal-up');
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
});

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}
