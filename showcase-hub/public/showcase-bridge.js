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
    logoUrl: ''
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

  function applyBranding(data) {
    if (!data) return;
    currentBrandData = { ...currentBrandData, ...data };
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
      const midColor = adjustColor(primaryColor, -12);
      const lightColor = adjustColor(primaryColor, 20);

      document.documentElement.style.setProperty('--gold', primaryColor);
      document.documentElement.style.setProperty('--primary', primaryColor);
      document.documentElement.style.setProperty('--primary-dark', darkColor);
      document.documentElement.style.setProperty('--primary-light', lightColor);
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.style.setProperty('--accent', primaryColor);
      document.documentElement.style.setProperty('--brand-red', primaryColor);
      document.documentElement.style.setProperty('--header-red-grad', `linear-gradient(90deg, ${primaryColor} 0%, ${darkColor} 100%)`);
      document.documentElement.style.setProperty('--bg-gradient', `linear-gradient(135deg, ${primaryColor} 0%, ${darkColor} 100%)`);

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
          --primary-dark: ${darkColor} !important;
          --primary-light: ${lightColor} !important;
          --accent: ${primaryColor} !important;
          --brand-red: ${primaryColor} !important;
        }

        /* 1. Electwell Header Bar & Accent Stripe */
        .jm-header-bar {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.25) 0%, transparent 35%), linear-gradient(90deg, ${primaryColor} 0%, ${midColor} 50%, ${darkColor} 100%) !important;
        }
        .brand-accent-stripe {
          background: ${darkColor} !important;
        }
        .brand-text-name sup {
          color: ${primaryColor} !important;
        }

        /* 2. Electwell Hero Concentric Circles */
        .layer-1 {
          background: ${darkColor} !important;
        }
        .layer-2 {
          background: ${primaryColor} !important;
        }
        .layer-3 {
          background: ${primaryColor}33 !important;
        }
        .layer-4 {
          background: ${primaryColor}15 !important;
        }

        /* 3. Buttons & CTAs across all projects */
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
        button.bg-primary,
        button.bg-\\[var\\(--gold\\)\\] {
          background: linear-gradient(135deg, ${lightColor} 0%, ${primaryColor} 100%) !important;
          border-color: ${primaryColor} !important;
          color: #ffffff !important;
        }

        /* 4. Text & Accent Highlights across all projects */
        .text-primary, 
        .text-\\[var\\(--gold\\)\\], 
        .gold-underline, 
        .brand-text-accent, 
        .stat-number, 
        .section-tag,
        .gold-accent-text,
        .badge-accent {
          color: ${primaryColor} !important;
          border-color: ${primaryColor} !important;
        }

        /* 5. Borders and Highlights */
        .border-primary, 
        .border-\\[var\\(--gold\\)\\] {
          border-color: ${primaryColor} !important;
        }

        /* 6. Scrollbars & Selection */
        ::-webkit-scrollbar-thumb {
          background: ${primaryColor} !important;
        }
        ::selection {
          background: ${primaryColor} !important;
          color: #ffffff !important;
        }
      `;
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

    // 5. Floating Demo Watermark / Pill
    updateDemoWatermark(name, primaryColor);
  }

  function updateDemoWatermark(name, color) {
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
        background: rgba(15, 23, 42, 0.88);
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
    badge.innerHTML = `
      <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${accent};box-shadow:0 0 8px ${accent};"></span>
      <span>${brandLabel}</span>
      <span style="color:rgba(255,255,255,0.45);font-size:9px;text-transform:uppercase;">Live Demo</span>
    `;
  }

  // Handle postMessage from Showcase Hub parent
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOWCASE_UPDATE_BRAND') {
      applyBranding(event.data.payload);
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

      if (name || color || phone || tagline || email || logoUrl) {
        applyBranding({ 
          name, 
          primaryColor: color ? (color.startsWith('#') ? color : '#' + color) : '', 
          phone, 
          tagline, 
          email,
          logoUrl
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

  window.addEventListener('load', () => {
    initFromUrl();
    const observer = new MutationObserver(() => {
      if (currentBrandData.name || currentBrandData.logoUrl) {
        applyLogo(currentBrandData.logoUrl, currentBrandData.name, currentBrandData.primaryColor);
      }
      if (currentBrandData.name) {
        const brandNameSpans = document.querySelectorAll(
          '.brand-text-name, [data-brand="name"], .site-logo-text, .brand-title, .brand-name'
        );
        brandNameSpans.forEach((el) => {
          el.innerHTML = `${currentBrandData.name.toUpperCase()}<sup>®</sup>`;
        });
        replaceTextInNode(document.body, currentBrandData.name);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });

  window.addEventListener('DOMContentLoaded', () => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SHOWCASE_TEMPLATE_READY' }, '*');
    }
  });
})();
