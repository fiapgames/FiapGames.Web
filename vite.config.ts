import { defineConfig, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'

// React Router routes (/games, /orders/:id, /library, /library/:userId) share the
// same path prefixes as the API proxy below. A page navigation (typed URL, refresh,
// link click) sends `Accept: text/html`, while the app's own fetch() calls don't -
// bypass the proxy for the former so Vite serves the SPA shell instead of raw JSON.
const apiProxy: ProxyOptions = {
  target: 'http://localhost:8080',
  bypass(req) {
    if (req.headers.accept?.includes('text/html')) return '/index.html'
  },
}

// Users API runs as a separate service (its own container/port), unlike Catalog.
const usersApiProxy: ProxyOptions = {
  target: 'http://localhost:8083',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forwards API calls to the Catalog and Users APIs during dev, neither of which
    // has CORS middleware configured. Same-origin browser requests avoid the issue entirely.
    proxy: {
      '/games': apiProxy,
      '/orders': apiProxy,
      '/library': apiProxy,
      '/health': apiProxy,
      '/api': usersApiProxy,
    },
  },
})
