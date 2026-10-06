# Blossoms Verification Bot

A clean Discord.js bot for the Blossoms community built around **Discord Components V2**.

## Included

- Automatic welcome message in a designated welcome channel.
- Welcome message mentions the new member.
- Member count displayed at the bottom of the panel as a visual footer.
- Welcome banner at the top.
- Rules button.
- Marketplace button.
- Role-selection dropdown.
- Verification panel with a private ticket button.
- New members automatically receive `Unverified`.
- Staff can approve or deny a verification ticket.
- Approval:
  - Gives `Community Member`
  - Removes `Unverified`
  - Removes `Denied`
  - Gives access to the normal server channels through Discord permissions.
- Denial:
  - Removes `Community Member`
  - Removes `Unverified`
  - Gives `Denied`
  - Denied members remain unable to see the normal server.
- `/rules`
- `/verification`
- `/welcome`
- `/rolepanel`
- Verification logs.
- Ticket cleanup after a decision.
- No traditional Discord embeds are used by the bot's panels. The UI is built with Components V2.

## IMPORTANT: Discord permissions

The bot cannot make a member "not see the server" by itself. Discord channel/category permissions control visibility.

Set your server up like this:

### Roles

Create:

1. `Community Member`
2. `Unverified`
3. `Denied`
4. Your verification staff role

Put the bot's role above these roles.

### Normal server channels/categories

For every normal server category:

- `@everyone` -> Deny `View Channel`
- `Community Member` -> Allow `View Channel`
- `Unverified` -> Deny `View Channel`
- `Denied` -> Deny `View Channel`

This makes `Community Member` the access gate.

### Welcome / verification area

For the welcome and verification channels:

- `@everyone` -> Allow `View Channel` if desired
- `Unverified` -> Allow `View Channel`
- `Community Member` -> Allow `View Channel`
- `Denied` -> Decide whether you want them to retain access

The recommended setup is to allow `Unverified` to see the welcome and verification area.

### Ticket category

The bot creates each verification ticket with explicit permissions for:

- the applicant
- the verification staff role
- the bot

The ticket creator will not be able to see other tickets.

## Bot permissions

Give the bot:

- Manage Roles
- Manage Channels
- View Channels
- Send Messages
- Embed Links
- Read Message History

No Message Content Intent is required.

Enable **Server Members Intent** in the Discord Developer Portal.

## Install

```bash
npm install
```

Copy `.env.example` to `.env`, then fill in the values.

Run:

```bash
npm start
```

## Railway

Use:

```text
npm start
```

Add the `.env` values as Railway Variables.

Do not upload `.env` to GitHub.

## Slash commands

The bot registers:

- `/rules`
- `/verification`
- `/welcome`
- `/rolepanel`

They are administrator-only.

## First setup

1. Create the roles.
2. Configure category/channel permissions.
3. Create a verification ticket category.
4. Create a welcome channel.
5. Create a verification channel.
6. Create a rules channel.
7. Fill in `.env`.
9. Start the bot.
10. Run `/verification` in the verification channel.
11. Run `/rolepanel` in the role-selection channel.
12. Run `/rules` in the rules channel.
13. Run `/welcome` in the welcome channel if you want to manually repost it.

New members will automatically get `Unverified` and receive the welcome panel.

## Components V2

This project intentionally uses:

- ContainerBuilder
- TextDisplayBuilder
- MediaGalleryBuilder
- SeparatorBuilder
- ButtonBuilder
- StringSelectMenuBuilder
- MessageFlags.IsComponentsV2

There are no traditional EmbedBuilder panels in this project.
