import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SeparatorBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
} from "discord.js";

import config from "./config.js";

export function v2Message(components) {
  return {
    components,
    flags: MessageFlags.IsComponentsV2,
  };
}

export function createBanner(url) {
  if (!url) return null;

  return new MediaGalleryBuilder().addItems(
    new MediaGalleryItemBuilder().setURL(url)
  );
}

export function createWelcomePanel(member, memberCount) {
  const container = new ContainerBuilder()
    .setAccentColor(0xff4f9d);

  // Keep the banner first so the welcome looks intentional on both desktop and iPhone.
  const banner = createBanner(config.banners.welcome);
  if (banner) {
    container.addMediaGalleryComponents(banner);
  }

  container
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## 🌸 WELCOME TO BLOSSOMS! 🌸\n\n` +
        `Welcome to Blossoms! We're glad to have you here, <@${member.id}>. 🌷\n\n` +
        `Whether you're here to meet new people, hang out with the community, participate in events, or simply relax, there's a place for you here.\n\n` +
        `✨ **Before you get started:**\n` +
        `📜 Read through our server rules\n` +
        `🎭 Pick your roles\n` +
        `💬 Introduce yourself and meet the community\n` +
        `🎉 Check out our events and activities\n` +
        `🛍️ Explore everything Blossoms has to offer\n\n` +
        `Please make yourself comfortable, be respectful to others, and most importantly — have fun!\n\n` +
        `🌷 Once again, welcome to Blossoms! We hope you enjoy your stay.`
      )
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**Member Count:** ${memberCount}\n` +
        `*Welcome to the community — we're happy you're here.*`
      )
    );

  return v2Message([container]);
}

export function createRolePanel() {
  const container = new ContainerBuilder()
    .setAccentColor(config.accentColor)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# 🎭 Community Roles\n` +
        `Choose the roles you'd like to receive. You can change your selections at any time.`
      )
    )
    .addSeparatorComponents(new SeparatorBuilder());

  if (config.roleOptions.length === 0) {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `Role selection is not configured yet.`
      )
    );

    return v2Message([container]);
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId("community_role_select")
    .setPlaceholder("Choose your community roles")
    .setMinValues(0)
    .setMaxValues(Math.min(config.roleOptions.length, 5))
    .addOptions(
      config.roleOptions.map((role) => ({
        label: role.name.slice(0, 100),
        value: role.id,
      }))
    );

  container.addActionRowComponents(
    new ActionRowBuilder().addComponents(menu)
  );

  return v2Message([container]);
}

export function createVerificationPanel() {
  const container = new ContainerBuilder()
    .setAccentColor(config.accentColor)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# 🔐 Server Verification\n` +
        `Welcome to ${config.serverName}.\n\n` +
        `Before you can access the rest of the server, you need to complete verification with our staff team.\n\n` +
        `### How it works\n` +
        `1. Open a verification ticket.\n` +
        `2. Answer the questions from our staff team.\n` +
        `3. Staff will approve or deny your application.\n` +
        `4. If approved, you receive **Community Member** access.`
      )
    );

  const banner = createBanner(config.banners.verification);
  if (banner) {
    container.addMediaGalleryComponents(banner);
  }

  container
    .addSeparatorComponents(new SeparatorBuilder())
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("verification_open")
          .setLabel("Open Verification Ticket")
          .setEmoji("🔐")
          .setStyle(ButtonStyle.Primary)
      )
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**Important:** You will not receive normal server access until verification is approved.`
      )
    );

  return v2Message([container]);
}

export function createTicketPanel(member) {
  const container = new ContainerBuilder()
    .setAccentColor(config.accentColor)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# 🔐 Verification Ticket\n` +
        `Welcome, <@${member.id}>.\n\n` +
        `Please wait for a verification staff member. They will review your application and tell you what information they need.\n\n` +
        `**Please do not open duplicate verification tickets.**`
      )
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("verification_approve")
          .setLabel("Approve")
          .setEmoji("✅")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("verification_deny")
          .setLabel("Deny")
          .setEmoji("❌")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("verification_close")
          .setLabel("Close Ticket")
          .setEmoji("🔒")
          .setStyle(ButtonStyle.Secondary)
      )
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**Staff:** Use Approve only after the applicant has been verified.`
      )
    );

  return v2Message([container]);
}

export function createRulesPanel() {
  const container = new ContainerBuilder()
    .setAccentColor(config.accentColor)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# 🌐 ${config.serverName} — SERVER RULES\n\n` +
        `Welcome to ${config.serverName}!\n\n` +
        `To keep our community welcoming, enjoyable, and safe for everyone, please take a moment to read and follow the rules below.`
      )
    );

  const banner = createBanner(config.banners.rules);
  if (banner) {
    container.addMediaGalleryComponents(banner);
  }

  container
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## 01 • RESPECT\n` +
        `Treat everyone with kindness and respect. Harassment, bullying, discrimination, hate speech, or targeted attacks will not be tolerated.\n\n` +
        `## 02 • NO DRAMA\n` +
        `Do not start, encourage, or spread unnecessary drama, arguments, or conflicts. Keep personal issues out of public channels.\n\n` +
        `## 03 • KEEP IT APPROPRIATE\n` +
        `Sexual, excessively graphic, NSFW, or otherwise inappropriate content is not allowed. Keep conversations suitable for the community.\n\n` +
        `## 04 • NO SPAM\n` +
        `Avoid excessive spam, excessive tagging, repeated messages, emoji spam, or unnecessary use of commands.\n\n` +
        `## 05 • NO ADVERTISING\n` +
        `Do not advertise other servers, services, social media, products, or communities without permission from the staff team.\n\n` +
        `## 06 • USE THE RIGHT CHANNEL\n` +
        `Please keep conversations in their appropriate channels and follow any channel-specific rules or instructions.`
      )
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## 07 • NO MALICIOUS ACTIVITY\n` +
        `Scamming, phishing, malicious links, threats, doxxing, account theft, or attempts to harm other members are strictly prohibited.\n\n` +
        `## 08 • RESPECT PRIVACY\n` +
        `Do not share another person's private information, messages, images, or personal details without their permission.\n\n` +
        `## 09 • LISTEN TO STAFF\n` +
        `Staff members are responsible for maintaining the community. Follow reasonable staff instructions and use the appropriate channels if you wish to appeal a moderation action.\n\n` +
        `## 10 • USE COMMON SENSE\n` +
        `Not every situation can be covered by a written rule. If something is clearly disruptive, harmful, or inappropriate, staff may take action.`
      )
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## 🌸 FINAL NOTE\n` +
        `By remaining in ${config.serverName}, you agree to follow these rules and any additional guidelines provided by the staff team.\n\n` +
        `**Have fun, meet new people, and help make ${config.serverName} a great community!**`
      )
    );

  return v2Message([container]);
}

export function createDecisionPanel(type, memberId, staffId) {
  const approved = type === "approved";

  const container = new ContainerBuilder()
    .setAccentColor(approved ? 0x57f287 : 0xed4245)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        approved
          ? `# ✅ Verification Approved\n<@${memberId}> has been approved for **Community Member** access.`
          : `# ❌ Verification Denied\n<@${memberId}>'s verification request was denied.`
      )
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `Decision made by <@${staffId}>.`
      )
    );

  return v2Message([container]);
}
