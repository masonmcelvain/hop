import { SimpleGrid, useBoolean } from "@chakra-ui/react";
import { useLinkStore } from "@hooks/useLinkStore";
import * as React from "react";
import Cell from "./Cell";
import { openUpdateLinkModalForCellType } from "./Page";

const COL_COUNT = 3;

type GridProps = {
   isInEditMode: boolean;
   openUpdateLinkModal: openUpdateLinkModalForCellType;
};

export default function Grid({ isInEditMode, openUpdateLinkModal }: GridProps) {
   const linkKeys = useLinkStore((state) => state.linkKeys);
   const [isOverEmpty, setIsOverEmpty] = useBoolean();

   const length = React.useMemo(() => {
      const linkCount = linkKeys.length;
      if (linkCount === 0) {
         return 0;
      }
      const largestFactorOfWidth = linkCount - (linkCount % COL_COUNT);
      const cellsFromRemainder = linkCount % COL_COUNT ? COL_COUNT : 0;
      return largestFactorOfWidth + cellsFromRemainder;
   }, [linkKeys.length]);

   return (
      <SimpleGrid columns={COL_COUNT}>
         {Array.from({ length }).map((_, i) => (
            <Cell
               key={i}
               index={i}
               isOverEmpty={isOverEmpty}
               setIsOverEmpty={setIsOverEmpty}
               isInEditMode={isInEditMode}
               openUpdateLinkModal={openUpdateLinkModal}
            />
         ))}
      </SimpleGrid>
   );
}
