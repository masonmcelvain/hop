import { Button } from "@chakra-ui/react";
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
   const [{ isDragEventInProgress }, drag] = useDrag(
      () => ({
         type: DragItemTypes.CARD,
         item,
         isDragging: (monitor) => id === monitor.getItem().id,
         collect: (monitor) => ({
            isDragEventInProgress: !!monitor.getItem(),
         }),
      }),
      [id],
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
         className="group"
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
         disabled={isInEditMode}
         ref={drag}
         transform="translate(0, 0)" // Prevents React DnD background color bug
         {...conditionalButtonProps}
      >
         <div className="flex w-full flex-col items-center justify-center space-y-2">
            <CardImage linkData={linkData} />
            <p className="max-w-full truncate text-center text-sm group-hover:overflow-visible group-hover:whitespace-normal">
               {name}
            </p>
         </div>
      </Button>
   );
}
