# Agent Instructions for playwright-remote-poc

This project is a Proof of Concept (PoC) for running Playwright tests. It is now configured to connect to a **local** Playwright server instance.

## Local Server Connection Details

-   **IP Address:** `127.0.0.1` (localhost)
-   **Port:** `9223` (configurable in `utils/playwrightHelper.ts`)
-   **Expected Endpoint:** `ws://127.0.0.1:9223/ws`

The tests in this project are configured to connect to this local server.

The utility `utils/playwrightHelper.ts` handles the connection logic. It assumes the local server is launched using a command like `playwright launch-server <browser_name> --port 9223`.

## Setting Up and Running Tests

1.  **Prerequisites:**
    *   Node.js and npm installed.
    *   Playwright installed (either globally or as a project dependency).
    *   Project dependencies installed:
        ```bash
        cd playwright-remote-poc
        npm install
        ```

2.  **Launch the local Playwright Server:**
    Open a separate terminal window and run:
    ```bash
    npx playwright launch-server chromium --port 9223
    ```
    *   Replace `chromium` with `firefox` or `webkit` if desired (ensure `playwrightHelper.ts` uses the corresponding `browserType.connect()` method if you change the browser).
    *   The `--port 9223` should match the port configured in `utils/playwrightHelper.ts`.
    *   Keep this server running while you execute the tests.

3.  **Execute tests:**
    In your project directory (`playwright-remote-poc`), run:
    ```bash
    npm test
    # or
    npx playwright test
    ```

## Important Considerations

*   **Dependency Installation:** The `npm install` step is crucial. The development of this PoC initially faced issues with this step in the agent's environment. Ensure dependencies are correctly installed in your local environment.
*   **Browser Type for Server:** The `playwrightHelper.ts` currently defaults to using `chromium.connect()`. If you launch a local server with a different browser (e.g., Firefox, WebKit), the helper must be adjusted (e.g., use `firefox.connect()` or `webkit.connect()`).
*   **Error Handling:** The tests include basic error handling for connection failures. If the local server is not running or accessible, tests should indicate this.

This PoC demonstrates the structure and core logic for Playwright testing with a configurable server connection.
