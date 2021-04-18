export interface CardData {
  id: number;
  name: string;
  url: string;
}

export interface DragItem {
  id: number;
}

export type updateCardsType = (
  sourceId: number,
  newIndex: number,
  newGridId: number
) => void;
