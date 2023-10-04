import { Page, Locator } from "@playwright/test";
import { BUCKET_LIST_PAGE } from "../consts";

export class BucketsListPage {
  page: Page;

  /* Locators */

  createBucketBtn: Locator | undefined;
  refreshBucketsBtn: Locator | undefined;
  setReplicationBtn: Locator | undefined;

  bucketListItemPrefix = "#manageBucket-";

  constructor(page: Page) {
    this.page = page;
    this.initLocators();
  }
  getLocator(selector: string): Locator {
    const page = this.page;
    const locator: Locator = page.locator(`${selector}`);
    return locator;
  }

  initLocators() {
    this.createBucketBtn = this.getLocator("#create-bucket");
    this.refreshBucketsBtn = this.getLocator("#refresh-buckets");
    this.setReplicationBtn = this.getLocator("#set-replication");
  }

  locateBucket(bucketName: string): Locator {
    const bucketRow = this.getLocator(
      `${this.bucketListItemPrefix}${bucketName}`,
    );
    return bucketRow;
  }

  async clickOnBucketRow(bucketName: string) {
    const bucketRow = this.locateBucket(bucketName);
    await this.page.waitForTimeout(2500);
    await this.refreshBucketsBtn.click();
    await bucketRow.click();
  }
  async goToCreateBucket() {
    await this.createBucketBtn?.click();
  }

  async isBucketExist(bucketName: string) {
    const existBukCount = await this.locateBucket(bucketName).count();

    return existBukCount;
  }

  async loadPage() {
    const page = this.page;
    await page.goto(BUCKET_LIST_PAGE);
  }
}
