import { Center, useBoolean, useDisclosure } from "@chakra-ui/react";
import { useLinkStore } from "@hooks/useLinkStore";
import { LinkData } from "@models/link-state";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ActionBar from "./ActionBar";
import Grid from "./Grid";
import LinkEditModal from "./LinkEditModal";

export default function Page() {
   const links = useLinkStore((state) => state.links);
   const [isInEditMode, { toggle: toggleEditMode, off: offEditMode }] =
      useBoolean();
   const [linkToEdit, setLinkToEdit] = React.useState<LinkData | null>(null);

   const {
      isOpen: isLinkEditModalOpen,
      onOpen: onLinkEditModalOpen,
      onClose: onLinkEditModalClose,
   } = useDisclosure();

   const onKeyDown = React.useCallback(
      (event: KeyboardEvent) => {
         if (isLinkEditModalOpen) return;
         if (event.key === "e") {
            toggleEditMode();
         } else if (event.key === "n") {
            onLinkEditModalOpen();
         }
      },
      [isLinkEditModalOpen, onLinkEditModalOpen, toggleEditMode],
   );
   React.useEffect(() => {
      document.addEventListener("keydown", onKeyDown);
      return () => {
         document.removeEventListener("keydown", onKeyDown);
      };
   }, [onKeyDown]);

   return (
      <div className="flex w-full flex-col items-center justify-center space-y-2 p-2">
         <DndProvider backend={HTML5Backend}>
            <Center w="full">
               <Grid
                  isInEditMode={isInEditMode}
                  openUpdateLinkModal={(cellIndex: number) => {
                     setLinkToEdit(links[cellIndex]);
                     onLinkEditModalOpen();
                  }}
                  isLinkEditModalOpen={isLinkEditModalOpen}
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
      </div>
   );
}

export type openUpdateLinkModalForCellType = (cellIndex: number) => void;
