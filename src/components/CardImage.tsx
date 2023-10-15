import * as React from "react";
import { Image } from "react-feather";
import { LinkData } from "@models/link-state";

type CardImageProps = {
   linkData: LinkData;
};
export default function CardImage({ linkData }: CardImageProps) {
   const { name, imageUrl } = linkData;
   return imageUrl ? (
      <img src={imageUrl} alt={name} className="w-8" />
   ) : (
      <Image className="h-8 w-8 opacity-50" />
   );
}
