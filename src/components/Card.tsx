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

   const dragPseudo = isDragEventInProgress
      ? ""
      : "hover:bg-chakra-hover focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-chakra-focus active:bg-chakra-active dark:hover:bg-chakra-hover-dark dark:active:bg-chakra-active-dark";
   const dragTruncate = isDragEventInProgress
      ? ""
      : "group-hover:overflow-visible group-hover:whitespace-normal";
   return (
      <a
         ref={drag}
         className={`group absolute flex h-max min-h-[92%] w-11/12 translate-x-0 translate-y-0 cursor-pointer items-center justify-start rounded-md px-1 pt-4 transition duration-150 ${dragPseudo}`}
         tabIndex={0}
         onClick={onClick}
         aria-disabled={isInEditMode}
         href={url}
      >
         <div className="flex w-full flex-col items-center justify-center space-y-2">
            <CardImage linkData={linkData} />
            <p
               className={`max-w-full truncate text-center text-sm ${dragTruncate}`}
            >
               {name}
            </p>
         </div>
      </a>
   );
}
