# Agency Template Studio & Live Client Pitch Engine

Welcome to the **Agency Template Studio** — a high-performance web platform built specifically to showcase your website frameworks, personalize them in real-time for prospective clients, and close deals during pitch meetings.

---

## 🚀 Quick Start: Running the Platform

From the root directory (`e:\template`):

```bash
# Start the Showcase Studio Hub
npm run dev
```

Then open your browser at:
👉 **`http://localhost:5000/`**

---

## 🎨 What is Included in the Platform

### 1. Active Production Templates
Currently, all 4 of your project websites are registered and fully functional inside the studio:

| Template | Industry / Niche | Key Design & Tech Highlights | Default Accent |
| :--- | :--- | :--- | :--- |
| **Plaza Quartz** (`demo_plazaclock`) | Luxury Horology & Corporate Atelier | Plum/Aubergine & Warm Gold, Cormorant Garamond, Locomotive Smooth Physics Scroll, Zero-crop product cards. | `#E6C378` |
| **Electwell Engineers** (`jagmohan`) | Heavy Industrial Fans & Blowers | High-Heat Orange & Deep Industrial Navy, Technical Specification tables, ISO certifications, B2B RFQ Lead Funnel. | `#F97316` |
| **Padma Cable** (`padmacables`) | Power Cables & Critical Infrastructure | Dark Slate & Safety Amber, Oswald + IBM Plex Mono typography, Lenis Smooth Scroll, Blueprint cards. | `#EAB308` |
| **Young Wheels** (`youngwheels`) | Kids Toys & Consumer Goods E-Commerce | Vivid Rose & Cyber Violet, Fredoka & Nunito typography, Interactive product variants, WhatsApp direct commerce. | `#F43F5E` |

---

## 💼 The 3 Pitch Modes for Closing Clients

### 1. Live Interactive Studio & Device Simulator
* Select any template from the catalog or top dropdown.
* Switch between viewports with one click:
  * **Desktop**: 1080p full monitor browser view.
  * **Tablet**: Realistic iPad bezel mockup.
  * **Mobile**: Realistic iPhone frame with Dynamic Island notch.
* Click **Rotate** to test portrait vs. landscape.

### 2. Live Brand & Logo Personalizer (The Pitch Closer)
* Click **"Personalize for Client"** (or press the Sliders button in the toolbar).
* Customize:
  * **Brand Logo**:
    * **Upload Logo**: Select any PNG, SVG, or JPG from your computer to replace the header/footer logos live!
    * **Auto-Monogram**: One-click generation of a sleek luxury SVG badge using the client's initials and brand color.
    * **Logo URL**: Or paste a direct image URL.
  * **Business Name** (e.g. *Apex Luxury Clocks* or *Titan Heavy Engineering*)
  * **Tagline** (e.g. *Precision Craftsmanship Since 1985*)
  * **Primary Brand Accent Color** (Select from 8 curated luxury swatches or pick custom HEX)
  * **WhatsApp / Phone Number**
* The active template **updates live in real time**:
  * All header, footer, and navbar logos are dynamically swapped with the client's logo!
  * Headings and titles dynamically switch to the client's name.
  * Buttons, badges, and accents switch to the client's brand color.
  * WhatsApp buttons point directly to the client's phone number!

### 3. Shareable WhatsApp Pitch Links
* In the toolbar, click **"Share Link"**.
* Click **"Copy Link"** or **"Open & Send via WhatsApp"**.
* Generates a pre-parameterized link like:
  ```text
  http://localhost:5000/?template=plazaclock&brand=Apex%20Luxe&color=E6C378&phone=9876543210
  ```
* When the client taps that link on their smartphone, the website automatically opens with **their brand already loaded**!

---

## ➕ How to Add More Website Templates in the Future

Whenever you create a new website project (e.g. `bakery`, `real-estate`, `dentist`), follow this simple **2-step process**:

### Step 1: Add the project folder & build it
1. Place your project folder in `e:\template\your_project`.
2. In its `vite.config.js` (or build config), set:
   ```javascript
   export default defineConfig({
     base: './', // Ensures relative asset loading
     // ...
   });
   ```
3. Copy `showcase-hub/public/showcase-bridge.js` to `your_project/public/showcase-bridge.js` and add this script tag to its `index.html`:
   ```html
   <script src="/showcase-bridge.js"></script>
   ```
4. Run `npm run build` inside `your_project` to generate `dist/`.

### Step 2: Register it in `showcase-hub`
Open `e:\template\showcase-hub\src\config\templates.js` and add your new template:

```javascript
{
  id: 'your_project',
  title: 'Your Website Title',
  shortName: 'Short Title',
  tagline: 'High-converting tagline for this industry',
  category: 'Your Category', // e.g. 'Food & Hospitality', 'Real Estate', etc.
  industry: 'Specific Niche',
  badge: 'Premium UI',
  rating: 4.97,
  completionTime: '3-5 Days',
  heroColor: '#1e293b',
  accentColor: '#3b82f6',
  previewUrl: '/templates/your_project/index.html',
  description: 'Detailed description of the layout and conversion features.',
  keyFeatures: ['Feature 1', 'Feature 2', 'Feature 3'],
  techStack: ['React', 'Tailwind CSS', 'Vite'],
  defaultBrand: {
    name: 'Default Brand',
    tagline: 'Default Slogan',
    color: '#3b82f6',
    phone: '+91 98000 00000',
    email: 'hello@domain.com'
  }
}
```

In `showcase-hub/vite.config.js`, add one line to `templateMap`:
```javascript
'/templates/your_project': path.resolve(__dirname, '../your_project/dist'),
```

That's it! Your new template will instantly appear in the catalog and live previewer!
