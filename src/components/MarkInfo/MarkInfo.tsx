import React from 'react';
import styles from './MarkInfo.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const MarkInfo: React.FC = () => {
  const pickedMark = useSelector(
    (state: RootState) => state.pickedMark.pickedMark
  );
  return pickedMark ? (
    <div className={styles.markInfo}>
      <h1>{pickedMark.name}</h1>
    </div>
  ) : null;
};

export default MarkInfo;
