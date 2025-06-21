import { chromium, Browser, Page, BrowserContext } from 'playwright';

// const REMOTE_SERVER_URL = 'ws://35.197.149.222:9222'; // Old remote endpoint
const LOCAL_SERVER_PORT = 9223;
const LOCAL_WS_ENDPOINT = `ws://127.0.0.1:${LOCAL_SERVER_PORT}/ws`;

interface RemoteConnection {
    browser: Browser;
    context: BrowserContext;
    page: Page;
}

/**
 * Connects to a remote Playwright browser instance over CDP.
 * Note: The remote server must be launched with --remote-debugging-port=9222 (or your chosen port)
 * and allow remote origins if necessary (e.g., --remote-allow-origins=*).
 * For Playwright, it's typically launched via `playwright launch-server --port 9222 browser`
 *
 * @param options Optional parameters for new context and page.
 * @returns A promise that resolves to an object containing the browser, context, and page.
 */
export async function connectToRemoteBrowser(options?: {
    contextOptions?: Parameters<Browser['newContext']>[0];
    pageOptions?: Parameters<BrowserContext['newPage']>[0];
}): Promise<RemoteConnection> {
    try {
        console.log(`Attempting to connect to Playwright server at ${LOCAL_WS_ENDPOINT}...`);

        // This function now targets a local Playwright server,
        // typically launched via `playwright launch-server <browser> --port ${LOCAL_SERVER_PORT}`.

        const wsEndpoint = LOCAL_WS_ENDPOINT;

        // Since we don't know which browser is running on the server,
        // we might need to make this configurable or try to connect with chromium first.
        // For a PoC, chromium is a safe bet.
        const browser = await chromium.connect(wsEndpoint, {
            timeout: 30000 // 30 seconds timeout for connection
        });

        console.log('Successfully connected to Playwright server.');

        const context = await browser.newContext(options?.contextOptions);
        console.log('Browser context created.');

        const page = await context.newPage(options?.pageOptions);
        console.log('New page created.');

        return { browser, context, page };
    } catch (error) {
        console.error('Failed to connect to Playwright server or create page:', error);
        // Ensure browser is closed if connection was partially successful but later steps failed.
        // await browser?.close(); // This might cause issues if browser is undefined
        throw new Error(`Could not connect to Playwright server at ${wsEndpoint}. Is it running? Error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Closes the browser connection.
 * @param connection The Playwright connection object (includes browser instance).
 */
export async function closeRemoteBrowser(connection: RemoteConnection | null): Promise<void> {
    if (connection?.browser) {
        try {
            await connection.browser.close();
            console.log('Browser connection closed.');
        } catch (error) {
            console.error('Error closing browser connection:', error);
        }
    }
}
