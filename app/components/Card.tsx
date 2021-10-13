import * as React from "react";
import { Button, Text, VStack, useBoolean } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import CardImage from "./CardImage";
import { LinkAction, LinkData } from "../contexts/Links/reducer";
import { LinksContext } from "../contexts/Links";
import { openLinkInThisTab } from "../lib/chrome/Tab";

export const DragItemTypes = {
  CARD: "card",
};
export type CardDragItem = {
  id: number;
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
  const { state, dispatch } = React.useContext(LinksContext);
  const [isMouseOver, setIsMouseOver] = useBoolean();
  const [, drag] = useDrag(
    () => ({
      type: DragItemTypes.CARD,
      item: () => {
        dispatch({
          type: LinkAction.SET_HAS_DRAG_EVENT,
          payload: true,
        });
        return { id };
      },
      end: () =>
        dispatch({
          type: LinkAction.SET_HAS_DRAG_EVENT,
          payload: false,
        }),
      isDragging: (monitor) => id === monitor.getItem().id,
    }),
    [linkData]
  );

  const conditionalButtonProps = state.hasDragEvent
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
