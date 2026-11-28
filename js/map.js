
"use strict";

// =====================================
// BusMap Itoshima
// 白糸線マップ
// =====================================


// -------------------------------------
// 1. 地図の基本設定
// -------------------------------------

const INITIAL_CENTER = [33.522, 130.190];
const INITIAL_ZOOM = 12;

const mapElement = document.getElementById("map");
const routeListElement = document.getElementById("routeList");
const resetButton = document.getElementById("resetMap");


// 地図のエラーを表示する
function showMapError(message) {
  console.error("[BusMap]", message);

  if (mapElement) {
    mapElement.innerHTML = `
      <div style="
        padding: 24px;
        color: #b91c1c;
        background: #fee2e2;
        border-radius: 12px;
        margin: 16px;
      ">
        <strong>地図を読み込めませんでした</strong>
        <p>${message}</p>
      </div>
    `;
  }
}


// 必要なHTML要素があるか確認
if (!mapElement) {
  console.error("HTMLに id='map' が見つかりません。");
}

if (!routeListElement) {
  console.error("HTMLに id='routeList' が見つかりません。");
}


// Leafletが読み込まれているか確認
if (typeof L === "undefined") {
  showMapError(
    "Leafletが読み込まれていません。index.htmlのLeaflet JSを確認してください。"
  );
}


// -------------------------------------
// 2. 白糸線データ
// -------------------------------------

const routes = [
  {
    id: "shiraito",
    name: "白糸線",
    color: "#2563eb",

    stops: [
      {
        name: "前原駅南口",
        lat: 33.55661733006474,
        lng: 130.1992836638313
      },
      {
        name: "南風台入口",
        lat: 33.550939498223705,
        lng: 130.1971271606821
      },
      {
        name: "南風台中央",
        lat: 33.5489434076725,
        lng: 130.195461992872
      },
      {
        name: "多久",
        lat: 33.5448246832026,
        lng: 130.1953942376346
      },
      {
        name: "宮地嶽入口",
        lat: 33.54158201089864,
        lng: 130.19154316435052
      },
      {
        name: "野添",
        lat: 33.53707169586137,
        lng: 130.18816606931676
      },
      {
        name: "真方",
        lat: 33.534071865014354,
        lng: 130.18731720522246
      },
      {
        name: "蛇石",
        lat: 33.52487851867237,
        lng: 130.1916897235768
      },
      {
        name: "本区",
        lat: 33.52121305722921,
        lng: 130.1909366788102
      },
      {
        name: "八反田",
        lat: 33.51280823638914,
        lng: 130.1943375265411
      },
      {
        name: "瀬戸",
        lat: 33.5133758782694,
        lng: 130.18395593380146
      },
      {
        name: "長糸支所",
        lat: 33.51121749363311,
        lng: 130.19558875937656
      },
      {
        name: "飯原口",
        lat: 33.50722843846738,
        lng: 130.1979480930921
      },
      {
        name: "長野（前原）",
        lat: 33.50220087428183,
        lng: 130.1980791671831
      },
      {
        name: "別処",
        lat: 33.49730964844752,
        lng: 130.19578537059078
      },
      {
        name: "白糸の森",
        lat: 33.49252745633985,
        lng: 130.17920449793257
      },
      {
        name: "白糸",
        lat: 33.488318909011404,
        lng: 130.17861466452314
      }
    ]
  }
];


// -------------------------------------
// 3. 地図を初期化
// -------------------------------------

let map = null;

if (typeof L !== "undefined" && mapElement) {
  try {
    map = L.map(mapElement, {
      zoomControl: true,
      scrollWheelZoom: true
    });

    map.setView(INITIAL_CENTER, INITIAL_ZOOM);

    // OpenStreetMap
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
      }
    ).addTo(map);

  } catch (error) {
    showMapError("地図の初期化中にエラーが発生しました。");
    console.error(error);
  }
}


// -------------------------------------
// 4. 路線の表示管理
// -------------------------------------

const routeLayers = {};


// -------------------------------------
// 5. 路線を地図に追加
// -------------------------------------

function createRoute(route) {
  if (!map) return;

  const layerGroup = L.layerGroup();

  // バス停の座標を路線の線にする
  const coordinates = route.stops.map(stop => [
    stop.lat,
    stop.lng
  ]);

  // 路線の線
  const line = L.polyline(coordinates, {
    color: route.color,
    weight: 5,
    opacity: 0.85,
    lineCap: "round",
    lineJoin: "round"
  });

  line.bindTooltip(route.name);

  layerGroup.addLayer(line);


  // バス停マーカー
  route.stops.forEach((stop, index) => {
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

    marker.bindTooltip(
      `${index + 1}. ${stop.name}`,
      {
        direction: "top",
        offset: [0, -6]
      }
    );

    layerGroup.addLayer(marker);
  });


  // 路線を保存
  routeLayers[route.id] = layerGroup;

  // 最初は表示
  layerGroup.addTo(map);
}


// -------------------------------------
// 6. 路線一覧を作成
// -------------------------------------

function createRouteList() {
  if (!routeListElement) return;

  routeListElement.innerHTML = "";

  routes.forEach(route => {
    const item = document.createElement("label");
    item.className = "route-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;

    checkbox.addEventListener("change", () => {
      const layer = routeLayers[route.id];

      if (!layer || !map) return;

      if (checkbox.checked) {
        layer.addTo(map);
      } else {
        map.removeLayer(layer);
      }
    });


    // 路線カラー
    const color = document.createElement("span");
    color.className = "route-color";
    color.style.backgroundColor = route.color;


    // 路線名
    const name = document.createElement("span");
    name.className = "route-name";
    name.textContent = route.name;


    item.appendChild(checkbox);
    item.appendChild(color);
    item.appendChild(name);

    routeListElement.appendChild(item);
  });
}


// -------------------------------------
// 7. 路線全体が見えるようにする
// -------------------------------------

function fitRouteBounds() {
  if (!map) return;

  const allCoordinates = [];

  routes.forEach(route => {
    route.stops.forEach(stop => {
      allCoordinates.push([
        stop.lat,
        stop.lng
      ]);
    });
  });

  if (allCoordinates.length === 0) return;

  const bounds = L.latLngBounds(allCoordinates);

  map.fitBounds(bounds, {
    padding: [40, 40],
    maxZoom: 14
  });
}


// -------------------------------------
// 8. 初期位置に戻るボタン
// -------------------------------------

if (resetButton) {
  resetButton.addEventListener("click", () => {
    fitRouteBounds();
  });
}


// -------------------------------------
// 9. 地図サイズの調整
// -------------------------------------

function refreshMapSize() {
  if (!map) return;

  map.invalidateSize({
    pan: false
  });
}


// 地図を描画したあとにサイズを再計算
if (map) {
  requestAnimationFrame(() => {
    refreshMapSize();
    fitRouteBounds();
  });

  // ウィンドウサイズ変更に対応
  window.addEventListener("resize", refreshMapSize);

  // 地図エリア自体のサイズ変更にも対応
  if (typeof ResizeObserver !== "undefined") {
    const mapResizeObserver = new ResizeObserver(() => {
      refreshMapSize();
    });

    mapResizeObserver.observe(mapElement);
  }
}


// -------------------------------------
// 10. 初期化
// -------------------------------------

if (map) {
  routes.forEach(createRoute);
  createRouteList();

  console.log("BusMap Itoshima: 地図を初期化しました");
  console.log("登録路線数:", routes.length);
  console.log("白糸線バス停数:", routes[0].stops.length);
}
