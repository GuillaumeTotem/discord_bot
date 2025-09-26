# Discord Bug Bot - Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm
- Discord account and server for testing

## Installation

1. Navigate to the bot directory:
```bash
cd bot
```

2. Install dependencies:
```bash
npm install
```

## Configuration

1. Create a `.env` file in the bot directory:
```
DISCORD_BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=your_test_server_id_here
BUG_REPORTS_CHANNEL_ID=your_channel_id_here
```

2. Get these values from Discord:
   - Go to https://discord.com/developers/applications
   - Create a new application or select existing one
   - Get the CLIENT_ID from "Application ID" on General Information page
   - Go to Bot section, create a bot, and copy the TOKEN
   - Get GUILD_ID by right-clicking your test server (with Developer Mode enabled)
   - Get BUG_REPORTS_CHANNEL_ID by right-clicking the channel for bug reports

## Invite Bot to Server (MUST DO BEFORE DEPLOY)

1. Go to OAuth2 > URL Generator in Discord Developer Portal
2. Select scopes: `bot`, `applications.commands`
3. Select permissions:
   - Send Messages
   - Create Public Threads
   - Send Messages in Threads
   - Embed Links
   - Attach Files
   - Use Slash Commands
4. Copy the generated URL and open it in browser
5. Select your server and authorize the bot

## Compilation

Compile TypeScript to JavaScript:
```bash
npx tsc
```

Or watch for changes during development:
```bash
npx tsc --watch
```

## Deploy Commands

Register slash commands with Discord (bot must be in server first):
```bash
npm run deploy
```

## Run the Bot

Start the bot (compiled version):
```bash
npm start
```

Or run in development mode (TypeScript directly):
```bash
npm run dev
```

## Testing

1. Invite the bot to your server:
   - Go to OAuth2 > URL Generator in Discord Developer Portal
   - Select scopes: `bot`, `applications.commands`
   - Select permissions: `Send Messages`, `Create Public Threads`, `Send Messages in Threads`, `Embed Links`, `Attach Files`
   - Use generated URL to invite bot

2. Test the `/report-bug` command in your Discord server

## File Structure
```
bot/
├── src/           # TypeScript source files
├── dist/          # Compiled JavaScript (after running tsc)
├── .env           # Environment variables (create this)
├── package.json   # Dependencies and scripts
└── tsconfig.json  # TypeScript configuration
```

## Common Issues

- **Bot not responding**: Check token in .env file
- **Commands not showing**: Run `npm run deploy` to register commands
- **Compilation errors**: Run `npx tsc` to see TypeScript errors
- **Missing channel**: Verify BUG_REPORTS_CHANNEL_ID is correct