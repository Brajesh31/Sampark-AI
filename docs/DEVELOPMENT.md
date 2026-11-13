# Development guide

## Toolchain

The project uses React 18, Vite 5, Tailwind CSS 3, Axios and react-markdown. The package manifest uses npm scripts and the repository includes package-lock.json. Use npm, not an alternate package manager, when following the documented workflow.

Use a supported Node.js LTS release compatible with Vite 5. Node.js 18 or newer is the documented baseline.

## First-time setup

    git clone https://github.com/Brajesh31/Sampark-AI.git
    cd Sampark-AI
    npm ci
    cp .env.example .env

Edit .env and set VITE_GEMINI_API_KEY to a restricted development key. Restart Vite after changing environment values.

Start the local server:

    npm run dev

Vite prints the local URL. The default is usually http://localhost:5173.

## Environment handling

Vite loads environment values at startup and exposes only values with the VITE_ prefix to client-side code. That prefix is a bundling convention, not a confidentiality feature. The current Gemini key is intentionally browser-visible. Use a limited development key and never reuse a privileged key.

The .env file is ignored by Git. Keep .env.example limited to variable names and placeholder values. Do not add actual keys to screenshots, logs, bug reports or pull request descriptions.

## Code organization

The current app is a single main component. App.jsx owns the textarea value, generated answer, loading flag, request call, response extraction and display. main.jsx mounts the root. index.css imports Tailwind layers. Vite and Tailwind configuration live at the project root.

For a small fix, avoid introducing unnecessary abstraction. For a larger feature, split UI, API access and response parsing into separate modules and test them independently.

## Available scripts

    npm run dev
    npm run lint
    npm run build
    npm run preview

Use npm ci for a clean reproducible dependency install. Do not edit package-lock.json by hand.

## Lint and build

Before submitting a change, run:

    npm run lint
    npm run build

The lint command treats warnings as failures. The build command verifies Vite can produce the static bundle. Neither command proves that a real Gemini key works, that provider quotas are available or that a production deployment is secure.

## UI validation

Test at desktop and mobile widths. Verify that the textarea remains usable, the submit button disables while waiting, the loading message appears, a response is rendered, and a failed request returns the form to an enabled state. Test keyboard submission and screen-reader announcement behavior for the response region.

## Change discipline

- Keep prompts and credentials out of source code.
- Do not enable raw HTML rendering for model output without a sanitization design.
- Do not execute generated code or treat generated links as trusted.
- Keep user-facing error messages useful but avoid leaking provider details.
- Update documentation when scripts, environment variables, model names or deployment assumptions change.
