import React from "react";
import styled from "styled-components";
import { ItemTypes } from "./ItemTypes";
import { useDrop } from "react-dnd";

const StyledCell = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Cell({ x, y, children }) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: () => null, // TODO: commit position to card on drop
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [x, y]
  );

  return (
    <StyledCell ref={drop}>
      {children}
      {isOver && ( // TODO: remove this overlay, use isOver to slide cards
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "yellow",
          }}
        />
      )}
    </StyledCell>
  );
}
