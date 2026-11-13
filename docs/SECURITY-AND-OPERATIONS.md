# Security and operational considerations

## Threat model

Sampark AI accepts arbitrary text from a browser user and sends it to an external generative AI provider. The current design has no application server, authentication, persistent user data or authoritative usage controls.

The most important current risk is credential exposure: the Gemini key is delivered to every browser because it is read from a VITE_ variable and used in a direct provider request.

## API key exposure

Vite replaces VITE_-prefixed environment variables in client code during the build. The resulting value can be inspected in downloaded assets and browser network tools. The request also places the key in the URL query string. Query strings can be captured by diagnostics, proxies or logs.

Use a low-privilege development key only. Restrict it at the provider where possible. Revoke and rotate any key that has been committed or included in a publicly accessible build. Removing a key from the latest source does not erase old Git commits, forks, caches or distributed artifacts.

A production architecture should call an application backend. The backend stores the provider key in server-only configuration and never returns it to the browser.

## Abuse and cost control

The current client has no reliable per-user quota, server-side prompt limit or rate limiter. Disabling a button in React prevents ordinary accidental double clicks, but it does not prevent scripted requests or direct calls to a visible provider key.

A backend should enforce:
- Authentication or an explicit anonymous-use policy.
- Per-account and per-IP rate limits.
- Prompt byte and token-size limits.
- Request timeouts and concurrency limits.
- Provider quota monitoring and budget alerts.
- Abuse detection and an operational shutdown switch.

## Prompt and response trust

Prompts are user-controlled. Model responses are external generated content and may be incorrect, misleading or unsafe. The UI renders Markdown using react-markdown. Do not enable raw HTML rendering without a deliberate sanitization strategy.

Never automatically execute generated code, shell commands, SQL, browser scripts or links. Treat generated instructions as suggestions requiring independent review.

## Privacy

The prompt is transmitted to Google Gemini. Do not ask users to enter passwords, access tokens, payment details, private health information or other sensitive data unless the application has a reviewed data-handling policy and appropriate provider configuration.

The current application does not persist prompts or answers in a database. However, the provider receives submitted prompt content, and browser/network tooling may retain request diagnostics. Do not claim that prompts are never stored by the provider without checking the provider's current terms and configuration.

## Operational monitoring

A backend implementation should record request identifiers, latency, response status and aggregate usage without recording API keys or unnecessary prompt content. Apply retention limits and access controls to operational logs.

## Incident response

If a key is exposed:
1. Revoke or rotate it in the provider console immediately.
2. Identify the affected commits and published builds.
3. Remove the key from current source and deployment configuration.
4. Deploy a new version using server-side secret storage.
5. Review provider usage and billing for unexpected activity.
6. Document the incident and prevent recurrence with secret scanning.

## Current readiness

The current repository is suitable as a learning/demo frontend. It should not be represented as a secure multi-user public AI service until a backend proxy, abuse controls, credential protection and privacy review are implemented.
