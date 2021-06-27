import * as React from "react";
import styled, { withTheme } from "styled-components";
import { CardDragItem, DragItemTypes } from "../types/DragItemTypes";
import { useDrop } from "react-dnd";
import { XCircle } from "react-feather";
import {
  storeCurrentCardsType,
  updateOrderOfCardsType,
} from "../types/CardTypes";

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

const StyledXCircle = styled(XCircle)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  margin: 2px;
  cursor: pointer;
`;

type CellProps = {
  index: number;
  gridIndex: number;
  updateOrderOfCards: updateOrderOfCardsType;
  storeCurrentCards: storeCurrentCardsType;
  inDeleteMode: boolean;
  deleteLink: (cellIndex: number, gridIndex: number) => void;
  theme;
  children: React.ReactChild;
};

function Cell({
  index,
  gridIndex,
  updateOrderOfCards,
  storeCurrentCards,
  inDeleteMode,
  deleteLink,
  theme,
  children,
}: CellProps) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragItemTypes.CARD,
      hover: (item: CardDragItem) =>
        updateOrderOfCards(item.id, index, gridIndex),
      drop: () => storeCurrentCards(),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, gridIndex, updateOrderOfCards]
  );

  return (
    <>
      {children && inDeleteMode ? (
        <StyledXCircle
          size={24}
          color={theme.colors.delete}
          onClick={() => deleteLink(index, gridIndex)}
        />
      ) : null}
      <StyledCell ref={drop}>{isOver ? null : children}</StyledCell>
    </>
  );
}

export default withTheme(Cell);
