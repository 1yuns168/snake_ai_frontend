import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

// WebSocket 代理到 Azure 後端
app.use('/ws', createProxyMiddleware({
  target: 'ws://20.239.90.85:8765',
  ws: true,
  changeOrigin: true,
  pathRewrite: { '^/ws': '' },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
  }
}));

// Vue Router 支援
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});