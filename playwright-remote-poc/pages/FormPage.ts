import { Page, Locator } from 'playwright';

export class FormPage {
    private page: Page;
    readonly pageUrl = 'https://the-internet.herokuapp.com/login';

    // Locators
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly flashMessage: Locator; // For success or error messages
    readonly securePageHeader: Locator; // For successful login indication

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]'); // More specific selector
        this.flashMessage = page.locator('#flash');
        this.securePageHeader = page.locator('h2'); // On secure page, header is "Secure Area"
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.pageUrl, { waitUntil: 'networkidle' });
    }

    async login(username: string, password?: string): Promise<void> {
        await this.usernameInput.fill(username);
        if (password) { // Password might be optional if testing for errors with missing password
            await this.passwordInput.fill(password);
        }
        await this.loginButton.click();
    }

    async getFlashMessageText(): Promise<string | null> {
        if (await this.flashMessage.isVisible()) {
            return await this.flashMessage.textContent();
        }
        return null;
    }

    async isLoginSuccessful(): Promise<boolean> {
        // A common check is to see if the URL changed to the secure area
        // or if a specific element on the secure page is visible.
        try {
            await this.page.waitForURL('**/secure', { timeout: 3000 }); // Wait for URL to change
            const headerText = await this.securePageHeader.textContent();
            return headerText === 'Secure Area';
        } catch (error) {
            // If waitForURL times out, it means navigation didn't happen or header is not found
            return false;
        }
    }
}
