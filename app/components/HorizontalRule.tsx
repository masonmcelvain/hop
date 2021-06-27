import styled from "styled-components";

export const HorizontalRule = styled.div`
  width: 90%;
  height: 2px;
  border-radius: 16px;
  margin: 8px auto;
  background-color: ${(props) => props.theme.colors.icon_accent};
`;
