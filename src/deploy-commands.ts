import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { reportBugCommand } from './commands/reportBug';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  reportBugCommand.data.toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID),
        { body: commands }
      );
      console.log(`Successfully registered commands for guild ${process.env.GUILD_ID}`);
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID!),
        { body: commands }
      );
      console.log('Successfully registered global commands (may take up to 1 hour to propagate)');
    }
  } catch (error) {
    console.error(error);
  }
})();