import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Edit, Plus } from "react-feather";
import { Direction } from "../types/DirectionEnum";

const ActionBarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type ActionButtonProps = {
  direction: Direction;
};
const ActionButton = styled.div<ActionButtonProps>`
  flex-grow: 1;
  height: 36px;
  margin: ${(props) =>
    Direction.withOptions(
      props.direction,
      "8px 4px 8px 8px",
      "8px 8px 8px 4px"
    )};
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.overlay_10};
`;

const StyledLink = styled(Link)`
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

export default function ActionBar(): JSX.Element {
  return (
    <ActionBarContainer>
      <ActionButton direction={Direction.Left}>
        <StyledLink to="/edit">
          <Edit color="white" size={24} />
        </StyledLink>
      </ActionButton>
      <ActionButton direction={Direction.Right}>
        <StyledLink to="/add">
          <Plus color="white" size={32} />
        </StyledLink>
      </ActionButton>
    </ActionBarContainer>
  );
}
