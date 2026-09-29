import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function serveTemplatesPlugin() {
  const templateMap = {
    '/templates/plazaclock': path.resolve(__dirname, '../demo_plazaclock/dist'),
    '/templates/electwell': path.resolve(__dirname, '../jagmohan/frontend/dist'),
    '/templates/padmacables': path.resolve(__dirname, '../padmacables/dist'),
    '/templates/youngwheels': path.resolve(__dirname, '../youngwheels/dist')
  };

  return {
    name: 'serve-templates-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ? req.url.split('?')[0] : '';

        for (const [prefix, targetDir] of Object.entries(templateMap)) {
          if (rawUrl === prefix || rawUrl.startsWith(prefix + '/')) {
            let relPath = rawUrl.slice(prefix.length);
            if (!relPath || relPath === '/') {
              relPath = '/index.html';
            }

            // Decode URI components
            relPath = decodeURIComponent(relPath);
            let fullPath = path.join(targetDir, relPath);

            // Check if file exists, or fallback to index.html for SPA routes
            if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
              const htmlFallback = path.join(targetDir, 'index.html');
              if (fs.existsSync(htmlFallback)) {
                fullPath = htmlFallback;
              } else {
                return next();
              }
            }

            const ext = path.extname(fullPath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            res.setHeader('Content-Type', contentType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            const stream = fs.createReadStream(fullPath);
            return stream.pipe(res);
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), serveTemplatesPlugin()],
  server: {
    port: 5000,
    open: true
  }
});
