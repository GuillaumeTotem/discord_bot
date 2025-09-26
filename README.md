# Discord Bug Reporter Bot

A Discord bot that streamlines bug reporting by collecting structured information and automatically creating dedicated threads for each bug report.

## Features

- **Slash Command**: `/report-bug` with optional screenshot upload
- **Interactive Modal**: Collects all required bug details
- **Automatic Threading**: Creates organized threads for each bug
- **Rich Embeds**: Professionally formatted bug reports
- **Discord-Native Storage**: No external database required
- **File Validation**: Supports images and videos up to 25MB

## Required Fields

- **Title**: Brief bug summary
- **Description**: Detailed steps to reproduce
- **OS**: Windows or MacOS
- **Architecture**: x86, x64, or arm
- **Frequency**: Always, Occasional, or Rare
- **Version**: Software version and branch
- **Screenshot**: Optional visual evidence

## Quick Local Testing Setup

### 1. Minimal Discord Bot Setup (2 minutes)

**Why you need this**: Discord requires a bot token (like an API key) - no approval needed!

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Enter any name → "Create"
3. Go to "Bot" tab → "Add Bot" → "Yes, do it!"
4. **Copy the Token** (click "Copy" - keep this secret!)
5. Go to "OAuth2" → "URL Generator"
6. Check boxes: `bot` + `applications.commands`
7. Check permissions: `Send Messages`, `Create Public Threads`, `Manage Threads`, `Embed Links`, `Attach Files`, `Use Slash Commands`
8. **Copy the Generated URL** at bottom
9. **Paste URL in browser** → Select your test server → "Authorize"

**Done!** Your bot is now in your server (offline until you run the code).

### 2. Run the Bot Locally

**Open terminal/command prompt in the bot folder:**
```bash
cd C:\Code\istripper_dev\bot
```

**Set up environment:**
```bash
# Copy the example environment file
copy .env.example .env

# Edit .env file with your info
notepad .env
```

**Fill in your `.env` file:**
```env
DISCORD_BOT_TOKEN=paste_your_bot_token_here
CLIENT_ID=your_application_id_from_developer_portal
GUILD_ID=your_test_server_id
BUG_REPORTS_CHANNEL_ID=your_test_channel_id
NODE_ENV=development
```

**Get the missing IDs:**
- **CLIENT_ID**: Discord Developer Portal → Your App → General Information → Application ID
- **GUILD_ID**: Right-click your server name → "Copy Server ID" (enable Developer Mode in Discord settings first)
- **BUG_REPORTS_CHANNEL_ID**: Right-click any channel → "Copy Channel ID"

**Install and run:**
```bash
# Install dependencies
npm install

# Build and start
npm run build
npm start
```

**Success!** You should see: `🤖 Bot is ready! Logged in as YourBotName#1234`

### 3. Test the Bot

1. In your Discord server, type `/report-bug`
2. Optionally attach a screenshot
3. Fill out the modal form
4. Select frequency from dropdown
5. Bot should create a thread with your bug report!

**If `/report-bug` doesn't appear**: Wait 1-2 minutes for Discord to sync the command, or restart Discord.

---

## Full Setup Documentation (Optional)

## File Structure

```
bot/
├── src/
│   ├── commands/
│   │   └── reportBug.ts       # Slash command definition
│   ├── handlers/
│   │   ├── interactionHandler.ts  # Routes interactions
│   │   └── modalHandler.ts    # Processes modal submissions
│   ├── utils/
│   │   ├── embedBuilder.ts    # Creates rich embeds
│   │   ├── threadManager.ts   # Manages thread creation
│   │   └── bugIdGenerator.ts  # Generates unique bug IDs
│   ├── config/
│   │   └── botConfig.ts       # Configuration management
│   └── index.ts              # Main bot entry point
├── package.json
├── tsconfig.json
└── .env.example
```

## Usage

### Reporting a Bug

1. Use `/report-bug` command (with optional screenshot)
2. Fill out the modal with bug details
3. Select frequency from dropdown
4. Bot creates thread: `[BUG-001] Your Bug Title`

### Managing Bugs

- **Search**: Use Discord's search to find bugs by title, OS, etc.
- **Status**: Use emoji reactions (🔍 investigating, ✅ fixed, ❌ won't fix)
- **Assignment**: Mention developers in the thread
- **Archive**: Threads auto-archive after 1 week of inactivity

## Troubleshooting

### Bot doesn't respond to commands
- Check bot permissions in your server
- Verify bot token is correct
- Ensure bot is online (green status)

### Commands not appearing
- Bot needs `applications.commands` scope
- Check GUILD_ID is correct
- Re-invite bot with proper permissions

### Thread creation fails
- Check BUG_REPORTS_CHANNEL_ID is correct
- Bot needs thread creation permissions
- Channel must allow threads

### File upload issues
- Max file size: 25MB
- Supported: PNG, JPG, GIF, MP4, WebM
- Check Discord server boost level for larger files

## Development

### Adding New Commands

1. Create command file in `src/commands/`
2. Add to interaction handler
3. Register in `src/index.ts`

### Modifying Bug Fields

1. Update modal in `src/commands/reportBug.ts`
2. Update embed builder in `src/utils/embedBuilder.ts`
3. Update modal handler validation

### Custom Thread Tags

Set up channel tags in Discord:
- Windows, MacOS (OS tags)
- Always, Occasional, Rare (frequency tags)
- Bug, Feature Request (type tags)

## License

MIT License - feel free to modify and distribute!

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check Discord bot permissions
4. Review console logs for error messages