import * as React from "react";
import { useColorMode } from "@chakra-ui/react";
import Page from "./Page";
import { setStoredColorMode, StorageKey } from "./lib/chrome/SyncStorage";
import { LinksProvider } from "./contexts/Links";

export default function App(): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();

  // Initialize color theme from chrome storage
  React.useEffect(() => {
    chrome.storage.sync.get(null, (result) => {
      if (StorageKey.COLOR_MODE in result) {
        const storedColorMode = result[StorageKey.COLOR_MODE];
        storedColorMode !== colorMode && toggleColorMode();
      } else {
        setStoredColorMode(colorMode);
      }
    });
  }, []);

  return (
    <LinksProvider>
      <Page />
    </LinksProvider>
  );
}
