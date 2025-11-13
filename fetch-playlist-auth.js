#!/usr/bin/env node

// Fetch Spotify Playlist with Authentication
// Usage: SPOTIFY_CLIENT_ID=your_id SPOTIFY_CLIENT_SECRET=your_secret node fetch-playlist-auth.js

const PLAYLIST_ID = "40VBosKSZtXsVtJpiyl6Kh";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log('\n⚠️  Missing credentials!');
  console.log('\nGet them from: https://developer.spotify.com/dashboard');
  console.log('\nThen run:');
  console.log('SPOTIFY_CLIENT_ID=your_id SPOTIFY_CLIENT_SECRET=your_secret node fetch-playlist-auth.js\n');
  process.exit(1);
}

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

async function fetchPlaylistTracks() {
  try {
    console.log('🔐 Getting access token...');
    const token = await getAccessToken();

    console.log('📀 Fetching playlist tracks...');
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`\n✅ Found ${data.items.length} tracks!\n`);
    console.log('Copy this code into your MusicPlayerContext.tsx:\n');
    console.log('─'.repeat(60));
    
    console.log('\nconst tracks: Track[] = [');
    
    data.items.forEach((item, index) => {
      const track = item.track;
      if (!track) return;
      
      const albumImage = track.album.images[1]?.url || track.album.images[0]?.url;
      
      console.log(`  {`);
      console.log(`    id: "${index + 1}",`);
      console.log(`    title: "${track.name.replace(/"/g, '\\"')}",`);
      console.log(`    artist: "${track.artists.map(a => a.name).join(', ').replace(/"/g, '\\"')}",`);
      console.log(`    spotifyTrackId: "${track.id}",`);
      console.log(`    imageUrl: "${albumImage}",`);
      console.log(`  }${index < data.items.length - 1 ? ',' : ''}`);
    });
    
    console.log('];');
    console.log('\n' + '─'.repeat(60));
    console.log('\n✨ Done! Copy the code above into your MusicPlayerContext.tsx\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure your Client ID and Secret are correct');
    console.log('2. Make sure your playlist is PUBLIC');
    console.log('3. Try refreshing your credentials\n');
  }
}

fetchPlaylistTracks();

