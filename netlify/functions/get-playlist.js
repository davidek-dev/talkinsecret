export const handler = async (event, context) => {
  // Unterstütze CORS für Entwicklungsumgebungen
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300',
    'Access-Control-Allow-Origin': '*', // In Produktion sollte dies eingeschränkt werden
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // Vorflug-Anfragen für CORS beantworten
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }
  
  // Die Audiodateien befinden sich in /public/audio/petrichor
  const playlist = {
    albumTitle: "Petrichor",
    description: "Experience our latest album across all major streaming platforms.",
    songs: [
      { id: "petrichor-01", title: "Petrichor", artist: "Talkin'Secret", duration: "4:58", albumArt: "/images/image00001_scaled.webp", audioUrl: "/audio/petrichor/1 - Petrichor - Talkin'Secret Master 2 - 24_48.aac" },
      { id: "petrichor-02", title: "Worth the Way", artist: "Talkin'Secret", duration: "4:16", albumArt: "/images/image00001_scaled.webp", audioUrl: "/audio/petrichor/2 - Worth the Way - Talkin'Secret Master 2 - 24_48.aac" },
      { id: "petrichor-03", title: "Come On", artist: "Talkin'Secret", duration: "3:46", albumArt: "/images/image00001_scaled.webp", audioUrl: "/audio/petrichor/3 - Come On - Talkin'Secret Master 2 - 24_48.aac" },
      { id: "petrichor-04", title: "Changes", artist: "Talkin'Secret", duration: "3:28", albumArt: "/images/image00001_scaled.webp", audioUrl: "/audio/petrichor/4 - Changes - Talkin'Secret Master 2 - 24_48.aac" },
      { id: "petrichor-05", title: "Stranger in Disguise", artist: "Talkin'Secret", duration: "3:44", albumArt: "/images/image00001_scaled.webp", audioUrl: "/audio/petrichor/5 - Stranger in Disguise - Talkin'Secret Master 2 - 24_48.aac" },
      { id: "petrichor-06", title: "Glimpse of the Morning", artist: "Talkin'Secret", duration: "3:40", albumArt: "/images/image00001_scaled.webp", audioUrl: "/audio/petrichor/6 - Glimpse of the Morning - Talkin'Secret Master 2 - 24_48.aac" },
      { id: "petrichor-07", title: "Miracles", artist: "Talkin'Secret", duration: "3:42", albumArt: "/images/image00001_scaled.webp", audioUrl: "/audio/petrichor/7 - Miracles - Talkin'Secret Master 3 - 24_48.aac" },
      { id: "petrichor-08", title: "Only Friend", artist: "Talkin'Secret", duration: "4:52", albumArt: "/images/image00001_scaled.webp", audioUrl: "/audio/petrichor/8 - Only Friend - Talkin'Secret Master 2 - 24_48.aac" },
      { id: "petrichor-09", title: "Somehow Somewhere", artist: "Talkin'Secret", duration: "6:06", albumArt: "/images/image00001_scaled.webp", audioUrl: "/audio/petrichor/9 - Somehow Somewhere - Talkin'Secret Master 3 - 24_48.aac" }
    ],
    services: [
      { name: "Spotify", url: "https://open.spotify.com/intl-de/album/2n3P39BKiFLF71iH1nmiv6", icon: "🎵" },
      { name: "Apple Music", url: "https://music.apple.com/de/album/petrichor/1789391867", icon: "🍎" },
      { name: "YouTube Music", url: "https://music.youtube.com/playlist?list=OLAK5uy_mwGChRREfOau5FJbcwTGlMN1qDTrt73B0", icon: "📺" },
      { name: "Amazon Music", url: "https://music.amazon.de/albums/B0DSCK96HY", icon: "🛒" },
      { name: "Deezer", url: "https://www.deezer.com/de/album/693504991", icon: "🎧" }
    ]
  };
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(playlist)
  };
};
