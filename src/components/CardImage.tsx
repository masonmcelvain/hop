import * as React from "react";
import { Icon, Image } from "@chakra-ui/react";
import { LinkData } from "@models/link-state";
import { Image as FeatherImageIcon } from "react-feather";

type CardImageProps = {
   linkData: LinkData;
};
export default function CardImage({ linkData }: CardImageProps) {
   const { name, imageUrl } = linkData;
   return imageUrl ? (
      <Image src={imageUrl} alt={name} w={8} />
   ) : (
      <Icon as={FeatherImageIcon} w={8} h={8} opacity="0.5" />
   );
}
