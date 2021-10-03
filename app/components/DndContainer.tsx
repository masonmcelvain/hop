import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type DndContainerProps = {
  children: React.ReactChild[];
};

function DndContainer({ children }: DndContainerProps): JSX.Element {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}

export default DndContainer;
