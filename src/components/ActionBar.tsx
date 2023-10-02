import {
   ButtonGroup,
   Divider,
   IconButton,
   Tooltip,
   useColorMode,
   useColorModeValue,
} from "@chakra-ui/react";
import { setStoredColorMode } from "@lib/webextension";
import * as React from "react";
import { Edit, Moon, Plus, Sun } from "react-feather";

type ActionBarProps = {
   toggleEditMode: () => void;
   onLinkEditModalOpen: () => void;
};

export default function ActionBar({
   toggleEditMode,
   onLinkEditModalOpen,
}: ActionBarProps) {
   const { colorMode, toggleColorMode } = useColorMode();

   const onColorModeClick = React.useCallback(() => {
      setStoredColorMode(colorMode === "light" ? "dark" : "light");
      toggleColorMode();
   }, [colorMode, toggleColorMode]);

   return (
      <>
         <Divider />
         <ButtonGroup variant="ghost" spacing={2}>
            <Tooltip label="Edit links (e)" openDelay={750}>
               <IconButton
                  aria-label="Edit links"
                  icon={<Edit size={24} />}
                  onClick={toggleEditMode}
               />
            </Tooltip>
            <Tooltip label="Create new link (n)" openDelay={750}>
               <IconButton
                  aria-label="Create new link"
                  icon={<Plus size={32} />}
                  onClick={onLinkEditModalOpen}
               />
            </Tooltip>
            <Tooltip label="Toggle color mode" openDelay={750}>
               <IconButton
                  aria-label="Toggle color mode"
                  icon={useColorModeValue(
                     <Moon size={24} />,
                     <Sun size={24} />,
                  )}
                  onClick={onColorModeClick}
               />
            </Tooltip>
         </ButtonGroup>
      </>
   );
}
