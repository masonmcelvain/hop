import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import lightTheme from "../themes/light";
import darkTheme from "../themes/dark";
import DndContainer from "./DndContainer";
import Grid from "./Grid";
import sampleCards from "./sample_cards.json";

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
  chrome.storage.sync.get("isDarkMode", ({ isDarkModeSet }) => {
    setIsDarkMode(isDarkModeSet !== true);
  });
  const [topCards, setTopCards] = useState([]);
  const [bottomCards, setBottomCards] = useState([]);
  const gridIds = { top: "top", bottom: "bottom" };

  /**
   * Modify the order of the cards by relocating a card. Relocation can be
   * between grids.
   *
   * @param sourceId Id of the card being moved.
   * @param newIndex Index to move the source card to.
   * @param newGridId The id of the grid the card is being moved to.
   */
  function setCardOrder(sourceId, newIndex, newGridId) {
    let sourceIndex, sourceGridId, oldCards;
    if (topCards.some((card) => card.id === sourceId)) {
      sourceIndex = topCards.findIndex((card) => card.id === sourceId);
      sourceGridId = gridIds.top;
      oldCards = [...topCards];
    } else if (bottomCards.some((card) => card.id === sourceId)) {
      sourceIndex = bottomCards.findIndex((card) => card.id === sourceId);
      sourceGridId = gridIds.bottom;
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
        : newGridId === gridIds.top
        ? [...topCards]
        : [...bottomCards];

    // Insert the card into the new cards
    newCards.splice(newIndex, 0, card);

    if (sourceGridId === newGridId) {
      // only update one grid if the card is staying in it
      if (newGridId === gridIds.top) {
        setTopCards(newCards);
      } else if (newGridId === gridIds.bottom) {
        setBottomCards(newCards);
      }
    } else {
      // otherwise, update both grids
      let [newTopCards, newBottomCards] =
        newGridId === gridIds.top ? [newCards, oldCards] : [oldCards, newCards];
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
              id={gridIds.top}
              cards={topCards}
              setCardOrder={setCardOrder}
            />
          </TopGridContainer>
          {!bottomCards ? null : (
            <>
              <HorizontalRule />
              <BottomGridContainer>
                <Grid
                  id={gridIds.bottom}
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
