import * as React from "react";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import darkTheme from "../themes/dark";
import lightTheme from "../themes/light";
import LaunchPage from "./pages/LaunchPage";
import AddLinkPage from "./pages/AddLinkPage";
import { setStoredColorMode, StorageKey } from "./lib/chrome/SyncStorage";
import { LinksProvider } from "./contexts/Links";

export default function App(): JSX.Element {
  const [inDeleteMode, setInDeleteMode] = React.useState(false);
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
              <LaunchPage
                inDeleteMode={inDeleteMode}
                setInDeleteMode={setInDeleteMode}
              />
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

export const StyledPage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background};
  overflow-y: scroll;
`;
