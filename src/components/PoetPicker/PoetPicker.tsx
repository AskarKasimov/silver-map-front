import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './PoetPicker.module.scss';
import { RootState } from '../../store';
import { setPickedPoet } from '../../store/pickedPoet.ts';
import { IPoet } from '../../store/API/models.api.ts';

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (poet: IPoet | null) => {
    dispatch(setPickedPoet(poet));
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={style.selectWrapper}>
      <label className={style.label} onClick={() => setIsOpen(!isOpen)}>
        {label}
      </label>
      <div className={style.customSelect} ref={dropdownRef}>
        <div className={style.selectHeader} onClick={() => setIsOpen(!isOpen)}>
          {pickedPoet?.name || '-- Не выбран --'}
        </div>
        {isOpen && (
          <div className={style.dropdownList}>
            {poets.length ? null : (
              <div
                className={style.dropdownItem}
                onClick={() => handleSelect(null)}
              >
                -- Не выбран --
              </div>
            )}
            {poets.map((poet) => (
              <div
                key={poet.id}
                className={style.dropdownItem}
                onClick={() => handleSelect(poet)}
              >
                {poet.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
