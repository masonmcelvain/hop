export function openLinkInThisTab(url: string): void {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.update(tabs[0].id, { url });
  });
  window.close();
}

export async function getCurrentTabUrl(): Promise<string> {
  const tab = await getCurrentTab();
  return tab.url;
}

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
