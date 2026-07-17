import fs from 'fs';
import path from 'path';

const dirsToCopy = ['css', 'js', 'RES'];
const filesToCopy = ['index.html', 'robots.txt', 'sitemap.xml'];
const destDir = 'dist';

// Clean destination
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir, { recursive: true });

// Copy directories
for (const dir of dirsToCopy) {
  if (fs.existsSync(dir)) {
    fs.cpSync(dir, path.join(destDir, dir), { recursive: true });
    console.log(`Copied directory: ${dir}`);
  }
}

// Copy files
for (const file of filesToCopy) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(destDir, file));
    console.log(`Copied file: ${file}`);
  }
}

console.log('Build completed successfully!');
