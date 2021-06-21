import * as React from "react";
import styled from "styled-components";
import { StyledPage } from "../App";
import DndContainer from "../components/DndContainer";
import Grid from "../components/Grid";
import ActionBar from "../components/ActionBar";
import sampleCards from "../sample_cards.json";
import { CardData } from "../modules/types";

const GridContainer = styled.div`
  width: 100%;
  height: min-content;
`;

const HorizontalRule = styled.div`
  width: 90%;
  height: 1px;
  margin: 10px auto;
  background-color: ${(props) => props.theme.colors.accent};
`;

type LaunchPageProps = {
  isDarkMode: boolean;
};
export default function LaunchPage({ isDarkMode }: LaunchPageProps) {
  const [cards, setCards] = React.useState<CardData[][]>(sampleCards);

  /**
   * Modify the order of the cards by relocating a card. Relocation can be
   * between grids.
   *
   * @param sourceId Id of the card being moved.
   * @param newCardIndex Index to move the source card to.
   * @param newGridIndex The index of the grid the card is being moved to.
   */
  function updateCards(
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

  function renderGrids() {
    if (!cards) {
      return null;
    }
    const grids = [
      <GridContainer key={0}>
        <Grid gridId={0} cards={cards[0]} updateCards={updateCards} />
      </GridContainer>,
    ];
    for (let i = 1; i < cards.length; i++) {
      grids.push(
        <React.Fragment key={i}>
          <HorizontalRule />
          <GridContainer>
            <Grid gridId={i} cards={cards[i]} updateCards={updateCards} />
          </GridContainer>
        </React.Fragment>
      );
    }
    return grids;
  }

  return (
    <StyledPage>
      <DndContainer>{renderGrids()}</DndContainer>
      <ActionBar />
    </StyledPage>
  );
}
