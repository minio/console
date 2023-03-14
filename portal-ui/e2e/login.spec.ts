import { test, expect } from "@playwright/test";

test("Basic `minioadmin` Login", async ({ page, context }) => {
  await page.goto("http://localhost:5005");
  await page.getByPlaceholder("Username").click();
  await page.getByPlaceholder("Username").fill("minioadmin");
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill("minioadmin");
  await page.getByRole("button", { name: "Login" }).click();
  await context.storageState({ path: "storage/minioadmin.json" });
  await expect(page.getByRole("main").getByText("Object Browser")).toBeTruthy();
});
