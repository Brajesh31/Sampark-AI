# Troubleshooting

## npm ci fails

Confirm that Node.js and npm are installed:

    node --version
    npm --version

Use npm ci from the repository root. It installs the dependency graph recorded in package-lock.json. If the lockfile and package manifest are inconsistent, regenerate it deliberately with the project's supported npm version and commit the resulting lockfile change.

## Vite does not start

Run:

    npm run dev

Check whether the default port is already in use. Vite may select another port and print the actual URL. Open the URL shown in the terminal rather than assuming the default.

## API key is missing

Confirm that a local .env file exists and contains:

    VITE_GEMINI_API_KEY=your-restricted-development-key

Restart the Vite server after changing the file. Do not add quotes unless the key format requires them. Do not commit the real value.

## API key appears exposed

That is expected with the current browser-side architecture. VITE_ values are bundled into the client, and the current request includes the key in its query string. Rotate any exposed key and use a server-side proxy for a public deployment. Hiding the variable name or minifying JavaScript does not secure it.

## Unauthorized or permission error

Check that the key is active, belongs to the intended provider project and has access to the configured model/API. Confirm provider restrictions and current model availability in the official Gemini API documentation. Rotate a key if it may have been exposed.

## Quota or rate limit error

Review provider quota and usage. The frontend does not implement authoritative rate limiting. Avoid repeated retries in a loop. A public service needs backend limits and quota monitoring.

## Model not found or unsupported model

The model identifier is hard-coded in src/App.jsx. Provider model availability changes. Verify the current supported identifier and endpoint before changing it. Do not assume the historical gemini-1.5-flash identifier will remain available.

## Empty answer

The UI reads text parts from the first candidate only. The provider may return no candidate, a blocked response, an empty content list or a non-text response. Inspect the response shape in a safe development environment and add explicit handling if this case is common.

## Markdown looks different than expected

The app uses react-markdown without a raw HTML plugin. Markdown syntax is rendered, but raw HTML is not enabled. Do not enable arbitrary HTML rendering just to make a response look closer to the provider output without considering XSS and sanitization.

## Lint fails

Run:

    npm run lint

Fix the reported source issue rather than disabling the rule or lowering the warning threshold without a clear reason.

## Production build fails

Run:

    npm run build

Check import paths, syntax errors and dependency compatibility. The production build does not need a real Gemini API key merely to compile the frontend, but the deployed client will need the configured key under the current direct-call design.

## Deployment works but requests fail

A static deployment can serve the React application while Gemini requests fail due to key restrictions, provider quota, unsupported model, network policy or browser restrictions. Inspect the browser network response without copying credentials into an issue. For public deployment, route requests through a backend you control.
