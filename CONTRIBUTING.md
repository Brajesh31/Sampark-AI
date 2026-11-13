# Contributing

Thanks for helping improve Sampark AI.

## Development setup

- Install Node.js 18 or later.
- Run `npm ci`.
- Copy `.env.example` to `.env` and configure a restricted development Gemini key.
- Run `npm run dev`.

## Before submitting

1. Keep the change focused and explain the user problem it solves.
2. Run `npm run lint` and `npm run build`.
3. Test the prompt form, loading state, API error state, and Markdown output when relevant.
4. Do not commit `.env`, API keys, tokens, or generated `dist/` files.

## Pull requests

Include a concise summary, testing evidence, screenshots for UI changes, and any known limitations. Breaking changes to environment variables or setup steps must be documented.
