import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  ActivityType,
  TextChannel
} from 'discord.js';
import { botConfig, validateConfig } from './config/botConfig';
import { handleInteraction } from './handlers/interactionHandler';
import { reportBugCommand } from './commands/reportBug';
import { bugIdGenerator } from './utils/bugIdGenerator';

async function main() {
  try {
    validateConfig();
    console.log('✅ Configuration validated');

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds
      ]
    });

    client.once('ready', async (readyClient) => {
      console.log(`🤖 Bot is ready! Logged in as ${readyClient.user.tag}`);

      readyClient.user.setActivity('for bug reports', {
        type: ActivityType.Watching
      });

      await registerCommands();

      // Send startup reminder message
      try {
        const guild = readyClient.guilds.cache.get(botConfig.guildId);
        if (guild) {
          const channel = guild.channels.cache.get(botConfig.bugReportsChannelId) as TextChannel;
          if (channel) {
            const currentCount = bugIdGenerator.getCurrentCount();
            await channel.send({
              content: `🟢 **Bot is online!** (Bug reports tracked: ${currentCount})\n💡 **Reminder:** To create a bug report, type \`/report-bug\` and follow the instructions. Thank you for helping us improve!`
            });
            console.log(`Sent startup message to bug reports channel (Current bug count: ${currentCount})`);
          }
        }
      } catch (error) {
        console.error('Error sending startup message:', error);
      }
    });

    client.on('interactionCreate', handleInteraction);

    client.on('error', (error) => {
      console.error('Discord client error:', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
      client.destroy();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('🛑 Received SIGTERM. Gracefully shutting down...');
      client.destroy();
      process.exit(0);
    });

    await client.login(botConfig.token);

  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

async function registerCommands() {
  const commands = [reportBugCommand.data.toJSON()];

  const rest = new REST().setToken(botConfig.token);

  try {
    console.log('🔄 Started refreshing application (/) commands.');

    const data = await rest.put(
      Routes.applicationGuildCommands(botConfig.clientId, botConfig.guildId),
      { body: commands }
    ) as any[];

    console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
}

main();