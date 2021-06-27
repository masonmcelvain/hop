import { STORAGE } from "../types/StorageEnum";
import { LinkData } from "../types/CardTypes";

export function setStoredIsDarkMode(isDarkMode: boolean) {
  setStorageWithKey(STORAGE.IS_DARK_MODE_SET, isDarkMode);
}

export function setStoredLinks(links: LinkData[][]) {
  setStorageWithKey(STORAGE.STORED_LINKS, links);
}

export function setNextStoredLinkId(id: number) {
  setStorageWithKey(STORAGE.NEXT_LINK_ID, id);
}

function setStorageWithKey(key: string, value: any) {
  const storageObj = {};
  storageObj[key] = value;
  chrome.storage.sync.set(storageObj);
}
