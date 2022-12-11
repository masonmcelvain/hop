import * as React from "react";
import {
  IconButton,
  ButtonGroup,
  Divider,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Edit, Plus, Moon, Sun } from "react-feather";
import { setStoredColorMode } from "../lib/webextension";

type ActionBarProps = {
  toggleEditMode: () => void;
  onAddLinkModalOpen: () => void;
};
function ActionBar({
  toggleEditMode,
  onAddLinkModalOpen,
}: ActionBarProps): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();

  function toggleAndStoreColorMode(): void {
    setStoredColorMode(colorMode === "light" ? "dark" : "light");
    toggleColorMode();
  }

  return (
    <>
      <Divider />
      <ButtonGroup variant="ghost" spacing={2}>
        <IconButton
          aria-label="Edit links"
          icon={<Edit size={24} />}
          onClick={toggleEditMode}
        />

        <IconButton
          aria-label="Create new link"
          icon={<Plus size={32} />}
          onClick={onAddLinkModalOpen}
        />

        <IconButton
          aria-label="Toggle color mode"
          icon={useColorModeValue(<Moon size={24} />, <Sun size={24} />)}
          onClick={toggleAndStoreColorMode}
        />
      </ButtonGroup>
    </>
  );
}

export default ActionBar;
