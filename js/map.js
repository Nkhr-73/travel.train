
// ==================================
// BusMap Itoshima
// Phase 1 : Map System
// ==================================

// 糸島市の初期表示位置
const initialPosition = [33.557, 130.201];

// 初期ズーム
const initialZoom = 12;

// 地図の作成
const map = L.map("map", {
  zoomControl: true
}).setView(initialPosition, initialZoom);

// OpenStreetMapの地図データ
L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map);

// 初期位置に戻るボタン
document
  .getElementById("resetMap")
  .addEventListener("click", () => {

    map.setView(initialPosition, initialZoom, {
      animate: true
    });

  });

// 地図の読み込み後にサイズを再計算
setTimeout(() => {
  map.invalidateSize();
}, 100);

console.log("BusMap Itoshima : Map System Started");
