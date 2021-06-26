import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Edit, Plus } from "react-feather";
import { Direction } from "../modules/types";

const ActionBarContainer = styled.div`
  margin: 5px auto 10px;
  width: 95%;
  height: 30px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.overlay_10};
`;

type StyledLinkProps = {
  direction: Direction;
};
const StyledLink = styled(Link)<StyledLinkProps>`
  width: 50%;
  height: 100%;
  border-radius: ${(props) =>
    Direction.withOptions(props.direction, "12px 0 0 12px", "0 12px 12px 0")};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

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
      <StyledLink to="/edit" direction={Direction.Left}>
        <Edit color="white" size={24} />
      </StyledLink>
      <StyledLink to="/add" direction={Direction.Right}>
        <Plus color="white" size={32} />
      </StyledLink>
    </ActionBarContainer>
  );
}
