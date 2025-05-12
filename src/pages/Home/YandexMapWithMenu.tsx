import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import styles from './YandexMapWithMenu.module.scss';
import 'leaflet/dist/leaflet.css';

// Тип точки
interface Point {
  id: number;
  name: string;
  coordinates: LatLngExpression;
  description: string;
}

// Пример точек
const points: Point[] = [
  {
    id: 1,
    name: 'Москва',
    coordinates: [55.751574, 37.573856],
    description: 'Москва, Россия',
  },
  {
    id: 2,
    name: 'Санкт-Петербург',
    coordinates: [59.939099, 30.315877],
    description: 'Санкт-Петербург',
  },
  {
    id: 3,
    name: 'Екатеринбург',
    coordinates: [56.838011, 60.597474],
    description: 'Екатеринбург',
  },
];

// Хелпер для центровки карты на выбранной точке
const MapCenterer: React.FC<{ center: LatLngExpression }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12, { animate: true });
  }, [center, map]);
  return null;
};

const YandexMapWithMenu: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [center, setCenter] = useState<LatLngExpression>([
    55.751574, 37.573856,
  ]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuVisible &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuVisible]);

  const handleSelectPoint = (point: Point) => {
    setSelectedPoint(point);
    setCenter(point.coordinates);
    if (window.innerWidth <= 768) setMenuVisible(false);
  };

  return (
    <div
      className={`${styles.container} ${menuVisible ? styles.menuOpen : ''}`}
    >
      <MapContainer
        center={center}
        zoom={10}
        // scrollWheelZoom
        className={styles.map}
        style={{ width: '100vw', height: '100vh' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedPoint && <MapCenterer center={center} />}
        {points.map((point) => (
          <Marker key={point.id} position={point.coordinates}>
            <Popup>
              <strong>{point.name}</strong>
              <br />
              {point.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <button
        className={styles.menuToggle}
        onClick={() => setMenuVisible((v) => !v)}
        aria-label={menuVisible ? 'Закрыть меню' : 'Открыть меню'}
      >
        {menuVisible ? '×' : '☰'}
      </button>

      <div
        className={`${styles.slidingMenu} ${menuVisible ? styles.visible : ''}`}
        ref={menuRef}
      >
        <h2>Список точек</h2>
        <ul className={styles.pointsList}>
          {points.map((point) => (
            <li
              key={point.id}
              className={`${styles.pointItem} ${
                selectedPoint && selectedPoint.id === point.id
                  ? styles.active
                  : ''
              }`}
              onClick={() => handleSelectPoint(point)}
            >
              <div className={styles.pointName}>{point.name}</div>
              <div className={styles.pointDescription}>{point.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default YandexMapWithMenu;
