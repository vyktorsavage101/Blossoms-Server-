# 🌸 Blossoms Server Bot

Discord.js bot for **Blossoms**, built entirely around Discord **Components V2**.

## What this bot does

### 🌸 Automatic welcome
When a member joins Blossoms, the bot automatically:

1. Gives them the `Unverified` role.
2. Posts the Blossoms welcome panel in the configured Welcome channel.
3. Mentions the new member.
4. Shows the member count.
5. Displays the configured Blossoms welcome banner.

**There is no `/welcome` command.** The welcome panel is join-triggered only.

### 🎭 Role Select
The permanent role-selection panel is posted in the configured **Role Select** channel.

### 🔐 Verification
The permanent verification panel is posted in the configured **Verify** channel.

A member can open a private verification ticket. Staff can approve or deny the application.

**Approved:**
- `Community Member` is added.
- `Unverified` is removed.
- `Denied` is removed.

**Denied:**
- `Community Member` is removed.
- `Unverified` is removed.
- `Denied` is added.

### 📜 Rules
`/rules` posts the Blossoms rules panel in the configured Rules channel.

### Slash commands
- `/rules`
- `/verification`
- `/rolepanel`

All three are administrator-only. There is intentionally **no `/welcome` command**.

## Recommended repository structure

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

Do not upload `.env` or your Discord bot token to GitHub.

## Discord setup

Create these roles:

- `Community Member`
- `Unverified`
- `Denied`
- Verification Staff role

Put the bot's role above these roles.

For normal server categories, use `Community Member` as the access role. Deny View Channel to `@everyone`, `Unverified`, and `Denied`, then allow View Channel for `Community Member`.

Keep the Welcome, Role Select, and Verify channels visible to `Unverified` so new members can complete the verification flow.

The bot needs:

- Manage Roles
- Manage Channels
- View Channels
- Send Messages
- Read Message History
- Embed Links

Enable **Server Members Intent** in the Discord Developer Portal.

## Configuration

Copy `.env.example` to `.env` for local development, or add the same variables to Railway.

Required channels:

- `WELCOME_CHANNEL_ID`
- `VERIFICATION_CHANNEL_ID`
- `ROLE_SELECT_CHANNEL_ID`
- `RULES_CHANNEL_ID`
- `TICKET_CATEGORY_ID`

Required roles:

- `UNVERIFIED_ROLE_ID`
- `COMMUNITY_MEMBER_ROLE_ID`
- `DENIED_ROLE_ID`
- `VERIFICATION_STAFF_ROLE_ID`

Set `WELCOME_BANNER_URL` to the direct image URL for the Blossoms welcome banner.

## Run

```bash
npm install
npm start
```

Railway start command:

```text
npm start
```
