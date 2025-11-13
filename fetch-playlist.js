// Spotify Playlist Fetcher
// Run this with: node fetch-playlist.js

const PLAYLIST_ID = "40VBosKSZtXsVtJpiyl6Kh";

async function fetchPlaylistTracks() {
  try {
    // Using Spotify's public oEmbed API (no auth needed)
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      console.error('Need to use authenticated request. Using alternative method...');
      console.log('\n⚠️  Visit this URL in your browser to see your tracks:');
      console.log(`https://open.spotify.com/playlist/${PLAYLIST_ID}`);
      console.log('\nThen manually get each track:');
      console.log('1. Right-click each song → Share → Embed track');
      console.log('2. Extract the track ID from: /embed/track/TRACK_ID');
      console.log('3. Open https://open.spotify.com/track/TRACK_ID to get album art\n');
      return;
    }

    const data = await response.json();
    
    console.log('\n✅ Found tracks! Generating code...\n');
    
    const tracks = data.items.map((item, index) => {
      const track = item.track;
      const albumImage = track.album.images[1]?.url || track.album.images[0]?.url; // Medium size
      
      return {
        id: String(index + 1),
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        spotifyTrackId: track.id,
        imageUrl: albumImage
      };
    });

    console.log('const tracks: Track[] = [');
    tracks.forEach((track, index) => {
      console.log(`  {`);
      console.log(`    id: "${track.id}",`);
      console.log(`    title: "${track.title}",`);
      console.log(`    artist: "${track.artist}",`);
      console.log(`    spotifyTrackId: "${track.spotifyTrackId}",`);
      console.log(`    imageUrl: "${track.imageUrl}",`);
      console.log(`  }${index < tracks.length - 1 ? ',' : ''}`);
    });
    console.log('];');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n📝 Manual method:');
    console.log('Visit: https://open.spotify.com/playlist/' + PLAYLIST_ID);
    console.log('For each song: Right-click → Share → Embed track');
    console.log('Send me all the embed codes!\n');
  }
}

fetchPlaylistTracks();

