import * as React from "react";
import { IconButton, Square, useBoolean, VStack } from "@chakra-ui/react";
import Card, { CardDragItem, DragItemTypes } from "./Card";
import { useDrop } from "react-dnd";
import { Edit2, X } from "react-feather";
import { LinksContext } from "../contexts/Links";
import { LinkAction } from "../contexts/Links/reducer";
import { openUpdateLinkModalForCellType } from "../components/Page";
import { getStorageKeyForLink, setStoredLinkKeys } from "../lib/webextension";

type CellProps = {
  index: number;
  isOverEmpty: boolean;
  setIsOverEmpty: ReturnType<typeof useBoolean>[1];
  isInEditMode: boolean;
  openUpdateLinkModal: openUpdateLinkModalForCellType;
};

const SIDE_LENGTH = 90;

function Cell({
  index,
  isOverEmpty,
  setIsOverEmpty,
  isInEditMode,
  openUpdateLinkModal,
}: CellProps): JSX.Element {
  const { state, dispatch } = React.useContext(LinksContext);

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

  const [{ isOver, dragItem }, drop] = useDrop(
    () => ({
      accept: DragItemTypes.CARD,
      hover: (item: CardDragItem) =>
        dispatch({
          type: LinkAction.REORDER_LINKS,
          payload: {
            sourceId: item.id,
            newLinkKeyIndex: index,
          },
        }),
      drop: () => {
        setStoredLinkKeys(state.linkKeys);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        dragItem: monitor.getItem(),
      }),
    }),
    [index, state, dispatch]
  );

  React.useEffect(() => {
    if (isOver && !card) {
      setIsOverEmpty.on();
    } else if (isOver && card) {
      setIsOverEmpty.off();
    } else if (!dragItem) {
      setIsOverEmpty.off();
    }
  }, [card, isOver, dragItem, setIsOverEmpty]);

  const deleteChildCard: React.MouseEventHandler = React.useCallback(
    (event) => {
      event.preventDefault();
      dispatch({
        type: LinkAction.DELETE_LINK,
        payload: index,
      });
    },
    [dispatch, index]
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

export default Cell;
