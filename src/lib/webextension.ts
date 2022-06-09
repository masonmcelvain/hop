import browser from "webextension-polyfill";
import { ColorMode } from "@chakra-ui/react";
import { LinkData } from "../contexts/Links/reducer";

export function setStoredColorMode(colorMode: ColorMode): void {
  setStorageWithKey(StorageKey.COLOR_MODE, colorMode);
}

export function setStoredLinks(links: LinkData[]): void {
  setStorageWithKey(StorageKey.STORED_LINKS, links);
}

export function setNextStoredLinkId(id: number): void {
  setStorageWithKey(StorageKey.NEXT_LINK_ID, id);
}

export async function navigateCurrentTab(url: string): Promise<void> {
  await getCurrentTab().then((tab) => {
    browser.tabs.update(tab.id, { url });
  });
  window.close();
}

export async function openInNewTab(url: string): Promise<void> {
  await browser.tabs.create({ url, active: false });
}

export async function getCurrentTab(): Promise<browser.Tabs.Tab> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

function setStorageWithKey(key: string, value: any) {
  const storageObj: Record<string, any> = {};
  storageObj[key] = value;
  browser.storage.sync.set(storageObj);
}

/**
 * Keys for values in chrome storage
 */
export enum StorageKey {
  COLOR_MODE = "COLOR_MODE",
  STORED_LINKS = "STORED_LINKS",
  NEXT_LINK_ID = "NEXT_LINK_ID",
}
