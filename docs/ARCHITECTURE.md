# Architecture and application behavior

## 1. System overview

Sampark AI is a browser-only React application built with Vite. The browser owns the user interface, prompt state, loading state and response state. Axios sends the prompt directly to Google's Gemini generate-content endpoint. The response is rendered with react-markdown.

There is no application server, database, authentication provider, background worker or durable conversation store in the current repository.

## 2. Runtime component map

| File | Responsibility |
|---|---|
| index.html | HTML document shell, metadata and Vite entry script |
| src/main.jsx | React root creation, StrictMode and global CSS import |
| src/App.jsx | Prompt form, request lifecycle, API call, response extraction and Markdown rendering |
| src/index.css | Tailwind directives and small global utility rule |
| vite.config.js | Vite configuration and React plugin |
| tailwind.config.js | Tailwind content scanning and theme extension point |
| postcss.config.js | PostCSS processing configuration |

The application is deliberately small. Most behavior currently lives in App.jsx. This keeps the demonstration easy to follow, but it also means networking, state transitions and presentation are coupled in one component.

## 3. State model

App.jsx maintains three pieces of local state:

- question: current textarea value.
- answer: response text or a user-facing error message.
- generatingAnswer: whether a request is in progress.

There is no conversation array. A new request clears the previous answer, so the UI is not a multi-turn transcript. State is not persisted to local storage or a remote service. Reloading the page resets it.

The form disables the textarea and submit button while generating. The handler also checks the generating flag to guard against duplicate submissions. The prompt is trimmed before submission, and empty prompts are ignored.

## 4. Request lifecycle

The handler prevents the browser's default form submission. It reads the prompt and configured API key. If the prompt is empty, or a request is already running, it returns without starting another request.

If the key is absent, a configuration message is placed in the answer area and no network call is attempted. Otherwise the component enters its loading state, clears the previous answer and posts a JSON request through Axios.

The request includes one user content entry with one text part. The response handler reads the first candidate's content parts, extracts their text values, joins them with newline characters and trims the result. If the response has no usable text, the UI shows an empty-response message.

The finally block always clears the loading state. This is important because both successful requests and thrown errors must restore the form controls.

## 5. Response rendering

The answer string is passed to react-markdown. The project does not enable raw HTML parsing through a rehype raw plugin. Do not add raw HTML support casually. If rich HTML output is ever required, define a strict sanitization policy and test untrusted model output.

Markdown rendering is presentation only. It does not validate that the generated content is true, safe, appropriate or relevant.

## 6. API boundary and trust

The browser sends the request directly to the provider. The API key is read from import.meta.env and included as a query parameter. Since Vite replaces VITE_ variables in client assets, the key is observable by end users. Browser-side checks cannot enforce quotas or authorization against a determined user.

The provider response is external data. The UI should treat it as untrusted text. Do not execute generated code, HTML, URLs or shell commands based on model output.

## 7. Failure behavior

The catch block tries to display the provider's error message, then the generic JavaScript error message, then a fallback string. This gives basic feedback but does not classify failures. For example, missing quota, invalid key, blocked origin, network failure, provider outage and malformed response are not mapped to separate recovery paths.

The current component also displays the raw message supplied by the HTTP client or provider. If the app becomes public, consider mapping provider failures to safe, concise user-facing messages and keeping detailed diagnostics server-side.

## 8. Scaling the design

If the project grows beyond a single-screen demonstration, separate concerns deliberately:

- A prompt form component for input and submission.
- A response component for Markdown display.
- A Gemini client module for request construction and response parsing.
- A server-side API route for credentials, validation and abuse prevention.
- A typed error model for user-facing failure states.
- A conversation state model if multi-turn chat is introduced.
- A test suite around request parsing, error mapping and UI states.

These are future design directions, not existing modules.
