// Service Worker do Painel de Estudos
// -------------------------------------------------
// Objetivo: só existir pra deixar o site "instalável" como app e abrir mais
// rápido/funcionar levemente offline. NÃO tenta ser dono da rede: toda
// requisição vai pra internet primeiro, e só usa o cache se estiver
// realmente sem conexão. Isso evita o clássico problema de "app preso numa
// versão antiga" — sempre que tiver internet, pega a versão mais nova.
const CACHE_NAME = 'estudos-cache-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './diario.html',
  './provas.html',
  './prova-jogar.html',
  './revisao.html',
  './mural.html',
  './perfil.html',
  './nova-prova.html',
  './style.css',
  './theme.js',
  './haptics.js',
  './animations.js',
  './auth.js',
  './subjects.js',
  './gamification.js',
  './lightbox.js',
  './firebase-config.js',
  './firebase-init.js',
  './ai-config.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => { /* se algum arquivo não existir, não trava a instalação */ })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Deixa passar direto (sem cache) tudo que não é do próprio site:
  // Firebase, CDNs de fontes/bibliotecas, etc. — continuam funcionando
  // exatamente como sempre funcionaram.
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
