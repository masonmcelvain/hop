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

export enum Direction {
  Left,
  Right,
};

export namespace Direction {
  export function withOptions<T>(option: Direction, left: T, right: T): T {
    switch (option) {
      case Direction.Left:
        return left;
      case Direction.Right:
        return right;
      default:
        throw new Error("Direction is neither Left nor Right");
    }
  }
}
