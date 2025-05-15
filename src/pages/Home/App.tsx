import React from 'react';
import styles from './App.module.scss';
import MapComponent from '../../components/MapComponent/MapComponent.tsx';
import { MarkInfo } from '../../components/MarkInfo/MarkInfo.tsx';
import {
  useGetAllPoetsQuery,
  useGetEventsByPoetIdQuery,
} from '../../store/API/projectAPI.api.ts';
import { PoetPicker } from '../../components/PoetPicker/PoetPicker.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const App: React.FC = () => {
  const pickedPoet = useSelector(
    (state: RootState) => state.pickedPoet.pickedPoet
  );
  const { data: poets, isSuccess: poetsSuccess } = useGetAllPoetsQuery();
  const { data: points, isSuccess: pointsSuccess } = useGetEventsByPoetIdQuery(
    pickedPoet?.id ?? -1,
    { skip: pickedPoet === null }
  );

  return (
    <main className={styles.main}>
      <div className={styles.back} />
      {poetsSuccess ? <PoetPicker poets={poets} /> : null}
      <div className={styles.horizontalWrapper}>
        <MapComponent points={pointsSuccess ? points : []} />
        <MarkInfo />
      </div>
    </main>
  );
};

export default App;
