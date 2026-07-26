const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png'
};

http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  let file = reqUrl === '/' ? '/index.html' : reqUrl;
  let filePath = path.join(__dirname, file);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      let ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
      res.end(data);
    }
  });
}).listen(PORT, () => {
  console.log(`Custom server running at http://localhost:${PORT}`);
});
