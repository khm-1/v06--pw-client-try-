import { Page } from 'playwright';

export class HomePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }
}
