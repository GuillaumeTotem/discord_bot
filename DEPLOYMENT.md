# Bot Deployment Guide

## Free Hosting Options (24/7 Running)

### Option 1: Railway (Recommended - Easiest)
**Cost:** Free tier ($5 credit/month, usually enough for a Discord bot)

1. **Prepare your bot:**
   - Remove `.env` from your code (Railway uses environment variables)
   - Push your bot folder to GitHub

2. **Deploy on Railway:**
   - Go to https://railway.app
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js project

3. **Configure environment variables:**
   - Click on your service → "Variables"
   - Add each variable from your `.env`:
     - `DISCORD_BOT_TOKEN`
     - `CLIENT_ID`
     - `GUILD_ID`
     - `BUG_REPORTS_CHANNEL_ID`

4. **Add build command:**
   - Go to Settings → Deploy
   - Build Command: `npm install && npx tsc`
   - Start Command: `npm start`

### Option 2: Render
**Cost:** Free tier (spins down after 15 min inactivity, auto-restarts on activity)

1. **Setup:**
   - Push to GitHub
   - Go to https://render.com
   - Connect GitHub account
   - Create "New Web Service"

2. **Configuration:**
   - Build Command: `npm install && npx tsc`
   - Start Command: `npm start`
   - Add environment variables in dashboard

### Option 3: Fly.io
**Cost:** Free tier (3 shared VMs)

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Deploy:**
   ```bash
   cd bot
   fly launch
   fly secrets set DISCORD_BOT_TOKEN=your_token
   fly secrets set CLIENT_ID=your_client_id
   # ... set other secrets
   fly deploy
   ```

### Option 4: VPS (Most Control)
**Cost:** $3-5/month (DigitalOcean, Linode, Vultr)

1. **Setup Ubuntu VPS**
2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and setup:**
   ```bash
   git clone your-repo
   cd bot
   npm install
   npx tsc
   ```

4. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name "discord-bot"
   pm2 startup
   pm2 save
   ```

## Quick Deploy Files

### Create `Dockerfile` (for container deployments):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx tsc
CMD ["npm", "start"]
```

### Create `fly.toml` (for Fly.io):
```toml
app = "your-bot-name"
primary_region = "iad"

[build]
  builder = "nodejs"

[env]
  PORT = "8080"

[processes]
  app = "npm start"
```

### Create `render.yaml` (for Render):
```yaml
services:
  - type: web
    name: discord-bot
    env: node
    buildCommand: npm install && npx tsc
    startCommand: npm start
    envVars:
      - key: DISCORD_BOT_TOKEN
        sync: false
      - key: CLIENT_ID
        sync: false
      - key: GUILD_ID
        sync: false
      - key: BUG_REPORTS_CHANNEL_ID
        sync: false
```

## Updating Your Bot

### For Railway/Render:
- Push changes to GitHub
- Auto-deploys on push (or manual trigger)

### For VPS with PM2:
```bash
git pull
npm install
npx tsc
pm2 restart discord-bot
```

## Important Notes

1. **Never commit `.env` file** - Use platform's environment variables
2. **Add npm scripts** for easier deployment:
   ```json
   "scripts": {
     "build": "tsc",
     "start": "node dist/index.js",
     "deploy": "npm run build && npm start"
   }
   ```

3. **Monitor your bot:**
   - Railway/Render have built-in logs
   - For VPS: `pm2 logs discord-bot`

4. **Free tier limitations:**
   - Railway: 500 hours/month (~20 days)
   - Render: Sleeps after 15 min inactivity
   - Fly.io: 3 VMs, limited resources
   - Choose paid tier ($5-7/month) for 24/7 uptime

## Recommended: Railway

Railway is the easiest for Discord bots because:
- Simple GitHub integration
- Good free tier for bots
- Easy environment variables
- Auto-deploy on push
- Built-in logging
- No sleep/spin-down on free tier (within limits)