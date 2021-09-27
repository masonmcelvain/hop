import * as React from "react";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import lightTheme from "../themes/light";
import darkTheme from "../themes/dark";
import LaunchPage from "./pages/LaunchPage";
import AddLinkPage from "./pages/AddLinkPage";
import {
  setNextStoredLinkId,
  setStoredIsDarkMode,
  setStoredLinks,
} from "./lib/chrome/SyncStorage";
import { LinkData } from "./types/CardTypes";
import { STORAGE } from "./types/StorageEnum";

export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [nextLinkId, setNextLinkId] = React.useState(0);
  const [cards, setCards] = React.useState<LinkData[][]>([[]]);
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

      // Set the next linkid
      if (STORAGE.NEXT_LINK_ID in result) {
        setNextLinkId(result[STORAGE.NEXT_LINK_ID]);
      } else {
        setNextLinkId(nextLinkId);
      }

      // Initialize links
      if (STORAGE.STORED_LINKS in result) {
        setCards(result[STORAGE.STORED_LINKS]);
      } else {
        setStoredLinks(cards);
      }
    });
  }, []);

  function getAndIncrementLinkId(): number {
    const currentLinkId = nextLinkId;
    setNextStoredLinkId(currentLinkId + 1);
    setNextLinkId(currentLinkId + 1);
    return currentLinkId;
  }

  function addLink(name: string, url: string, sectionIndex: number, imageUrl: string) {
    const newCards: LinkData[][] = JSON.parse(JSON.stringify(cards));
    if (sectionIndex > newCards.length) {
      throw new Error(
        `Trying to insert a link into section that does not exist: ${sectionIndex}`
      );
    }
    const newLink: LinkData = {
      id: getAndIncrementLinkId(),
      name,
      url,
      imageUrl,
    };
    newCards[sectionIndex].push(newLink);
    setStoredLinks(newCards);
    setCards(newCards);
  }

  function addImageUrl(url: string, id: number) {
    const newCards: LinkData[][] = JSON.parse(JSON.stringify(cards));
    let returnEarly = false;

    newCards.forEach((section, i) => {
      section.forEach((card, j) => {
        if (card.id === id) {
          newCards[i][j].imageUrl = url;
          returnEarly = true;
          return;
        }
      });
      if (returnEarly) {
        return;
      }
    });

    setStoredLinks(newCards);
    setCards(newCards);
  }

  function deleteLink(cellIndex: number, gridIndex: number) {
    const newCards: LinkData[][] = JSON.parse(JSON.stringify(cards));
    newCards[gridIndex].splice(cellIndex, 1);
    setStoredLinks(newCards);
    setCards(newCards);
  }

  function toggleDarkMode() {
    setIsDarkMode((prevMode) => {
      setStoredIsDarkMode(!prevMode);
      return !prevMode;
    });
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <MemoryRouter>
        <Switch>
          <Route exact path="/">
            <LaunchPage
              cards={cards}
              setCards={setCards}
              inDeleteMode={inDeleteMode}
              setInDeleteMode={setInDeleteMode}
              deleteLink={deleteLink}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              addImageUrl={addImageUrl}
            />
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

export type addLinkType = (
  linkName: string,
  linkUrl: string,
  sectionIndex: number,
  imageUrl: string
) => void;

export type addImageUrlType = (
  url: string,
  id: number,
) => void;
