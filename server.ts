import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// Import HTTP proxy middleware
import { createProxyMiddleware } from 'http-proxy-middleware';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const publicFolder = resolve(serverDistFolder, '../public'); // Resolve the public folder path
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  // Set the view engine for SSR
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Proxy API requests to the backend server
  server.use(
    '/api',
    createProxyMiddleware({
      target: 'https://safizoo-backend-spring-mysql.fly.dev', // Backend API URL
      changeOrigin: true,
      secure: true,
    })
  );

  // Serve static files from /browser (Angular app build files)
  server.use(express.static(browserDistFolder, { maxAge: '1y' }));

  // Serve static files from /public (images, etc.)
  server.use('/public', express.static(publicFolder, { maxAge: '1y' }));

  // All other routes use the Angular Universal engine for SSR
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start the Node.js server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
