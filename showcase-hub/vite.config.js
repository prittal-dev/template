import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { discoverTemplates, saveRegistry } from '../scripts/discover-templates.mjs';

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

const rootDir = path.resolve(__dirname, '..');
const dataDir = path.resolve(rootDir, 'data');
const projectsFile = path.resolve(dataDir, 'projects.json');
const uploadsDir = path.resolve(dataDir, 'uploads');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

function readProjects() {
  if (!fs.existsSync(projectsFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(projectsFile, 'utf-8'));
  } catch (e) {
    return [];
  }
}

function writeProjects(projects) {
  fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2), 'utf-8');
}

function agencyApiPlugin() {
  return {
    name: 'agency-api-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        const method = req.method;

        // Parse JSON body helper
        const parseJsonBody = () => new Promise((resolve) => {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              resolve(JSON.parse(body || '{}'));
            } catch (err) {
              resolve({});
            }
          });
        });

        // 1. GET /api/templates
        if (url === '/api/templates' && method === 'GET') {
          const templates = discoverTemplates();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, templates }));
          return;
        }

        // 2. POST /api/templates/refresh
        if (url === '/api/templates/refresh' && method === 'POST') {
          const templates = discoverTemplates();
          saveRegistry(templates);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, templates, message: 'Templates refreshed successfully' }));
          return;
        }

        // 3. GET /api/projects
        if (url === '/api/projects' && method === 'GET') {
          const projects = readProjects();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, projects }));
          return;
        }

        // 4. POST /api/projects (Create / Update)
        if (url === '/api/projects' && method === 'POST') {
          parseJsonBody().then(data => {
            const projects = readProjects();
            const now = new Date().toISOString();
            if (data.id) {
              const idx = projects.findIndex(p => p.id === data.id);
              if (idx !== -1) {
                projects[idx] = { ...projects[idx], ...data, updatedAt: now };
              } else {
                projects.unshift({ ...data, createdAt: now, updatedAt: now });
              }
            } else {
              const newId = `proj_${Date.now()}`;
              projects.unshift({ ...data, id: newId, createdAt: now, updatedAt: now });
            }
            writeProjects(projects);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, projects }));
          });
          return;
        }

        // 5. POST /api/projects/:id/duplicate
        if (url.startsWith('/api/projects/') && url.endsWith('/duplicate') && method === 'POST') {
          const id = url.replace('/api/projects/', '').replace('/duplicate', '');
          const projects = readProjects();
          const target = projects.find(p => p.id === id);
          if (target) {
            const now = new Date().toISOString();
            const copy = {
              ...JSON.parse(JSON.stringify(target)),
              id: `proj_${Date.now()}`,
              name: `${target.name} (Copy)`,
              clientName: `${target.clientName} (Copy)`,
              createdAt: now,
              updatedAt: now,
              status: 'Draft'
            };
            projects.unshift(copy);
            writeProjects(projects);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, project: copy, projects }));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, error: 'Project not found' }));
          }
          return;
        }

        // 6. DELETE /api/projects/:id
        if (url.startsWith('/api/projects/') && method === 'DELETE') {
          const id = url.replace('/api/projects/', '');
          let projects = readProjects();
          projects = projects.filter(p => p.id !== id);
          writeProjects(projects);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, projects }));
          return;
        }

        // 7. POST /api/upload (Local safe image upload)
        if (url === '/api/upload' && method === 'POST') {
          parseJsonBody().then(data => {
            const { fileName, base64Data, projectId } = data;
            if (!fileName || !base64Data) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Missing file data' }));
            }
            
            // Validate extension
            const ext = path.extname(fileName).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Invalid file type' }));
            }

            const targetFolder = projectId ? path.join(uploadsDir, projectId.replace(/[^a-zA-Z0-9_-]/g, '')) : uploadsDir;
            if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

            const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9_.-]/g, '')}`;
            const targetPath = path.join(targetFolder, safeName);
            
            // Strip data:image/...;base64, prefix
            const cleanBase64 = base64Data.replace(/^data:image\/[a-z0-9+.-]+;base64,/, '');
            fs.writeFileSync(targetPath, Buffer.from(cleanBase64, 'base64'));

            const relativeUrl = `/data/uploads/${projectId ? projectId + '/' : ''}${safeName}`;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, url: relativeUrl, fileName: safeName }));
          });
          return;
        }

        // 8. Serve /data/uploads/*
        if (url.startsWith('/data/uploads/')) {
          const rel = url.replace('/data/uploads/', '');
          const safeRel = path.normalize(rel).replace(/^(\.\.[\/\\])+/, '');
          const full = path.join(uploadsDir, safeRel);
          if (fs.existsSync(full) && !fs.statSync(full).isDirectory()) {
            const ext = path.extname(full).toLowerCase();
            res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
            return fs.createReadStream(full).pipe(res);
          }
        }

        next();
      });
    }
  };
}

function serveTemplatesPlugin() {
  const templateMap = {
    '/templates/plazaclock': path.resolve(rootDir, 'demo_plazaclock/dist'),
    '/templates/electwell': path.resolve(rootDir, 'jagmohan/frontend/dist'),
    '/templates/padmacables': path.resolve(rootDir, 'padmacables/dist'),
    '/templates/youngwheels': path.resolve(rootDir, 'youngwheels/dist')
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
  plugins: [react(), agencyApiPlugin(), serveTemplatesPlugin()],
  server: {
    port: 5000,
    open: true
  }
});
