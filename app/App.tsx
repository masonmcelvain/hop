import * as React from "react";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import lightTheme from "../themes/light";
import darkTheme from "../themes/dark";
import LaunchPage from "./pages/LaunchPage";
import EditLinksPage from "./pages/EditLinksPage";
import AddLinkPage from "./pages/AddLinkPage";
import { setNextStoredLinkId, setStoredLinks } from "./lib/SyncStorageLib";
import { LinkData } from "./types/CardTypes";
import { STORAGE } from "./types/StorageEnum";

export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [cards, setCards] = React.useState<LinkData[][]>([[]]);
  const [nextLinkId, setNextLinkId] = React.useState(0);

  React.useEffect(() => {
    // Set color theme from chrome storage
    chrome.storage.sync.get(STORAGE.IS_DARK_MODE_SET, (result) => {
      if (STORAGE.IS_DARK_MODE_SET in result) {
        setIsDarkMode(result[STORAGE.IS_DARK_MODE_SET]);
      } else {
        setIsDarkMode(true);
      }
    });

    // Set the next linkid from chrome storage
    chrome.storage.sync.get(STORAGE.NEXT_LINK_ID, (result) => {
      if (STORAGE.NEXT_LINK_ID in result) {
        setNextLinkId(result[STORAGE.NEXT_LINK_ID]);
      } else {
        setNextLinkId(0);
      }
    });

    // Initialize links from chrome storage
    chrome.storage.sync.get(STORAGE.STORED_LINKS, (result) => {
      if (STORAGE.STORED_LINKS in result) {
        setCards(result[STORAGE.STORED_LINKS]);
      } else {
        setStoredLinks([[]]);
      }
    });
  }, []);

  function getAndIncrementLinkId(): number {
    const currentLinkId = nextLinkId;
    setNextStoredLinkId(currentLinkId + 1);
    setNextLinkId(currentLinkId + 1);
    return currentLinkId;
  }

  function addLink(name: string, url: string, sectionIndex: number) {
    const newCards = [...cards];
    if (sectionIndex > newCards.length) {
      throw new Error(
        `Trying to insert a link into section that does not exist: ${sectionIndex}`
      );
    }
    const newLink: LinkData = {id: getAndIncrementLinkId(), name, url};
    newCards[sectionIndex].push(newLink);
    setStoredLinks(newCards);
    setCards(newCards);
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <MemoryRouter>
        <Switch>
          <Route exact path="/">
            <LaunchPage cards={cards} setCards={setCards} />
          </Route>
          <Route path="/edit">
            <EditLinksPage />
          </Route>
          <Route path="/add">
            <AddLinkPage addLink={addLink} />
          </Route>
        </Switch>
      </MemoryRouter>
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

export type addLinkType = (linkName: string, linkUrl: string, sectionIndex: number) => void;
