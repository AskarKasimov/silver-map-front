import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './PoetPicker.module.scss';
import { IPoet } from '../API/models.api';
import { RootState } from '../../store';
import { setPickedPoet } from '../../store/pickedPoet.ts';

type PoetPickerProps = {
  poets: IPoet[];
  label?: string;
};

export const PoetPicker: React.FC<PoetPickerProps> = ({
  poets,
  label = 'Выберите писателя',
}) => {
  const dispatch = useDispatch();
  const pickedPoet = useSelector(
    (state: RootState) => state.pickedPoet.pickedPoet
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const poet = poets.find((p) => p.id === Number(e.target.value)) || null;
    dispatch(setPickedPoet(poet));
  };

  return (
    <div className={style.selectWrapper}>
      <label className={style.label} htmlFor="poet-select">
        {label}
      </label>
      <select
        id="poet-select"
        className={style.select}
        value={pickedPoet?.id ?? ''}
        onChange={handleChange}
      >
        <option value="" disabled>
          -- Не выбран --
        </option>
        {poets.map((poet) => (
          <option key={poet.id} value={poet.id}>
            {poet.name}
          </option>
        ))}
      </select>
    </div>
  );
};
