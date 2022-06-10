import * as React from "react";
import { Image as FeatherImageIcon } from "react-feather";
import { Icon, Image } from "@chakra-ui/react";
import { LinkAction, LinkData } from "../contexts/Links/reducer";
import { LinksContext } from "../contexts/Links";
import { getHighestResFaviconUrl } from "../lib/getFavicon";

type CardImageProps = {
  linkData: LinkData;
};
export default function CardImage({ linkData }: CardImageProps): JSX.Element {
  const { dispatch } = React.useContext(LinksContext);
  const { id, name, url, imageUrl } = linkData;

  React.useEffect(() => {
    if (!imageUrl) {
      const fetchAndSetFaviconUrl = async () => {
        const faviconUrl = await getHighestResFaviconUrl(url);
        faviconUrl &&
          dispatch({
            type: LinkAction.UPDATE_IMAGE_URL,
            payload: {
              url: faviconUrl.toString(),
              linkId: id,
            },
          });
      };
      fetchAndSetFaviconUrl();
    }
  }, [id, url, imageUrl]);

  return imageUrl ? (
    <Image src={imageUrl} alt={name} w={8} />
  ) : (
    <Icon as={FeatherImageIcon} w={8} h={8} opacity="0.5" />
  );
}
