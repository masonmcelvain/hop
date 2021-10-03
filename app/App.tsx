import * as React from "react";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import lightTheme from "../themes/light";
import darkTheme from "../themes/dark";
import LaunchPage from "./pages/LaunchPage";
import AddLinkPage from "./pages/AddLinkPage";
import { setStoredIsDarkMode, STORAGE } from "./lib/chrome/SyncStorage";
import { LinksProvider } from "./contexts/Links";

export default function App(): JSX.Element {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [inDeleteMode, setInDeleteMode] = React.useState(false);

  // Initialize state from chrome storage
  React.useEffect(() => {
    chrome.storage.sync.get(null, (result) => {
      // Set color theme
      if (STORAGE.IS_DARK_MODE_SET in result) {
        setIsDarkMode(result[STORAGE.IS_DARK_MODE_SET]);
      } else {
        setStoredIsDarkMode(isDarkMode);
      }
    });
  }, []);

  function toggleDarkMode() {
    setIsDarkMode((prevMode) => {
      setStoredIsDarkMode(!prevMode);
      return !prevMode;
    });
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <LinksProvider>
        <MemoryRouter>
          <Switch>
            <Route exact path="/">
              <LaunchPage
                inDeleteMode={inDeleteMode}
                setInDeleteMode={setInDeleteMode}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
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
