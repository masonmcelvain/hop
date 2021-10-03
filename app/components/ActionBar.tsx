import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Divider, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Trash2, Plus, Moon, Sun } from "react-feather";
import { setStoredColorMode } from "../lib/chrome/SyncStorage";
import themes from "../../themes/themes";

const ActionBarContainer = styled.div`
  width: 100%;
  margin: 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ActionButton = styled.div`
  height: 40px;
  width: 40px;
  margin: 0 8px;
  border-radius: 8px;
`;

const ActionButtonOverlay = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  @media (hover: hover) and (pointer: fine) {
    :hover {
      background-color: ${(props) => props.theme.colors.overlay_15};
    }
  }

  :active {
    background-color: ${(props) => props.theme.colors.overlay_25};
  }
`;

const StyledLink = styled(Link)`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type ActionBarProps = {
  toggleEditMode: () => void;
};
function ActionBar({ toggleEditMode }: ActionBarProps): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();

  const textColor = useColorModeValue(
    themes.light.colors.textColor,
    themes.dark.colors.textColor
  );

  function toggleAndStoreColorMode(): void {
    setStoredColorMode(colorMode === "light" ? "dark" : "light");
    toggleColorMode();
  }

  return (
    <>
      <Divider />
      <ActionBarContainer>
        <ActionButton title="Choose Links to Delete">
          <ActionButtonOverlay onClick={toggleEditMode}>
            <Trash2 color={textColor} size={24} />
          </ActionButtonOverlay>
        </ActionButton>

        <ActionButton title="Create New Link">
          <ActionButtonOverlay>
            <StyledLink to="/add">
              <Plus color={textColor} size={32} />
            </StyledLink>
          </ActionButtonOverlay>
        </ActionButton>

        <ActionButton>
          <ActionButtonOverlay onClick={toggleAndStoreColorMode}>
            {useColorModeValue(
              <Moon color={themes.light.colors.textColor} size={24} />,
              <Sun color={themes.dark.colors.textColor} size={24} />
            )}
          </ActionButtonOverlay>
        </ActionButton>
      </ActionBarContainer>
    </>
  );
}

export default ActionBar;
