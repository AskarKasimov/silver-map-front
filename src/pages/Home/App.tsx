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

interface ClusterProperties {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: number;
}

type PoetPointFeature = PointFeature<PoetPointProperties>;
type PoetClusterFeature = ClusterFeature<ClusterProperties>;
type PoetFeature = PoetPointFeature | PoetClusterFeature;

// Type guard для проверки типа фичи
function isPointFeature(feature: PoetFeature): feature is PoetPointFeature {
  return !('cluster' in feature.properties) || !feature.properties.cluster;
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

  const clearAllMarkers = () => {
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};
  };

  const createMarker = (feature: PoetFeature) => {
    const { geometry, properties } = feature;
    const coordinates = geometry.coordinates as [number, number];

    const el = document.createElement('div');

    if (!isPointFeature(feature)) {
      // маркер - кластер
      const clusterProps = properties as ClusterProperties;
      el.className = 'cluster-marker';
      el.innerHTML = `<span>${clusterProps.point_count}</span>`;
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mapRef.current && superclusterRef.current) {
          // точный зум, при котором кластер раскроется
          const expansionZoom = superclusterRef.current.getClusterExpansionZoom(
            feature.properties.cluster_id
          );

          // приближение к кластеру
          mapRef.current.flyTo({
            center: coordinates,
            zoom: expansionZoom,
            speed: 0.5,
          });
        }
      });
    } else {
      // маркер - точка
      const pointProps = properties as PoetPointProperties;
      el.className = 'sepia-marker';
      el.style.backgroundImage = `url(${markerPoint})`;
      el.title = pointProps.name;
    }

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'center',
    }).setLngLat(coordinates);

    // Добавляем popup только для точек
    if (isPointFeature(feature)) {
      const pointProps = properties as PoetPointProperties;
      marker.setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(`
      <div class="vintage-popup">
        <h3>${pointProps.name}</h3>
        <p>${pointProps.description}</p>
        <img src="${pointProps.photo}" alt="${pointProps.name}" width="140">
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

    const clusters = superclusterRef.current.getClusters(
      bbox,
      Math.floor(zoom)
    ) as PoetFeature[];

    clearAllMarkers();

    clusters.forEach((cluster) => {
      const marker = createMarker(cluster);
      marker.addTo(mapRef.current!);

      // ключ для маркера
      const key = isPointFeature(cluster)
        ? `point-${cluster.properties.id}`
        : `cluster-${cluster.properties.cluster_id}`;

      markersRef.current[key] = marker;
    });
  };

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
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

      superclusterRef.current = new Supercluster<
        PoetPointProperties,
        ClusterProperties
      >({
        radius: 60,
        maxZoom: 16,
      });

      // формат Supercluster
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

      superclusterRef.current.load(points); // загрузка точек

      mapRef.current.on('moveend', updateClusters);
      mapRef.current.on('zoomend', updateClusters);

      updateClusters();
    }

    return () => {
      // Очистка при размонтировании
      clearAllMarkers();
      mapRef.current?.remove();
      mapRef.current = null;
      superclusterRef.current = null;
    };
  });

  return (
    <div className="sepia-map-container">
      <div ref={mapContainer} className="sepia-map" />
    </div>
  );
};

export default App;
