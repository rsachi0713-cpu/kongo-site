const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '.pages-output', '_worker.js');
let workerCode = fs.readFileSync(workerPath, 'utf8');

// Inject a global error handler at the very top
const patch = `
globalThis.addEventListener = globalThis.addEventListener || function() {};
const originalConsoleError = console.error;
console.error = function(...args) {
  originalConsoleError("[INTERCEPTED ERROR]:", ...args);
};
process.on = process.on || function() {};
`;

workerCode = patch + workerCode;
fs.writeFileSync(workerPath, workerCode);
console.log("Patched _worker.js");
