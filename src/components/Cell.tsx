import { IconButton, Square, useBoolean, VStack } from "@chakra-ui/react";
import { LinksContext } from "@contexts/links";
import { getStorageKeyForLink, setStoredLinkKeys } from "@lib/webextension";
import { useLinkStore } from "hooks/useLinkStore";
import * as React from "react";
import { useDrop } from "react-dnd";
import { Edit2, X } from "react-feather";
import { Card, CardDragItem, DragItemTypes } from "./Card";
import { openUpdateLinkModalForCellType } from "./Page";

type CellProps = {
  index: number;
  isOverEmpty: boolean;
  setIsOverEmpty: ReturnType<typeof useBoolean>[1];
  isInEditMode: boolean;
  openUpdateLinkModal: openUpdateLinkModalForCellType;
};

const SIDE_LENGTH = 90;

export default function Cell({
  index,
  isOverEmpty,
  setIsOverEmpty,
  isInEditMode,
  openUpdateLinkModal,
}: CellProps) {
  const { state } = React.useContext(LinksContext);

  const isEmpty = index >= state.linkKeys.length;
  const link = React.useMemo(
    () =>
      !isEmpty &&
      state.links.find(
        (link) => link && getStorageKeyForLink(link) === state.linkKeys[index]
      ),
    [isEmpty, index, state]
  );
  const card = React.useMemo(
    () => link && <Card linkData={link} isInEditMode={isInEditMode} />,
    [isInEditMode, link]
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
        setStoredLinkKeys(state.linkKeys);
      },
      collect: (monitor) => ({
        dragItem: monitor.getItem<CardDragItem>(),
        isOver: monitor.isOver(),
      }),
    }),
    [index, state]
  );

  React.useEffect(() => {
    if (isOver && !card) {
      setIsOverEmpty.on();
    } else if (!dragItem) {
      setIsOverEmpty.off();
    }
  }, [card, dragItem, isOver, setIsOverEmpty]);

  const deleteLink = useLinkStore((state) => state.deleteLink);
  const deleteChildCard: React.MouseEventHandler = React.useCallback(
    (event) => {
      event.preventDefault();
      deleteLink(index);
    },
    [deleteLink, index]
  );

  const isLastCellWithCard = index === state.links.length - 1;
  const shouldHideChildren = isOver || (isLastCellWithCard && isOverEmpty);

  return (
    <Square
      ref={drop}
      pos="relative"
      size={SIDE_LENGTH}
      data-testid={isEmpty ? "empty-cell" : "non-empty-cell"}
    >
      {card && isInEditMode ? (
        <VStack pos="absolute" top={0} left={0} zIndex="docked" spacing="px">
          <IconButton
            icon={<Edit2 size={16} />}
            aria-label="Edit this link"
            onClick={() => openUpdateLinkModal(index)}
            variant="ghost"
            size="xs"
          />
          <IconButton
            icon={<X size={20} />}
            aria-label="Delete this link"
            onClick={deleteChildCard}
            colorScheme="red"
            variant="ghost"
            size="xs"
          />
        </VStack>
      ) : null}
      {shouldHideChildren ? null : card}
    </Square>
  );
}
