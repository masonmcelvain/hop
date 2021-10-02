import * as React from "react";
import styled from "styled-components";
import { StyledPage } from "../App";
import DndContainer from "../components/DndContainer";
import Grid from "../components/Grid";
import ActionBar from "../components/ActionBar";
import { HorizontalRule } from "../components/HorizontalRule";
import { LinksContext } from "../contexts/Links";

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

  function renderGrids() {
    if (!state.links) {
      return null;
    }
    const grids = [
      <GridContainer key={0}>
        <Grid
          gridIndex={0}
          cards={state.links[0]}
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
