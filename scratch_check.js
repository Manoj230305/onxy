const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(content)) !== null) {
    count++;
    if (count === 5 || count === 12) {
        const body = match[1];
        console.log(`=== Script #${count} ===`);
        const sub = /.{0,40}ally.{0,40}/gi;
        let m;
        while ((m = sub.exec(body)) !== null) {
            console.log('Match:', m[0]);
        }
    }
}
