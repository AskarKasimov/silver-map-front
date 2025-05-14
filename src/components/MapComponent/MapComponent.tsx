import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './MapComponent.module.scss';
import markerPoint from '@assets/point.png';
import Supercluster, { ClusterFeature, PointFeature } from 'supercluster';
import { truncateText } from '../../utils/text.ts';
import poet from '@assets/cvetaeva.png';
import { IMark } from '../../store/API/models.api.ts';
import { useDispatch } from 'react-redux';
import { setPickedMark } from '../../store/pickedMark.ts';

const MAP_STYLE =
  'https://api.maptiler.com/maps/019672dc-4df0-7fa6-afc6-39c61c2ed227/style.json?key=iKHXej3Rp2N1NAr4Xjdf';
const INITIAL_CENTER: [number, number] = [37.6173, 55.7558];
const INITIAL_ZOOM = 11;

interface ClusterProperties {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: number;
}

type MarkPointFeature = PointFeature<IMark>;
type MarkClusterFeature = ClusterFeature<ClusterProperties>;
type MarkFeature = MarkPointFeature | MarkClusterFeature;

// Type guard для проверки типа фичи
const isPointFeature = (feature: MarkFeature): feature is MarkPointFeature => {
  return !('cluster' in feature.properties) || !feature.properties.cluster;
};

export interface MapComponentProps {
  points: IMark[];
}

const MapComponent: React.FC<MapComponentProps> = ({ points }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const superclusterRef = useRef<Supercluster<IMark> | null>(null);

  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  const dispatch = useDispatch();

  const clearAllMarkers = () => {
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};
  };

  const createMarker = (feature: MarkFeature) => {
    const { geometry, properties } = feature;
    const coordinates = geometry.coordinates as [number, number];

    const el = document.createElement('div');

    if (!isPointFeature(feature)) {
      // маркер - кластер
      const clusterProps = properties as ClusterProperties;
      el.className = styles.clusterMarker;
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
            speed: 1.5,
          });
        }
      });
    } else {
      // маркер - точка
      const pointProps = properties as IMark;
      el.className = styles.sepiaMarker;
      el.style.backgroundImage = `url(${markerPoint})`;
      el.title = pointProps.name;
    }

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'bottom',
    }).setLngLat(coordinates);

    // popup только для точек
    if (isPointFeature(feature)) {
      const pointProps = properties as IMark;
      const popup = new maplibregl.Popup({
        closeButton: false,
        className: styles.vintagePopup,
      }).setHTML(`
      <h3>${pointProps.name}</h3>
      <p>${truncateText(pointProps.description, 100)}</p>
      <p class="${styles.more}" id="mark${pointProps.id}">Подробнее</p>
      `);
      marker.setPopup(popup);
      popup.on('open', () => {
        const popupElement = document.getElementById(`mark${pointProps.id}`);
        if (popupElement) {
          popupElement.addEventListener('click', () => {
            dispatch(setPickedMark(pointProps));
          });
        }
      });
    }

    return marker;
  };

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
    ) as MarkFeature[];

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

      superclusterRef.current = new Supercluster<IMark, ClusterProperties>({
        radius: 60,
        maxZoom: 16,
      });

      // формат Supercluster
      const pointsSuperCluster: PointFeature<IMark>[] = points.map(
        (location) => ({
          type: 'Feature',
          properties: {
            id: location.id,
            name: location.name,
            coord_x: location.coord_x,
            coord_y: location.coord_y,
            photo: location.photo,
            description: location.description,
            time_start: location.time_start,
            time_end: location.time_end,
          },
          geometry: {
            type: 'Point',
            coordinates: [location.coord_x, location.coord_y],
          },
        })
      );

      superclusterRef.current.load(pointsSuperCluster); // загрузка точек

      mapRef.current.on('moveend', updateClusters);
      mapRef.current.on('zoomend', updateClusters);

      updateClusters();
    }

    return () => {
      clearAllMarkers();
      mapRef.current?.remove();
      mapRef.current = null;
      superclusterRef.current = null;
    };
  });

  return (
    <div className={styles.wrapper}>
      <div ref={mapContainer} className={styles.sepiaMap} />
      <img src={poet} className={styles.poet} />
    </div>
  );
};

export default MapComponent;
