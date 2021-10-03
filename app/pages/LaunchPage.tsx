import * as React from "react";
import styled from "styled-components";
import { StyledPage } from "../App";
import DndContainer from "../components/DndContainer";
import Grid from "../components/Grid";
import ActionBar from "../components/ActionBar";
import { HorizontalRule } from "../components/HorizontalRule";
import { LinksContext } from "../contexts/Links";
import { StateType } from "../contexts/Links/reducer";

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

  const getGridContainer = (index: number): JSX.Element => (
    <GridContainer key={index}>
      <Grid
        gridIndex={index}
        cards={state.links[index]}
        inDeleteMode={inDeleteMode}
      />
    </GridContainer>
  );

  function renderGrids() {
    const grids = [getGridContainer(0)];
    for (let i = 1; i < state.links.length; i++) {
      grids.push(
        <React.Fragment key={i}>
          <HorizontalRule />
          {getGridContainer(i)}
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
