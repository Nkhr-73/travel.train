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
// ==============================
// 白糸線 路線データ
// ==============================

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
