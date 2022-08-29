import browser from "webextension-polyfill";
import { ColorMode } from "@chakra-ui/react";
import { LinkData } from "../contexts/Links/reducer";

export function setStoredColorMode(colorMode: ColorMode): void {
  setStorageWithKey(StorageKey.COLOR_MODE, colorMode);
}

export function setStoredLinksAndKeys(
  links: LinkData[],
  linkKeys: string[]
): void {
  setStoredLinkKeys(linkKeys);
  setStoredLinks(links);
}

export function setStoredLinkKeys(linkKeys: string[]): void {
  setStorageWithKey(StorageKey.LINK_STORAGE_KEYS, linkKeys);
}

export function setStoredLinks(links: LinkData[]): void {
  links.forEach((link) => {
    setStorageWithKey(getStorageKeyForLink(link), link);
  });
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

export function getStorageKeyForLink(link: LinkData): string {
  return `${StorageKey.LINK_STORAGE_PREFIX}${link.id}`;
}

export function getLinkIdForStorageKey(key: string): number {
  return parseInt(key.replace(StorageKey.LINK_STORAGE_PREFIX, ""), 10);
}

function setStorageWithKey(key: string, value: any) {
  const storageObj: Record<string, any> = {};
  storageObj[key] = value;
  browser.storage.local.set(storageObj);
}

/**
 * Keys for values in chrome storage
 */
export enum StorageKey {
  COLOR_MODE = "COLOR_MODE",
  LINK_STORAGE_KEYS = "LINK_STORAGE_KEYS",
  LINK_STORAGE_PREFIX = "LINK_ID_",
  NEXT_LINK_ID = "NEXT_LINK_ID",
}
