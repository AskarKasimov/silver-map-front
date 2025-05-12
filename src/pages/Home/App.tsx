import React, { useEffect, useState } from 'react';
import MapComponent, {
  PoetPointProperties,
} from '../../components/MapComponent.tsx';

const App: React.FC = () => {
  const [points, setPoints] = useState<PoetPointProperties[]>([]);

  useEffect(() => {
    setPoints([
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
    ]);
  }, []);
  return (
    <>
      <MapComponent points={points} />
    </>
  );
};

export default App;
