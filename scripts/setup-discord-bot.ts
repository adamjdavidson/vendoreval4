#!/usr/bin/env tsx
/**
 * Discord Bot Setup Guide
 * 
 * This script provides interactive guidance for setting up Discord OAuth and bot integration.
 * 
 * Usage: npm run setup:discord
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║         Discord Bot Setup for VendorEval                     ║
╚══════════════════════════════════════════════════════════════╝

Follow these steps to configure Discord OAuth and bot membership verification:

1. Create Discord Application
   → Go to: https://discord.com/developers/applications
   → Click "New Application"
   → Name: "VendorEval (Local Dev)"
   → Click "Create"

2. Configure OAuth
   → Go to OAuth2 → General
   → Copy CLIENT ID and CLIENT SECRET
   → Add Redirect URL: http://localhost:54321/auth/v1/callback
   → Save Changes

3. Create Discord Bot
   → Go to Bot tab
   → Click "Add Bot"
   → Enable "Server Members Intent"
   → Click "Reset Token" → Copy bot token

4. Add Bot to Server
   → Go to OAuth2 → URL Generator
   → Select scopes: bot, identify, guilds
   → Select permissions: Read Messages/View Channels
   → Copy generated URL
   → Open URL in browser → Add to Discord server (ID: 1254761492608188517)

5. Configure Environment Variables
   → Edit supabase/.env:
     DISCORD_GUILD_ID=1254761492608188517
     DISCORD_BOT_TOKEN=<your-bot-token>
   
   → Edit apps/evaluation-tool/.env.local:
     VITE_DISCORD_CLIENT_ID=<your-client-id>

6. Configure Supabase Auth
   → Open Supabase Studio: http://localhost:54323
   → Navigate to: Authentication → Providers → Discord
   → Enable Discord provider
   → Enter Client ID and Client Secret
   → Save

✓ Setup complete! Test by running: npm run dev
`);
