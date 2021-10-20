import * as React from "react";
import { Button, Text, VStack, useBoolean } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import CardImage from "./CardImage";
import { LinkData } from "../contexts/Links/reducer";
import { LinksContext } from "../contexts/Links";
import { openLinkInThisTab } from "../lib/chrome/Tab";

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
  const { dispatch } = React.useContext(LinksContext);
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
    [linkData, dispatch]
  );

  const conditionalButtonProps = isDragEventInProgress
    ? {
        _hover: {},
        _active: {},
        _focus: {},
      }
    : {};

  return (
    <Button
      pos="absolute"
      top={0}
      as="a"
      href={url.toString()}
      onClick={() => openLinkInThisTab(url.toString())}
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
      {...conditionalButtonProps}
    >
      <VStack
        w="full"
        ref={drag}
        transform="translate(0, 0)" // Prevents React DnD background color bug
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
      </VStack>
    </Button>
  );
}