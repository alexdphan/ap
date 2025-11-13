import { NextResponse } from 'next/server';

const PLAYLIST_ID = "40VBosKSZtXsVtJpiyl6Kh";

export async function GET() {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json({ error: 'Missing Spotify credentials' }, { status: 500 });
  }

  try {
    // Get access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    // Fetch playlist
    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        next: { revalidate: 86400 } // Cache for 24 hours
      }
    );

    const playlistData = await playlistResponse.json();
    
    console.log(`📀 Fetched ${playlistData.items?.length || 0} tracks from playlist`);
    
    if (!playlistData.items || playlistData.items.length === 0) {
      console.warn('⚠️ Playlist is empty or has no tracks');
      return NextResponse.json({ 
        tracks: [], 
        lastUpdated: new Date().toISOString(),
        error: 'Playlist has no tracks'
      });
    }
    
    const tracks = playlistData.items.map((item: any, index: number) => {
      const track = item.track;
      const albumImage = track.album.images[1]?.url || track.album.images[0]?.url;
      
      return {
        id: String(index + 1),
        title: track.name,
        artist: track.artists.map((a: any) => a.name).join(', '),
        spotifyTrackId: track.id,
        imageUrl: albumImage,
        previewUrl: track.preview_url || null
      };
    });

    console.log(`✅ Returning ${tracks.length} tracks`);

    // Return tracks data with caching headers
    return NextResponse.json(
      { tracks, lastUpdated: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400'
        }
      }
    );
    
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 });
  }
}

