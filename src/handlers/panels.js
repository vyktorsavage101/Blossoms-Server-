import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
} from "discord.js";

import config from "../config/config.js";
import {
  createRolePanel,
  createRulesPanel,
  createVerificationPanel,
  createWelcomePanel,
  v2Message,
} from "../config/components.js";
import {
  approveMember,
  createVerificationTicket,
  denyMember,
  closeTicket,
} from "./tickets.js";

export async function sendWelcome(member) {
  const channel = await member.guild.channels
    .fetch(config.channels.welcome)
    .catch(() => null);

  if (!channel?.isTextBased()) return;

  await channel.send(createWelcomePanel(member, member.guild.memberCount));
}

export async function sendRules(channel) {
  await channel.send(createRulesPanel());
}

export async function sendVerification(channel) {
  await channel.send(createVerificationPanel());
}

export async function sendRolePanel(channel) {
  await channel.send(createRolePanel());
}

function isVerificationStaff(interaction) {
  return (
    interaction.memberPermissions?.has("Administrator") ||
    interaction.member?.roles?.cache?.has(config.roles.verificationStaff)
  );
}

export async function handleButton(interaction) {
  const id = interaction.customId;

  if (id === "welcome_rules") {
    if (config.links.rules) {
      await interaction.reply({
        content: `Rules: ${config.links.rules}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `The rules link has not been configured yet.`,
        ephemeral: true,
      });
    }
    return;
  }

  if (id === "welcome_marketplace") {
    if (config.links.marketplace) {
      await interaction.reply({
        content: `Marketplace: ${config.links.marketplace}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `The marketplace link has not been configured yet.`,
        ephemeral: true,
      });
    }
    return;
  }

  if (id === "welcome_roles") {
    await interaction.reply({
      ...createRolePanel(),
      ephemeral: true,
    });
    return;
  }

  if (id === "verification_open") {
    await createVerificationTicket(interaction);
    return;
  }

  if (
    ["verification_approve", "verification_deny", "verification_close"].includes(
      id
    )
  ) {
    if (!isVerificationStaff(interaction)) {
      await interaction.reply({
        content: "You do not have permission to use this verification control.",
        ephemeral: true,
      });
      return;
    }

    const topic = interaction.channel.topic || "";
    const match = topic.match(/^verification:(\d+)$/);

    if (!match) {
      await interaction.reply({
        content: "This does not appear to be a verification ticket.",
        ephemeral: true,
      });
      return;
    }

    const memberId = match[1];

    if (id === "verification_approve") {
      await interaction.deferUpdate();
      const member = await interaction.guild.members.fetch(memberId);
      await approveMember(interaction, member);
      return;
    }

    if (id === "verification_deny") {
      await interaction.deferUpdate();
      const member = await interaction.guild.members.fetch(memberId);
      await denyMember(interaction, member);
      return;
    }

    if (id === "verification_close") {
      await interaction.deferUpdate();
      await closeTicket(interaction.channel, `Closed by <@${interaction.user.id}>.`);
    }
  }
}

export async function handleRoleSelect(interaction) {
  if (interaction.customId !== "community_role_select") return;

  const member = interaction.member;
  const allowedIds = new Set(config.roleOptions.map((role) => role.id));
  const selected = new Set(interaction.values);

  for (const role of config.roleOptions) {
    if (!allowedIds.has(role.id)) continue;

    if (selected.has(role.id)) {
      await member.roles.add(role.id, "Community role selection");
    } else if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role.id, "Community role selection");
    }
  }

  await interaction.reply({
    content:
      interaction.values.length > 0
        ? `Your community roles have been updated.`
        : `Your community role selections have been cleared.`,
    ephemeral: true,
  });
}
