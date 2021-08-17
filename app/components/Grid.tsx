import * as React from "react";
import styled from "styled-components";
import Card from "./Card";
import Cell from "./Cell";
import {
  storeCurrentCardsType,
  LinkData,
  updateOrderOfCardsType,
} from "../types/CardTypes";
import { addImageUrlType } from "../App";

// The width of the grid measured in cells
const cellsWide = 3;

const StyledGrid = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const CellWrapper = styled.div`
  width: ${(100 / cellsWide) - 2}%;
  height: 0;
  margin: 1%;
  padding-top: ${(100 / cellsWide) - 2}%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Get the number of cells needed for this grid based on the number of cards
 * provided.
 *
 * @param numCards The number of cards to go in this grid
 */
function getNumCells(numCards: number) {
  if (!numCards) {
    return 0;
  }
  const largestFactorOfWidth = numCards - (numCards % cellsWide);
  const cellsFromRemainder = numCards % cellsWide ? cellsWide : 0;
  return largestFactorOfWidth + cellsFromRemainder;
}

type GridProps = {
  gridIndex: number;
  cards: LinkData[];
  updateOrderOfCards: updateOrderOfCardsType;
  storeCurrentCards: storeCurrentCardsType;
  inDeleteMode: boolean;
  deleteLink: (cellIndex: number, gridIndex: number) => void;
  addImageUrl: addImageUrlType;
};

export default function Grid({
  gridIndex,
  cards,
  updateOrderOfCards,
  storeCurrentCards,
  inDeleteMode,
  deleteLink,
  addImageUrl,
}: GridProps) {
  const numCells = getNumCells(cards ? cards.length : 0);

  function renderCell(i: number) {
    const cellHasACard = i < cards.length;
    const card = cellHasACard ? (
      <Card linkData={cards[i]} addImageUrl={addImageUrl} />
    ) : null;
    return (
      <CellWrapper key={i}>
        <Cell
          index={i}
          gridIndex={gridIndex}
          updateOrderOfCards={updateOrderOfCards}
          storeCurrentCards={storeCurrentCards}
          inDeleteMode={inDeleteMode}
          deleteLink={deleteLink}
        >
          {card}
        </Cell>
      </CellWrapper>
    );
  }

  const cells = [];
  for (let i = 0; i < numCells; i++) {
    cells.push(renderCell(i));
  }

  return <StyledGrid>{cells}</StyledGrid>;
}
