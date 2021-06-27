import * as React from "react";
import styled from "styled-components";
import { CardDragItem, DragItemTypes } from "../types/DragItemTypes";
import { useDrop } from "react-dnd";
import { updateOrderOfCardsType } from "../types/CardTypes";

const StyledCell = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type CellProps = {
  index: number;
  gridId: number;
  updateOrderOfCards: updateOrderOfCardsType;
  children: React.ReactChild;
};

export default function Cell({
  index,
  gridId,
  updateOrderOfCards,
  children,
}: CellProps) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragItemTypes.CARD,
      hover: (item: CardDragItem) => updateOrderOfCards(item.id, index, gridId),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, gridId, updateOrderOfCards]
  );

  return <StyledCell ref={drop}>{isOver ? null : children}</StyledCell>;
}
