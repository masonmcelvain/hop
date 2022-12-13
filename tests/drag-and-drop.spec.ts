import { test, expect } from "@fixtures/extension";

test("can drag link right", async ({ links, pageWithLinks: page }) => {
  const [name1, name2, name3, ...rest] = links.map(({ name }) => name);
  await page
    .getByRole("link", { name: name1 })
    .dragTo(page.getByRole("link", { name: name3 }));
  await expect(page.getByRole("link")).toHaveText([
    name2,
    name3,
    name1,
    ...rest,
  ]);
});

test("can drag link left", async ({ links, pageWithLinks: page }) => {
  const [name1, name2, name3, ...rest] = links.map(({ name }) => name);
  await page
    .getByRole("link", { name: name3 })
    .dragTo(page.getByRole("link", { name: name2 }));
  await expect(page.getByRole("link")).toHaveText([
    name1,
    name3,
    name2,
    ...rest,
  ]);
});

test("can drag link up", async ({ links, pageWithLinks: page }) => {
  const [name1, name2, name3, name4, ...rest] = links.map(({ name }) => name);
  await page
    .getByRole("link", { name: name4 })
    .dragTo(page.getByRole("link", { name: name2 }));
  await expect(page.getByRole("link")).toHaveText([
    name1,
    name4,
    name2,
    name3,
    ...rest,
  ]);
});

test("can drag link down", async ({ links, pageWithLinks: page }) => {
  const [name1, name2, name3, name4, ...rest] = links.map(({ name }) => name);
  await page
    .getByRole("link", { name: name1 })
    .dragTo(page.getByRole("link", { name: name4 }));
  await expect(page.getByRole("link")).toHaveText([
    name2,
    name3,
    name4,
    name1,
    ...rest,
  ]);
});

test("can drag over empty cell", async ({ links, pageWithLinks: page }) => {
  const [name1, name2, name3, name4, ...rest] = links.map(({ name }) => name);
  await page
    .getByRole("link", { name: name1 })
    .dragTo(page.getByTestId("empty-cell").first());
  await expect(page.getByRole("link")).toHaveText([
    name2,
    name3,
    name4,
    name1,
    ...rest,
  ]);
});
