/**
 * Agency Templates Registry
 * To add a new website template in the future:
 * Simply add a new object to this array!
 */
export const TEMPLATES = [
  {
    id: 'plazaclock',
    title: 'Plaza Quartz & Atelier',
    shortName: 'Plaza Clock',
    tagline: 'Timeless Luxury Horology & Bespoke Corporate Gifting',
    category: 'Luxury & Atelier',
    industry: 'Luxury Horology / Corporate Gifting',
    badge: 'Luxury E-Commerce',
    rating: 4.98,
    completionTime: '3-5 Days',
    heroColor: '#4A1535',
    accentColor: '#E6C378',
    previewUrl: '/templates/plazaclock/index.html',
    description:
      'Ultra-luxury e-commerce atelier design featuring Aubergine/Plum backdrops, Warm Gold accents, Cormorant Garamond typography, 0% image crop containers, and smooth scroll interactions.',
    keyFeatures: [
      'Locomotive Smooth Physics Scroll',
      'Compact Atelier Layout Ratios',
      'Interactive Corporate Catalog Mockup',
      'Zero-Crop Luxury Product Showcases',
      'High-Contrast Ivory Navigation',
      'Instant Quote / Inquire Modal'
    ],
    techStack: ['React 18', 'Tailwind CSS', 'Framer Motion', 'Locomotive Scroll', 'Lucide Icons'],
    defaultBrand: {
      name: 'Plaza Enterprises',
      tagline: 'Timeless Gifting for Discerning Brands',
      color: '#E6C378',
      phone: '+91 98100 12345',
      email: 'concierge@plazaquartz.com',
      city: 'Delhi & Mumbai'
    },
    sampleClients: ['Luxury Hotels', 'Jewelry Boutiques', 'Corporate Gifting', 'Heritage Brands']
  },
  {
    id: 'electwell',
    title: 'Electwell Industrial Engineering',
    shortName: 'Electwell',
    tagline: 'Precision Engineered Industrial Process Fans & Heavy Blowers',
    category: 'Heavy Engineering',
    industry: 'Industrial Equipment / Manufacturing',
    badge: 'B2B Enterprise',
    rating: 4.95,
    completionTime: '4-7 Days',
    heroColor: '#0c2340',
    accentColor: '#f97316',
    previewUrl: '/templates/electwell/index.html',
    description:
      'Heavy industrial B2B manufacturing portal engineered for high credibility. Highlights technical centrifugal specs, air pollution control, ISO standards, and multi-parameter RFQ inquiry flows.',
    keyFeatures: [
      'Industrial Product Specification Tables',
      'Centrifugal & Axial Fan Dynamic Catalog',
      'Air Pollution Control Process Deep-Dives',
      'B2B RFQ Lead Generation Funnel',
      'High-Heat Blue & Engineering Orange Accents',
      'Client Trust Logos & Certification Badges'
    ],
    techStack: ['React 18', 'Vite', 'React Router', 'Modern CSS System', 'Lucide Icons'],
    defaultBrand: {
      name: 'Electwell Engineers',
      tagline: 'Industrial Fans Manufacturer Since 1992',
      color: '#f97316',
      phone: '+91 98711 54321',
      email: 'sales@electwellengineers.com',
      city: 'Ghaziabad & Delhi NCR'
    },
    sampleClients: ['Cement Plants', 'Steel Mills', 'Chemical Processing', 'Boiler Manufacturers']
  },
  {
    id: 'padmacables',
    title: 'Padma Cable Infrastructure',
    shortName: 'Padma Cables',
    tagline: 'Engineered Conductors for Critical Power Infrastructure',
    category: 'Infrastructure & Tech',
    industry: 'High-Voltage Power & Electrical Cables',
    badge: 'Critical Infrastructure',
    rating: 4.96,
    completionTime: '3-5 Days',
    heroColor: '#0a0d14',
    accentColor: '#eab308',
    previewUrl: '/templates/padmacables/index.html',
    description:
      'Government and utility-grade digital showroom showcasing high-tension power cables, automotive harnesses, and multi-core conductors with Lenis smooth physics and technical blueprints.',
    keyFeatures: [
      'Lenis Fluid Kinetic Scrolling',
      'High-Tension Conductor Blueprint Cards',
      'Interactive Technical Spec Sheets',
      'Oswald & IBM Plex Mono Engineering Typography',
      'Safety Gold & Dark Slate Contrast System',
      'Instant WhatsApp Spec Sheet Request'
    ],
    techStack: ['React 18', 'Vite', 'Lenis Scroll', 'Tailwind/CSS Grid', 'Lucide Icons'],
    defaultBrand: {
      name: 'Padma Cable',
      tagline: 'Conductors for Critical Infrastructure',
      color: '#eab308',
      phone: '+91 99990 87654',
      email: 'contact@padmacable.com',
      city: 'New Delhi, India'
    },
    sampleClients: ['Power Distribution Utilities', 'Solar Grid EPCs', 'Railways & Metros', 'Heavy EPC Contractors']
  },
  {
    id: 'youngwheels',
    title: 'Young Wheels Consumer Goods',
    shortName: 'Young Wheels',
    tagline: 'Premier Kids Toys & Ride-Ons Manufacturer & Exporter',
    category: 'Consumer & Retail',
    industry: 'Consumer Goods / Kids Toys & Mobility',
    badge: 'High-Converting Retail',
    rating: 4.99,
    completionTime: '3-5 Days',
    heroColor: '#1e1b4b',
    accentColor: '#f43f5e',
    previewUrl: '/templates/youngwheels/index.html',
    description:
      'Vibrant, hyper-engaging consumer catalog and manufacturing portal. Features dynamic product carousels, safety certifications, interactive category navigation, and direct WhatsApp commerce.',
    keyFeatures: [
      'Engaging Interactive Product Grids',
      'Multi-Variant Color Selectors',
      'One-Tap WhatsApp Bulk Order Funnel',
      'Playful Fredoka & Nunito Modern Typography',
      'Non-Toxic BIS Certified Trust Badges',
      'Mobile-First Touch Optimized Navigation'
    ],
    techStack: ['React 19', 'Tailwind CSS v4', 'Motion Engine', 'Canvas Confetti', 'Lucide Icons'],
    defaultBrand: {
      name: 'Young Wheels',
      tagline: 'India’s Premier Kids Toys & Ride-ons',
      color: '#f43f5e',
      phone: '+91 98188 99887',
      email: 'info@youngwheels.in',
      city: 'Delhi, India'
    },
    sampleClients: ['Baby & Kids Brands', 'Toy Retailers', 'E-Commerce Brands', 'Wholesale Exporters']
  }
];

export const CATEGORIES = ['All Templates', 'Luxury & Atelier', 'Heavy Engineering', 'Infrastructure & Tech', 'Consumer & Retail'];
