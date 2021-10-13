import * as psl from "psl";
import axios from "axios";

const grabFaviconBaseEndpoint = "http://favicongrabber.com/api/grab/";
type grabFaviconIconType = {
  src: string;
  sizes?: string;
};
type grabFaviconResponseType = {
  icons: grabFaviconIconType[];
};

export async function getHighestResFaviconUrl(linkUrl: string): Promise<URL> {
  const url = new URL(linkUrl);
  const domain = psl.parse(url.hostname).domain;
  if (!domain) {
    const message = "Invalid domain name";
    console.error(message, linkUrl);
    return Promise.reject(message);
  }
  const endpoint = grabFaviconBaseEndpoint + domain;

  let highestResUrl: URL = null;
  let highestRes = "0x0";
  const hasGreaterRes = (icon: grabFaviconIconType) =>
    icon["sizes"] && parseInt(icon.sizes) > parseInt(highestRes);

  await axios
    .get<grabFaviconResponseType>(endpoint)
    .then((response) => {
      const icons = response.data.icons;
      icons.forEach((icon) => {
        if (!highestResUrl) {
          highestResUrl = new URL(icon.src);
          highestRes = icon.sizes ? icon.sizes : highestRes;
        } else if (hasGreaterRes(icon)) {
          highestResUrl = new URL(icon.src);
          highestRes = icon.sizes;
        }
      });
    })
    .catch((e) => console.error(e));

  return highestResUrl;
}
