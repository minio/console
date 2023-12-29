import { Page, Locator } from "@playwright/test";

export class BucketSummaryPage {
  page: Page;
  bucketName: string;

  /* Locators */
  deleteBucketBtn: Locator | undefined;

  constructor(page: Page, bucketName: string) {
    this.page = page;
    this.bucketName = bucketName;

    this.initLocators();
  }
  getLocator(selector: string): Locator {
    const page = this.page;
    const locator: Locator = page.locator(`${selector}`);
    return locator;
  }

  initLocators() {
    this.deleteBucketBtn = this.getLocator("#delete-bucket-button");
  }

  async loadPage() {
    await this.clickOnTab(`Summary`);
  }

  async clickOnTab(tabID: string) {
    await this.getLocator(`#${tabID}`).click();

    // await page.goto(`${BUCKET_LIST_PAGE}/${this.bucketName}/admin/${tabName}`);
  }

  async confirmDeleteBucket() {
    await this.getLocator("#delete-bucket-button").click();
    await this.getLocator("#confirm-ok").click();
  }

  async getObjectVersionOption() {
    await this.page.getByRole("button", { name: "Add Lifecycle Rule" }).click();
    return this.getLocator("#object_version-select > div").nth(0);
  }
}
