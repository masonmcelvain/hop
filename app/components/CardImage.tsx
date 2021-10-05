import * as React from "react";
import { Image as FeatherImageIcon } from "react-feather";
import { Icon, Image } from "@chakra-ui/react";
import * as psl from "psl";
import * as axios from "axios";
import { LinkData } from "../contexts/Links/reducer";
import { LinksContext } from "../contexts/Links";

/**
 * @return {Promise<?URL>}
 */
async function getHighestResFaviconUrl(cardUrl: string) {
  const grabFaviconApi = "http://favicongrabber.com/api/grab/";
  type grabFaviconApiIconType = {
    src: string;
    sizes?: string;
  };
  const url = new URL(cardUrl);
  const domain = psl.parse(url.hostname).domain;
  if (!domain) {
    console.error("Invalid domain name passed to CardImage", cardUrl);
  }
  const endpoint = grabFaviconApi + domain;

  /** @type {?URL} */
  let highestResUrl = null;
  let highestRes = "0x0";
  const hasGreaterRes = (icon: grabFaviconApiIconType) =>
    icon["sizes"] && parseInt(icon.sizes) > parseInt(highestRes);

  await axios
    // @ts-ignore
    .get(endpoint)
    .then((response) => {
      const icons: grabFaviconApiIconType[] = response.data.icons;
      icons.forEach((icon) => {
        if (!highestResUrl) {
          highestResUrl = new URL(icon.src);
        } else if (hasGreaterRes(icon)) {
          highestResUrl = new URL(icon.src);
          highestRes = icon.sizes;
        }
      });
    })
    .catch((e) => console.error(e));
  return highestResUrl;
}

type CardImageProps = {
  linkData: LinkData;
};
export default function CardImage({ linkData }: CardImageProps): JSX.Element {
  const { dispatch } = React.useContext(LinksContext);
  const { id, name, url, imageUrl } = linkData;

  // if (!imageUrl) {
  //   const faviconPromise = getHighestResFaviconUrl(url);
  //   faviconPromise.then((imageUrl) => {
  //     imageUrl && dispatch({
  //       type: LinkAction.ADD_IMAGE_URL,
  //       payload: {
  //         url: imageUrl.toString(),
  //         linkId: id,
  //       },
  //     });
  //   });
  // }

  return imageUrl ? (
    <Image src={imageUrl} alt={name} w={8} />
  ) : (
    <Icon as={FeatherImageIcon} w={8} h={8} opacity="0.5" />
  );
}
