import * as React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import Card from "./Card";
import Cell from "./Cell";
import { LinkData } from "../contexts/Links/reducer";
import { openUpdateLinkModalForCellType } from "../Page";

const numColumns = 3;

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
  const largestFactorOfWidth = numCards - (numCards % numColumns);
  const cellsFromRemainder = numCards % numColumns ? numColumns : 0;
  return largestFactorOfWidth + cellsFromRemainder;
}

type GridProps = {
  links: LinkData[];
  isInEditMode: boolean;
  openUpdateLinkModal: openUpdateLinkModalForCellType;
};

export default function Grid({
  links,
  isInEditMode,
  openUpdateLinkModal,
}: GridProps): JSX.Element {
  const numCells = getNumCells(links ? links.length : 0);

  function renderCell(i: number) {
    const cellHasACard = i < links.length;
    const card = cellHasACard ? (
      <Card linkData={links[i]} isInEditMode={isInEditMode} />
    ) : null;

    return (
      <Cell
        key={i}
        index={i}
        isInEditMode={isInEditMode}
        openUpdateLinkModal={openUpdateLinkModal}
      >
        {card}
      </Cell>
    );
  }

  const cells = [];
  for (let i = 0; i < numCells; i++) {
    cells.push(renderCell(i));
  }

  return <SimpleGrid columns={numColumns}>{cells}</SimpleGrid>;
}
