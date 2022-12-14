import { useColorMode, useTheme } from "@chakra-ui/react";
import * as React from "react";
import browser from "webextension-polyfill";
import { LinksProvider } from "@contexts/Links";
import { setStoredColorMode, StorageKey } from "@lib/webextension";
import { parseColorMode } from "@models/color-mode";
import Page from "./Page";

export default function App(): JSX.Element {
  const { setColorMode } = useColorMode();
  const { initialColorMode } = useTheme();

  React.useEffect(() => {
    const initializeColorMode = async () => {
      const data = await browser.storage.local.get(StorageKey.COLOR_MODE);
      const storedMode = parseColorMode(data[StorageKey.COLOR_MODE]);
      storedMode
        ? setColorMode(storedMode)
        : setStoredColorMode(initialColorMode);
    };
    initializeColorMode();
  }, [initialColorMode, setColorMode]);

  return (
    <LinksProvider>
      <Page />
    </LinksProvider>
  );
}
