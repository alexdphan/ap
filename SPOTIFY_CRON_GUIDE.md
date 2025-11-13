# Spotify Playlist Cron Guide

## 📅 Cron Schedule

The Vercel cron job runs **once per day** at:
- **3:00 AM UTC** (Every day)
- Cron expression: `0 3 * * *`

This means:
- 10:00 PM PST (Pacific Standard Time)
- 11:00 PM PDT (Pacific Daylight Time)

The cron automatically refreshes the playlist cache by calling the `/api/playlist` endpoint.

---

## 🔧 Configuration

The cron is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/playlist",
      "schedule": "0 3 * * *"
    }
  ]
}
```

---

## 🎵 The API Endpoint

### URL
- **Local Dev**: `http://localhost:3000/api/playlist`
- **Production**: `https://ap-delta.vercel.app/api/playlist`

### What it does:
1. Authenticates with Spotify using Client Credentials Flow
2. Fetches tracks from playlist ID: `40VBosKSZtXsVtJpiyl6Kh`
3. Formats track data (title, artist, Spotify ID, album art)
4. Returns JSON with caching headers
5. Caches for 24 hours

### Response Format:
```json
{
  "tracks": [
    {
      "id": "1",
      "title": "Track Name",
      "artist": "Artist Name",
      "spotifyTrackId": "7rbECVPkY5UODxoOUVKZnA",
      "imageUrl": "https://i.scdn.co/image/..."
    }
  ],
  "lastUpdated": "2025-11-13T22:42:41.509Z"
}
```

---

## 🧪 Testing

### In Development

**Method 1: Browser**
```
Visit: http://localhost:3000/api/playlist
```

**Method 2: cURL**
```bash
curl http://localhost:3000/api/playlist
```

**Method 3: Pretty Print with jq**
```bash
curl http://localhost:3000/api/playlist | jq '.'
```

**Check Track Count:**
```bash
curl http://localhost:3000/api/playlist | jq '.tracks | length'
```

### In Production

**Manual Trigger:**
```bash
curl https://ap-delta.vercel.app/api/playlist
```

**Check Last Update Time:**
```bash
curl https://ap-delta.vercel.app/api/playlist | jq '.lastUpdated'
```

---

## 🔄 Cache Behavior

### Client-Side Cache
- Duration: 24 hours
- Controlled by: `Cache-Control` header
- Stale-while-revalidate: 24 hours

### Server-Side Cache (Next.js)
- Duration: 24 hours
- Controlled by: `next: { revalidate: 86400 }`

### When cache refreshes:
1. **Automatically**: Every day at 3 AM UTC (via cron)
2. **Manually**: Visit the `/api/playlist` endpoint after 24 hours
3. **On Deploy**: New deployment may clear cache
4. **Dev Server**: Restart clears cache

---

## 📝 Environment Variables

Required in `.env.local` (dev) and Vercel (prod):

```bash
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

**To get credentials:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create or select your app
3. Copy Client ID and Client Secret
4. Add them to `.env.local` for local development
5. Add them to Vercel Project Settings → Environment Variables for production

---

## 🔍 Monitoring

### Check Cron Logs (Vercel)
1. Go to your [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to **Deployments** → Click on latest deployment
4. Click **Functions** tab
5. Find `/api/playlist` logs
6. Check for cron execution at 3 AM UTC

### What to look for in logs:
```
📀 Fetched X tracks from playlist
✅ Returning X tracks
```

### Common Issues:
- `⚠️ Playlist is empty or has no tracks` - Check playlist ID
- `Missing Spotify credentials` - Check environment variables
- `401 Unauthorized` - Client Secret is incorrect
- `403 Forbidden` - Playlist is private

---

## ⚙️ Changing the Schedule

To change when the cron runs, update `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/playlist",
      "schedule": "0 */6 * * *"  // Every 6 hours
    }
  ]
}
```

**Common Cron Patterns:**
- `0 3 * * *` - Daily at 3 AM UTC
- `0 */6 * * *` - Every 6 hours
- `0 0 * * *` - Daily at midnight UTC
- `0 0 * * 1` - Every Monday at midnight
- `*/30 * * * *` - Every 30 minutes (use sparingly!)

**Note**: Vercel has limits on cron frequency for free plans.

---

## 🎯 Quick Reference

| Action | Command |
|--------|---------|
| Test locally | `curl http://localhost:3000/api/playlist` |
| Test production | `curl https://ap-delta.vercel.app/api/playlist` |
| View track count | `curl <url> \| jq '.tracks \| length'` |
| View last update | `curl <url> \| jq '.lastUpdated'` |
| Check cron schedule | Check `vercel.json` |
| View cron logs | Vercel Dashboard → Functions |

---

## 📚 Resources

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Cron Expression Generator](https://crontab.guru/)

