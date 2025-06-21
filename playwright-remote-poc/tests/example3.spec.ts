import { test, expect } from '@playwright/test';
import { connectToRemoteBrowser, closeRemoteBrowser, RemoteConnection } from '../utils/playwrightHelper';
import { FormPage } from '../pages/FormPage';

let connection: RemoteConnection | null = null;
let formPage: FormPage;

test.beforeAll(async () => {
    try {
        connection = await connectToRemoteBrowser();
        formPage = new FormPage(connection.page);
    } catch (error) {
        console.error("Failed to connect to remote browser in beforeAll for Example 3:", error);
        connection = null;
        throw error;
    }
});

test.describe('Example 3: Fill and Submit Form', () => {
    test('should attempt login with valid credentials and verify success', async () => {
        if (!connection) {
            test.skip(true, 'Skipping test due to connection failure in beforeAll.');
            return;
        }

        await formPage.navigate();
        // Using the known valid credentials for this site
        await formPage.login('tomsmith', 'SuperSecretPassword!');

        const isSuccess = await formPage.isLoginSuccessful();
        expect(isSuccess).toBe(true);

        const flashMessage = await formPage.getFlashMessageText();
        expect(flashMessage).toContain('You logged into a secure area!');
        console.log('Login successful with valid credentials.');
    });

    test('should attempt login with invalid credentials and verify failure message', async () => {
        if (!connection) {
            test.skip(true, 'Skipping test due to connection failure in beforeAll.');
            return;
        }

        await formPage.navigate();
        await formPage.login('wronguser', 'wrongpassword');

        const isSuccess = await formPage.isLoginSuccessful();
        expect(isSuccess).toBe(false);

        const flashMessage = await formPage.getFlashMessageText();
        expect(flashMessage).toContain('Your username is invalid!');
        console.log('Login attempt with invalid credentials showed correct error message.');
    });
});

test.afterAll(async () => {
    if (connection) {
        await closeRemoteBrowser(connection);
    }
});
