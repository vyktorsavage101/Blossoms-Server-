import {
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";

import config from "../config/config.js";
import {
  createDecisionPanel,
  createTicketPanel,
  v2Message,
} from "../config/components.js";

function ticketName(user) {
  const clean = user.username
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 20);

  return `verify-${clean || user.id.slice(-6)}`;
}

export async function findExistingTicket(guild, userId) {
  const category = await guild.channels.fetch(config.channels.ticketCategory);

  if (!category) return null;

  return guild.channels.cache.find(
    (channel) =>
      channel.parentId === category.id &&
      channel.type === ChannelType.GuildText &&
      channel.topic?.includes(`verification:${userId}`)
  );
}

export async function createVerificationTicket(interaction) {
  const guild = interaction.guild;
  const member = interaction.member;

  const existing = await findExistingTicket(guild, member.id);

  if (existing) {
    await interaction.reply({
      content: `You already have an open verification ticket: <#${existing.id}>`,
      ephemeral: true,
    });
    return;
  }

  const category = await guild.channels.fetch(config.channels.ticketCategory);

  if (!category || category.type !== ChannelType.GuildCategory) {
    throw new Error("TICKET_CATEGORY_ID does not point to a category.");
  }

  const channel = await guild.channels.create({
    name: ticketName(member.user),
    type: ChannelType.GuildText,
    parent: category.id,
    topic: `verification:${member.id}`,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: member.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AttachFiles,
        ],
      },
      {
        id: config.roles.verificationStaff,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageMessages,
        ],
      },
      {
        id: interaction.client.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.ManageMessages,
        ],
      },
    ],
  });

  await channel.send(createTicketPanel(member));

  await interaction.reply({
    content: `Your verification ticket has been created: <#${channel.id}>`,
    ephemeral: true,
  });

  return channel;
}

export async function closeTicket(channel, reason = "Ticket closed.") {
  await channel.send(
    v2Message([
      new (await import("discord.js")).ContainerBuilder()
        .setAccentColor(config.accentColor)
        .addTextDisplayComponents(
          new (await import("discord.js")).TextDisplayBuilder().setContent(
            `# 🔒 Ticket Closed\n${reason}\n\nThis channel will be deleted in 5 seconds.`
          )
        ),
    ])
  );

  setTimeout(async () => {
    try {
      await channel.delete("Verification ticket closed");
    } catch {}
  }, 5000);
}

export async function approveMember(interaction, ticketMember) {
  const guildMember = await interaction.guild.members.fetch(ticketMember.id);

  await guildMember.roles.add(config.roles.communityMember, "Verification approved");
  await guildMember.roles.remove(config.roles.unverified, "Verification approved");

  if (guildMember.roles.cache.has(config.roles.denied)) {
    await guildMember.roles.remove(config.roles.denied, "Verification approved");
  }

  await interaction.channel.send(
    createDecisionPanel("approved", guildMember.id, interaction.user.id)
  );

  await logDecision(interaction, guildMember, "APPROVED");

  try {
    await guildMember.send(
      `Your verification for **${config.serverName}** has been approved. You now have Community Member access.`
    );
  } catch {}

  await closeTicket(interaction.channel, "Verification approved.");
}

export async function denyMember(interaction, ticketMember) {
  const guildMember = await interaction.guild.members.fetch(ticketMember.id);

  if (guildMember.roles.cache.has(config.roles.communityMember)) {
    await guildMember.roles.remove(
      config.roles.communityMember,
      "Verification denied"
    );
  }

  if (guildMember.roles.cache.has(config.roles.unverified)) {
    await guildMember.roles.remove(
      config.roles.unverified,
      "Verification denied"
    );
  }

  await guildMember.roles.add(config.roles.denied, "Verification denied");

  await interaction.channel.send(
    createDecisionPanel("denied", guildMember.id, interaction.user.id)
  );

  await logDecision(interaction, guildMember, "DENIED");

  try {
    await guildMember.send(
      `Your verification for **${config.serverName}** has been denied. If you believe this was a mistake, contact the server staff team.`
    );
  } catch {}

  await closeTicket(interaction.channel, "Verification denied.");
}

async function logDecision(interaction, member, decision) {
  if (!config.channels.staffLog) return;

  const channel = await interaction.guild.channels
    .fetch(config.channels.staffLog)
    .catch(() => null);

  if (!channel?.isTextBased()) return;

  await channel.send({
    content:
      `**Verification ${decision}**\n` +
      `Member: <@${member.id}> (${member.user.tag})\n` +
      `Staff: <@${interaction.user.id}>\n` +
      `Ticket: <#${interaction.channel.id}>`,
  });
}
