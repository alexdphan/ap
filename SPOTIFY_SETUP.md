# Spotify Integration Setup

This project now uses Spotify Web Playback SDK instead of YouTube. Follow these steps to get it working:

## 1. Create a Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create app"**
3. Fill in the details:
   - **App name**: Alex Phan Music Player (or whatever you want)
   - **App description**: Personal music player
   - **Redirect URI**: `http://localhost:3000` (for development)
   - For production, add your production URL too
4. Accept the terms and click **"Save"**
5. Click **"Settings"** to see your **Client ID**

## 2. Configure Environment Variables

Create a `.env.local` file in the project root (if it doesn't exist) and add:

```bash
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000
```

Replace `your_client_id_here` with your actual Client ID from the Spotify Dashboard.

## 3. Important Notes

- **Spotify Premium Required**: The Spotify Web Playback SDK requires a Spotify Premium account
- **Redirect URI**: Make sure the redirect URI in your `.env.local` matches exactly what you set in the Spotify Dashboard
- **Production**: When deploying to production, add your production URL to both:
  - Spotify Dashboard redirect URIs
  - `.env.local` as `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI`

## 4. How It Works

1. Click "Connect to Spotify" on the homepage
2. Authorize the app with your Spotify account
3. The player will initialize and you can start playing music!
4. Music will autoplay to the next track when one ends (like Spotify's normal behavior)

## Features

✅ **Reliable autoplay** - No more YouTube iframe issues!  
✅ **Better playback control** - Direct integration with Spotify's API  
✅ **No picture-in-picture issues** - Spotify Web SDK doesn't use video elements  
✅ **Same beautiful UI** - All your existing components work the same way  
✅ **Better state management** - Spotify's SDK provides consistent events  

## Troubleshooting

- **"Premium Required" error**: Make sure you're using a Spotify Premium account
- **Authentication fails**: Double-check your Client ID and Redirect URI match
- **Player won't load**: Check the browser console for errors and ensure your token is valid
- **No sound**: Check that your Spotify player is selected as the active device in your Spotify app

