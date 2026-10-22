/* ============================================
   STACKLY Electronics — app.js
   Premium Interactions & Animations
   ============================================ */

'use strict';

/* ── 0. Logo Loader ─────────────────────── */
window.showLoader = function() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.add('active');
    setTimeout(() => { window.location.href = 'index.html'; }, 2200);
  } else {
    window.location.href = 'index.html';
  }
};

/* ── 1. Page Reveal Triggers ────────────── */
window.addEventListener('load', () => {
  document.body.classList.add('start-reveal');
});

/* ── 2. Custom Cursor ───────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const interactives = document.querySelectorAll('a, button, .cat-card, .product-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      follower.style.width = '60px';
      follower.style.height = '60px';
      follower.style.opacity = '0.35';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.width = '36px';
      follower.style.height = '36px';
      follower.style.opacity = '0.7';
    });
  });
})();

/* ── 3. Navbar Scroll Behaviour ─────────── */
(function initNav() {
  const nav = document.getElementById('mainNav');
  const navMenu = document.getElementById('navMenu');
  if (!nav) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    if (st > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = st;
  }, { passive: true });

  if (navMenu) {
    navMenu.addEventListener('show.bs.collapse', () => {
      document.body.classList.add('nav-menu-open');
    });
    navMenu.addEventListener('hide.bs.collapse', () => {
      document.body.classList.remove('nav-menu-open');
    });
  }
})();

/* ── 4. Scroll Reveal ───────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ── 5. Animated Counters ───────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num, .stat-number[data-counter]');
  if (!counters.length) return;

  function startCounter(counter) {
    if (counter.dataset.counted === 'true') return;
    counter.dataset.counted = 'true';
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = +counter.getAttribute('data-decimals') || 0;
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        counter.textContent = current.toFixed(decimals) + suffix;
      }, 16);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  counters.forEach(counter => obs.observe(counter));
})();

/* ── 6. Parallax Orbs ───────────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 18;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });
})();

/* ── 7. Add to Cart ─────────────────────── */
(function initCart() {
  let cartCount = 0;
  const badge = document.querySelector('.cart-badge');
  if (badge) badge.setAttribute('data-count', '0');
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');

  function updateCartTotal() {
    if (!cartTotal) return;
    const items = cartBody ? cartBody.querySelectorAll('.drawer-item') : [];
    let total = 0;
    items.forEach(item => {
      const priceText = item.querySelector('.drawer-item-info .item-price')?.textContent.trim() || '$0';
      const qty = parseInt(item.querySelector('.item-qty-value')?.textContent) || 1;
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      total += price * qty;
    });
    cartTotal.textContent = '$' + total.toFixed(2);
  }

  function removeCartItem(item) {
    item.remove();
    cartCount = Math.max(0, cartCount - 1);
    if (badge) { badge.textContent = cartCount; badge.setAttribute('data-count', cartCount); }
    if (!cartBody.querySelector('.drawer-item')) {
      cartBody.innerHTML = '<div class="drawer-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>';
    }
    updateCartTotal();
  }

  function changeQty(item, delta) {
    const valEl = item.querySelector('.item-qty-value');
    let qty = parseInt(valEl.textContent) + delta;
    if (qty < 1) { removeCartItem(item); return; }
    valEl.textContent = qty;
    updateCartTotal();
  }

  document.querySelectorAll('.pact-btn').forEach(btn => {
    if (!btn.querySelector('.fa-shopping-bag')) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!cartBody) return;
      const card = btn.closest('.product-card, .cat-card');
      if (!card) return;
      const img = card.querySelector('img');
      const nameEl = card.querySelector('.product-name, h3');
      const priceEl = card.querySelector('.product-price, .cat-card .product-price');
      if (!nameEl) return;
      const name = nameEl.textContent.trim();
      const price = priceEl ? priceEl.textContent.trim() : '';
      const imgSrc = img ? img.src : '';

      cartCount++;
      if (badge) {
        badge.textContent = cartCount;
        badge.setAttribute('data-count', cartCount);
        badge.style.transform = 'scale(1.6)';
        setTimeout(() => badge.style.transform = '', 300);
      }

      const empty = cartBody.querySelector('.drawer-empty');
      if (empty) empty.remove();

      const item = document.createElement('div');
      item.className = 'drawer-item';
      item.innerHTML = `
        <img src="${imgSrc}" alt="${name}" class="drawer-item-img" />
        <div class="drawer-item-info">
          <h4>${name}</h4>
          <p class="item-price">${price}</p>
          <div class="item-qty-wrap">
            <button class="item-qty-btn item-qty-minus">&minus;</button>
            <span class="item-qty-value">1</span>
            <button class="item-qty-btn item-qty-plus">+</button>
          </div>
        </div>
        <button class="drawer-item-remove" title="Remove">&times;</button>
      `;
      item.querySelector('.drawer-item-remove').addEventListener('click', () => removeCartItem(item));
      item.querySelector('.item-qty-minus').addEventListener('click', () => changeQty(item, -1));
      item.querySelector('.item-qty-plus').addEventListener('click', () => changeQty(item, 1));
      cartBody.appendChild(item);
      updateCartTotal();
      showToast('Added to cart 🛍');
    });
  });
})();

/* ── 9. Toast Notification ──────────────── */
function showToast(message) {
  const existing = document.querySelector('.lumis-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'lumis-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 5rem; left: 50%; transform: translateX(-50%) translateY(20px);
    background: #1a1714; color: #faf8f5;
    padding: 0.85rem 1.75rem; border-radius: 99px;
    font-size: 0.875rem; font-family: 'Inter', sans-serif;
    box-shadow: 0 12px 40px rgba(0,0,0,0.35);
    border: 1px solid rgba(194, 133, 82,0.3);
    z-index: 99999; opacity: 0;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 2500);
}

/* ── 10. Cart & Wishlist Drawers ────────── */
(function initDrawers() {
  const overlay = document.getElementById('drawerOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const wishlistDrawer = document.getElementById('wishlistDrawer');
  const cartToggle = document.getElementById('cartToggle');
  const wishlistToggle = document.getElementById('wishlistToggle');
  const cartClose = document.getElementById('cartClose');
  const wishlistClose = document.getElementById('wishlistClose');

  if (!overlay) return;

  function openDrawer(drawer) {
    overlay.classList.add('open');
    if (drawer) drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawers() {
    overlay.classList.remove('open');
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (wishlistDrawer) wishlistDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartToggle) cartToggle.addEventListener('click', (e) => { e.preventDefault(); openDrawer(cartDrawer); });
  if (wishlistToggle) wishlistToggle.addEventListener('click', (e) => { e.preventDefault(); openDrawer(wishlistDrawer); });
  if (cartClose) cartClose.addEventListener('click', closeDrawers);
  if (wishlistClose) wishlistClose.addEventListener('click', closeDrawers);
  overlay.addEventListener('click', closeDrawers);

  // Track wishlist items from product cards
  let wishlistCount = 0;
  const wishlistBadge = document.querySelector('.wishlist-badge');
  if (wishlistBadge) wishlistBadge.setAttribute('data-count', '0');
  const wishlistBody = document.getElementById('wishlistBody');

  function updateWishlistBadge() {
    if (!wishlistBadge) return;
    const items = wishlistBody ? wishlistBody.querySelectorAll('.drawer-item') : [];
    wishlistCount = items.length;
    wishlistBadge.textContent = wishlistCount;
    wishlistBadge.setAttribute('data-count', wishlistCount);
  }

  document.querySelectorAll('.pact-btn').forEach(btn => {
    if (!btn.querySelector('.fa-heart')) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!wishlistBody) return;
      const card = btn.closest('.product-card, .cat-card');
      if (!card) return;
      const img = card.querySelector('img');
      const nameEl = card.querySelector('.product-name, h3');
      const priceEl = card.querySelector('.product-price, .cat-card .product-price');
      if (!nameEl) return;
      const name = nameEl.textContent.trim();
      const price = priceEl ? priceEl.textContent.trim() : '';
      const imgSrc = img ? img.src : '';

      const icon = btn.querySelector('i');
      if (icon.classList.contains('far')) {
        icon.classList.replace('far', 'fas');
        btn.style.color = '#ef4444';
        const empty = wishlistBody.querySelector('.drawer-empty');
        if (empty) empty.remove();
        const item = document.createElement('div');
        item.className = 'drawer-item';
        item.dataset.name = name;
        item.innerHTML = `
          <img src="${imgSrc}" alt="${name}" class="drawer-item-img" />
          <div class="drawer-item-info">
            <h4>${name}</h4>
            <p class="item-price">${price}</p>
            <div class="item-qty-wrap">
              <button class="item-qty-btn item-qty-minus">&minus;</button>
              <span class="item-qty-value">1</span>
              <button class="item-qty-btn item-qty-plus">+</button>
            </div>
          </div>
          <button class="drawer-item-remove" title="Remove">&times;</button>
        `;
        item.querySelector('.drawer-item-remove').addEventListener('click', () => {
          item.remove();
          if (!wishlistBody.querySelector('.drawer-item')) {
            wishlistBody.innerHTML = '<div class="drawer-empty"><i class="far fa-heart"></i><p>Your wishlist is empty</p></div>';
          }
          updateWishlistBadge();
          document.querySelectorAll('.pact-btn').forEach(b => {
            const i = b.querySelector('i');
            const cardEl = b.closest('.product-card, .cat-card');
            if (cardEl && cardEl.querySelector('.product-name, h3')?.textContent.trim() === name) {
              if (i) { i.classList.replace('fas', 'far'); b.style.color = ''; }
            }
          });
        });
        item.querySelector('.item-qty-minus').addEventListener('click', () => {
          let qty = parseInt(item.querySelector('.item-qty-value').textContent) - 1;
          if (qty < 1) { item.querySelector('.drawer-item-remove').click(); return; }
          item.querySelector('.item-qty-value').textContent = qty;
          updateWishlistBadge();
        });
        item.querySelector('.item-qty-plus').addEventListener('click', () => {
          let qty = parseInt(item.querySelector('.item-qty-value').textContent) + 1;
          item.querySelector('.item-qty-value').textContent = qty;
          updateWishlistBadge();
        });
        wishlistBody.appendChild(item);
        updateWishlistBadge();
      } else {
        icon.classList.replace('fas', 'far');
        btn.style.color = '';
        const item = wishlistBody.querySelector(`.drawer-item[data-name="${name}"]`);
        if (item) item.remove();
        if (!wishlistBody.querySelector('.drawer-item')) {
          wishlistBody.innerHTML = '<div class="drawer-empty"><i class="far fa-heart"></i><p>Your wishlist is empty</p></div>';
        }
        updateWishlistBadge();
      }
    });
  });
})();

/* ── 10b. Search Overlay ───────────────── */
(function initSearch() {
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  if (!searchOverlay || !searchToggle) return;

  function openSearch() {
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (searchInput) setTimeout(() => searchInput.focus(), 300);
  }

  function closeSearch() {
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  searchToggle.addEventListener('click', (e) => { e.preventDefault(); openSearch(); });

  if (searchClose) searchClose.addEventListener('click', closeSearch);

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('open')) closeSearch();
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openSearch(); }
  });
})();

/* ── 11. Back to Top ────────────────────── */

/* -- 10c. FAQ Accordions ------------------ */
(function initAccordions() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  function toggleItem(item) {
    const isOpen = item.classList.toggle('active');
    const header = item.querySelector('.accordion-header');
    if (header) header.setAttribute('aria-expanded', String(isOpen));
  }

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
    header.addEventListener('click', () => toggleItem(item));
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(item);
      }
    });
  });
})();

/* -- 10d. Footer Trust Selection ---------- */
(function initFooterTrustButtons() {
  const trustButtons = document.querySelectorAll('.footer-trust span');
  if (!trustButtons.length) return;

  trustButtons.forEach(button => {
    const link = button.querySelector('a');

    button.setAttribute('tabindex', '0');
    button.setAttribute('role', 'button');

    function goToTrustLink() {
      if (link) window.location.href = link.getAttribute('href') || '404.html';
    }

    button.addEventListener('click', (e) => {
      e.preventDefault();
      goToTrustLink();
    });
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToTrustLink();
      }
    });
  });
})();
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── 11. Smooth Scroll for Nav Links ────── */
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      
      // Close mobile menu robustly
      const collapse = document.getElementById('navMenu');
      if (collapse && collapse.classList.contains('show')) {
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) {
          toggler.click();
        } else {
          const bsCollapse = bootstrap.Collapse.getInstance(collapse) || new bootstrap.Collapse(collapse, { toggle: false });
          bsCollapse.hide();
        }
      }
    }
  });
});

/* ── 12. Active Nav Link on Scroll ─────── */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.lumis-nav .nav-link');
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && href.includes('index.html')) || (page === '' && href.includes('index.html'))) {
      link.classList.add('active');
    }
  });
})();

/* ── 13. Tilt Effect on Cards ───────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.product-card, .cat-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── 14. Scroll-triggered Navbar links ──── */
(function navLinkHover() {
  // Already handled via CSS, this adds a ripple on mobile tap
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      this.style.color = '#c28552';
      setTimeout(() => this.style.color = '', 500);
    });
  });
})();

/* ── 15. Hero image parallax on scroll ──── */
(function heroParallax() {
  window.addEventListener('scroll', () => {
    const activeImg = document.querySelector('.hero-slide.active img');
    if (!activeImg) return;
    if (window.innerWidth < 992) {
      activeImg.style.transform = '';
      return;
    }
    const y = window.scrollY * 0.25;
    activeImg.style.transform = `translateY(${y}px)`;
  }, { passive: true });
})();

/* ── 16. Hero Slideshow ─────────────────── */
(function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const badgeLabel = document.querySelector('.hero-img-badge .badge-label');
  const badgeName = document.querySelector('.hero-img-badge .badge-name');
  const badgePrice = document.querySelector('.hero-img-badge .badge-price');
  const badgeContent = document.querySelector('.hero-img-badge .badge-content');
  
  if (!slides.length) return;
  
  let currentIndex = 0;
  
  function changeSlide() {
    const activeSlide = slides[currentIndex];
    activeSlide.classList.remove('active');
    
    currentIndex = (currentIndex + 1) % slides.length;
    const nextSlide = slides[currentIndex];
    nextSlide.classList.add('active');
    
    // Animate badge text change
    if (badgeContent && badgeLabel && badgeName && badgePrice) {
      badgeContent.style.opacity = '0';
      badgeContent.style.transform = 'translateY(5px)';
      
      setTimeout(() => {
        badgeLabel.textContent = nextSlide.getAttribute('data-label');
        badgeName.textContent = nextSlide.getAttribute('data-name');
        badgePrice.textContent = nextSlide.getAttribute('data-price');
        
        badgeContent.style.opacity = '1';
        badgeContent.style.transform = 'translateY(0)';
      }, 300);
    }
  }
  
  setInterval(changeSlide, 3000);
})();

