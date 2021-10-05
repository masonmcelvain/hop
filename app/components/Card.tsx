import * as React from "react";
import { Button, Text, useBoolean } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { DragItemTypes } from "../types/DragItemTypes";
import CardImage from "./CardImage";
import { LinkData } from "../contexts/Links/reducer";

function openLinkInThisTab(url: string): void {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.update(tabs[0].id, { url });
  });
  window.close();
}

type CardProps = {
  linkData: LinkData;
  isInEditMode: boolean;
};

export default function Card({
  linkData,
  isInEditMode,
}: CardProps): JSX.Element {
  const { id, name, url } = linkData;
  const [isMouseOver, setIsMouseOver] = useBoolean();
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
    <Button
      pos="absolute"
      top={0}
      as="a"
      href={url.toString()}
      onClick={() => openLinkInThisTab(url.toString())}
      variant="ghost"
      w="full"
      minH="full"
      h="max-content"
      pt={2}
      px={1}
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="flex-start"
      gridRowGap={2}
      onMouseEnter={setIsMouseOver.on}
      onMouseLeave={setIsMouseOver.off}
      ref={drag}
      transform="translate(0, 0)" // Prevents React DnD background color bug
      disabled={isInEditMode}
    >
      <CardImage linkData={linkData} />
      <Text
        align="center"
        fontSize="sm"
        maxW="full"
        whiteSpace="normal"
        isTruncated={!isMouseOver}
      >
        {name}
      </Text>
    </Button>
  );
}
