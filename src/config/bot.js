import {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
  REST,
  Routes,
  Events,
} from "discord.js";

import config from "./config.js";
import {
  handleButton,
  handleRoleSelect,
  sendRolePanel,
  sendRules,
  sendVerification,
  sendWelcome,
} from "../handlers/panels.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

const commands = [
  {
    name: "rules",
    description: "Post the Blossoms server rules panel.",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  {
    name: "verification",
    description: "Post the verification ticket panel.",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  {
    name: "welcome",
    description: "Post the welcome panel.",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  {
    name: "rolepanel",
    description: "Post the community role-selection panel.",
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
];

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`READY — ${readyClient.user.tag}`);
  console.log(`Registering ${commands.length} commands...`);

  const rest = new REST({ version: "10" }).setToken(config.token);

  await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: commands }
  );

  console.log(
    `Registered: ${commands.map((command) => `/${command.name}`).join(", ")}`
  );
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    await member.roles.add(
      config.roles.unverified,
      "New member verification gate"
    );

    if (member.roles.cache.has(config.roles.denied)) {
      await member.roles.remove(
        config.roles.denied,
        "New member entered verification flow"
      );
    }

    await sendWelcome(member);

    console.log(`Welcome sent for ${member.user.tag}`);
  } catch (error) {
    console.error("GuildMemberAdd error:", error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({
          content: "You must be an administrator to use this command.",
          ephemeral: true,
        });
        return;
      }

      if (interaction.commandName === "rules") {
        const channel = await interaction.guild.channels.fetch(
          config.channels.rules
        );
        await sendRules(channel);
        await interaction.reply({
          content: `Rules panel posted in <#${channel.id}>.`,
          ephemeral: true,
        });
        return;
      }

      if (interaction.commandName === "verification") {
        const channel = await interaction.guild.channels.fetch(
          config.channels.verification
        );
        await sendVerification(channel);
        await interaction.reply({
          content: `Verification panel posted in <#${channel.id}>.`,
          ephemeral: true,
        });
        return;
      }

      if (interaction.commandName === "welcome") {
        const channel = await interaction.guild.channels.fetch(
          config.channels.welcome
        );
        await sendWelcome(interaction.member);
        await interaction.reply({
          content: `Welcome panel posted in <#${channel.id}>.`,
          ephemeral: true,
        });
        return;
      }

      if (interaction.commandName === "rolepanel") {
        const channel = await interaction.guild.channels.fetch(
          config.channels.verification
        );
        await sendRolePanel(channel);
        await interaction.reply({
          content: `Role-selection panel posted in <#${channel.id}>.`,
          ephemeral: true,
        });
        return;
      }
    }

    if (interaction.isButton()) {
      await handleButton(interaction);
      return;
    }

    if (interaction.isStringSelectMenu()) {
      await handleRoleSelect(interaction);
    }
  } catch (error) {
    console.error("Interaction error:", error);

    const payload = {
      content: "Something went wrong while processing that action.",
      ephemeral: true,
    };

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(payload).catch(() => {});
    } else {
      await interaction.reply(payload).catch(() => {});
    }
  }
});

client.on("error", (error) => {
  console.error("Discord client error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

client.login(config.token);
