import * as React from "react";
import { Center, IconButton, VStack } from "@chakra-ui/react";
import { CardDragItem, DragItemTypes } from "./Card";
import { useDrop } from "react-dnd";
import { Edit2, X } from "react-feather";
import { LinksContext } from "../contexts/Links";
import { LinkAction } from "../contexts/Links/reducer";
import { openUpdateLinkModalForCellType } from "../Page";
import { setStoredLinks } from "../lib/chrome/SyncStorage";

type CellProps = {
  index: number;
  isInEditMode: boolean;
  openUpdateLinkModal: openUpdateLinkModalForCellType;
  children: React.ReactChild;
};

function Cell({
  index,
  isInEditMode,
  openUpdateLinkModal,
  children,
}: CellProps): JSX.Element {
  const { state, dispatch } = React.useContext(LinksContext);
  const sideLength = 90;

  const [{ isOver, dragItem }, drop] = useDrop(
    () => ({
      accept: DragItemTypes.CARD,
      hover: (item: CardDragItem) =>
        dispatch({
          type: LinkAction.REORDER_LINKS,
          payload: {
            sourceId: item.id,
            newLinkIndex: index,
          },
        }),
      drop: () => setStoredLinks(state.links),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        dragItem: monitor.getItem(),
      }),
    }),
    [index, state, dispatch]
  );

  function deleteChildCard(event): void {
    event.preventDefault();
    dispatch({
      type: LinkAction.DELETE_LINK,
      payload: index,
    });
  }

  const isLastCellWithCard = index === state.links.length - 1;
  const shouldDisplayChildren =
    !isOver &&
    !(dragItem && isLastCellWithCard && dragItem.id === state.links[index].id);

  return (
    <Center ref={drop} pos="relative" w={sideLength} h={sideLength}>
      {children && isInEditMode ? (
        <VStack pos="absolute" top={0} left={0} zIndex="docked" spacing="px">
          <IconButton
            icon={<Edit2 size={16} />}
            aria-label="Edit this card"
            onClick={() => openUpdateLinkModal(index)}
            variant="ghost"
            size="xs"
          />
          <IconButton
            icon={<X size={20} />}
            aria-label="Delete this card"
            onClick={deleteChildCard}
            colorScheme="red"
            variant="ghost"
            size="xs"
          />
        </VStack>
      ) : null}
      {shouldDisplayChildren ? children : null}
    </Center>
  );
}

export default Cell;
