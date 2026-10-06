# 🌸 Blossoms Server Bot

Discord.js bot for the Blossoms community using Discord Components V2.

## Automatic welcome

There is **no `/welcome` command**. Every time a new member joins:

1. The bot gives them the `Unverified` role.
2. The bot posts a Blossoms welcome message in the configured Welcome channel.
3. The welcome includes the new member mention, welcome banner, member count, and navigation to rules/roles/marketplace through the configured panel controls.

## Commands

- `/rules` — posts the rules panel in the configured Rules channel.
- `/verification` — posts the verification panel in the configured Verify channel.
- `/rolepanel` — posts the role-selection panel in the configured Role Select channel.

All three commands are administrator-only. The welcome itself is **join-event only** and cannot be manually triggered.

## GitHub layout

Keep the repository clean and upload the contents of this project, not the ZIP file itself:

```text
Blossoms-Server/
├── src/
│   ├── config/
│   │   ├── bot.js
│   │   ├── components.js
│   │   └── config.js
│   └── handlers/
│       ├── panels.js
│       └── tickets.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Railway

Add the variables from `.env.example` to Railway. Never commit your real bot token to GitHub.


## Automatic welcome message

The bot automatically posts the welcome panel when a member joins, using the Discord `GuildMemberAdd` event. New members do not need a Railway account or Railway login. Railway is only used to host/run the bot. Keep the service running and enable the **Server Members Intent** under Discord Developer Portal → Bot → Privileged Gateway Intents.

The welcome panel includes Rules, Role Select, Marketplace, and Dashboard buttons. Marketplace and Dashboard are configured by default to open Discord channels `1556550884224409701` and `1556920663497900073` in the server. You can set `MARKETPLACE_URL` or `DASHBOARD_URL` to a full URL instead if needed.
