import * as React from "react";
import { Center, IconButton, VStack } from "@chakra-ui/react";
import { CardDragItem, DragItemTypes } from "../types/DragItemTypes";
import { useDrop } from "react-dnd";
import { Edit2, X } from "react-feather";
import { LinksContext } from "../contexts/Links";
import { LinkAction } from "../contexts/Links/reducer";

type CellProps = {
  index: number;
  gridIndex: number;
  isInEditMode: boolean;
  children: React.ReactChild;
};

function Cell({
  index,
  gridIndex,
  isInEditMode,
  children,
}: CellProps): JSX.Element {
  const { dispatch } = React.useContext(LinksContext);
  const sideLength = 90;

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DragItemTypes.CARD,
      hover: (item: CardDragItem) =>
        dispatch({
          type: LinkAction.UPDATE_LINK_ORDER,
          payload: {
            sourceId: item.id,
            newLinkIndex: index,
            newGridIndex: gridIndex,
          },
        }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, gridIndex, dispatch]
  );

  function deleteChildCard(event): void {
    event.preventDefault();
    dispatch({
      type: LinkAction.DELETE_LINK,
      payload: {
        cellIndex: index,
        gridIndex,
      },
    });
  }

  function editChildCard(event): void {
    event.preventDefault();
    // TODO: Open up the edit link page
  }

  return (
    <Center ref={drop} pos="relative" w={sideLength} h={sideLength}>
      {children && isInEditMode ? (
        <VStack pos="absolute" top={0} left={0} zIndex="docked" spacing="px">
          <IconButton
            icon={<Edit2 size={16} />}
            aria-label="Edit this card"
            onClick={editChildCard}
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
      {isOver ? null : children}
    </Center>
  );
}

export default Cell;
