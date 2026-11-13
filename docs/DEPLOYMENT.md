# Deployment guide

## Deployment shape

Vite builds Sampark AI into static frontend assets in dist/. The current repository has no backend. It can be hosted by a static web host, but the current browser-to-Gemini design exposes the API key to visitors. A successful static deployment is not equivalent to a secure public launch.

## Build locally

Install dependencies and produce a production bundle:

    npm ci
    npm run lint
    npm run build

Inspect the generated dist/ directory. Preview it locally with:

    npm run preview

The preview command serves the already-built frontend. It does not simulate a backend or hide the browser API key.

## Static hosting

The built dist/ directory can be deployed to a static host that serves index.html and the generated assets. Configure the host to serve the application over HTTPS. If the app is hosted below a URL subpath, configure Vite's base option and test asset paths before release.

The current Vite configuration uses the default base path. The project does not define a custom router or server rewrite policy.

## Environment variable behavior

VITE_GEMINI_API_KEY is embedded into the client bundle at build time. Setting it in the hosting provider's frontend build environment does not make it secret. Anyone can inspect the resulting JavaScript and browser requests.

Do not deploy a privileged key through this variable. The recommended public deployment architecture is:

1. Browser submits a prompt to an application-owned backend endpoint.
2. Backend validates request size and shape.
3. Backend applies authentication, rate limiting and abuse controls.
4. Backend reads the Gemini key from server-only environment variables.
5. Backend calls the provider and normalizes the response.
6. Browser receives only the answer and safe status metadata.

The backend and frontend may be deployed separately. If so, configure an explicit allowed-origin policy and use HTTPS for both.

## Production checklist

- Replace direct browser-to-provider requests with a server-side proxy.
- Rotate any key exposed in source history or previous public builds.
- Configure server-side secrets outside source control.
- Apply request size limits and rate limits.
- Configure HTTPS and an explicit CORS policy on the backend.
- Review provider quotas, billing and model availability.
- Verify the application handles provider errors without leaking secrets.
- Test the deployed build from a clean browser session.
- Confirm the deployment host does not expose source maps or environment files unintentionally.
- Document a rollback procedure and monitor provider failures.

## CI scope

The existing quality workflow runs npm ci, npm run lint and npm run build. It does not deploy the site, test a live Gemini request, validate a provider key or perform security penetration testing.
