import { Page, Locator } from 'playwright';

export class InteractionPage {
    private page: Page;
    readonly pageUrl = 'https://the-internet.herokuapp.com/challenging_dom';

    // Locators for buttons. We'll pick the first one for the example.
    // These buttons have dynamic IDs and text, so we use a more generic selector.
    readonly primaryButton: Locator; // e.g., class 'button'
    readonly alertButton: Locator; // e.g., class 'button alert'
    readonly successButton: Locator; // e.g., class 'button success'

    // Locator for the canvas element, if we want to check if it changes.
    // However, verifying canvas changes is complex. We'll focus on clicking.
    readonly canvas: Locator;

    // Table elements to verify existence or simple properties
    readonly table: Locator;

    constructor(page: Page) {
        this.page = page;
        // Example: select the first button with class 'button'
        this.primaryButton = page.locator('.button').first();
        this.alertButton = page.locator('.button.alert').first();
        this.successButton = page.locator('.button.success').first();
        this.canvas = page.locator('#canvas');
        this.table = page.locator('table');
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.pageUrl, { waitUntil: 'networkidle' });
    }

    async clickPrimaryButton(): Promise<void> {
        await this.primaryButton.click();
    }

    async clickAlertButton(): Promise<void> {
        await this.alertButton.click();
    }

    async clickSuccessButton(): Promise<void> {
        await this.successButton.click();
    }

    async isTableVisible(): Promise<boolean> {
        return await this.table.isVisible();
    }
}
