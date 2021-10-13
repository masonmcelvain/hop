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
  manageIsOverEmpty: [
    boolean,
    {
      readonly on: () => void;
      readonly off: () => void;
      readonly toggle: () => void;
    }
  ];
  isInEditMode: boolean;
  openUpdateLinkModal: openUpdateLinkModalForCellType;
  children: React.ReactChild;
};

function Cell({
  index,
  manageIsOverEmpty,
  isInEditMode,
  openUpdateLinkModal,
  children,
}: CellProps): JSX.Element {
  const { state, dispatch } = React.useContext(LinksContext);
  const [isOverEmpty, setIsOverEmpty] = manageIsOverEmpty;
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

  React.useEffect(() => {
    if (isOver && !children) {
      setIsOverEmpty.on();
    } else if (isOver && children) {
      setIsOverEmpty.off();
    } else if (!dragItem) {
      setIsOverEmpty.off();
    }
  }, [children, isOver, dragItem, setIsOverEmpty]);

  function deleteChildCard(event): void {
    event.preventDefault();
    dispatch({
      type: LinkAction.DELETE_LINK,
      payload: index,
    });
  }

  const isLastCellWithCard = index === state.links.length - 1;
  const shouldHideChildren = isOver || (isLastCellWithCard && isOverEmpty);

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
      {shouldHideChildren ? null : children}
    </Center>
  );
}

export default Cell;
