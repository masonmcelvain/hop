import React from "react";
import styled from "styled-components";
import { Image } from "react-feather";

const StyledIcon = styled(Image)`
  width: 80%;
  height: 80%;
  color: ${(props) => props.theme.colors.icon_accent};
`;

export default function Icon({ image }) {
  return <StyledIcon />;
}
