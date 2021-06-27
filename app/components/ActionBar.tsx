import * as React from "react";
import { Link } from "react-router-dom";
import styled, { withTheme } from "styled-components";
import { HorizontalRule } from "../components/HorizontalRule";
import { Trash2, Plus, Moon, Sun } from "react-feather";

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
  setInDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme;
};
function ActionBar({
  setInDeleteMode,
  isDarkMode,
  toggleDarkMode,
  theme,
}: ActionBarProps) {
  return (
    <>
      <HorizontalRule />
      <ActionBarContainer>
        <ActionButton title="Choose Links to Delete">
          <ActionButtonOverlay
            onClick={() => setInDeleteMode((prevMode) => !prevMode)}
          >
            <Trash2 color={theme.colors.textColor} size={24} />
          </ActionButtonOverlay>
        </ActionButton>

        <ActionButton title="Create New Link">
          <ActionButtonOverlay>
            <StyledLink to="/add">
              <Plus color={theme.colors.textColor} size={32} />
            </StyledLink>
          </ActionButtonOverlay>
        </ActionButton>

        <ActionButton>
          <ActionButtonOverlay onClick={() => toggleDarkMode()}>
            {isDarkMode ? (
              <Sun color={theme.colors.textColor} size={24} />
            ) : (
              <Moon color={theme.colors.textColor} size={24} />
            )}
          </ActionButtonOverlay>
        </ActionButton>
      </ActionBarContainer>
    </>
  );
}

export default withTheme(ActionBar);
