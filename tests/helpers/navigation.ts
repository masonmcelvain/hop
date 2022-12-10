export function getIndexUrl(extensionId: string): string {
  return `chrome-extension://${extensionId}/index.html`;
}
