export type IExample = {
  id: number;
  name: string;
  description: string;
};

export type IMark = {
  id: number;
  name: string;
  coord_x: number;
  coord_y: number;
  photo: string;
  description: string;
  time_start: number;
  time_end: number;
};

export type IPoet = {
  id: number;
  name: string;
  bio: string;
  time_birth: number;
  time_death: number;
};
