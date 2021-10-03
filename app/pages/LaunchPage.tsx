import * as React from "react";
import { Container, Divider, VStack } from "@chakra-ui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Grid from "../components/Grid";
import ActionBar from "../components/ActionBar";
import { LinksContext } from "../contexts/Links";

export default function LaunchPage(): JSX.Element {
  const { state } = React.useContext(LinksContext); // after clicking delete button, this state does not seem to get the updated version (ie the deleted link still exists here)
  const [isInEditMode, setIsInEditMode] = React.useState(false);

  function toggleEditMode(): void {
    setIsInEditMode(!isInEditMode);
  }

  return (
    <VStack w="full" p={2}>
      <DndProvider backend={HTML5Backend}>
        {state.links.map((sectionLinks, i) => (
          <Container key={0}>
            {i > 0 && <Divider />}
            <Grid
              gridIndex={i}
              links={sectionLinks}
              isInEditMode={isInEditMode}
            />
          </Container>
        ))}
      </DndProvider>
      <ActionBar toggleEditMode={toggleEditMode} />
    </VStack>
  );
}
