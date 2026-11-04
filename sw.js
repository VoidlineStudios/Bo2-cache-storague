// sw.js - Service Worker de soporte optimizado para Vercel (credentialless)
self.addEventListener("install", (e) => {
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).then((response) => {
            // Si la respuesta no es válida o viene vacía, la dejamos pasar normal
            if (!response || response.status !== 200 || response.type === 'opaque') {
                return response;
            }
            
            // Clonamos los encabezados e inyectamos la política compatible con Vercel
            const newHeaders = new Headers(response.headers);
            newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
            newHeaders.set("Cross-Origin-Embedder-Policy", "credentialless"); // Cambiado a credentialless
            
            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders,
            });
        }).catch(() => fetch(event.request))
    );
});
