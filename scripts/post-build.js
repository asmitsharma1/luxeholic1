import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distClientPath = path.join(__dirname, '..', 'dist', 'client');
const indexHtmlPath = path.join(distClientPath, 'index.html');

// Find the main JS file
const assetsDir = path.join(distClientPath, 'assets');
let mainJsFile = '';
let cssFile = '';

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  mainJsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js')) || '';
  cssFile = files.find(f => f.startsWith('styles-') && f.endsWith('.css')) || '';
}

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Luxeholic — The Maison of Premium Houses</title>
    <meta name="description" content="Curated luxury from Gucci, Prada, Balenciaga, Saint Laurent and more. Shipping across Australia, New Zealand and India." />
    <meta name="author" content="Luxeholic" />
    <meta property="og:title" content="Luxeholic — The Maison of Premium Houses" />
    <meta property="og:description" content="Curated luxury from the world's most coveted Maisons." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ''}
  </head>
  <body>
    <div id="root"></div>
    ${mainJsFile ? `<script type="module" src="/assets/${mainJsFile}"></script>` : ''}
  </body>
</html>`;

fs.writeFileSync(indexHtmlPath, indexHtml);
console.log('✅ Generated index.html for static hosting');
