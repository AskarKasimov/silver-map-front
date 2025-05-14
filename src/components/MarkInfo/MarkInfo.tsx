import React from 'react';
import { useSelector } from 'react-redux';
import style from './MarkInfo.module.scss';
import { RootState } from '../../store';

export const MarkInfo: React.FC = () => {
  const mark = useSelector((state: RootState) => state.pickedMark.pickedMark);

  if (!mark) {
    return (
      <div className={style.wrapper}>
        <div className={style.placeholder}>Выберите точку на карте</div>
      </div>
    );
  }

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <span className={style.period}>
          {mark.time_start} - {mark.time_end}
        </span>
        <h2 className={style.title}>{mark.name}</h2>
      </div>
      <div className={style.content}>
        <img className={style.photo} src={mark.photo} alt={mark.name} />
        <p className={style.desc}>{mark.description}</p>
      </div>
    </div>
  );
};
