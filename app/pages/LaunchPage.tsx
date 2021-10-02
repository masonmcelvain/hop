import * as React from "react";
import styled from "styled-components";
import { StyledPage } from "../App";
import DndContainer from "../components/DndContainer";
import Grid from "../components/Grid";
import ActionBar from "../components/ActionBar";
import { HorizontalRule } from "../components/HorizontalRule";
import { LinksContext } from "../contexts/Links";
import { LinkAction } from "../contexts/Links/reducer";

const GridContainer = styled.div`
  width: 100%;
  height: min-content;
`;

type LaunchPageProps = {
  inDeleteMode: boolean;
  setInDeleteMode: (prevCallback) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};
export default function LaunchPage({
  inDeleteMode,
  setInDeleteMode,
  isDarkMode,
  toggleDarkMode,
}: LaunchPageProps): JSX.Element {
  const {state, dispatch} = React.useContext(LinksContext);

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
    const removeFromGrid = state.links.find((grid) =>
      grid.some((card) => card.id === sourceId)
    );
    if (!removeFromGrid) {
      // If source is unknown, do nothing.
      console.log("Unkown sourceId in updateOrderOfCards(): " + sourceId);
      return;
    }
    const oldGridIndex = state.links.findIndex((grid) => grid === removeFromGrid);
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
    const [link] = removeFromGrid.splice(oldCardIndex, 1);

    const insertIntoGrid =
      oldGridIndex === newGridIndex ? removeFromGrid : state.links[newGridIndex];

    // Insert the card into the new cards
    insertIntoGrid.splice(newCardIndex, 0, link);

    const newCards = [...state.links];
    if (oldGridIndex !== newGridIndex) {
      newCards.splice(oldGridIndex, 1, removeFromGrid);
    }
    newCards.splice(newGridIndex, 1, insertIntoGrid);

    dispatch({
      type: LinkAction.SET_LINKS,
      payload: newCards,
    });
  }

  function renderGrids() {
    if (!state.links) {
      return null;
    }
    const grids = [
      <GridContainer key={0}>
        <Grid
          gridIndex={0}
          cards={state.links[0]}
          updateOrderOfCards={updateOrderOfCards}
          inDeleteMode={inDeleteMode}
        />
      </GridContainer>,
    ];
    for (let i = 1; i < state.links.length; i++) {
      grids.push(
        <React.Fragment key={i}>
          <HorizontalRule />
          <GridContainer>
            <Grid
              gridIndex={i}
              cards={state.links[i]}
              updateOrderOfCards={updateOrderOfCards}
              inDeleteMode={inDeleteMode}
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
