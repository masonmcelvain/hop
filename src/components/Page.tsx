import { Center, useBoolean, useDisclosure, VStack } from "@chakra-ui/react";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LinksContext } from "@contexts/Links";
import { LinkData } from "@models/link-state";
import ActionBar from "./ActionBar";
import Grid from "./Grid";
import LinkEditModal from "./LinkEditModal";

export default function Page(): JSX.Element {
  const { state } = React.useContext(LinksContext);
  const [isInEditMode, { toggle: toggleEditMode, off: offEditMode }] =
    useBoolean();
  const [linkToEdit, setLinkToEdit] = React.useState<LinkData | null>(null);

  const {
    isOpen: isLinkEditModalOpen,
    onOpen: onLinkEditModalOpen,
    onClose: onLinkEditModalClose,
  } = useDisclosure();

  return (
    <VStack w="full" p={2}>
      <DndProvider backend={HTML5Backend}>
        <Center w="full">
          <Grid
            isInEditMode={isInEditMode}
            openUpdateLinkModal={(cellIndex: number) => {
              setLinkToEdit(state.links[cellIndex]);
              onLinkEditModalOpen();
            }}
          />
        </Center>
      </DndProvider>
      <ActionBar
        toggleEditMode={toggleEditMode}
        onLinkEditModalOpen={onLinkEditModalOpen}
      />
      <LinkEditModal
        link={linkToEdit}
        isOpen={isLinkEditModalOpen}
        onClose={() => {
          setLinkToEdit(null);
          offEditMode();
          onLinkEditModalClose();
        }}
      />
    </VStack>
  );
}

export type openUpdateLinkModalForCellType = (cellIndex: number) => void;
