// Tiệm Vàng v1.0.0 – trang lấy mạng trước, mất mạng thì dùng bản đã lưu
var C = "tiemvang-1.0.0";
self.addEventListener("install", function (e) { self.skipWaiting(); e.waitUntil(caches.open(C).then(function (c) { return c.addAll(["./", "manifest.json", "icon-192.png"]); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== C; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) { var k = r.clone(); caches.open(C).then(function (c) { c.put(e.request, k); }); return r; }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match("./"); }); }));
});
