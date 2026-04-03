# Cloudflare Assistant Setup

This repo now includes a Cloudflare Worker scaffold for the ResumAI assistant.

## What Was Added

- `wrangler.jsonc`
- `cloudflare/src/index.js`
- `npm run cf:dev`
- `npm run cf:deploy`

## Bindings Defined In Config

The Worker is configured with:

- `AI`
- `CHAT_SESSIONS`
- required secret `RESUMAI_ASSISTANT_TOKEN`

Cloudflare should read these from `wrangler.jsonc` on the next deploy.

## What To Do In Cloudflare

1. Open the Worker project connected to this repo.
2. Trigger a fresh deployment from the latest commit.
3. After deploy, open `Settings` or `Bindings` and confirm:
   - AI binding: `AI`
   - Durable Object binding: `CHAT_SESSIONS`
4. Copy the Worker URL for later frontend integration.
5. Add an environment variable to the app deployment:
   - `EXPO_PUBLIC_RESUMAI_ASSISTANT_URL`

## Local Dev

Run:

```bash
npm run cf:dev
```

Wrangler may prompt you to authenticate locally the first time.

## Current Routes

- `GET /health`
- `POST /assistant/session`
- `POST /assistant/message`

## Example Request

```json
{
  "sessionId": "optional-session-id",
  "message": "Why is my ATS score low for this role?",
  "profile": {},
  "jobDescription": "Full job description text",
  "resumeResult": {},
  "atsInsights": {}
}
```

Send the request with:

```http
Content-Type: application/json
```

## Notes

- Durable Object memory is per chat session.
- The Worker is intentionally separate from the existing Render backend.
- This is a scaffold for the assistant backend. The in-app chat UI is the next step.
- `RESUMAI_ASSISTANT_TOKEN` is optional. If you later route requests through a trusted server, you can turn auth back on.
