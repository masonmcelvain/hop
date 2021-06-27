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
