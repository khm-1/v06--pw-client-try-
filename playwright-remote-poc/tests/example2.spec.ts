import { test, expect } from '@playwright/test';
import { connectToRemoteBrowser, closeRemoteBrowser, RemoteConnection } from '../utils/playwrightHelper';
import { InteractionPage } from '../pages/InteractionPage';

let connection: RemoteConnection | null = null;
let interactionPage: InteractionPage;

test.beforeAll(async () => {
    try {
        connection = await connectToRemoteBrowser();
        interactionPage = new InteractionPage(connection.page);
    } catch (error) {
        console.error("Failed to connect to remote browser in beforeAll for Example 2:", error);
        connection = null;
        throw error;
    }
});

test.describe('Example 2: Interact with Elements on Challenging DOM', () => {
    test('should navigate to Challenging DOM page and click a button', async () => {
        if (!connection) {
            test.skip(true, 'Skipping test due to connection failure in beforeAll.');
            return;
        }

        await interactionPage.navigate();
        expect(await interactionPage.isTableVisible()).toBe(true);

        // We'll click the first primary button.
        // The buttons on this page change their IDs and text, so direct verification of
        // a specific outcome post-click is tricky without more complex logic.
        // For a PoC, we'll ensure the click doesn't throw an error and the page remains stable.

        const initialCanvasValue = await interactionPage.canvas.evaluate(node => (node as HTMLCanvasElement).toDataURL());

        await interactionPage.clickPrimaryButton();

        // Wait a bit for any DOM changes or scripts to run after click
        await connection.page.waitForTimeout(500);

        const newCanvasValue = await interactionPage.canvas.evaluate(node => (node as HTMLCanvasElement).toDataURL());

        // The canvas is expected to change after a button click on this page.
        // This is a basic way to check for that change.
        expect(newCanvasValue).not.toBe(initialCanvasValue);
        console.log('Primary button clicked, and canvas content appears to have changed.');

        // Optionally, click another button
        const initialUrl = connection.page.url();
        await interactionPage.clickAlertButton();
        await connection.page.waitForTimeout(500);
        // Typically, these buttons don't navigate away, but good to check.
        expect(connection.page.url()).toBe(initialUrl);
        console.log('Alert button clicked.');
    });
});

test.afterAll(async () => {
    if (connection) {
        await closeRemoteBrowser(connection);
    }
});
