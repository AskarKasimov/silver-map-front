import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { IMark } from '../../store/API/models.api.ts';
import MapComponent from '../../components/MapComponent/MapComponent.tsx';
import MarkInfo from '../../components/MarkInfo/MarkInfo.tsx';

const App: React.FC = () => {
  const [points, setPoints] = useState<IMark[]>([]);

  useEffect(() => {
    setPoints([
      {
        id: 1,
        name: 'Дом Марины Цветаевой',
        coord_x: 37.6022,
        coord_y: 55.7496,
        photo:
          'https://www.m24.ru/b/d/nBkSUhL2hFklns62IL6BrNOp2Z318Ji-mifGnuWR9mOBdDebBizCnTY8qdJf6ReJ58vU9meMMok3Ee2nhSR6ISeO9G1N_wjJ=DhPYScc6iiTxGYl9gEqyJw.jpg',
        description:
          'Музей-квартира Марины Цветаевой. Здесь поэтесса жила в 1914–1922 годах.',
        time_start: 1914,
        time_end: 1922,
      },
      {
        id: 2,
        name: 'Булгаковский дом',
        coord_x: 37.5937,
        coord_y: 55.7762,
        photo:
          'https://upload.wikimedia.org/wikipedia/commons/1/1c/Bulgakov_Museum_Moscow.jpg',
        description:
          'Место, связанное с Михаилом Булгаковым, автором «Мастера и Маргариты».',
        time_start: 1921, // Примерные даты, нужно уточнить
        time_end: 1940, // Примерные даты, нужно уточнить
      },
    ]);
  }, []);
  return (
    <main className={styles.main}>
      <div className={styles.back} />
      <MapComponent points={points} />
      <MarkInfo />
    </main>
  );
};

export default App;
