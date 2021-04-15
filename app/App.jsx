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

  function renderTopGrid() {
    return (
      <TopGridContainer>
        <Grid cards={topCards} />
      </TopGridContainer>
    );
  }

  function renderBottomGrid() {
    return !bottomCards ? null : (
      <>
        <HorizontalRule />
        <BottomGridContainer>
          <Grid cards={bottomCards} />
        </BottomGridContainer>
      </>
    );
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
          {renderTopGrid()}
          {renderBottomGrid()}
        </DndContainer>
      </StyledApp>
    </ThemeProvider>
  );
}

// TODO: add options.html in /static, and then create a new /options folder to
// render a react library for it? Or just hard code in JS without react
