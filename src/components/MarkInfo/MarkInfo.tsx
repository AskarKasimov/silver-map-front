import React from 'react';
import { useSelector } from 'react-redux';
import style from './MarkInfo.module.scss';
import { RootState } from '../../store';
import WorksList from './WorkList/WorkList.tsx';
import { useGetWorksByEventIdQuery } from '../../store/API/projectAPI.api.ts';

export const MarkInfo: React.FC = () => {
  const mark = useSelector((state: RootState) => state.pickedMark.pickedMark);

  const {
    data: works,
    isError,
    isSuccess,
  } = useGetWorksByEventIdQuery(mark?.id ?? -1, {
    skip: mark === null,
  });

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
          {mark.time_start === mark.time_end
            ? mark.time_start
            : `${mark.time_start} - ${mark.time_end}`}
        </span>
        <h2 className={style.title}>{mark.name}</h2>
      </div>
      <div className={style.content}>
        {mark.photo ? (
          <img className={style.photo} src={mark.photo} alt={mark.name} />
        ) : null}
        <p className={style.desc}>{mark.description}</p>
        <WorksList works={!isError && works && isSuccess ? works : []} />
      </div>
    </div>
  );
};
