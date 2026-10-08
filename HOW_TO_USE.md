# Agency Website Template Library & Client Website Builder — User Manual

This manual explains how to use the **Agency Website Template Library & Client Website Builder** to manage templates, onboard clients via the guided wizard, and export independent client websites.

---

## 🚀 1. Running the Platform

From the workspace root:

```bash
# Starts the discovery engine, updates registry, and launches Vite on port 5000
npm run dev
```

Open your browser at:
👉 **`http://localhost:5000/`**

---

## 🏷️ 2. Tier Segregation Architecture

Templates are segregated into 3 distinct tiers based on design complexity, animation physics, and conversion mechanics:

### 1. Basic Websites (`padmacables` & `jagmohan`)
* **Padma Cable Infrastructure** (`padmacables`):
  * High-voltage conductors, wiring harnesses, utility infrastructure.
  * Dark slate & safety gold contrast, Lenis smooth physics, technical specification cards.
* **Electwell Industrial Engineering** (`jagmohan`):
  * Heavy industrial centrifugal fans, axial blowers, and air pollution systems.
  * High-heat orange & deep industrial navy, aerodynamic specification tables, RFQ lead generation funnels.

### 2. Standard Websites (`demo_plazaclock`)
* **Plaza Quartz & Atelier** (`demo_plazaclock`):
  * Luxury horology atelier, bespoke corporate gifting, precision timepieces.
  * Aubergine/Plum & Warm Gold, Cormorant Garamond typography, zero-crop showcase containers, Locomotive smooth physics scroll.

### 3. Premium Websites (`youngwheels`)
* **Young Wheels Consumer Goods** (`youngwheels`):
  * Consumer goods, kids toys, e-commerce & wholesale distributor portal.
  * React 19 Motion, Canvas Confetti celebrations, multi-variant color pickers, category banners, direct WhatsApp commerce drawer.

---

## 🧙‍♂️ 3. Client Website Setup Wizard (6 Steps)

To create a new client website:
1. Navigate to the **Template Library**.
2. Select any template and click **"Create Website"**.
3. The adaptive wizard opens with 6 guided steps:

### Step 1: Business Details
* Client/project name, registered business name, tagline.
* Full company description & About Us copy.
* Phone number, email, address, and WhatsApp contact for lead routing.

### Step 2: Branding & Colors
* **Brand Logo**: Upload high-res PNG/WebP/SVG or enter a logo URL.
* **Primary Brand Color**: Pick a custom HEX or choose from curated swatches.
* Dynamic theme variables (`--primary`, `--accent`, button gradients) update automatically.

### Step 3: Media Manager
* Upload local product photos, plant images, or banners.
* Media files are stored in an isolated project location without touching original template assets.

### Step 4: Dynamic Product Management (Enabled for Product Templates)
* Add, Edit, Duplicate, or Delete products.
* Fields: Name, SKU, Category, Price, Specifications, Badges (`isBestSeller`), and images.
* Automatically rendered using the template's native product card design.

### Step 5: Page Content Management
* Customize Hero headline, Hero subtitle, and value proposition.
* Edit repeating section copy without touching JSX code.

### Step 6: SEO Settings
* Customize `<title>`, `<meta name="description">`, and keywords.
* Review the real-time Google search snippet preview.

---

## 💾 4. Managing Client Projects

Click **"Client Projects"** in the top navigation bar to access the portfolio manager:
* **Edit Website**: Reopen saved client drafts in the Wizard.
* **Live Simulator**: Test the client's website in Desktop, Tablet, and Mobile device frames.
* **Duplicate Project**: Clone an existing client setup with one click.
* **Export Standalone ZIP**: Download the complete independent React project.
* **Delete Project**: Remove drafts with confirmation.

---

## 📦 5. Exporting Independent React Projects (.ZIP)

When you click **"Export Standalone ZIP"**:
1. The platform packages an independent React + Vite project.
2. Injects client-specific configuration (`src/config/siteConfig.js`), branding, products, and SEO metadata.
3. Packages clean `package.json`, `vite.config.js`, and `README.md`.
4. Triggers an automatic download of `<project-name>-standalone.zip`.

### Running the Exported Project:
```bash
# 1. Unzip the file and enter the project folder
cd my-client-website

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build for production deployment
npm run build
```

---

## 📂 6. Adding New Templates to `sources/`

To add a new template in the future without modifying dashboard code:
1. Place the new React project folder inside `sources/` (e.g. `sources/real-estate/`).
2. Include a `template.manifest.json` inside the project folder:
   ```json
   {
     "id": "realestate",
     "title": "Prime Horizon Realty",
     "shortName": "Prime Horizon",
     "tier": "standard",
     "category": "Real Estate & Architecture",
     "industry": "Commercial & Luxury Real Estate",
     "accentColor": "#0ea5e9",
     "hasProducts": true
   }
   ```
3. Run:
   ```bash
   npm run discover
   ```
   Or click **"Refresh Template Library"** in the dashboard header.
4. The new website template will instantly appear in the Library under its configured Tier!
