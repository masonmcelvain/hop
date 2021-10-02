import * as React from "react";
import styled from "styled-components";
import { Image } from "react-feather";
import * as psl from "psl";
import * as axios from "axios";
import { LinkAction, LinkData } from "../contexts/Links/reducer";
import { LinksContext } from "../contexts/Links";

const DefaultImage = styled(Image)`
  width: 50%;
  height: auto;
  color: ${(props) => props.theme.colors.icon_accent};
`;

const StyledImage = styled.img`
  width: 50%;
  height: auto;
`;

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
    icon.hasOwnProperty("sizes") && parseInt(icon.sizes) > parseInt(highestRes);

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
  const {state, dispatch} = React.useContext(LinksContext);
  const { id, name, url, imageUrl } = linkData;
  const faviconPromise = getHighestResFaviconUrl(url);

  if (!imageUrl) {
    faviconPromise.then((imageUrl) => {
      dispatch({
        type: LinkAction.ADD_IMAGE_URL,
        payload: {
          url: imageUrl.toString(),
          linkId: id,
        },
      });
    });
  }

  const DisplayImage = imageUrl ? (
    <StyledImage alt={name} src={imageUrl} />
  ) : (
    <DefaultImage />
  );

  return DisplayImage;
}
