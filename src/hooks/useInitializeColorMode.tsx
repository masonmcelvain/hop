import { useColorMode, useTheme } from "@chakra-ui/react";
import { setStoredColorMode, StorageKey } from "@lib/webextension";
import { parseColorMode } from "@models/color-mode";
import * as React from "react";
import browser from "webextension-polyfill";

export function useInitializeColorMode() {
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
}
