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


### Rules panel
The `/rules` command posts the Blossoms rules panel as a clean, single Components V2 card matching the supplied desktop/mobile reference layout.
