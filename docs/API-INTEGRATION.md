# Gemini API integration

## Provider and model

The frontend currently calls Google's Gemini generate-content REST API. The endpoint and model identifier are hard-coded in src/App.jsx:

    https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

Provider model identifiers and API versions can change. Before changing the model, verify the currently supported model name, method, request schema, quotas and account availability in Google's official Gemini API documentation. Do not assume that an identifier remains available indefinitely.

## Credential source

The key is read from:

    import.meta.env.VITE_GEMINI_API_KEY

For local development, place the value in an ignored .env file. The repository includes .env.example with a placeholder. Do not put a real key in the example file.

A VITE_ prefix means Vite makes the value available to browser code. It is not a server-side secret. The current request also puts the key in the URL query string. This makes the key visible in browser network tooling and potentially in request logs. The current approach is acceptable only for a controlled demonstration using a restricted development key.

## Request shape

The current application sends a JSON body equivalent to:

    {
      "contents": [
        {
          "parts": [
            { "text": "User prompt text" }
          ]
        }
      ]
    }

The request uses Axios POST. No system instruction, conversation history, generation configuration, safety configuration, tool definition or streaming option is currently supplied by this code.

## Response extraction

The UI expects a response with a candidates array. It reads candidates[0].content.parts and concatenates the text property from each part. This is a narrow assumption about the response shape.

The application does not currently handle:

- A response with no candidates.
- A candidate with a finish reason but no text.
- Prompt feedback or provider safety blocking metadata.
- Multiple candidate selection.
- Non-text content parts.
- Usage metadata or token counts.
- Streaming chunks.
- A schema-validation failure.

A robust client should validate the response shape before updating UI state. A backend proxy should perform the same validation before returning a normalized response to the browser.

## Failure categories

| Failure | Likely cause | Recommended action |
|---|---|---|
| Missing local key | .env not configured or dev server not restarted | Set VITE_GEMINI_API_KEY and restart Vite |
| Unauthorized response | Invalid, revoked or unavailable key | Rotate/configure key and verify provider project |
| Permission or model error | Model not enabled or identifier unsupported | Check current provider documentation and project access |
| Quota or rate-limit response | Provider quota exhausted or request rate too high | Review quota, reduce usage and enforce application limits |
| Network error | Offline state, DNS, TLS or browser connectivity | Verify connectivity and retry deliberately |
| Empty response | No usable text part in first candidate | Inspect finish metadata and normalize response |
| CORS/browser rejection | Provider or browser policy blocks request | Use a server-side proxy rather than attempting to bypass browser security |

Exact status codes and error payloads are provider-controlled and can change. Inspect the actual response and official API documentation rather than assuming every error has the same shape.

## Request limits and prompt validation

The current UI trims whitespace and blocks empty input. It does not enforce a maximum prompt length, token budget, content policy or per-user quota. A browser-side limit can improve usability but is not a security boundary. Enforce authoritative limits on a backend before making provider requests.

## Safe integration direction

For a public service, the browser should call an application-owned endpoint such as POST /api/generate. The backend should authenticate or otherwise control access, validate prompt size and content, apply per-IP or per-account limits, read the provider key from server-only environment configuration, call Gemini, normalize the response and return only the data needed by the UI.

Do not add a server-side secret to a VITE_ variable. Do not log the full provider URL or key.
