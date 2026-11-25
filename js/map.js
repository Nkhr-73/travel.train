// 糸島市周辺の地図
const map = L.map("map").setView([33.557, 130.201], 12);

// OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// ==============================
// サンプル路線データ
// ※動作確認用の仮データ
// ==============================

const routes = [
  {
    id: "route1",
    name: "サンプル路線 A",
    color: "#3b82f6",
    stops: [
      {
        name: "サンプルバス停 1",
        lat: 33.557,
        lng: 130.201
      },
      {
        name: "サンプルバス停 2",
        lat: 33.565,
        lng: 130.215
      },
      {
        name: "サンプルバス停 3",
        lat: 33.573,
        lng: 130.230
      }
    ]
  },
  {
    id: "route2",
    name: "サンプル路線 B",
    color: "#f97316",
    stops: [
      {
        name: "サンプルバス停 4",
        lat: 33.557,
        lng: 130.201
      },
      {
        name: "サンプルバス停 5",
        lat: 33.545,
        lng: 130.215
      },
      {
        name: "サンプルバス停 6",
        lat: 33.535,
        lng: 130.230
      }
    ]
  }
];


// 路線ごとの表示レイヤー
const routeLayers = {};


// ==============================
// 路線を地図に追加
// ==============================

function createRoute(route) {
  const layerGroup = L.layerGroup();

  // 路線の線
  const coordinates = route.stops.map(stop => [
    stop.lat,
    stop.lng
  ]);

  const line = L.polyline(coordinates, {
    color: route.color,
    weight: 5,
    opacity: 0.85
  });

  layerGroup.addLayer(line);


  // バス停マーカー
  route.stops.forEach(stop => {
    const marker = L.circleMarker(
      [stop.lat, stop.lng],
      {
        radius: 6,
        color: "#ffffff",
        weight: 2,
        fillColor: route.color,
        fillOpacity: 1
      }
    );

    marker.bindTooltip(stop.name);

    layerGroup.addLayer(marker);
  });

  routeLayers[route.id] = layerGroup;

  // 最初は表示する
  layerGroup.addTo(map);
}


// ==============================
// 路線一覧を作成
// ==============================

function createRouteList() {
  const routeList = document.getElementById("routeList");

  if (!routeList) {
    console.error("routeList が見つかりません");
    return;
  }

  routeList.innerHTML = "";

  routes.forEach(route => {
    const item = document.createElement("label");
    item.className = "route-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        routeLayers[route.id].addTo(map);
      } else {
        map.removeLayer(routeLayers[route.id]);
      }
    });

    const color = document.createElement("span");
    color.className = "route-color";
    color.style.backgroundColor = route.color;

    const name = document.createElement("span");
    name.className = "route-name";
    name.textContent = route.name;

    item.appendChild(checkbox);
    item.appendChild(color);
    item.appendChild(name);

    routeList.appendChild(item);
  });
}


// ==============================
// 初期化
// ==============================

routes.forEach(createRoute);
createRouteList();


// ==============================
// 初期位置に戻るボタン
// ==============================

const resetButton = document.getElementById("resetMap");

if (resetButton) {
  resetButton.addEventListener("click", () => {
    map.setView([33.557, 130.201], 12);
  });
}
