const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const bs = spawn('browser-sync', [
  'start', '--server',
  '--files', '**/*.html,**/*.css,**/*.js',
  '--no-open', '--port', '3000'
], { stdio: 'inherit', shell: true });

bs.on('error', () => console.error('browser-sync not found — run: npm install -g browser-sync'));

const ALLOWED = ['enterprise/deck.html', 'investor/deck.html', 'portfolio/deck.html'];

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method === 'POST' && req.url === '/apply-theme') {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      try {
        const { file, html } = JSON.parse(body);
        if (!ALLOWED.includes(file)) { res.writeHead(400); res.end('{"error":"invalid file"}'); return; }
        fs.writeFileSync(path.join(__dirname, file), html, 'utf8');
        res.writeHead(200); res.end('{"ok":true}');
      } catch (e) { res.writeHead(500); res.end(JSON.stringify({ error: e.message })); }
    });
    return;
  }
  res.writeHead(404); res.end();
}).listen(3001, () => console.log('Theme write-server → http://localhost:3001'));

process.on('SIGINT', () => { bs.kill(); process.exit(); });
process.on('SIGTERM', () => { bs.kill(); process.exit(); });
