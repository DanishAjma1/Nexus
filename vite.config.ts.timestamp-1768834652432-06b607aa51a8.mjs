// vite.config.ts
import { defineConfig } from "file:///E:/final%20year%20project/frontend/Nexus/node_modules/vite/dist/node/index.js";
import react from "file:///E:/final%20year%20project/frontend/Nexus/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///E:/final%20year%20project/frontend/Nexus/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true
      },
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "TrustBridge AI",
        short_name: "TrustBridge",
        description: "Business Collaboration App",
        theme_color: "#0f172a",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/login",
        icons: [
          {
            src: "/logo-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/logo-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // 5 MB
        navigateFallbackDenylist: [
          /^\/$/,
          // landing
          /^\/All-Campaigns(\/.*)?$/,
          /^\/Fundraises(\/.*)?$/
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) => {
              if (request.destination !== "document") return false;
              const excluded = [
                "/",
                "/All-Campaigns",
                "/Fundraises"
              ];
              return !excluded.some(
                (route) => url.pathname === route || url.pathname.startsWith(route + "/")
              );
            },
            handler: "NetworkFirst",
            options: {
              cacheName: "pwa-pages-cache"
            }
          },
          {
            urlPattern: ({ request }) => request.destination === "script" || request.destination === "style",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets-cache"
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxmaW5hbCB5ZWFyIHByb2plY3RcXFxcZnJvbnRlbmRcXFxcTmV4dXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXGZpbmFsIHllYXIgcHJvamVjdFxcXFxmcm9udGVuZFxcXFxOZXh1c1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovZmluYWwlMjB5ZWFyJTIwcHJvamVjdC9mcm9udGVuZC9OZXh1cy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcclxuICAgICAgZGV2T3B0aW9uczoge1xyXG4gICAgICAgIGVuYWJsZWQ6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLnN2ZycsICdyb2JvdHMudHh0J10sXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgbmFtZTogJ1RydXN0QnJpZGdlIEFJJyxcclxuICAgICAgICBzaG9ydF9uYW1lOiAnVHJ1c3RCcmlkZ2UnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQnVzaW5lc3MgQ29sbGFib3JhdGlvbiBBcHAnLFxyXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnIzBmMTcyYScsXHJcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcclxuICAgICAgICBzY29wZTogJy8nLFxyXG4gICAgICAgIHN0YXJ0X3VybDogJy9sb2dpbicsXHJcbiAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiAnL2xvZ28tMTkyeDE5Mi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiAnL2xvZ28tNTEyeDUxMi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgd29ya2JveDoge1xyXG4gICAgICAgIGNsZWFudXBPdXRkYXRlZENhY2hlczogdHJ1ZSxcclxuICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogNSAqIDEwMjQgKiAxMDI0LCAvLyA1IE1CXHJcbiAgICAgICAgbmF2aWdhdGVGYWxsYmFja0RlbnlsaXN0OiBbXHJcbiAgICAgICAgICAvXlxcLyQvLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsYW5kaW5nXHJcbiAgICAgICAgICAvXlxcL0FsbC1DYW1wYWlnbnMoXFwvLiopPyQvLFxyXG4gICAgICAgICAgL15cXC9GdW5kcmFpc2VzKFxcLy4qKT8kLyxcclxuICAgICAgICBdLFxyXG5cclxuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAoeyByZXF1ZXN0LCB1cmwgfSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChyZXF1ZXN0LmRlc3RpbmF0aW9uICE9PSAnZG9jdW1lbnQnKSByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgZXhjbHVkZWQgPSBbXHJcbiAgICAgICAgICAgICAgICAnLycsXHJcbiAgICAgICAgICAgICAgICAnL0FsbC1DYW1wYWlnbnMnLFxyXG4gICAgICAgICAgICAgICAgJy9GdW5kcmFpc2VzJ1xyXG4gICAgICAgICAgICAgIF1cclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuICFleGNsdWRlZC5zb21lKHJvdXRlID0+XHJcbiAgICAgICAgICAgICAgICB1cmwucGF0aG5hbWUgPT09IHJvdXRlIHx8IHVybC5wYXRobmFtZS5zdGFydHNXaXRoKHJvdXRlICsgJy8nKVxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaGFuZGxlcjogJ05ldHdvcmtGaXJzdCcsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdwd2EtcGFnZXMtY2FjaGUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHVybFBhdHRlcm46ICh7IHJlcXVlc3QgfSkgPT5cclxuICAgICAgICAgICAgICByZXF1ZXN0LmRlc3RpbmF0aW9uID09PSAnc2NyaXB0JyB8fFxyXG4gICAgICAgICAgICAgIHJlcXVlc3QuZGVzdGluYXRpb24gPT09ICdzdHlsZScsXHJcbiAgICAgICAgICAgIGhhbmRsZXI6ICdTdGFsZVdoaWxlUmV2YWxpZGF0ZScsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdhc3NldHMtY2FjaGUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgXSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J11cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFMsU0FBUyxvQkFBb0I7QUFDdlUsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUV4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxZQUFZO0FBQUEsUUFDVixTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsZUFBZSxDQUFDLGVBQWUsWUFBWTtBQUFBLE1BQzNDLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLGtCQUFrQjtBQUFBLFFBQ2xCLFNBQVM7QUFBQSxRQUNULE9BQU87QUFBQSxRQUNQLFdBQVc7QUFBQSxRQUNYLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLHVCQUF1QjtBQUFBLFFBQ3ZCLCtCQUErQixJQUFJLE9BQU87QUFBQTtBQUFBLFFBQzFDLDBCQUEwQjtBQUFBLFVBQ3hCO0FBQUE7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxRQUVBLGdCQUFnQjtBQUFBLFVBQ2Q7QUFBQSxZQUNFLFlBQVksQ0FBQyxFQUFFLFNBQVMsSUFBSSxNQUFNO0FBQ2hDLGtCQUFJLFFBQVEsZ0JBQWdCLFdBQVksUUFBTztBQUUvQyxvQkFBTSxXQUFXO0FBQUEsZ0JBQ2Y7QUFBQSxnQkFDQTtBQUFBLGdCQUNBO0FBQUEsY0FDRjtBQUVBLHFCQUFPLENBQUMsU0FBUztBQUFBLGdCQUFLLFdBQ3BCLElBQUksYUFBYSxTQUFTLElBQUksU0FBUyxXQUFXLFFBQVEsR0FBRztBQUFBLGNBQy9EO0FBQUEsWUFDRjtBQUFBLFlBQ0EsU0FBUztBQUFBLFlBQ1QsU0FBUztBQUFBLGNBQ1AsV0FBVztBQUFBLFlBQ2I7QUFBQSxVQUNGO0FBQUEsVUFDQTtBQUFBLFlBQ0UsWUFBWSxDQUFDLEVBQUUsUUFBUSxNQUNyQixRQUFRLGdCQUFnQixZQUN4QixRQUFRLGdCQUFnQjtBQUFBLFlBQzFCLFNBQVM7QUFBQSxZQUNULFNBQVM7QUFBQSxjQUNQLFdBQVc7QUFBQSxZQUNiO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
