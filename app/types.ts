export interface CardData {
  id: number;
  name: string;
  url: string;
}

export enum GridId {
  TOP,
  BOTTOM,
}

export interface DragItem {
  id: number;
}

export type setCardOrderType = (
  sourceId: number,
  newIndex: number,
  newGridId: number
) => void;
