/**
 * Showcase Bridge — Dynamic Client Customization Engine
 * Allows the template to live-update brand name, accent colors, logo, taglines,
 * and contact numbers from the Showcase Hub or via URL query parameters.
 */
(function () {
  'use strict';

  // Base list of brand names across all portfolio projects
  const BASE_BRAND_PATTERNS = [
    'Plaza Enterprises Pvt Ltd',
    'Plaza Corporate Gifts',
    'Plaza Enterprises',
    'Plaza Quartz',
    'Plaza Clocks?',
    'Plaza',
    'Electwell Engineers Pvt Ltd',
    'Electwell Engineers',
    'Electwell',
    'Padma Cable Infrastructure',
    'Padma Cables?',
    'Padma',
    'Young Wheels Consumer Goods',
    'Young Wheels',
    'YoungWheels'
  ];

  // Protected navigation terms that should NEVER be touched or replaced
  const PROTECTED_TERMS = new Set([
    'home',
    'about',
    'about us',
    'contact',
    'contact us',
    'catalogue',
    'catalog',
    'collections',
    'corporate',
    'products',
    'all products',
    'gallery',
    'blog',
    'blogs',
    'events',
    'exports',
    'our clients',
    'infrastructure',
    'inquire',
    'inquiry',
    'quote',
    'get a quote',
    'get in touch',
    'rfq',
    'services',
    'solutions',
    'clients',
    'quality',
    'certifications',
    'sitemap',
    'privacy policy',
    'terms of service',
    'commercial plaza',
    'commercial vista',
    'wall clocks',
    'table clocks',
    'pen stand',
    'pen stands',
    'photo frames',
    'desktop items',
    'mobile stand',
    'mobile stands',
    'wrist watches',
    'menu',
    'close',
    'download catalogue',
    'request quote',
    'quick view'
  ]);

  let currentBrandData = {
    name: '',
    tagline: '',
    primaryColor: '',
    phone: '',
    email: '',
    logoUrl: '',
    products: []
  };

  let lastAppliedBrandName = '';

  // Helper to darken or lighten a hex color
  function adjustColor(hex, percent) {
    if (!hex || !hex.startsWith('#')) return hex;
    let cleanHex = hex.slice(1);
    if (cleanHex.length === 3) {
      cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
    }
    let num = parseInt(cleanHex, 16);
    if (isNaN(num)) return hex;
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
    let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // Helper to generate a fresh, stateless brand regex
  function getBrandRegex(prevCustomName) {
    const list = [...BASE_BRAND_PATTERNS];
    if (prevCustomName && prevCustomName.trim().length > 1) {
      const escaped = prevCustomName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      list.unshift(escaped);
    }
    return new RegExp('\\b(' + list.join('|') + ')\\b', 'gi');
  }

  // Generate a rectangular SVG logo badge
  function createBrandLogoSvg(name, color) {
    const accent = color || '#E6C378';
    const cleanName = (name || 'Brand').trim();
    const words = cleanName.split(' ').filter(Boolean);
    const initials = words.slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'CO';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 64" width="280" height="64">
        <rect x="4" y="8" width="48" height="48" rx="12" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="1.8"/>
        <text x="28" y="39" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="22" fill="${accent}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
        <text x="64" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="18" fill="#ffffff" letter-spacing="0.5">${cleanName}</text>
        <text x="64" y="49" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="9" fill="${accent}" letter-spacing="2">OFFICIAL PREVIEW</text>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Generate a circular SVG logo badge for round icons
  function createCircleMonogramSvg(name, color) {
    const accent = color || '#8B5CF6';
    const cleanName = (name || 'CO').trim();
    const words = cleanName.split(' ').filter(Boolean);
    const initials = words.slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'CO';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
        <circle cx="25" cy="25" r="24" fill="${accent}" />
        <circle cx="25" cy="25" r="21" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.4"/>
        <text x="25" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="19" fill="#ffffff" text-anchor="middle">${initials}</text>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Helper to determine if an element is part of a navigation bar, menu, or nav link
  function isNavigationElement(el) {
    if (!el) return false;
    if (el.nodeType === Node.TEXT_NODE) {
      el = el.parentElement;
    }
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;

    // Check tag names
    if (['NAV', 'BUTTON'].includes(el.tagName)) return true;
    if (el.getAttribute('role') === 'navigation') return true;

    // Check if inside a <nav> or header navigation area
    if (el.closest('nav') || el.closest('[role="navigation"]') || el.closest('.nav-links') || el.closest('.navbar-nav')) {
      return true;
    }

    // Check if inside header nav list
    if (el.closest('header nav') || el.closest('header ul') || el.closest('.mobile-menu')) {
      return true;
    }

    // Check text against protected navigation items
    const text = (el.innerText || el.textContent || '').trim().toLowerCase();
    if (PROTECTED_TERMS.has(text)) {
      return true;
    }

    return false;
  }

  // Walk DOM text nodes and replace brand names safely without touching navigation
  function replaceTextInNode(node, newText) {
    if (!node || !newText) return;

    if (node.nodeType === Node.TEXT_NODE) {
      if (isNavigationElement(node)) return;

      const trimmedVal = node.nodeValue.trim().toLowerCase();
      if (PROTECTED_TERMS.has(trimmedVal)) return;

      const regex = getBrandRegex(lastAppliedBrandName);
      if (regex.test(node.nodeValue)) {
        regex.lastIndex = 0;
        node.nodeValue = node.nodeValue.replace(regex, newText);
      }
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      !['SCRIPT', 'STYLE', 'SVG', 'PATH', 'IFRAME', 'CODE', 'NAV'].includes(node.tagName)
    ) {
      if (node.tagName === 'NAV' || node.getAttribute('role') === 'navigation') {
        return;
      }
      for (let child of node.childNodes) {
        replaceTextInNode(child, newText);
      }
    }
  }

  // Replace logos in header, footer, and preloader
  function applyLogo(logoUrl, name, color) {
    const logoSelectors = [
      'img[alt*="logo" i]',
      'img[src*="logo" i]',
      '.brand-logo',
      '#header-logo-img',
      '.footer-logo-img',
      '.preloader-company-logo',
      'header a[href="/"] img',
      'header a.group img',
      '.site-logo img'
    ];

    const logoImgs = document.querySelectorAll(logoSelectors.join(', '));
    logoImgs.forEach((img) => {
      if (!img.dataset.originalSrc) {
        img.dataset.originalSrc = img.src;
      }

      // If user uploaded a custom logo image, always use it
      if (logoUrl) {
        img.src = logoUrl;
      } else if (name && name.trim()) {
        // If image is round (like Electwell header icon), use circle monogram SVG
        if (img.id === 'header-logo-img' || img.style.borderRadius === '50%' || img.classList.contains('preloader-company-logo')) {
          img.src = createCircleMonogramSvg(name, color);
        } else {
          img.src = createBrandLogoSvg(name, color);
        }
      }

      img.style.objectFit = 'contain';
      img.style.filter = 'none';
      if (img.classList.contains('invert')) {
        img.classList.remove('invert');
      }
    });
  }

  function restoreOriginalLogos() {
    const logoSelectors = [
      'img[alt*="logo" i]',
      'img[src*="logo" i]',
      '.brand-logo',
      '#header-logo-img',
      '.footer-logo-img',
      '.preloader-company-logo',
      'header a[href="/"] img',
      'header a.group img',
      '.site-logo img'
    ];
    document.querySelectorAll(logoSelectors.join(', ')).forEach((img) => {
      if (img.dataset.originalSrc) {
        img.src = img.dataset.originalSrc;
      }
    });
  }

  let isMutatingInternal = false;
  let brandingDebounceTimer = null;

  function recolorDomElements(primaryColor, lightColor, darkColor) {
    if (!primaryColor) return;
    try {
      const redRegex = /#(d32f2f|af1716|e53935|b71c1c|ff1744|c62828)|rgb\(\s*(211,\s*47,\s*47|175,\s*23,\s*22|229,\s*57,\s*53|183,\s*28,\s*28|255,\s*23,\s*68)\)/i;

      // 1. Rewrite inline styles with hardcoded red
      const styledEls = document.querySelectorAll('[style]');
      styledEls.forEach((el) => {
        const styleText = el.getAttribute('style') || '';
        if (redRegex.test(styleText)) {
          if (el.style.color && redRegex.test(el.style.color)) {
            el.style.color = primaryColor;
          }
          if (el.style.backgroundColor && redRegex.test(el.style.backgroundColor)) {
            el.style.backgroundColor = primaryColor;
          }
          if (el.style.borderColor && redRegex.test(el.style.borderColor)) {
            el.style.borderColor = primaryColor;
          }
          if (el.style.borderLeftColor && redRegex.test(el.style.borderLeftColor)) {
            el.style.borderLeftColor = primaryColor;
          }
          if (el.style.borderBottomColor && redRegex.test(el.style.borderBottomColor)) {
            el.style.borderBottomColor = primaryColor;
          }
          if (el.style.background && redRegex.test(el.style.background)) {
            if (el.style.background.includes('linear-gradient')) {
              el.style.background = `linear-gradient(90deg, ${primaryColor} 0%, ${darkColor} 100%)`;
            } else {
              el.style.background = primaryColor;
            }
          }
        }
      });

      // 2. SVG strokes and fills
      document.querySelectorAll('svg, path, circle, line, polyline').forEach((el) => {
        const stroke = el.getAttribute('stroke');
        if (stroke && redRegex.test(stroke)) {
          el.setAttribute('stroke', primaryColor);
        }
        const fill = el.getAttribute('fill');
        if (fill && redRegex.test(fill) && fill.toLowerCase() !== 'none') {
          el.setAttribute('fill', primaryColor);
        }
      });

      // 3. Guarantee key hero and about elements
      document.querySelectorAll('.golden-title-box, #golden-title-box').forEach((box) => {
        box.style.background = `linear-gradient(135deg, ${lightColor} 0%, ${primaryColor} 50%, ${darkColor} 100%)`;
        box.style.boxShadow = `0 10px 30px ${primaryColor}55`;
      });

      document.querySelectorAll('.about-main-heading').forEach((h) => {
        h.style.color = primaryColor;
        h.style.fontFamily = "var(--font-heading, 'Montserrat', sans-serif)";
      });

      document.querySelectorAll('.nav-underline').forEach((u) => {
        u.style.backgroundColor = primaryColor;
      });

      document.querySelectorAll('.social-circle-icon').forEach((s) => {
        s.style.color = primaryColor;
        s.style.borderColor = primaryColor + '40';
      });

      document.querySelectorAll('.brand-accent-stripe').forEach((stripe) => {
        stripe.style.backgroundColor = primaryColor;
      });

      document.querySelectorAll('.golden-counter-card').forEach((card) => {
        card.style.backgroundColor = primaryColor;
        card.style.boxShadow = `0 8px 25px ${primaryColor}40`;
      });
    } catch (e) {
      console.warn('recolorDomElements error:', e);
    }
  }

  // Dynamic Product Replacer Engine
  function applyProducts(products) {
    if (!products || !Array.isArray(products) || products.length === 0) return;
    try {
      const validProds = products.filter(p => p && (p.name || (p.images && p.images.length > 0) || p.image));
      if (validProds.length === 0) return;

      // 1. Update the Hero Machine/Product Cutout
      const firstProd = validProds[0];
      const firstCover = (firstProd.images && firstProd.images[0]) || firstProd.image;
      if (firstCover) {
        const heroCutouts = document.querySelectorAll(
          '.machine-cutout-frame img, .hero-product-img, .hero-clock-visual img, .hero-cable-img, .hero-toy-img'
        );
        heroCutouts.forEach(img => {
          if (!img.dataset.originalSrc) img.dataset.originalSrc = img.src;
          img.src = firstCover;
          img.alt = firstProd.name || 'Hero Product';
        });
      }

      // 2. Update Carousel & Grid Cards Across All Templates
      const cardSelectors = [
        '.carousel-card-item',
        '.product-machine-card',
        '.cable-card',
        '.clock-card',
        '.luxury-product-card',
        '.collection-card',
        '.toy-card',
        '.product-card'
      ];

      const cards = document.querySelectorAll(cardSelectors.join(', '));
      cards.forEach((card, idx) => {
        const prod = validProds[idx % validProds.length];
        if (!prod) return;

        const allImages = (prod.images && prod.images.length > 0)
          ? prod.images
          : (prod.image ? [prod.image] : []);
        const coverImg = allImages[0];

        // Replace product image
        const imgEl = card.querySelector('img');
        if (imgEl && coverImg) {
          if (!imgEl.dataset.originalSrc) imgEl.dataset.originalSrc = imgEl.src;
          imgEl.src = coverImg;
          imgEl.alt = prod.name || 'Product Image';
        }

        // Replace product title
        const titleEl = card.querySelector(
          '.card-product-title, .product-label-text, .toy-title, .clock-title, .cable-name, h3, h4'
        );
        if (titleEl && prod.name) {
          titleEl.innerText = prod.name;
        }

        // Replace category / price tag
        const tagEl = card.querySelector(
          '.card-category-badge, .product-category, .toy-category, .tag-label, .category-badge, .card-price'
        );
        if (tagEl && (prod.category || prod.price)) {
          tagEl.innerText = prod.price ? `${prod.category || 'Product'} • ${prod.price}` : prod.category;
        }

        // Render interactive multi-image thumbnail previews on cards
        if (allImages.length > 1 && imgEl) {
          let swatchBox = card.querySelector('.bridge-img-swatches');
          if (!swatchBox) {
            swatchBox = document.createElement('div');
            swatchBox.className = 'bridge-img-swatches';
            swatchBox.style.cssText = `
              display: flex;
              gap: 5px;
              justify-content: center;
              align-items: center;
              padding: 6px 0;
              z-index: 15;
              position: relative;
            `;
            const imageWrapper = card.querySelector('.card-image-box, .product-img-frame, .img-wrapper') || imgEl.parentElement;
            if (imageWrapper) {
              imageWrapper.appendChild(swatchBox);
            }
          }

          swatchBox.innerHTML = '';
          allImages.forEach((imgSrc, imgIdx) => {
            const thumbBtn = document.createElement('button');
            thumbBtn.type = 'button';
            thumbBtn.style.cssText = `
              width: 22px;
              height: 22px;
              border-radius: 4px;
              overflow: hidden;
              border: 1.5px solid ${imgIdx === 0 ? 'var(--primary, #3b82f6)' : 'rgba(255, 255, 255, 0.4)'};
              padding: 0;
              cursor: pointer;
              background: #000;
              transition: all 0.2s ease;
              flex-shrink: 0;
            `;
            thumbBtn.title = `View Photo ${imgIdx + 1}`;

            const thumbImg = document.createElement('img');
            thumbImg.src = imgSrc;
            thumbImg.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
            thumbBtn.appendChild(thumbImg);

            thumbBtn.onclick = (e) => {
              e.stopPropagation();
              e.preventDefault();
              imgEl.src = imgSrc;
              swatchBox.querySelectorAll('button').forEach((b, bi) => {
                b.style.borderColor = bi === imgIdx ? 'var(--primary, #3b82f6)' : 'rgba(255, 255, 255, 0.4)';
                b.style.transform = bi === imgIdx ? 'scale(1.15)' : 'scale(1)';
              });
            };

            swatchBox.appendChild(thumbBtn);
          });
        }
      });
    } catch (e) {
      console.warn('applyProducts error:', e);
    }
  }

  function applyBranding(data) {
    if (!data) return;
    currentBrandData = { ...currentBrandData, ...data };
    if (brandingDebounceTimer) clearTimeout(brandingDebounceTimer);
    brandingDebounceTimer = setTimeout(() => {
      runApplyBranding();
    }, 100);
  }

  function runApplyBranding() {
    isMutatingInternal = true;
    try {
      const { name, tagline, primaryColor, phone, email, logoUrl } = currentBrandData;

      // 1. Dynamic Logo & Brand Name in Navbar
      if (logoUrl || (name && name.trim())) {
        applyLogo(logoUrl, name, primaryColor);
      } else {
        restoreOriginalLogos();
      }

    // 2. Comprehensive Dynamic Color Injection
    if (primaryColor) {
      const darkColor = adjustColor(primaryColor, -25);
      const darkerColor = adjustColor(primaryColor, -40);
      const midColor = adjustColor(primaryColor, -12);
      const lightColor = adjustColor(primaryColor, 18);
      const lighterColor = adjustColor(primaryColor, 35);
      const glowShadow = primaryColor + '55';

      document.documentElement.style.setProperty('--gold', primaryColor);
      document.documentElement.style.setProperty('--primary', primaryColor);
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.style.setProperty('--primary-dark', darkColor);
      document.documentElement.style.setProperty('--primary-light', lightColor);
      document.documentElement.style.setProperty('--accent', primaryColor);
      document.documentElement.style.setProperty('--accent-color', primaryColor);
      document.documentElement.style.setProperty('--accent-hover', darkColor);
      document.documentElement.style.setProperty('--accent-light', lightColor);
      document.documentElement.style.setProperty('--brand-red', primaryColor);
      document.documentElement.style.setProperty('--vibrant-red', lightColor);
      document.documentElement.style.setProperty('--golden-orange', primaryColor);
      document.documentElement.style.setProperty('--link-blue', primaryColor);
      document.documentElement.style.setProperty('--nav-accent', primaryColor);
      document.documentElement.style.setProperty('--shadow-accent', glowShadow);
      document.documentElement.style.setProperty('--header-red-grad', `linear-gradient(90deg, ${primaryColor} 0%, ${midColor} 50%, ${darkColor} 100%)`);
      document.documentElement.style.setProperty('--bg-gradient', `linear-gradient(135deg, ${lightColor} 0%, ${primaryColor} 45%, ${darkColor} 100%)`);
      // Plazaclock and Padmacables variable bridges
      document.documentElement.style.setProperty('--plum', primaryColor);
      document.documentElement.style.setProperty('--aubergine', darkColor);
      document.documentElement.style.setProperty('--wine', midColor);
      document.documentElement.style.setProperty('--line', primaryColor + '22');
      document.documentElement.style.setProperty('--line-dark', primaryColor + '14');

      let styleEl = document.getElementById('showcase-dynamic-styles');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'showcase-dynamic-styles';
        document.head.appendChild(styleEl);
      }

      styleEl.innerHTML = `
        :root {
          --gold: ${primaryColor} !important;
          --primary: ${primaryColor} !important;
          --primary-color: ${primaryColor} !important;
          --primary-dark: ${darkColor} !important;
          --primary-light: ${lightColor} !important;
          --accent: ${primaryColor} !important;
          --accent-color: ${primaryColor} !important;
          --accent-hover: ${darkColor} !important;
          --accent-light: ${lightColor} !important;
          --brand-red: ${primaryColor} !important;
          --vibrant-red: ${lightColor} !important;
          --golden-orange: ${primaryColor} !important;
          --link-blue: ${primaryColor} !important;
          --nav-accent: ${primaryColor} !important;
          --shadow-accent: ${glowShadow} !important;
          --header-red-grad: linear-gradient(90deg, ${primaryColor} 0%, ${midColor} 50%, ${darkColor} 100%) !important;
          --bg-gradient: linear-gradient(135deg, ${lightColor} 0%, ${primaryColor} 45%, ${darkColor} 100%) !important;
          --plum: ${primaryColor} !important;
          --aubergine: ${darkColor} !important;
          --wine: ${midColor} !important;
          --line: ${primaryColor}22 !important;
          --line-dark: ${primaryColor}14 !important;
        }

        /* 1. Electwell Header Bar & Accent Stripe */
        .jm-header-bar {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.25) 0%, transparent 35%), linear-gradient(90deg, ${primaryColor} 0%, ${midColor} 50%, ${darkColor} 100%) !important;
        }
        .brand-accent-stripe {
          background: ${primaryColor} !important;
        }
        .brand-text-name sup {
          color: ${primaryColor} !important;
        }

        /* 2. Navigation Underlines & Active Indicator */
        .nav-underline,
        .jm-nav-link-btn.active .nav-underline,
        .jm-nav-link-btn:hover .nav-underline,
        .mobile-nav-link.active .nav-underline,
        .mobile-nav-link:hover .nav-underline {
          background-color: ${primaryColor} !important;
          background: ${primaryColor} !important;
          transform: scaleX(1) !important;
        }
        .mobile-nav-link.active,
        .mobile-nav-link:hover,
        .mobile-menu-btn:active {
          background: ${primaryColor} !important;
          color: #ffffff !important;
        }
        .mobile-nav-close:hover {
          background: ${primaryColor} !important;
        }

        /* 3. Hero Section Concentric Circles & Top Tag */
        .layer-1 { background: ${darkColor} !important; }
        .layer-2 { background: ${primaryColor} !important; }
        .layer-3 { background: ${primaryColor}33 !important; }
        .layer-4 { background: ${primaryColor}15 !important; }
        .hero-top-tag { color: ${primaryColor} !important; }
        .hero-spec-badge.layer {
          background: linear-gradient(135deg, ${lightColor} 0%, ${primaryColor} 100%) !important;
          border-color: ${primaryColor} !important;
          color: #ffffff !important;
        }

        /* 4. Golden Title Box & About Main Heading */
        .golden-title-box,
        #golden-title-box {
          background: linear-gradient(135deg, ${lightColor} 0%, ${primaryColor} 50%, ${darkColor} 100%) !important;
          box-shadow: 0 10px 30px ${glowShadow} !important;
        }
        .golden-title-box:hover,
        #golden-title-box:hover {
          background: linear-gradient(135deg, ${primaryColor} 0%, ${darkColor} 100%) !important;
          box-shadow: 0 15px 35px ${glowShadow} !important;
        }
        .about-main-heading {
          font-family: var(--font-heading, 'Montserrat', sans-serif) !important;
          color: ${primaryColor} !important;
          font-weight: 700 !important;
        }
        .about-red-story-card {
          background-color: ${darkColor} !important;
          box-shadow: 0 20px 45px ${glowShadow} !important;
        }

        /* 5. Mosaic Counters & Statistics */
        .golden-counter-card {
          background-color: ${primaryColor} !important;
          box-shadow: 0 8px 25px ${glowShadow} !important;
        }
        .golden-counter-card:hover {
          background-color: ${darkColor} !important;
          box-shadow: 0 16px 40px ${darkerColor}80 !important;
        }

        /* 6. Two-Tone & Multi-Tone Title Gradients */
        .tapered-header-line {
          background: linear-gradient(90deg, ${primaryColor}0d, ${lightColor} 40%, ${primaryColor}, ${darkColor}) !important;
        }
        .title-blue {
          background: linear-gradient(90deg, ${darkColor}, ${primaryColor}) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .title-purple, .tone-purple {
          background: linear-gradient(90deg, ${primaryColor}, ${midColor}, ${darkColor}) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .tone-blue {
          background: linear-gradient(90deg, ${lightColor}, ${primaryColor}) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        .tone-dark-purple {
          background: linear-gradient(90deg, ${darkColor}, ${primaryColor}) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }

        /* 7. Product Showcase & Carousel Controls */
        .btn-product-arrow {
          color: ${primaryColor} !important;
          border-color: ${primaryColor}40 !important;
          box-shadow: 0 4px 14px ${primaryColor}25 !important;
        }
        .btn-product-arrow:hover {
          background: linear-gradient(135deg, ${lightColor}, ${primaryColor}) !important;
          color: #ffffff !important;
          border-color: transparent !important;
          box-shadow: 0 10px 25px ${glowShadow} !important;
        }
        .product-machine-card:hover {
          border-color: ${primaryColor}66 !important;
          box-shadow: 0 20px 45px ${primaryColor}33 !important;
        }
        .product-label-accent {
          background: linear-gradient(180deg, ${lightColor}, ${primaryColor}) !important;
        }

        /* 8. Finance & Action Cards */
        .finance-purple-title {
          color: ${primaryColor} !important;
        }
        .btn-finance-know {
          background: linear-gradient(90deg, ${primaryColor}, ${midColor}, ${darkColor}) !important;
          box-shadow: 0 6px 18px ${primaryColor}4d !important;
        }
        .finance-card-item:hover .btn-finance-know,
        .btn-finance-know:hover {
          background: linear-gradient(90deg, ${lightColor}, ${primaryColor}, ${darkColor}) !important;
          box-shadow: 0 8px 25px ${glowShadow} !important;
        }

        /* 9. News Section & Pulse */
        .jm-news-section {
          background: linear-gradient(135deg, ${darkColor}, ${primaryColor}, #0a0d14 85%) !important;
        }
        .news-section-heading:after, .pulse-title-text:after {
          background-color: ${lightColor} !important;
        }
        .magazine-card-white {
          border-color: ${primaryColor}33 !important;
        }

        /* 10. Floating Social Icons & Carousel Chevrons */
        .social-circle-icon {
          color: ${primaryColor} !important;
          border-color: ${primaryColor}40 !important;
        }
        .social-circle-icon:hover {
          background: linear-gradient(135deg, ${lightColor} 0%, ${primaryColor} 100%) !important;
          color: #ffffff !important;
          border-color: transparent !important;
          box-shadow: 0 8px 25px ${glowShadow} !important;
        }
        .social-circle-icon svg {
          fill: currentColor !important;
        }
        .carousel-chevron {
          color: ${primaryColor} !important;
        }
        .carousel-chevron:hover {
          color: ${darkColor} !important;
          box-shadow: 0 14px 35px ${glowShadow} !important;
        }

        /* 11. Buttons & CTAs across all projects */
        .primary-btn, 
        .rfq-btn, 
        .btn-primary, 
        .btn-gradient, 
        .toy-button, 
        .catalog-cta, 
        .view-all-btn, 
        .contact-submit-btn,
        .brochure-btn,
        .jm-cta-btn,
        .pc-nav-btn,
        button.bg-primary,
        button.bg-\\[var\\(--gold\\)\\] {
          background: linear-gradient(135deg, ${lightColor} 0%, ${primaryColor} 100%) !important;
          border-color: ${primaryColor} !important;
          color: #ffffff !important;
        }

        /* 12. Text & Accent Highlights across all projects */
        .text-primary, 
        .text-\\[var\\(--gold\\)\\], 
        .gold-underline, 
        .brand-text-accent, 
        .stat-number, 
        .section-tag,
        .gold-accent-text,
        .badge-accent,
        .accent-text,
        .footer-link-item:hover,
        .contact-email-link:hover {
          color: ${primaryColor} !important;
        }

        /* 13. Borders and Highlights */
        .border-primary, 
        .border-\\[var\\(--gold\\)\\] {
          border-color: ${primaryColor} !important;
        }

        /* 14. Scrollbars & Selection */
        ::-webkit-scrollbar-thumb {
          background: ${primaryColor} !important;
        }
        ::selection {
          background: ${primaryColor} !important;
          color: #ffffff !important;
        }

        /* 15. Attribute selectors to override hardcoded legacy red inline colors */
        [style*="#D32F2F" i]:not([style*="background"]),
        [style*="#d32f2f" i]:not([style*="background"]),
        [style*="rgb(211, 47, 47)" i]:not([style*="background"]),
        [style*="#AF1716" i]:not([style*="background"]),
        [style*="#af1716" i]:not([style*="background"]),
        [style*="rgb(175, 23, 22)" i]:not([style*="background"]),
        [style*="#E53935" i]:not([style*="background"]),
        [style*="#e53935" i]:not([style*="background"]),
        [style*="#B71C1C" i]:not([style*="background"]),
        [style*="#b71c1c" i]:not([style*="background"]),
        [style*="#FF1744" i]:not([style*="background"]),
        [style*="#ff1744" i]:not([style*="background"]) {
          color: ${primaryColor} !important;
          border-color: ${primaryColor} !important;
        }

        [style*="linear-gradient"][style*="#D32F2F" i],
        [style*="linear-gradient"][style*="#d32f2f" i],
        [style*="linear-gradient"][style*="#AF1716" i],
        [style*="linear-gradient"][style*="#af1716" i],
        [style*="linear-gradient"][style*="#E53935" i],
        [style*="linear-gradient"][style*="#e53935" i],
        [style*="linear-gradient"][style*="#B71C1C" i],
        [style*="linear-gradient"][style*="#b71c1c" i] {
          background: linear-gradient(135deg, ${lightColor} 0%, ${primaryColor} 50%, ${darkColor} 100%) !important;
        }

        svg[stroke="#D32F2F" i], svg[stroke="#d32f2f" i], svg[stroke="#AF1716" i], svg[stroke="#af1716" i], svg[stroke="#E53935" i], svg[stroke="#e53935" i],
        path[stroke="#D32F2F" i], path[stroke="#d32f2f" i], path[stroke="#AF1716" i], path[stroke="#af1716" i], path[stroke="#E53935" i], path[stroke="#e53935" i] {
          stroke: ${primaryColor} !important;
        }

        svg[fill="#D32F2F" i], svg[fill="#d32f2f" i], svg[fill="#AF1716" i], svg[fill="#af1716" i], svg[fill="#E53935" i], svg[fill="#e53935" i],
        path[fill="#D32F2F" i], path[fill="#d32f2f" i], path[fill="#AF1716" i], path[fill="#af1716" i], path[fill="#E53935" i], path[fill="#e53935" i] {
          fill: ${primaryColor} !important;
        }
      `;

      // Run dynamic DOM recoloring pass to immediately catch rendered inline nodes
      recolorDomElements(primaryColor, lightColor, darkColor);
    }

    // 3. Dynamic Text / Brand Name Replacement across content, headings, navbar & footer
    if (name && name.trim()) {
      const cleanName = name.trim();
      document.title = `${cleanName} — Official Preview`;

      // Update explicit brand headers in Electwell and other frameworks
      const brandNameSpans = document.querySelectorAll(
        '.brand-text-name, [data-brand="name"], .site-logo-text, .brand-title, .brand-name'
      );
      brandNameSpans.forEach((el) => {
        el.innerHTML = `${cleanName.toUpperCase()}<sup>®</sup>`;
      });

      // Replace brand mentions across body safely
      replaceTextInNode(document.body, cleanName);

      lastAppliedBrandName = cleanName;
    }

    // 4. Dynamic Phone & WhatsApp Link Updates
    if (phone && phone.trim()) {
      const rawDigits = phone.replace(/[^0-9]/g, '');
      const waLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"], a[href^="https://api.whatsapp"]');
      waLinks.forEach((a) => {
        a.href = `https://wa.me/${rawDigits}?text=Hi%2C%20I%20am%20interested%20in%20your%20products%20and%20services.`;
      });

      const telLinks = document.querySelectorAll('a[href^="tel:"]');
      telLinks.forEach((a) => {
        a.href = `tel:${phone.trim()}`;
        if (a.innerText && /\d/.test(a.innerText)) {
          a.innerText = phone.trim();
        }
      });
    }

    // 5. Dynamic Email & Address Updates
    if (email && email.trim()) {
      const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
      mailLinks.forEach((a) => {
        a.href = `mailto:${email.trim()}`;
        if (a.innerText && a.innerText.includes('@')) {
          a.innerText = email.trim();
        }
      });
    }

    if (currentBrandData.address && currentBrandData.address.trim()) {
      const addressEls = document.querySelectorAll('address, .footer-address, .contact-address, [data-brand="address"]');
      addressEls.forEach((el) => {
        el.innerText = currentBrandData.address.trim();
      });
    }

      // 6. Dynamic Hero Text & Tagline Replacement
      if (currentBrandData.heroHeading && currentBrandData.heroHeading.trim()) {
        const h1s = document.querySelectorAll('h1');
        h1s.forEach((h1) => {
          if (!h1.closest('header') && !h1.closest('nav')) {
            h1.innerText = currentBrandData.heroHeading.trim();
          }
        });
      }

      if (currentBrandData.heroSubheading && currentBrandData.heroSubheading.trim()) {
        const subEls = document.querySelectorAll('.hero-subtitle, .hero-desc, .hero-p, [data-brand="subheading"]');
        subEls.forEach((el) => {
          el.innerText = currentBrandData.heroSubheading.trim();
        });
      }

      if (tagline && tagline.trim()) {
        const taglineEls = document.querySelectorAll('.brand-tagline, .hero-tagline, [data-brand="tagline"]');
        taglineEls.forEach((el) => {
          el.innerText = tagline.trim();
        });
      }

      // 7. Dynamic Theme Mode (Dark / Clean Light)
      if (currentBrandData.themeMode) {
        document.documentElement.setAttribute('data-theme', currentBrandData.themeMode);
        let themeStyleEl = document.getElementById('showcase-theme-mode-styles');
        if (!themeStyleEl) {
          themeStyleEl = document.createElement('style');
          themeStyleEl.id = 'showcase-theme-mode-styles';
          document.head.appendChild(themeStyleEl);
        }

        if (currentBrandData.themeMode === 'light') {
          themeStyleEl.innerHTML = `
            html[data-theme="light"], body.light-mode {
              --bg-dark: #f8fafc !important;
              --bg-color: #f8fafc !important;
              --text-main: #0f172a !important;
              --text-dim: #64748b !important;
              --card-dark-bg: #ffffff !important;
              --cream-bg: #ffffff !important;
              background-color: #f8fafc !important;
              color: #0f172a !important;
            }
            html[data-theme="light"] .jm-about-section,
            html[data-theme="light"] .jm-mosaic-section,
            html[data-theme="light"] .jm-awards-section,
            html[data-theme="light"] .jm-products-section,
            html[data-theme="light"] .jm-finance-section,
            html[data-theme="light"] .jm-footer-section,
            html[data-theme="light"] .about-page-wrapper,
            html[data-theme="light"] .contact-page-wrapper,
            html[data-theme="light"] .hero-section {
              background-color: #ffffff !important;
              color: #0f172a !important;
            }
            html[data-theme="light"] nav, html[data-theme="light"] header {
              border-color: rgba(0, 0, 0, 0.08) !important;
            }
            html[data-theme="light"] .glass-card, 
            html[data-theme="light"] .product-card,
            html[data-theme="light"] .product-machine-card,
            html[data-theme="light"] .finance-card-item {
              background: #ffffff !important;
              border-color: rgba(0, 0, 0, 0.08) !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
              color: #0f172a !important;
            }
            html[data-theme="light"] .about-para,
            html[data-theme="light"] .products-desc-text,
            html[data-theme="light"] .awards-sub-desc,
            html[data-theme="light"] .finance-card-desc {
              color: #334155 !important;
            }
          `;
        } else {
          themeStyleEl.innerHTML = `
            html[data-theme="dark"], body.dark-mode {
              --bg-dark: #0a0d14 !important;
              --bg-color: #0a0d14 !important;
              --text-main: #ffffff !important;
              --text-dim: #94a3b8 !important;
              --card-dark-bg: #111827 !important;
              --cream-bg: #0f172a !important;
              background-color: #0a0d14 !important;
              color: #ffffff !important;
            }
            html[data-theme="dark"] .jm-about-section,
            html[data-theme="dark"] .jm-mosaic-section,
            html[data-theme="dark"] .jm-awards-section,
            html[data-theme="dark"] .jm-products-section,
            html[data-theme="dark"] .jm-finance-section,
            html[data-theme="dark"] .jm-footer-section,
            html[data-theme="dark"] .about-page-wrapper,
            html[data-theme="dark"] .contact-page-wrapper,
            html[data-theme="dark"] .hero-section {
              background-color: #0d1117 !important;
              color: #f1f5f9 !important;
            }
            html[data-theme="dark"] .glass-card, 
            html[data-theme="dark"] .product-card,
            html[data-theme="dark"] .product-machine-card,
            html[data-theme="dark"] .finance-card-item {
              background: #161b22 !important;
              border-color: rgba(255, 255, 255, 0.1) !important;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4) !important;
              color: #ffffff !important;
            }
            html[data-theme="dark"] .about-para,
            html[data-theme="dark"] .products-desc-text,
            html[data-theme="dark"] .awards-sub-desc,
            html[data-theme="dark"] .finance-card-desc {
              color: #94a3b8 !important;
            }
          `;
        }
      }

      // 8. Dynamic Product Images & Catalog Customization
      if (currentBrandData.products && currentBrandData.products.length > 0) {
        applyProducts(currentBrandData.products);
      }

      // 9. Floating Demo Watermark / Pill
      updateDemoWatermark(name, primaryColor);
    } finally {
      setTimeout(() => {
        isMutatingInternal = false;
      }, 150);
    }
  }

  let currentTier = 'basic';

  function updateDemoWatermark(name, color, tier) {
    if (tier) currentTier = tier;
    let badge = document.getElementById('showcase-demo-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'showcase-demo-badge';
      badge.style.cssText = `
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 999999;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        background: rgba(15, 23, 42, 0.92);
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.04em;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(8px);
        pointer-events: none;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(badge);
    }

    const brandLabel = name ? name : 'Template Preview';
    const accent = color || '#3b82f6';
    const tierTag = currentTier.toUpperCase();
    const tierBg = currentTier === 'premium' ? '#f43f5e' : currentTier === 'standard' ? '#eab308' : '#3b82f6';

    badge.innerHTML = `
      <span style="display:inline-block;padding:2px 6px;border-radius:4px;background:${tierBg};color:#ffffff;font-size:9px;font-weight:800;letter-spacing:0.05em;">${tierTag}</span>
      <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${accent};box-shadow:0 0 8px ${accent};"></span>
      <span>${brandLabel}</span>
      <span style="color:rgba(255,255,255,0.45);font-size:9px;text-transform:uppercase;">Live Preview</span>
    `;
  }

  // Handle postMessage from Showcase Hub parent
  window.addEventListener('message', (event) => {
    if (event.data) {
      if (event.data.type === 'SHOWCASE_UPDATE_BRAND') {
        if (event.data.tier) currentTier = event.data.tier;
        applyBranding(event.data.payload);
      }
      if (event.data.type === 'SHOWCASE_UPDATE_TIER') {
        currentTier = event.data.tier || 'basic';
        updateDemoWatermark(currentBrandData.name, currentBrandData.primaryColor, currentTier);
      }
    }
  });

  // Check URL query parameters for direct shared links
  function initFromUrl() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('brand') || urlParams.get('client');
      const color = urlParams.get('color');
      const phone = urlParams.get('phone');
      const tagline = urlParams.get('tagline');
      const email = urlParams.get('email');
      const logoUrl = urlParams.get('logo');
      const themeMode = urlParams.get('mode');

      if (name || color || phone || tagline || email || logoUrl || themeMode) {
        applyBranding({ 
          name, 
          primaryColor: color ? (color.startsWith('#') ? color : '#' + color) : '', 
          phone, 
          tagline, 
          email,
          logoUrl,
          themeMode
        });
      }
    } catch (e) {
      console.warn('Showcase Bridge URL init error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFromUrl);
  } else {
    initFromUrl();
  }

  let observerDebounceTimer = null;

  window.addEventListener('load', () => {
    initFromUrl();

    // Guarded and throttled observer that CANNOT cause infinite recursion or CPU lag
    const observer = new MutationObserver(() => {
      if (isMutatingInternal) return; // Strict lock
      if (
        !currentBrandData.name && 
        !currentBrandData.logoUrl && 
        !currentBrandData.primaryColor && 
        (!currentBrandData.products || currentBrandData.products.length === 0)
      ) return;

      if (observerDebounceTimer) clearTimeout(observerDebounceTimer);
      observerDebounceTimer = setTimeout(() => {
        if (isMutatingInternal) return;
        isMutatingInternal = true;
        try {
          if (currentBrandData.logoUrl || currentBrandData.name) {
            applyLogo(currentBrandData.logoUrl, currentBrandData.name, currentBrandData.primaryColor);
          }
          if (currentBrandData.primaryColor) {
            const darkColor = adjustColor(currentBrandData.primaryColor, -25);
            const lightColor = adjustColor(currentBrandData.primaryColor, 18);
            recolorDomElements(currentBrandData.primaryColor, lightColor, darkColor);
          }
          if (currentBrandData.products && currentBrandData.products.length > 0) {
            applyProducts(currentBrandData.products);
          }
          if (currentBrandData.name) {
            const brandNameSpans = document.querySelectorAll(
              '.brand-text-name, [data-brand="name"], .site-logo-text, .brand-title, .brand-name'
            );
            brandNameSpans.forEach((el) => {
              el.innerHTML = `${currentBrandData.name.toUpperCase()}<sup>®</sup>`;
            });
          }
        } finally {
          setTimeout(() => {
            isMutatingInternal = false;
          }, 200);
        }
      }, 350); // 350ms throttle
    });

    observer.observe(document.body, { childList: true, subtree: false });
  });

  window.addEventListener('DOMContentLoaded', () => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SHOWCASE_TEMPLATE_READY' }, '*');
    }
  });
})();
