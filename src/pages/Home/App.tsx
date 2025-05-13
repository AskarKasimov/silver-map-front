import React, { useEffect, useState } from 'react';
import MapComponent, {
  PoetPointProperties,
} from '../../components/MapComponent.tsx';
import styles from './App.module.scss';
import poet from '@assets/cvetaeva.png';

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
          'https://www.m24.ru/b/d/nBkSUhL2hFklns62IL6BrNOp2Z318Ji-mifGnuWR9mOBdDebBizCnTY8qdJf6ReJ58vU9meMMok3Ee2nhSR6ISeO9G1N_wjJ=DhPYScc6iiTxGYl9gEqyJw.jpg',
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
    <main className={styles.main}>
      <img src={poet} className={styles.poet} />
      <MapComponent points={points} />
    </main>
  );
};

export default App;
