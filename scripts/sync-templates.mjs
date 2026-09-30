import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const publicTemplatesDir = path.resolve(rootDir, 'showcase-hub/public/templates');

const templateMap = {
  plazaclock: path.resolve(rootDir, 'demo_plazaclock/dist'),
  electwell: path.resolve(rootDir, 'jagmohan/frontend/dist'),
  padmacables: path.resolve(rootDir, 'padmacables/dist'),
  youngwheels: path.resolve(rootDir, 'youngwheels/dist')
};

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit per file

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) {
    console.warn(`[sync-templates] Source does not exist: ${from}`);
    return;
  }

  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }

  const entries = fs.readdirSync(from, { withFileTypes: true });
  const entryNames = new Set(entries.map((e) => e.name));

  for (const entry of entries) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);

    if (
      entry.name === '.git' ||
      entry.name === '.DS_Store' ||
      entry.name === 'node_modules' ||
      entry.name.endsWith('.pdf') ||
      entry.name.endsWith('.zip')
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      // If a modern lightweight .webp exists for this .png/.jpg, skip the heavy legacy original
      if (/\.(png|jpe?g)$/i.test(entry.name)) {
        const webpName = entry.name.replace(/\.(png|jpe?g)$/i, '.webp');
        if (entryNames.has(webpName)) {
          continue; // skip duplicate heavy uncompressed image
        }
      }

      try {
        const stats = fs.statSync(srcPath);
        if (stats.size > MAX_FILE_SIZE) {
          console.warn(`[sync-templates] Skipping oversized file (>15MB): ${entry.name} (${(stats.size / (1024 * 1024)).toFixed(1)} MB)`);
          continue;
        }
        fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        console.error(`[sync-templates] Failed to copy ${srcPath}:`, err.message);
      }
    }
  }
}

console.log('🚀 Syncing built template dist folders into showcase-hub/public/templates (optimized)...');
for (const [key, sourceDir] of Object.entries(templateMap)) {
  const targetDir = path.join(publicTemplatesDir, key);
  console.log(`📦 Copying ${key} from ${sourceDir} -> ${targetDir}`);
  copyFolderSync(sourceDir, targetDir);
}
console.log('✅ Template sync complete! Templates will now deploy smoothly to Vercel/production.');
