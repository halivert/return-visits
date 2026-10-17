# Return visits push server

Cloudflare Worker that sends return visit reminders. It only stores push
subscriptions and `{ uuid, sendAt }` pairs, the notification text is built on
the device from its own IndexedDB.

## Setup

```sh
npm install
npx wrangler d1 create return-visits-push  # copy database_id to wrangler.jsonc
npm run db:migrate
npm run vapid                              # generates a key pair
npx wrangler secret put VAPID_PRIVATE_KEY
```

Set `VAPID_PUBLIC_KEY`, `VAPID_SUBJECT` and `ALLOWED_ORIGINS` in
`wrangler.jsonc`, then `npm run deploy`.

In the app, set `VITE_PUSH_API_URL` (the worker URL) and
`VITE_VAPID_PUBLIC_KEY` in `.env.local`, and as `PUSH_API_URL` and
`VAPID_PUBLIC_KEY` repository variables for the GitHub Pages build.

## Local development

```sh
npm run db:migrate:local
npm run vapid > .dev.vars
npm run dev
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"  # run the cron once
```

## API

- `PUT /devices/:id` with `Authorization: Bearer <token>` and
  `{ subscription, reminders: [{ uuid, sendAt }] }`. Registers the device on
  first call and replaces all its reminders.
- `DELETE /devices/:id` removes the device and its reminders.
