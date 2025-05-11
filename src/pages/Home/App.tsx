import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './sepia-map.css';
import markerPoint from '@assets/point.png';
import Supercluster, { ClusterFeature, PointFeature } from 'supercluster';

const MAP_STYLE =
  'https://api.maptiler.com/maps/019672dc-4df0-7fa6-afc6-39c61c2ed227/style.json?key=iKHXej3Rp2N1NAr4Xjdf';
const INITIAL_CENTER: [number, number] = [37.6173, 55.7558];
const INITIAL_ZOOM = 11;

interface PoetPointProperties {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  photo: string;
}

const poetsLocations: PoetPointProperties[] = [
  {
    id: 1,
    name: 'Дом Марины Цветаевой',
    description:
      'Музей-квартира Марины Цветаевой. Здесь поэтесса жила в 1914–1922 годах.',
    lat: 55.7496,
    lng: 37.6022,
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/6/6b/Marina_Tsvetaeva_Museum_Moscow.jpg',
  },
  {
    id: 2,
    name: 'Булгаковский дом',
    description:
      'Место, связанное с Михаилом Булгаковым, автором «Мастера и Маргариты».',
    lat: 55.7762,
    lng: 37.5937,
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/1/1c/Bulgakov_Museum_Moscow.jpg',
  },
];
const App: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const superclusterRef = useRef<Supercluster<PoetPointProperties> | null>(
    null
  );

  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  // Функция для очистки всех маркеров
  const clearAllMarkers = () => {
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};
  };

  // Функция создания маркера
  const createMarker = (
    feature:
      | PointFeature<PoetPointProperties>
      | ClusterFeature<PoetPointProperties>
  ) => {
    const { geometry, properties } = feature;
    const coordinates = geometry.coordinates as [number, number];
    const isCluster = 'cluster' in properties && properties.cluster;

    const el = document.createElement('div');
    if (isCluster) {
      el.className = 'cluster-marker';
      el.innerHTML = `<span>${properties.point_count}</span>`;
    } else {
      el.className = 'sepia-marker';
      el.style.backgroundImage = `url(${markerPoint})`;
      el.title = properties.name;
    }

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'center',
    }).setLngLat(coordinates);

    // Для точек
    if (!isCluster) {
      marker.setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div class="vintage-popup">
          <h3>${properties.name}</h3>
          <p>${properties.description}</p>
          <img src="${properties.photo}" alt="${properties.name}" width="140">
        </div>
      `)
      );
    }

    return marker;
  };

  // Функция обновления кластеров
  const updateClusters = () => {
    if (!mapRef.current || !superclusterRef.current) return;

    const zoom = mapRef.current.getZoom();
    const bounds = mapRef.current.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ] as [number, number, number, number];

    // Получаем актуальные кластеры
    const clusters = superclusterRef.current.getClusters(
      bbox,
      Math.floor(zoom)
    );

    // Очищаем все предыдущие маркеры
    clearAllMarkers();

    // Добавляем новые маркеры
    clusters.forEach((cluster) => {
      const marker = createMarker(cluster);
      marker.addTo(mapRef.current!);

      // Сохраняем маркер в ref
      const key =
        'cluster' in cluster.properties && cluster.properties.cluster
          ? `cluster-${cluster.properties.cluster_id}`
          : `point-${cluster.properties.id}`; // Только для точек, проверяем наличие id
      markersRef.current[key] = marker;
    });
  };

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      // Инициализация карты
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLE,
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
      });

      mapRef.current.addControl(
        new maplibregl.NavigationControl(),
        'top-right'
      );

      // Инициализация Supercluster
      superclusterRef.current = new Supercluster<PoetPointProperties>({
        radius: 60,
        maxZoom: 16,
      });

      // Преобразование данных в формат, который ожидает Supercluster
      const points: PointFeature<PoetPointProperties>[] = poetsLocations.map(
        (location) => ({
          type: 'Feature',
          properties: {
            id: location.id,
            name: location.name,
            description: location.description,
            lat: location.lat,
            lng: location.lng,
            photo: location.photo,
          },
          geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat],
          },
        })
      );

      superclusterRef.current.load(points); // Загрузка точек

      // Подписка на события
      mapRef.current.on('moveend', updateClusters);
      mapRef.current.on('zoomend', updateClusters);

      // Первоначальная отрисовка
      updateClusters();
    }

    return () => {
      // Очистка при размонтировании
      clearAllMarkers();
      mapRef.current?.remove();
      mapRef.current = null;
      superclusterRef.current = null;
    };
  }, []);

  return (
    <div className="sepia-map-container">
      <div ref={mapContainer} className="sepia-map" />
    </div>
  );
};

export default App;
