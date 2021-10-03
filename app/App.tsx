import * as React from "react";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import darkTheme from "../themes/dark";
import lightTheme from "../themes/light";
import LaunchPage from "./pages/LaunchPage";
import AddLinkPage from "./pages/AddLinkPage";
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
    <ThemeProvider theme={useColorModeValue(lightTheme, darkTheme)}>
      <LinksProvider>
        <MemoryRouter>
          <Switch>
            <Route exact path="/">
              <LaunchPage />
            </Route>
            <Route path="/add">
              <AddLinkPage />
            </Route>
          </Switch>
        </MemoryRouter>
      </LinksProvider>
    </ThemeProvider>
  );
}
