import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import lightTheme from "../themes/light";
import darkTheme from "../themes/dark";
import DndContainer from "./DndContainer";
import Grid from "./Grid";
import sampleCards from "./sample_cards.json";
import { Card, GridId } from "./types";

const StyledApp = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background};
  overflow-y: scroll;
`;

const TopGridContainer = styled.div`
  width: 100%;
  height: min-content;
`;

const BottomGridContainer = styled.div`
  width: 100%;
  height: min-content;
`;

const HorizontalRule = styled.div`
  width: 90%;
  height: 1px;
  margin: 10px auto;
  background-color: ${(props) => props.theme.colors.accent};
`;

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  // @ts-ignore
  chrome.storage.sync.get("isDarkMode", ({ isDarkModeSet }) => {
    setIsDarkMode(isDarkModeSet !== true);
  });
  const [topCards, setTopCards] = useState<Card[]>([]);
  const [bottomCards, setBottomCards] = useState<Card[]>([]);

  /**
   * Modify the order of the cards by relocating a card. Relocation can be
   * between grids.
   *
   * @param sourceId Id of the card being moved.
   * @param newIndex Index to move the source card to.
   * @param newGridId The id of the grid the card is being moved to.
   */
  function setCardOrder(sourceId: number, newIndex: number, newGridId: number) {
    let sourceIndex: number, sourceGridId: number, oldCards: Card[];
    if (topCards.some((card) => card.id === sourceId)) {
      sourceIndex = topCards.findIndex((card) => card.id === sourceId);
      sourceGridId = GridId.TOP;
      oldCards = [...topCards];
    } else if (bottomCards.some((card) => card.id === sourceId)) {
      sourceIndex = bottomCards.findIndex((card) => card.id === sourceId);
      sourceGridId = GridId.BOTTOM;
      oldCards = [...bottomCards];
    } else {
      // If source is unknown, do nothing.
      console.log("Unkown sourceId in setCardOrder(): " + sourceId);
      return;
    }

    if (sourceIndex === newIndex && sourceGridId === newGridId) {
      // If there is no positional change, do nothing.
      return;
    }

    // If dropped in an empty cell, put the card at the end of the array
    if (newIndex >= oldCards.length) {
      newIndex = oldCards.length - 1;
    }

    // Delete the card from the old cards
    let [card] = oldCards.splice(sourceIndex, 1);

    let newCards =
      sourceGridId === newGridId
        ? oldCards
        : newGridId === GridId.TOP
        ? [...topCards]
        : [...bottomCards];

    // Insert the card into the new cards
    newCards.splice(newIndex, 0, card);

    if (sourceGridId === newGridId) {
      // only update one grid if the card is staying in it
      switch (newGridId) {
        case GridId.TOP:
          setTopCards(newCards);
          break;
        case GridId.BOTTOM:
          setBottomCards(newCards);
          break;
      }
    } else {
      // otherwise, update both grids
      let [newTopCards, newBottomCards] =
        newGridId === GridId.TOP ? [newCards, oldCards] : [oldCards, newCards];
      setTopCards(newTopCards);
      setBottomCards(newBottomCards);
    }
  }

  // Initialize the cards with stored (dummy) data
  useEffect(() => {
    setTopCards(sampleCards[0]);
    setBottomCards(sampleCards[1]);
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <StyledApp>
        <DndContainer>
          <TopGridContainer>
            <Grid
              id={GridId.TOP}
              cards={topCards}
              setCardOrder={setCardOrder}
            />
          </TopGridContainer>
          {!bottomCards ? null : (
            <>
              <HorizontalRule />
              <BottomGridContainer>
                <Grid
                  id={GridId.BOTTOM}
                  cards={bottomCards}
                  setCardOrder={setCardOrder}
                />
              </BottomGridContainer>
            </>
          )}
        </DndContainer>
      </StyledApp>
    </ThemeProvider>
  );
}

// TODO: add options.html in /static, and then create a new /options folder to
// render a react library for it? Or just hard code in JS without react
