import * as React from "react";
import { Box, Divider, VStack } from "@chakra-ui/react";
import DndContainer from "../components/DndContainer";
import Grid from "../components/Grid";
import ActionBar from "../components/ActionBar";
import { LinksContext } from "../contexts/Links";

type LaunchPageProps = {
  inDeleteMode: boolean;
  setInDeleteMode: (prevCallback) => void;
};
export default function LaunchPage({
  inDeleteMode,
  setInDeleteMode,
}: LaunchPageProps): JSX.Element {
  const { state } = React.useContext(LinksContext);

  function renderGrids() {
    const getGridContainer = (index: number): JSX.Element => (
      <Box w="full" key={index}>
        <Grid
          gridIndex={index}
          cards={state.links[index]}
          inDeleteMode={inDeleteMode}
        />
      </Box>
    );

    const grids = [getGridContainer(0)];
    for (let i = 1; i < state.links.length; i++) {
      grids.push(
        <React.Fragment key={i}>
          <Divider />
          {getGridContainer(i)}
        </React.Fragment>
      );
    }
    return grids;
  }

  return (
    <VStack w="full" p={2}>
      <DndContainer>{renderGrids()}</DndContainer>
      <ActionBar setInDeleteMode={setInDeleteMode} />
    </VStack>
  );
}
