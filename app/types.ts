export interface CardObj {
  id: number;
  name: string;
  url: string;
}

export enum GridId {
  TOP,
  BOTTOM,
}

export type setCardOrderType = (
  sourceId: number,
  newIndex: number,
  newGridId: number
) => void;
