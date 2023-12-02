import { useLinkStore } from "@hooks/useLinkStore";
import {
   getStorageKeyForLink,
   navigateCurrentTab,
   openInNewTab,
   setStoredLinkKeys,
} from "@lib/webextension";
import * as React from "react";
import { useDrop } from "react-dnd";
import { Edit2, X } from "react-feather";
import { Card, CardDragItem, DragItemTypes } from "./Card";
import { openUpdateLinkModalForCellType } from "./Page";

type CellProps = {
   index: number;
   isOverEmpty: boolean;
   setIsOverEmpty: (a: boolean) => void;
   isInEditMode: boolean;
   openUpdateLinkModal: openUpdateLinkModalForCellType;
   isLinkEditModalOpen: boolean;
};

export default function Cell({
   index,
   isOverEmpty,
   setIsOverEmpty,
   isInEditMode,
   openUpdateLinkModal,
   isLinkEditModalOpen,
}: CellProps) {
   const links = useLinkStore((state) => state.links);
   const linkKeys = useLinkStore((state) => state.linkKeys);

   const isEmpty = index >= linkKeys.length;
   const link = React.useMemo(
      () =>
         (!isEmpty &&
            links.find(
               (link) => link && getStorageKeyForLink(link) === linkKeys[index],
            )) ||
         null,
      [isEmpty, index, links, linkKeys],
   );

   const onClick = React.useCallback(
      (event: React.MouseEvent | KeyboardEvent) => {
         if (isInEditMode || !link?.url) return;
         if (event.ctrlKey) {
            event.preventDefault();
            openInNewTab(link.url);
         } else {
            navigateCurrentTab(link.url);
         }
      },
      [isInEditMode, link?.url],
   );
   const onKeyDown = React.useCallback(
      (event: KeyboardEvent) => {
         if (isEmpty || isLinkEditModalOpen) return;
         if (String(index + 1) === event.key) {
            event.preventDefault();
            if (isInEditMode) {
               openUpdateLinkModal(index);
            } else {
               onClick(event);
            }
         }
      },
      [
         index,
         isEmpty,
         isInEditMode,
         isLinkEditModalOpen,
         onClick,
         openUpdateLinkModal,
      ],
   );
   React.useEffect(() => {
      document.addEventListener("keydown", onKeyDown);
      return () => {
         document.removeEventListener("keydown", onKeyDown);
      };
   }, [onKeyDown]);
   const card = React.useMemo(
      () =>
         link && (
            <Card
               linkData={link}
               isInEditMode={isInEditMode}
               onClick={onClick}
            />
         ),
      [isInEditMode, link, onClick],
   );

   const reorderLinks = useLinkStore((state) => state.reorderLinks);
   const [{ dragItem, isOver }, drop] = useDrop(
      () => ({
         accept: DragItemTypes.CARD,
         hover: (item: CardDragItem) =>
            reorderLinks({
               sourceId: item.id,
               newLinkKeyIndex: index,
            }),
         drop: () => {
            setStoredLinkKeys(linkKeys);
         },
         collect: (monitor) => ({
            dragItem: monitor.getItem<CardDragItem>(),
            isOver: monitor.isOver(),
         }),
      }),
      [index, linkKeys],
   );

   React.useEffect(() => {
      if (isOver && !card) {
         setIsOverEmpty(true);
      } else if (!dragItem) {
         setIsOverEmpty(false);
      }
   }, [card, dragItem, isOver, setIsOverEmpty]);

   const deleteLink = useLinkStore((state) => state.deleteLink);
   const deleteChildCard: React.MouseEventHandler = React.useCallback(
      (event) => {
         event.preventDefault();
         deleteLink(index);
      },
      [deleteLink, index],
   );

   const isLastCellWithCard = index === links.length - 1;
   const shouldHideChildren = isOver || (isLastCellWithCard && isOverEmpty);

   return (
      <div
         ref={drop}
         className="relative flex h-[90px] w-[90px] items-center justify-center"
         data-testid={isEmpty ? "empty-cell" : "non-empty-cell"}
      >
         {card && isInEditMode ? (
            <div className="absolute left-0 top-0 z-10 flex flex-col items-center justify-center space-y-0.5">
               <button
                  aria-label="Edit this link"
                  className="relative inline-flex h-6 min-w-[1.5rem] select-none appearance-none items-center justify-center whitespace-nowrap rounded-md bg-transparent align-middle text-xs font-semibold leading-tight outline outline-2 outline-offset-2 outline-transparent transition duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring focus-visible:ring-chakra-focus active:bg-white/20"
                  onClick={() => openUpdateLinkModal(index)}
               >
                  <Edit2 size={16} />
               </button>
               <button
                  aria-label="Delete this link"
                  className="relative inline-flex h-6 min-w-[1.5rem] select-none appearance-none items-center justify-center whitespace-nowrap rounded-md bg-transparent align-middle text-xs font-semibold leading-tight text-red-300 outline outline-2 outline-offset-2 outline-transparent transition duration-200 hover:bg-red-300/10 focus-visible:outline-none focus-visible:ring focus-visible:ring-chakra-focus active:bg-red-300/20"
                  onClick={deleteChildCard}
               >
                  <X size={20} />
               </button>
            </div>
         ) : null}
         {shouldHideChildren ? null : card}
      </div>
   );
}
