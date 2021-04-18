import React from "react";
import styled from "styled-components";
import Card from "./Card";
import Cell from "./Cell";

// The width of the grid measured in cells
const cellsWide = 3;

const StyledGrid = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const CellWrapper = styled.div`
  width: ${100 / cellsWide}%;
  height: 0;
  padding-top: ${100 / cellsWide}%;
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
function getNumCells(numCards) {
  if (!numCards) {
    return 0;
  }
  const largestFactorOfWidth = numCards - (numCards % cellsWide);
  const cellsFromRemainder = numCards % cellsWide ? cellsWide : 0;
  return largestFactorOfWidth + cellsFromRemainder;
}

export default function Grid({ id, cards, setCardOrder }) {
  const numCells = getNumCells(cards.length);

  function renderCell(i) {
    const cellHasACard = i < cards.length;
    const card = cellHasACard ? <Card cardData={cards[i]} /> : null;
    return (
      <CellWrapper key={i}>
        <Cell index={i} gridId={id} setCardOrder={setCardOrder}>
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
