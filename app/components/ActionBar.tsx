import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  IconButton,
  ButtonGroup,
  Divider,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Trash2, Plus, Moon, Sun } from "react-feather";
import { setStoredColorMode } from "../lib/chrome/SyncStorage";

type ActionBarProps = {
  toggleEditMode: () => void;
};
function ActionBar({ toggleEditMode }: ActionBarProps): JSX.Element {
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
          aria-label="Choose Links to Edit"
          icon={<Trash2 size={24} />}
          onClick={toggleEditMode}
        />

        <IconButton
          as={RouterLink}
          aria-label="Create New Link"
          icon={<Plus size={32} />}
          to="/add"
        />

        <IconButton
          aria-label="Create New Link"
          icon={useColorModeValue(
            <Moon size={24} />,
            <Sun size={24} />
          )}
          onClick={toggleAndStoreColorMode}
        />
      </ButtonGroup>
    </>
  );
}

export default ActionBar;
