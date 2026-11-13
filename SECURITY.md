# Security Policy

## Reporting

Do not report vulnerabilities by posting API keys, tokens, or exploit details in a public issue. Use GitHub private vulnerability reporting for this repository if enabled. Otherwise, contact the repository owner privately through the GitHub profile.

## API key handling

- Never commit `.env` files or real API keys.
- The current frontend uses a `VITE_*` variable. Vite embeds such values in browser assets, so the key is visible to users.
- Use only a restricted development key in this client-side demo.
- For production, proxy Gemini requests through a backend and store the key only on the server.
- Revoke or rotate any key that has appeared in source control. A new commit does not remove historical exposure.
