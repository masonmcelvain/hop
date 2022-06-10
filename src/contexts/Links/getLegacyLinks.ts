import browser from "webextension-polyfill";
import { LinkData } from "./reducer";

const LEGACY_STORED_LINKS_KEY = "STORED_LINKS";

export async function getLegacyLinks(): Promise<LinkData[] | undefined> {
  return browser.storage.sync
    .get(LEGACY_STORED_LINKS_KEY)
    .then((result) => result[LEGACY_STORED_LINKS_KEY]);
}
