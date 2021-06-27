import * as React from "react";
import styled from "styled-components";
import { StyledPage } from "../App";
import DndContainer from "../components/DndContainer";
import Grid from "../components/Grid";
import ActionBar from "../components/ActionBar";
import { LinkData } from "../types/CardTypes";
import { setStoredLinks } from "../lib/SyncStorageLib";

const GridContainer = styled.div`
  width: 100%;
  height: min-content;
`;

const HorizontalRule = styled.div`
  width: 90%;
  height: 1px;
  margin: 10px auto;
  background-color: ${(props) => props.theme.colors.icon_accent};
`;

type LaunchPageProps = {
  cards: LinkData[][];
  setCards: (prevCallback: any) => void;
};
export default function LaunchPage({ cards, setCards }: LaunchPageProps) {
  /**
   * Modify the order of the cards by relocating a card. Relocation can be
   * between grids.
   *
   * @param sourceId Id of the card being moved.
   * @param newCardIndex Index to move the source card to.
   * @param newGridIndex The index of the grid the card is being moved to.
   * @param isDrop True if this is a drop, false if it's a hover
   */
  const memoizedupdateOrderOfCards = React.useCallback(
    function updateOrderOfCards(
      sourceId: number,
      newCardIndex: number,
      newGridIndex: number,
      isDrop: boolean
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
        if (isDrop) {
          setStoredLinks(newCards);
        }
        return newCards;
      });
    },
    [cards, setCards]
  );

  const memoizedupdateRenderGrids = React.useCallback(
    function renderGrids() {
      if (!cards) {
        return null;
      }
      const grids = [
        <GridContainer key={0}>
          <Grid
            gridId={0}
            cards={cards[0]}
            updateOrderOfCards={memoizedupdateOrderOfCards}
          />
        </GridContainer>,
      ];
      for (let i = 1; i < cards.length; i++) {
        grids.push(
          <React.Fragment key={i}>
            <HorizontalRule />
            <GridContainer>
              <Grid
                gridId={i}
                cards={cards[i]}
                updateOrderOfCards={memoizedupdateOrderOfCards}
              />
            </GridContainer>
          </React.Fragment>
        );
      }
      return grids;
    },
    [cards, memoizedupdateOrderOfCards]
  );

  return (
    <StyledPage>
      <DndContainer>{memoizedupdateRenderGrids()}</DndContainer>
      <ActionBar />
    </StyledPage>
  );
}
