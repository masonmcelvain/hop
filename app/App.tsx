import * as React from "react";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import lightTheme from "../themes/light";
import darkTheme from "../themes/dark";
import LaunchPage from "./pages/LaunchPage";
import EditLinksPage from "./pages/EditLinksPage";
import AddLinkPage from "./pages/AddLinkPage";

export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  chrome.storage.sync.get("isDarkMode", ({ isDarkModeSet }) => {
    setIsDarkMode(isDarkModeSet !== true);
  });
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <MemoryRouter>
        <Switch>
          <Route exact path="/">
            <LaunchPage isDarkMode={isDarkMode} />
          </Route>
          <Route path="/edit">
            <EditLinksPage />
          </Route>
          <Route path="/add">
            <AddLinkPage />
          </Route>
        </Switch>
      </MemoryRouter>
    </ThemeProvider>
  );
}

export const StyledPage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background};
  overflow-y: scroll;
`;
