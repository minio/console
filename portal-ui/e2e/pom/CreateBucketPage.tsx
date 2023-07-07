import { Page, Locator } from "@playwright/test";
import { BUCKET_LIST_PAGE } from "../consts";

export class CreateBucketPage {
  page: Page;

  /* Locators */

  submitBtn: Locator | undefined;
  clearBtn: Locator | undefined;
  bucketNameInput: Locator | undefined;
  versioningToggle: Locator | undefined;
  lockingToggle: Locator | undefined;
  quotaToggle: Locator | undefined;
  bucketNamingRules: Locator | undefined;

  bucketRetentionToggle: Locator | undefined;
  quotaSizeInput: Locator | undefined;
  retentionModeRadio: Locator | undefined;
  retentionValidity: Locator | undefined;

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
    this.submitBtn = this.getLocator("#create-bucket");
    this.clearBtn = this.getLocator("#clear");
    this.versioningToggle = this.getLocator("#versioned-switch");
    this.lockingToggle = this.getLocator("#locking-switch");
    this.quotaToggle = this.getLocator("#bucket_quota-switch");
    this.bucketNamingRules = this.getLocator("#toggle-naming-rules");
    this.bucketNameInput = this.getLocator("#bucket-name");
  }

  //Lazy/Conditional selectors Note: These respective methods must be called before using them.
  onVersioningToggleOn() {
    this.bucketRetentionToggle = this.getLocator("#bucket_retention");
  }

  onBucketQuotaToggleOn() {
    this.quotaSizeInput = this.getLocator("#quota_size");
  }

  onRetentionToggleOn() {
    this.retentionModeRadio = this.getLocator("#retention_mode");
    this.retentionValidity = this.getLocator("#retention_validity");
  }

  loadPage() {
    const page = this.page;
    page.goto(BUCKET_LIST_PAGE);
  }

  async fillBucketName(bucketName: string) {
    await this.bucketNameInput?.click();
    await this.bucketNameInput?.fill(bucketName);
  }

  async toggleBucketNamingRules() {
    await this.bucketNamingRules?.click();
  }

  async toggleVersioning() {
    await this.versioningToggle?.check();
    this.onVersioningToggleOn();
    //expect to be on
  }

  async toggleObjectLocking() {
    await this.lockingToggle?.click();
    this.onVersioningToggleOn();
    this.onRetentionToggleOn();
  }

  async toggleBucketQuota() {
    await this.quotaToggle?.click();
    this.onBucketQuotaToggleOn();
  }

  async toggleRetention() {
    await this.bucketRetentionToggle?.click();
  }

  async submitForm() {
    await this.submitBtn?.click();
  }

  //Convenience Methods for easy testing

  //create a bucket without any features like versioning, locking, quota etc.
  async createBucket(bucketName: string) {
    await this.fillBucketName(bucketName);
    await this.submitForm();
  }

  //create a bucket with versioning feature
  async createVersionedBucket(bucketName: string) {
    await this.fillBucketName(bucketName);
    await this.toggleVersioning();
    await this.submitForm();
  }
  //create a bucket with locking feature

  async goToCreateBucket() {
    await this.submitBtn?.click();
  }
}
