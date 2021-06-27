import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { StyledPage } from "../App";

const FlexPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function EditLinksPage(): JSX.Element {
  return (
    <StyledPage>
      <FlexPage>
        <Link to="/">LaunchPage</Link>
      </FlexPage>
    </StyledPage>
  );
}
