import React from "react";
import styled from "styled-components";

const StyledIcon = styled.div`
  width: 80%;
  height: 80%;
  background-color: pink;
  border-radius: 2px;
`;

export default function Icon({ image }) {
  return <StyledIcon />;
}
