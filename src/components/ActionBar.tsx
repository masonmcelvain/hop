import * as React from "react";
import {
  IconButton,
  ButtonGroup,
  Divider,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Edit, Plus, Moon, Sun } from "react-feather";
import { setStoredColorMode } from "@lib/webextension";

type ActionBarProps = {
  toggleEditMode: () => void;
  onLinkEditModalOpen: () => void;
};

export default function ActionBar({
  toggleEditMode,
  onLinkEditModalOpen,
}: ActionBarProps): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();

  const onColorModeClick = React.useCallback(() => {
    setStoredColorMode(colorMode === "light" ? "dark" : "light");
    toggleColorMode();
  }, [colorMode, toggleColorMode]);

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
          onClick={onLinkEditModalOpen}
        />

        <IconButton
          aria-label="Toggle color mode"
          icon={useColorModeValue(<Moon size={24} />, <Sun size={24} />)}
          onClick={onColorModeClick}
        />
      </ButtonGroup>
    </>
  );
}
