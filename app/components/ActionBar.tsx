import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Edit, Plus } from "react-feather";

const ActionBarContainer = styled.div`
  margin: 5px auto 10px;
  width: 95%;
  height: 30px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
`;

type StyledLinkProps = {
  left?: boolean;
};
const StyledLink = styled(Link)<StyledLinkProps>`
  width: 50%;
  height: 100%;
  border-radius: ${(props) => (props.left ? "12px 0 0 12px" : "0 12px 12px 0")};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    :hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }

  :active {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

export default function ActionBar(): JSX.Element {
  return (
    <ActionBarContainer>
      <StyledLink to="/edit" left>
        <Edit color="white" size={24} />
      </StyledLink>
      <StyledLink to="/add">
        <Plus color="white" size={32} />
      </StyledLink>
    </ActionBarContainer>
  );
}
