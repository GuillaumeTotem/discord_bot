import { config } from 'dotenv';

config();

export const botConfig = {
  token: process.env.DISCORD_BOT_TOKEN!,
  clientId: process.env.CLIENT_ID!,
  guildId: process.env.GUILD_ID!,
  bugReportsChannelId: process.env.BUG_REPORTS_CHANNEL_ID!,
  isDevelopment: process.env.NODE_ENV === 'development'
};

export function validateConfig() {
  const required = [
    'DISCORD_BOT_TOKEN',
    'CLIENT_ID',
    'GUILD_ID',
    'BUG_REPORTS_CHANNEL_ID'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}