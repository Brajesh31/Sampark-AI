# Sampark AI

Sampark AI is a small React single-page application for submitting a text prompt to Google's Gemini generate-content API and displaying the generated answer as Markdown. The interface is intentionally narrow: one prompt, one response, and a visible loading state.

This repository is a frontend demonstration, not a complete conversational product. It currently has no server-side API proxy, user identity, persistent conversation history, streaming output, prompt library, moderation service or automated browser test suite.

## What it does

- Accepts a non-empty text prompt.
- Sends the prompt to the configured Gemini model using Axios.
- Displays the first candidate's text parts as Markdown.
- Shows a loading indicator while the request is active.
- Prevents a second submission while a request is in progress.
- Displays a human-readable message when configuration or the API request fails.
- Uses React 18, Vite 5 and Tailwind CSS 3.

## Stack

| Layer | Implementation |
|---|---|
| UI | React 18 |
| Development server and bundler | Vite 5 |
| Styling | Tailwind CSS 3 |
| HTTP | Axios |
| Markdown rendering | react-markdown |
| AI provider | Google Gemini generateContent REST API |
| Quality checks | ESLint and Vite production build |

## Requirements

- Node.js 18 or a compatible newer LTS release.
- npm.
- A Google AI Studio API key for local interactive use.
- Internet access to reach the Gemini API.

## Local setup

Clone the project:

    git clone https://github.com/Brajesh31/Sampark-AI.git
    cd Sampark-AI

Install the exact dependency versions recorded in the lockfile:

    npm ci

Create a local environment file:

    cp .env.example .env

Set the key in .env:

    VITE_GEMINI_API_KEY=your-restricted-development-key

Start Vite:

    npm run dev

Open the local address printed by Vite, normally http://localhost:5173.

The environment variable is read through import.meta.env.VITE_GEMINI_API_KEY. Restart the Vite server after changing the environment file.

## Available commands

| Command | Description |
|---|---|
| npm ci | Install dependencies from package-lock.json |
| npm run dev | Start the local Vite development server |
| npm run lint | Run ESLint with warnings treated as failures |
| npm run build | Generate the production bundle in dist/ |
| npm run preview | Serve the generated bundle locally for inspection |

## How a request works

1. The user types a question in the textarea.
2. The form handler trims the input and ignores an empty prompt or duplicate submission.
3. The app reads the configured Gemini key.
4. It sets the loading state and clears the previous answer.
5. Axios sends a generateContent request to the configured Gemini model.
6. The response handler collects text from the first candidate's content parts.
7. The text is stored in React state and rendered through react-markdown.
8. The loading state is cleared in the finally block.

The implementation and current response assumptions are documented in docs/ARCHITECTURE.md and docs/API-INTEGRATION.md.

## Important security limitation

The current browser application sends the Gemini request directly to Google. Vite exposes variables prefixed with VITE_ in the generated client assets. Therefore VITE_GEMINI_API_KEY is visible to anyone who can access the application. The API key is also included in the request URL query string, which can appear in browser developer tools and diagnostic logs.

Use only a restricted, low-quota development key for this client-side demonstration. Do not treat a VITE_ variable as a secret. A previously committed key was removed from the current source, but a later commit does not remove exposure from Git history. Revoke or rotate that key in Google AI Studio.

For a public deployment, move provider calls to a backend endpoint. Store the key in server-side environment configuration, validate input, enforce request limits, control allowed origins, and avoid logging secrets or full provider URLs. See docs/SECURITY-AND-OPERATIONS.md.

## Current limitations

- One prompt and one answer are held in component state.
- Refreshing the page clears the current prompt and answer.
- There is no account or authorization layer.
- There is no chat transcript or conversation context sent between requests.
- Responses are not streamed.
- The UI uses only the first candidate returned by the API.
- The model identifier is currently hard-coded in src/App.jsx.
- There is no typed response schema or dedicated error classification.
- No automated component or browser tests are currently configured.
- No backend exists to protect the provider key or enforce server-side quotas.

## Documentation

- docs/ARCHITECTURE.md: component boundaries, state, request lifecycle and data flow.
- docs/API-INTEGRATION.md: provider endpoint, request and response assumptions, and failure modes.
- docs/DEVELOPMENT.md: local setup, configuration, scripts and engineering workflow.
- docs/DEPLOYMENT.md: static hosting, build output and environment handling.
- docs/SECURITY-AND-OPERATIONS.md: key exposure, abuse controls and operational safeguards.
- docs/TESTING.md: current validation and manual test matrix.
- docs/TROUBLESHOOTING.md: common setup and API failures.

## Contributing

Read CONTRIBUTING.md before opening a pull request. Keep changes focused and include the checks you actually ran.

## License

MIT. See LICENSE.
