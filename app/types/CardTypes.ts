export interface LinkData {
  id: number;
  name: string;
  url: string;
}

export type updateOrderOfCardsType = (
  sourceId: number,
  newIndex: number,
  newGridId: number,
  isDrop: boolean,
) => void;
