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
        } else if (file.endsWith('page.tsx') || file.endsWith('route.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir('src/app');
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes("export const runtime = 'edge'") && !content.includes('export const runtime = "edge"')) {
        fs.writeFileSync(file, content + "\n\nexport const runtime = 'edge';\n");
        console.log('Added to', file);
    }
});
