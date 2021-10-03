import * as React from "react";
import styled from "styled-components";
import { useDrag } from "react-dnd";
import { DragItemTypes } from "../types/DragItemTypes";
import CardImage from "./CardImage";
import { LinkData } from "../contexts/Links/reducer";

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

type HyperLinkProps = {
  isDragging: boolean;
};
const Hyperlink = styled.a<HyperLinkProps>`
  display: inline-block;
  width: 90%;
  height: 90%;
  padding: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  border-radius: 8px;
  transition: all 0.2s;

  // TODO: make a custom hook to control this https://www.thisdot.co/blog/creating-a-global-state-with-react-hooks
  @media (hover: hover) and (pointer: fine) {
    :hover {
      background-color: ${(props) =>
        props.isDragging ? "transparent" : props.theme.colors.overlay_15};
    }
  }

  :active {
    background-color: ${(props) =>
      props.isDragging ? "transparent" : props.theme.colors.overlay_25};
  }
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
};

export default function Card({ linkData }: CardProps): JSX.Element {
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
        isDragging={isDragging}
      >
        <IconContainer>
          <CardImage linkData={linkData} />
        </IconContainer>
        <Paragraph>{name}</Paragraph>
      </Hyperlink>
    </StyledCard>
  );
}
