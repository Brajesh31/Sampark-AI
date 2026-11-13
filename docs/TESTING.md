# Testing and validation

## Automated checks currently configured

The GitHub Actions quality workflow installs dependencies with npm ci, runs ESLint and builds the Vite production bundle.

Run the same checks locally:

    npm ci
    npm run lint
    npm run build

These checks validate static code quality and bundling. They do not test live Gemini API availability, API credentials, provider quotas, network conditions or visual behavior in a browser.

## Current test coverage

There is no dedicated unit-test, component-test or end-to-end test framework in the current package manifest. Do not infer that the application has automated UI coverage merely because lint and build pass.

## Manual functional test matrix

| Scenario | Expected result |
|---|---|
| Initial page load | Sampark AI heading and prompt form render |
| Empty prompt | Submit control remains disabled and no request is made |
| Whitespace-only prompt | Handler ignores the trimmed empty value |
| Valid prompt with key | Loading state appears and Gemini request is sent |
| Request in progress | Textarea and submit button are disabled |
| Successful response | Text parts from the first candidate are joined and rendered as Markdown |
| Empty candidate text | Friendly empty-response message appears |
| Missing key | Configuration guidance is shown without a network request |
| Invalid key | API failure is displayed and loading state clears |
| Offline browser | Network error is displayed and form becomes usable again |
| Repeated submission | UI prevents ordinary duplicate submission while loading |
| Narrow viewport | Form and response remain readable without horizontal overflow |
| Keyboard use | Textarea and submit button are reachable and operable |
| Markdown content | Headings, lists and code blocks render as formatted content |

## Suggested automated test layers

A future test suite can use Vitest with React Testing Library and a mocked Axios client. Keep provider requests out of unit tests.

Recommended cases:
- Prompt trimming and empty prompt behavior.
- Missing API key handling.
- Loading state transitions.
- Successful extraction of one or multiple text parts.
- Missing candidates and empty parts.
- Axios rejection and provider error mapping.
- Ensuring loading resets after both success and failure.
- Keyboard form submission and disabled controls.
- Markdown rendering for headings, lists, links and code blocks.

For end-to-end testing, use a mocked application API rather than a real provider key. A real-provider smoke test should be separate, manually triggered, rate-limited and configured with a dedicated restricted test credential.

## CI interpretation

A green lint/build workflow means the source passes the configured ESLint rules and Vite can create a bundle. It does not prove production credential safety or provider integration correctness.
