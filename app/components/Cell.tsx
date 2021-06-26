import * as React from "react";
import styled from "styled-components";
import { ItemTypes } from "../modules/ItemTypes";
import { useDrop } from "react-dnd";
import { DragItem, updateCardsType } from "../modules/types";

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
  updateCards: updateCardsType;
  children: React.ReactChild;
};

export default function Cell({
  index,
  gridId,
  updateCards,
  children,
}: CellProps) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover: (item: DragItem) => updateCards(item.id, index, gridId),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, gridId, updateCards]
  );

  return (
    <StyledCell ref={drop}>
      {isOver ? null : children}
    </StyledCell>
  );
}
