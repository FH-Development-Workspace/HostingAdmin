# FH Developments Admin

Deploy to Vercel (import this folder). Environment variables:

- DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET - from the Discord Developer Portal
- DISCORD_GUILD_ID - your FH Discord server ID
- DISCORD_ROLE_ID - optional, defaults to 1557771113885335603
- SESSION_SECRET - any long random string
- UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN - add Upstash Redis from the Vercel Marketplace (KV_REST_API_URL / KV_REST_API_TOKEN also work)

Discord Developer Portal > OAuth2 > Redirects: add https://YOUR-SUBDOMAIN/api/auth/callback
