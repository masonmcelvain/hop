import React from "react";
import styled from "styled-components";
import { ItemTypes } from "./ItemTypes";
import { useDrag } from "react-dnd";
import Icon from "./Icon";

const IconContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Paragraph = styled.p`
  width: 100%;
  color: ${(props) => props.theme.colors.textColor};
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Link = styled.a`
  display: inline-block;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
`;

const StyledCard = styled.div`
  width: 90%;
  height: 90%;
  transform: translate(0, 0); // Prevents React DnD background color bug
`;

export default function Card({ name, url, image, x, y }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <StyledCard ref={drag}>
      <Link href={url} target="_blank" rel="noopener noreferrer">
        <IconContainer>
          <Icon image={image} />
        </IconContainer>
        <Paragraph>{name}</Paragraph>
      </Link>
    </StyledCard>
  );
}
