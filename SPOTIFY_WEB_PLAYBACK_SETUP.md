# Spotify Web Playback SDK Setup Guide

## Overview

The app now uses the **Spotify Web Playback SDK** to play **full tracks** (not just 30-second previews) with full programmatic control.

---

## 🔑 Requirements

1. **Spotify Premium Account** (required for Web Playback SDK)
2. **Spotify Access Token** with appropriate scopes

---

## 📝 Setup Instructions

### 1. Get Your Spotify Access Token

You need a Spotify access token with the following scopes:
- `streaming`
- `user-read-email`
- `user-read-private`
- `user-modify-playback-state`
- `user-read-playback-state`

**Option A: Quick Test Token (expires in 1 hour)**
1. Go to [Spotify Web API Console](https://developer.spotify.com/console/get-users-profile/)
2. Click "Get Token"
3. Select all the required scopes above
4. Copy the token

**Option B: Long-lived Token (recommended for production)**
1. Implement OAuth 2.0 Authorization Code Flow with PKCE
2. Store and refresh tokens as needed
3. See the [Spotify Authorization Guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)

### 2. Add Token to Environment Variables

**For Local Development:**
```bash
# .env.local
NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN=your_access_token_here
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

**For Vercel Production:**
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN` = your token
   - `SPOTIFY_CLIENT_ID` = your client ID
   - `SPOTIFY_CLIENT_SECRET` = your client secret

---

## 🎵 How It Works

### Initialization
1. Loads the Spotify Web Playback SDK script
2. Creates a player instance with your access token
3. Connects and gets a `device_id`

### Playback
1. When you select a track, it calls the Spotify Web API
2. Tells Spotify to play the track on your web player device
3. Full track plays through the browser

### Controls
- ✅ **Play/Pause**: `player.resume()` / `player.pause()`
- ✅ **Next/Previous**: Changes `currentTrackIndex` and calls API
- ✅ **Auto-advance**: Listens to `player_state_changed` event

---

## 📊 Features

### ✅ What Works
- Play full Spotify tracks (not previews!)
- Play/Pause control
- Next/Previous track
- Auto-advance when track ends
- Volume control
- Your custom beautiful UI

### ⚠️ Limitations
- **Requires Spotify Premium** for visitors to hear audio
- **Requires authentication** (users need to log in with Spotify)
- **Token expires** (need to implement refresh logic)

---

## 🔄 Token Refresh (TODO)

For production, you'll need to implement token refresh:

```typescript
// Example refresh function
async function refreshSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: YOUR_REFRESH_TOKEN
    })
  });
  
  const data = await response.json();
  return data.access_token;
}
```

---

## 🐛 Troubleshooting

### "Missing NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN"
- Make sure you've added the token to `.env.local`
- Restart your dev server after adding env variables

### "Authentication error"
- Token might be expired (tokens expire after 1 hour)
- Get a new token from Spotify Developer Console
- Or implement token refresh

### "Account error"
- The Spotify account needs **Spotify Premium**
- Free accounts cannot use the Web Playback SDK

### "No sound"
- Check browser console for errors
- Make sure the device appears in Spotify Connect devices
- Try transferring playback to the web player from another device

---

## 📚 Resources

- [Spotify Web Playback SDK Documentation](https://developer.spotify.com/documentation/web-playback-sdk)
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Authorization Guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
- [Web Playback SDK Quick Start](https://developer.spotify.com/documentation/web-playback-sdk/quick-start)

---

## 🎯 Next Steps

1. ✅ Get Spotify access token
2. ✅ Add to `.env.local`
3. ✅ Test locally
4. ⬜ Implement OAuth flow for visitors
5. ⬜ Add token refresh logic
6. ⬜ Deploy to Vercel with environment variables

