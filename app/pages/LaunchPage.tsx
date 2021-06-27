import * as React from "react";
import styled from "styled-components";
import { StyledPage } from "../App";
import DndContainer from "../components/DndContainer";
import Grid from "../components/Grid";
import ActionBar from "../components/ActionBar";
import { LinkData } from "../types/CardTypes";
import { setStoredLinks } from "../lib/SyncStorageLib";
import { HorizontalRule } from "../components/HorizontalRule";

const GridContainer = styled.div`
  width: 100%;
  height: min-content;
`;

type LaunchPageProps = {
  cards: LinkData[][];
  setCards: (prevCallback: any) => void;
  inDeleteMode: boolean;
  setInDeleteMode: (prevCallback: any) => void;
  deleteLink: (cellIndex: number, gridIndex: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};
export default function LaunchPage({
  cards,
  setCards,
  inDeleteMode,
  setInDeleteMode,
  deleteLink,
  isDarkMode,
  toggleDarkMode,
}: LaunchPageProps) {
  /**
   * Modify the order of the cards by relocating a card. Relocation can be
   * between grids.
   *
   * @param sourceId Id of the card being moved.
   * @param newCardIndex Index to move the source card to.
   * @param newGridIndex The index of the grid the card is being moved to.
   */
  function updateOrderOfCards(
    sourceId: number,
    newCardIndex: number,
    newGridIndex: number
  ) {
    let removeFromGrid = cards.find((grid) =>
      grid.some((card) => card.id === sourceId)
    );
    if (!removeFromGrid) {
      // If source is unknown, do nothing.
      console.log("Unkown sourceId in setCardOrder(): " + sourceId);
      return;
    }
    const oldGridIndex = cards.findIndex((grid) => grid === removeFromGrid);
    const oldCardIndex = removeFromGrid.findIndex(
      (card) => card.id === sourceId
    );

    if (oldCardIndex === newCardIndex && oldGridIndex === newGridIndex) {
      // If there is no positional change, do nothing.
      return;
    }

    // If dropped in an empty cell, put the card at the end of the array
    if (newCardIndex >= removeFromGrid.length) {
      newCardIndex = removeFromGrid.length - 1;
    }

    // Delete the card from the old cards
    let [card] = removeFromGrid.splice(oldCardIndex, 1);

    let insertIntoGrid =
      oldGridIndex === newGridIndex ? removeFromGrid : cards[newGridIndex];

    // Insert the card into the new cards
    insertIntoGrid.splice(newCardIndex, 0, card);

    setCards((prevCards) => {
      const newCards = [...prevCards];
      if (oldGridIndex !== newGridIndex) {
        newCards.splice(oldGridIndex, 1, removeFromGrid);
      }
      newCards.splice(newGridIndex, 1, insertIntoGrid);
      return newCards;
    });
  }

  function storeCurrentCards() {
    setStoredLinks(cards);
  }

  function renderGrids() {
    if (!cards) {
      return null;
    }
    const grids = [
      <GridContainer key={0}>
        <Grid
          gridIndex={0}
          cards={cards[0]}
          updateOrderOfCards={updateOrderOfCards}
          storeCurrentCards={storeCurrentCards}
          inDeleteMode={inDeleteMode}
          deleteLink={deleteLink}
        />
      </GridContainer>,
    ];
    for (let i = 1; i < cards.length; i++) {
      grids.push(
        <React.Fragment key={i}>
          <HorizontalRule />
          <GridContainer>
            <Grid
              gridIndex={i}
              cards={cards[i]}
              updateOrderOfCards={updateOrderOfCards}
              storeCurrentCards={storeCurrentCards}
              inDeleteMode={inDeleteMode}
              deleteLink={deleteLink}
            />
          </GridContainer>
        </React.Fragment>
      );
    }
    return grids;
  }

  return (
    <StyledPage>
      <DndContainer>{renderGrids()}</DndContainer>
      <ActionBar
        setInDeleteMode={setInDeleteMode}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </StyledPage>
  );
}
