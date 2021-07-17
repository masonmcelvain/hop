import * as React from "react";
import styled from "styled-components";
import { DragItemTypes } from "../types/DragItemTypes";
import { useDrag } from "react-dnd";
import CardImage from "./CardImage";
import { LinkData } from "../types/CardTypes";
import { addImageUrlType } from "../App";

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

const Hyperlink = styled.a`
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

function openLinkInThisTab(url: string): void {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.update(tabs[0].id, { url });
  });
  window.close();
}

type CardProps = {
  linkData: LinkData;
  addImageUrl: addImageUrlType;
};

export default function Card({ linkData, addImageUrl }: CardProps) {
  const { id, name, url } = linkData;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DragItemTypes.CARD,
      item: { id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [linkData]
  );

  return (
    <StyledCard ref={drag}>
      <Hyperlink
        href={url.toString()}
        onClick={() => openLinkInThisTab(url.toString())}
      >
        <IconContainer>
          <CardImage linkData={linkData} addImageUrl={addImageUrl} />
        </IconContainer>
        <Paragraph>{name}</Paragraph>
      </Hyperlink>
    </StyledCard>
  );
}
