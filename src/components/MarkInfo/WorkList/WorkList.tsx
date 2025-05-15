import React from 'react';
import style from './WorkList.module.scss';
import { IWork } from '../../../store/API/models.api.ts';

interface WorksListProps {
  works: IWork[];
}

const WorksList: React.FC<WorksListProps> = ({ works }) => {
  if (works.length === 0) {
    return (
      <div className={style.empty}>
        Нет известных произведений, связанных с этим местом/событием
      </div>
    );
  }

  return (
    <div className={style.worksList}>
      <h3 className={style.title}>Произведения</h3>
      <ul className={style.list}>
        {works.map((work) => (
          <li key={work.id} className={style.item}>
            <a
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              className={style.name}
            >
              {work.name}
            </a>
            <p className={style.description}>{work.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorksList;
