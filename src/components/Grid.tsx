import * as React from "react";
import { SimpleGrid, useBoolean } from "@chakra-ui/react";
import Card from "./Card";
import Cell from "./Cell";
import { openUpdateLinkModalForCellType } from "../components/Page";
import { LinksContext } from "../contexts/Links";
import { getStorageKeyForLink } from "../lib/webextension";

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
  isInEditMode: boolean;
  openUpdateLinkModal: openUpdateLinkModalForCellType;
};

export default function Grid({
  isInEditMode,
  openUpdateLinkModal,
}: GridProps): JSX.Element {
  const { state } = React.useContext(LinksContext);
  const [isOverEmpty, setIsOverEmpty] = useBoolean();
  const numCells = getNumCells(state.linkKeys ? state.linkKeys.length : 0);

  function renderCell(i: number) {
    const cellHasACard = i < state.linkKeys.length;

    let card = null;
    if (cellHasACard) {
      const linkKey = state.linkKeys[i];
      const link = state.links.find(
        (link) => link && getStorageKeyForLink(link) === linkKey
      );
      card = link ? <Card linkData={link} isInEditMode={isInEditMode} /> : null;
    }

    return (
      <Cell
        key={i}
        index={i}
        zIndex={state.links.length - i}
        manageIsOverEmpty={[isOverEmpty, setIsOverEmpty]}
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
