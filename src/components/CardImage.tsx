import * as React from "react";
import { Image as PlaceholderImage } from "react-feather";
import { Icon, Image } from "@chakra-ui/react";
import { LinkData } from "@models/link-state";

type CardImageProps = {
   linkData: LinkData;
};
export default function CardImage({ linkData }: CardImageProps) {
   const { name, imageUrl } = linkData;
   return imageUrl ? (
      <Image src={imageUrl} alt={name} w={8} />
   ) : (
      <Icon as={PlaceholderImage} w={8} h={8} opacity="0.5" />
   );
}
