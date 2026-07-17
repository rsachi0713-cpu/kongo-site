const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('src/app');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes("export const runtime = 'edge'") || content.includes('export const runtime = "edge"')) {
        content = content.replace(/export const runtime = 'edge';/g, '');
        content = content.replace(/export const runtime = "edge";/g, '');
        fs.writeFileSync(file, content);
        console.log('Removed from', file);
    }
});
