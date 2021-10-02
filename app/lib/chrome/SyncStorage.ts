import { LinkData } from "../../contexts/Links/reducer";
import { STORAGE } from "../../types/StorageEnum";

export function setStoredIsDarkMode(isDarkMode: boolean): void {
  setStorageWithKey(STORAGE.IS_DARK_MODE_SET, isDarkMode);
}

export function setStoredLinks(links: LinkData[][]): void {
  setStorageWithKey(STORAGE.STORED_LINKS, links);
}

export function setNextStoredLinkId(id: number): void {
  setStorageWithKey(STORAGE.NEXT_LINK_ID, id);
}

function setStorageWithKey(key: string, value) {
  const storageObj = {};
  storageObj[key] = value;
  chrome.storage.sync.set(storageObj);
}
