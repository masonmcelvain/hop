import React from "react";
import styled from "styled-components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function DndContainer({ children }) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}

const StyledDndContainer = styled(DndContainer)`
  width: 100%;
  height: 100%;
`;

export default StyledDndContainer;
