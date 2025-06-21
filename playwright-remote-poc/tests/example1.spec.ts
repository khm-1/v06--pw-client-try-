import { test, expect, Page, Browser } from '@playwright/test';
import { connectToRemoteBrowser, closeRemoteBrowser, RemoteConnection } from '../utils/playwrightHelper';
import { HomePage } from '../pages/HomePage';

// This structure is a bit different from standard Playwright test structure
// because we are manually managing the browser connection per test file or suite.

let connection: RemoteConnection | null = null;
let homePage: HomePage;

test.beforeAll(async () => {
    try {
        connection = await connectToRemoteBrowser();
        homePage = new HomePage(connection.page);
    } catch (error) {
        console.error("Failed to connect to remote browser in beforeAll:", error);
        // If connection fails, we should not proceed with tests.
        // Playwright doesn't have a direct way to skip all tests from beforeAll
        // if it throws, so tests might try to run and fail.
        // We'll ensure 'connection' remains null and tests handle this.
        connection = null;
        throw error; // Rethrow to mark the suite as failed early
    }
});

test.describe('Example 1: Navigate and Verify Title', () => {
    test('should navigate to Playwright website and check the title', async () => {
        if (!connection) {
            test.skip(true, 'Skipping test due to connection failure in beforeAll.');
            return;
        }

        const targetUrl = 'https://playwright.dev/';
        await homePage.navigateTo(targetUrl);
        const title = await homePage.getTitle();

        console.log(`Page title for ${targetUrl}: ${title}`);
        expect(title).toContain('Playwright');
    });
});

test.afterAll(async () => {
    if (connection) {
        await closeRemoteBrowser(connection);
    }
});
