const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PORT = 3000;
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

const ALLOWED_WRITES = [
  'enterprise/deck.html',
  'investor/deck.html',
  'portfolio/deck.html',
];

// Injected into every HTML page. Theme-builder pages bail out early so they
// don't lose form state when a deck file changes.
const HOT_SCRIPT = `<script>
(function(){
  if (location.pathname.includes('theme-builder')) return;
  function connect() {
    const ws = new WebSocket('ws://' + location.host + '/__ws');
    ws.onmessage = () => location.reload();
    ws.onclose  = () => setTimeout(connect, 1500);
  }
  connect();
})();
</script>`;

// ── WebSocket clients ────────────────────────────────────────────────────────

const sockets = new Set();

function broadcast() {
  const payload = Buffer.from('reload');
  const frame = Buffer.allocUnsafe(2 + payload.length);
  frame[0] = 0x81; // FIN + text opcode
  frame[1] = payload.length;
  payload.copy(frame, 2);
  for (const s of sockets) {
    try { s.write(frame); } catch { sockets.delete(s); }
  }
}

// ── HTTP server ──────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  // Write endpoint (called by theme-builder "Apply to deck" button)
  if (req.method === 'POST' && req.url === '/apply-theme') {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      try {
        const { file, html } = JSON.parse(body);
        if (!ALLOWED_WRITES.includes(file)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end('{"error":"invalid file"}'); return;
        }
        fs.writeFileSync(path.join(ROOT, file), html, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Static file serving
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/enterprise/deck.html';

  const filePath = path.resolve(ROOT, urlPath.replace(/^\//, ''));

  // Path traversal guard
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403); res.end(); return;
  }
  if (filePath.includes(`${path.sep}node_modules`)) {
    res.writeHead(403); res.end(); return;
  }

  let stat;
  try { stat = fs.statSync(filePath); } catch {
    res.writeHead(404); res.end('Not found'); return;
  }
  if (stat.isDirectory()) { res.writeHead(404); res.end('Not found'); return; }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  try {
    if (ext === '.html') {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace('</body>', HOT_SCRIPT + '\n</body>');
      res.writeHead(200, { 'Content-Type': mime });
      res.end(content);
    } else {
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch {
    res.writeHead(500); res.end();
  }
});

// ── WebSocket upgrade (path /__ws) ───────────────────────────────────────────

server.on('upgrade', (req, socket) => {
  if (req.url !== '/__ws') { socket.destroy(); return; }
  const key = req.headers['sec-websocket-key'];
  if (!key) { socket.destroy(); return; }
  const accept = crypto.createHash('sha1').update(key + WS_GUID).digest('base64');
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  );
  sockets.add(socket);
  socket.on('close', () => sockets.delete(socket));
  socket.on('error', () => sockets.delete(socket));
});

server.listen(PORT, () => {
  console.log('\nPresentable dev server ready\n');
  console.log(`  enterprise  http://localhost:${PORT}/enterprise/deck.html`);
  console.log(`  investor    http://localhost:${PORT}/investor/deck.html`);
  console.log(`  portfolio   http://localhost:${PORT}/portfolio/deck.html\n`);
  console.log(`  theme builders:`);
  console.log(`              http://localhost:${PORT}/enterprise/theme-builder.html`);
  console.log(`              http://localhost:${PORT}/investor/theme-builder.html`);
  console.log(`              http://localhost:${PORT}/portfolio/theme-builder.html\n`);
});

// ── File watcher ─────────────────────────────────────────────────────────────

let reloadTimer = null;
fs.watch(ROOT, { recursive: true }, (_, filename) => {
  if (!filename) return;
  if (filename.includes('node_modules')) return;
  if (!['.html', '.css', '.js'].includes(path.extname(filename))) return;
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    process.stdout.write(`↺  ${filename}\n`);
    broadcast();
  }, 50);
});
