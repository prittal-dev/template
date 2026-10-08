import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourcesDir = path.resolve(rootDir, 'sources');
const registryJsonPath = path.resolve(rootDir, 'showcase-hub/src/config/templates.registry.json');
const templatesJsPath = path.resolve(rootDir, 'showcase-hub/src/config/templates.js');

const TIER_MAPPING = {
  padmacables: 'basic',
  electwell: 'basic',
  jagmohan: 'basic',
  plazaclock: 'standard',
  demo_plazaclock: 'standard',
  youngwheels: 'premium'
};

export function discoverTemplates() {
  console.log('🔍 [Discovery Engine] Scanning for React website projects in sources/ and root...');
  
  const searchDirs = [];
  if (fs.existsSync(sourcesDir)) {
    const entries = fs.readdirSync(sourcesDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory() || e.isSymbolicLink()) {
        searchDirs.push(path.join(sourcesDir, e.name));
      }
    }
  }

  // Also include root project dirs if not already scanned
  const rootKnownDirs = ['padmacables', 'jagmohan', 'demo_plazaclock', 'youngwheels'];
  for (const kd of rootKnownDirs) {
    const full = path.join(rootDir, kd);
    if (fs.existsSync(full) && !searchDirs.some(d => path.resolve(d) === path.resolve(full))) {
      searchDirs.push(full);
    }
  }

  const templates = [];
  const seenIds = new Set();

  for (const dirPath of searchDirs) {
    try {
      const realPath = fs.realpathSync(dirPath);
      let pkgPath = path.join(realPath, 'package.json');
      let projectRoot = realPath;

      // Handle nested frontend (like jagmohan/frontend)
      if (!fs.existsSync(pkgPath) && fs.existsSync(path.join(realPath, 'frontend/package.json'))) {
        projectRoot = path.join(realPath, 'frontend');
        pkgPath = path.join(projectRoot, 'package.json');
      }

      if (!fs.existsSync(pkgPath)) {
        continue;
      }

      const pkgRaw = fs.readFileSync(pkgPath, 'utf-8');
      const pkg = JSON.parse(pkgRaw);

      // Verify it's a React project
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      if (!allDeps['react']) {
        continue;
      }

      // Check for manifest
      let manifest = null;
      const manifestPath = path.join(projectRoot, 'template.manifest.json');
      const parentManifestPath = path.join(realPath, 'template.manifest.json');

      if (fs.existsSync(manifestPath)) {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      } else if (fs.existsSync(parentManifestPath)) {
        manifest = JSON.parse(fs.readFileSync(parentManifestPath, 'utf-8'));
      }

      const folderBase = path.basename(dirPath).toLowerCase();
      const id = manifest?.id || (folderBase === 'demo_plazaclock' ? 'plazaclock' : folderBase === 'jagmohan' ? 'electwell' : folderBase);

      if (seenIds.has(id)) {
        continue;
      }
      seenIds.add(id);

      // Detect Tier
      const tier = manifest?.tier || TIER_MAPPING[id] || 'basic';
      const tierLabel = tier === 'premium' ? 'Premium Website' : tier === 'standard' ? 'Standard Website' : 'Basic Website';

      // Detect tech stack
      const detectedTech = [];
      if (allDeps['react']) detectedTech.push(`React ${allDeps['react'].replace('^', '')}`);
      if (allDeps['vite']) detectedTech.push('Vite');
      if (allDeps['tailwindcss'] || allDeps['@tailwindcss/vite']) detectedTech.push('Tailwind CSS');
      if (allDeps['framer-motion']) detectedTech.push('Framer Motion');
      if (allDeps['motion']) detectedTech.push('Motion');
      if (allDeps['locomotive-scroll']) detectedTech.push('Locomotive Scroll');
      if (allDeps['lenis']) detectedTech.push('Lenis Scroll');
      if (allDeps['lucide-react']) detectedTech.push('Lucide Icons');

      // Construct template entry
      const templateEntry = {
        id,
        title: manifest?.title || pkg.name || id,
        shortName: manifest?.shortName || id.charAt(0).toUpperCase() + id.slice(1),
        tagline: manifest?.tagline || `Professional ${id} website template`,
        tier,
        tierLabel,
        category: manifest?.category || 'Business & Enterprise',
        industry: manifest?.industry || 'Commercial Services',
        badge: manifest?.badge || (tier === 'premium' ? 'High-Converting Retail' : tier === 'standard' ? 'Luxury Atelier' : 'Standard Enterprise'),
        rating: manifest?.rating || 4.95,
        completionTime: manifest?.completionTime || (tier === 'basic' ? '2-3 Days' : tier === 'standard' ? '3-5 Days' : '4-7 Days'),
        heroColor: manifest?.heroColor || (tier === 'premium' ? '#1e1b4b' : tier === 'standard' ? '#4A1535' : '#0f172a'),
        accentColor: manifest?.accentColor || (tier === 'premium' ? '#f43f5e' : tier === 'standard' ? '#E6C378' : '#3b82f6'),
        previewUrl: `/templates/${id}/`,
        description: manifest?.description || `High-performance React website template for ${id}.`,
        keyFeatures: manifest?.keyFeatures || [
          'Responsive Multi-Device Layout',
          'Modern Animation Engine',
          'SEO Structured Metadata',
          'Custom Brand Token Architecture'
        ],
        techStack: manifest?.techStack || detectedTech,
        routes: manifest?.routes || [{ path: '/', name: 'Home' }],
        hasProducts: manifest?.hasProducts !== undefined ? manifest?.hasProducts : true,
        hasServices: manifest?.hasServices !== undefined ? manifest?.hasServices : true,
        defaultBrand: manifest?.defaultBrand || {
          name: manifest?.shortName || id,
          tagline: manifest?.tagline || 'Excellence in every detail',
          color: manifest?.accentColor || '#3b82f6',
          phone: '+91 98000 00000',
          email: `contact@${id}.com`,
          city: 'New Delhi, India'
        },
        contentSchema: manifest?.contentSchema || {
          allowCustomProducts: true,
          productFields: ['name', 'category', 'price', 'description', 'image']
        },
        sourcePath: dirPath
      };

      templates.push(templateEntry);
      console.log(`  ✓ Discovered: ${templateEntry.title} [Tier: ${templateEntry.tier.toUpperCase()}] (${id})`);
    } catch (err) {
      console.warn(`  ⚠️ Could not parse ${dirPath}:`, err.message);
    }
  }

  // Ensure deterministic sort: basic first, then standard, then premium (or vice-versa)
  const tierOrder = { basic: 1, standard: 2, premium: 3 };
  templates.sort((a, b) => (tierOrder[a.tier] || 99) - (tierOrder[b.tier] || 99));

  return templates;
}

export function saveRegistry(templates) {
  const registryData = {
    updatedAt: new Date().toISOString(),
    totalTemplates: templates.length,
    tiers: {
      basic: templates.filter(t => t.tier === 'basic').length,
      standard: templates.filter(t => t.tier === 'standard').length,
      premium: templates.filter(t => t.tier === 'premium').length
    },
    templates
  };

  // Write registry JSON
  fs.writeFileSync(registryJsonPath, JSON.stringify(registryData, null, 2), 'utf-8');

  // Also write modern templates.js ES module for direct React client consumption
  const categories = ['All Templates', ...new Set(templates.map(t => t.category))];
  const templatesJsContent = `/**
 * Agency Templates Registry
 * Auto-generated by scripts/discover-templates.mjs
 * Supports dynamic addition and tier segregation (Basic, Standard, Premium).
 */
export const TEMPLATES = ${JSON.stringify(templates, null, 2)};

export const CATEGORIES = ${JSON.stringify(categories, null, 2)};

export const TIERS = [
  { id: 'all', label: 'All Tiers' },
  { id: 'basic', label: 'Basic Websites' },
  { id: 'standard', label: 'Standard Websites' },
  { id: 'premium', label: 'Premium Websites' }
];
`;

  fs.writeFileSync(templatesJsPath, templatesJsContent, 'utf-8');
  console.log(`✅ Registry saved! Total templates: ${templates.length} (Basic: ${registryData.tiers.basic}, Standard: ${registryData.tiers.standard}, Premium: ${registryData.tiers.premium})`);
}

// If run directly via node scripts/discover-templates.mjs
if (process.argv[1] && process.argv[1].endsWith('discover-templates.mjs')) {
  const discovered = discoverTemplates();
  saveRegistry(discovered);
}
