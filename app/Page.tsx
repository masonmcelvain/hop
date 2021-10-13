import * as React from "react";
import { Center, VStack, useBoolean, useDisclosure } from "@chakra-ui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Grid from "./components/Grid";
import ActionBar from "./components/ActionBar";
import AddLinkModal from "./modals/AddLinkModal";
import EditLinkModal from "./modals/EditLinkModal";
import { LinksContext } from "./contexts/Links";
import { LinkData } from "./contexts/Links/reducer";

export default function Page(): JSX.Element {
  const { state } = React.useContext(LinksContext);
  const [isInEditMode, setIsInEditMode] = useBoolean();
  const [linkToEdit, setLinkToEdit] = React.useState<LinkData>(null);

  const {
    isOpen: isAddLinkModalOpen,
    onOpen: onAddLinkModalOpen,
    onClose: onAddLinkModalClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateLinkModalOpen,
    onOpen: onUpdateLinkModalOpen,
    onClose: onUpdateLinkModalClose,
  } = useDisclosure();

  function openUpdateLinkModalForCell(cellIndex: number): void {
    setLinkToEdit(state.links[cellIndex]);
    onUpdateLinkModalOpen();
  }

  function closeUpdateLinkModal(): void {
    setIsInEditMode.off();
    onUpdateLinkModalClose();
  }

  return (
    <VStack w="full" p={2}>
      <DndProvider backend={HTML5Backend}>
        <Center w="full">
          <Grid
            links={state.links}
            isInEditMode={isInEditMode}
            openUpdateLinkModal={openUpdateLinkModalForCell}
          />
        </Center>
      </DndProvider>
      <ActionBar
        toggleEditMode={setIsInEditMode.toggle}
        onAddLinkModalOpen={onAddLinkModalOpen}
      />
      <AddLinkModal isOpen={isAddLinkModalOpen} onClose={onAddLinkModalClose} />
      <EditLinkModal
        link={linkToEdit}
        isOpen={isUpdateLinkModalOpen}
        onClose={closeUpdateLinkModal}
      />
    </VStack>
  );
}

export type openUpdateLinkModalForCellType = (cellIndex: number) => void;
