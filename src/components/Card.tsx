import * as React from "react";
import { Button, Text, VStack, useBoolean } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import CardImage from "./CardImage";
import { navigateCurrentTab, openInNewTab } from "../lib/webextension";
import { LinkData } from "../models/link-state";

export const DragItemTypes = {
  CARD: "card",
};
export type CardDragItem = {
  id: number;
};

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
  const [{ isDragEventInProgress }, drag] = useDrag(
    () => ({
      type: DragItemTypes.CARD,
      item: { id },
      isDragging: (monitor) => id === monitor.getItem().id,
      collect: (monitor) => ({
        isDragEventInProgress: !!monitor.getItem(),
      }),
    }),
    [id]
  );

  const conditionalButtonProps = isDragEventInProgress
    ? {
        _hover: {},
        _active: {},
        _focus: {},
      }
    : {};

  const clickHandler = React.useCallback<React.MouseEventHandler>(
    (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
        openInNewTab(url.toString());
      } else {
        navigateCurrentTab(url.toString());
      }
    },
    [url]
  );

  return (
    <Button
      pos="absolute"
      top={0}
      as="a"
      target="_self"
      href={url.toString()}
      onClick={clickHandler}
      variant="ghost"
      w="92%"
      minH="92%"
      h="max-content"
      pt={4}
      px={1}
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="flex-start"
      gridRowGap={2}
      onMouseEnter={setIsMouseOver.on}
      onMouseLeave={setIsMouseOver.off}
      disabled={isInEditMode}
      ref={drag}
      transform="translate(0, 0)" // Prevents React DnD background color bug
      {...conditionalButtonProps}
    >
      <VStack w="full">
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
      </VStack>
    </Button>
  );
}
