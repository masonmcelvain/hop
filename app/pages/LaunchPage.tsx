import * as React from "react";
import { Center, Divider, VStack, useBoolean } from "@chakra-ui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Grid from "../components/Grid";
import ActionBar from "../components/ActionBar";
import { LinksContext } from "../contexts/Links";

export default function LaunchPage(): JSX.Element {
  const { state } = React.useContext(LinksContext); // after clicking delete button, this state does not seem to get the updated version (ie the deleted link still exists here)
  const [isInEditMode, setIsInEditMode] = useBoolean();

  return (
    <VStack w="full" p={2}>
      <DndProvider backend={HTML5Backend}>
        {state.links.map((sectionLinks, i) => (
          <Center key={0} w="full">
            {i > 0 && <Divider />}
            <Grid
              gridIndex={i}
              links={sectionLinks}
              isInEditMode={isInEditMode}
            />
          </Center>
        ))}
      </DndProvider>
      <ActionBar toggleEditMode={setIsInEditMode.toggle} />
    </VStack>
  );
}
