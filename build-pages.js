const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

const openNextDir = path.join(__dirname, '.open-next');
const pagesOutputDir = path.join(__dirname, '.pages-output');

if (fs.existsSync(pagesOutputDir)) {
  fs.rmSync(pagesOutputDir, { recursive: true, force: true });
}
fs.mkdirSync(pagesOutputDir, { recursive: true });

// Copy static assets directly to root of output
const assetsDir = path.join(openNextDir, 'assets');
if (fs.existsSync(assetsDir)) {
  fs.readdirSync(assetsDir).forEach((item) => {
    copyRecursiveSync(path.join(assetsDir, item), path.join(pagesOutputDir, item));
  });
}

// Copy required directories for worker.js
const dirsToCopy = ['cloudflare', 'server-functions', '.build', 'middleware', 'dynamodb-provider'];
dirsToCopy.forEach(dir => {
  const src = path.join(openNextDir, dir);
  if (fs.existsSync(src)) {
    copyRecursiveSync(src, path.join(pagesOutputDir, dir));
  }
});

// Copy and rename worker.js
const workerSrc = path.join(openNextDir, 'worker.js');
if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, path.join(pagesOutputDir, '_worker.js'));
}

console.log('Successfully prepared .pages-output for Cloudflare Pages!');
