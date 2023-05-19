import { Button, Text, useBoolean, VStack } from "@chakra-ui/react";
import { navigateCurrentTab, openInNewTab } from "@lib/webextension";
import { LinkData } from "@models/link-state";
import * as React from "react";
import { useDrag } from "react-dnd";
import CardImage from "./CardImage";

export const DragItemTypes = {
   CARD: "card",
};
export type CardDragItem = {
   id: number;
};

type CardProps = {
   linkData: LinkData;
   isInEditMode: boolean;
   onClick: React.MouseEventHandler;
};
export function Card({ linkData, isInEditMode, onClick }: CardProps) {
   const { id, name, url } = linkData;
   const item: CardDragItem = { id };
   const [isMouseOver, setIsMouseOver] = useBoolean();
   const [{ isDragEventInProgress }, drag] = useDrag(
      () => ({
         type: DragItemTypes.CARD,
         item,
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

   return (
      <Button
         pos="absolute"
         top={0}
         as="a"
         target="_self"
         href={url.toString()}
         onClick={onClick}
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
