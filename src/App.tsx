import * as React from "react";
import browser from "webextension-polyfill";
import { useColorMode } from "@chakra-ui/react";
import Page from "./components/Page";
import { setStoredColorMode, StorageKey } from "./lib/webextension";
import { LinksProvider } from "./contexts/Links";

export default function App(): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();

  // Initialize color theme from browser storage
  React.useEffect(() => {
    browser.storage.sync.get(StorageKey.COLOR_MODE).then((result) => {
      const storedColorMode = result[StorageKey.COLOR_MODE];
      storedColorMode ?
        storedColorMode !== colorMode && toggleColorMode() :
        setStoredColorMode(colorMode);
    });
  }, []);

  return (
    <LinksProvider>
      <Page />
    </LinksProvider>
  );
}
