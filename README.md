# Agency Website Template Library & Client Website Builder Platform

A professional, scalable, configuration-driven website template management system that automatically discovers React projects in the `sources/` directory, segregates them by Tier (**Basic**, **Standard**, **Premium**), and provides a guided wizard to generate independent client websites without manually editing source code.

---

## 🚀 Live Pitch Engine & Templates Catalog

| Tier | Template | Brand / Industry | Key Design & Tech Highlights | Default Accent |
| :--- | :--- | :--- | :--- | :--- |
| **Basic** | **Padma Cable** (`padmacables`) | Power Cables & Infrastructure | Dark Slate & Safety Gold, Lenis Kinetic Scroll, Technical spec sheets, RFQ lead funnel | `#EAB308` |
| **Basic** | **Electwell Engineers** (`jagmohan`) | Heavy Industrial Blowers & Fans | High-Heat Orange & Deep Industrial Navy, Technical parameter tables, ISO certifications | `#F97316` |
| **Standard** | **Plaza Quartz** (`demo_plazaclock`) | Luxury Horology & Corporate Atelier | Aubergine/Plum & Champagne Gold, Cormorant Garamond, Locomotive Smooth Physics Scroll, Zero-crop cards | `#E6C378` |
| **Premium** | **Young Wheels** (`youngwheels`) | Kids Toys & E-Commerce Consumer Goods | Vivid Rose & Cyber Violet, React 19 Motion, Multi-color variant selectors, WhatsApp commerce cart | `#F43F5E` |

---

## 🛠️ Quick Start

### 1. Discover Templates & Start Agency Studio
```bash
# Automatically scans sources/ and root directories, generates registry, and launches studio
npm run dev
```
Then visit **`http://localhost:5000/`**.

### 2. Manual Re-Scan of `sources/`
```bash
npm run discover
```

### 3. Production Build
```bash
npm run build
```

---

## 🌟 Key Platform Features

1. **Automatic Discovery Engine (`sources/` directory)**:
   * Drop any React project into `sources/`.
   * Automatically discovers the framework, styling, dependencies, routing, and features.
   * Generates `template.manifest.json` and updates the live registry without modifying dashboard code.
2. **Tier Segregation Architecture**:
   * **Basic Websites**: `padmacables` & `jagmohan` (Clean B2B industrial, high credibility, lead generation).
   * **Standard Websites**: `demo_plazaclock` (Luxury atelier, Locomotive scroll, zero-crop showcase).
   * **Premium Websites**: `youngwheels` (Motion micro-interactions, variant selectors, e-commerce funnels).
3. **Dynamic Client Setup Wizard (6 Adaptive Steps)**:
   * **Step 1: Client & Business Details** (Name, tagline, overview, email, phone, WhatsApp, address, Google Maps).
   * **Step 2: Branding & Colors** (Logo upload, custom colors, live theme variables).
   * **Step 3: Media Manager** (Local drag-and-drop file uploads, image previews, section assignments).
   * **Step 4: Dynamic Product Management** (Full CRUD, categories, prices, specs, badges, CSV import).
   * **Step 5: Page Content Management** (Hero headings, CTAs, About copy, repeating cards).
   * **Step 6: SEO Settings** (Meta titles, description, Open Graph preview, keywords).
4. **Interactive Multi-Device Simulator**:
   * Desktop (1440px), Tablet (iPad 768px), and Mobile (iPhone 375px) viewports with orientation rotation.
5. **Client Projects Portfolio (`data/projects.json`)**:
   * Full local persistence for client projects.
   * Save drafts, Edit existing sites, Duplicate projects, and Delete with confirmation.
6. **One-Click Standalone Export (.ZIP)**:
   * Packages a complete, independent React + Vite project with all client data and assets.
   * Zero runtime coupling to the agency dashboard.
   * Ready for instant deployment to Vercel, Netlify, or static web servers.
