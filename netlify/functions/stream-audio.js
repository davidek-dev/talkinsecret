import { createReadStream, statSync } from 'fs';
import { join } from 'path';

// Laden der Umgebungsvariablen (bei Netlify automatisch verfügbar)
const AUDIO_SECRET_KEY = process.env.AUDIO_SECRET_KEY;
const NETLIFY_SITE_URL = process.env.NETLIFY_SITE_URL;

// Gültige Domains, die auf die Audio-Dateien zugreifen dürfen
const VALID_REFERERS = ['talkinsecret.com', 'www.talkinsecret.com', 'localhost', NETLIFY_SITE_URL];

export const handler = async (event, context) => {
  // Validierung des Referers
  const referer = event.headers.referer || event.headers.Referer;
  if (!VALID_REFERERS.some(domain => referer?.includes(domain))) {
    console.log(`Access denied: Invalid referer: ${referer}`);
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Access denied: Invalid referer' })
    };
  }

  // Validierung des Secret Key (optional)
  const { songId, key } = event.queryStringParameters || {};
  if (AUDIO_SECRET_KEY && key !== AUDIO_SECRET_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Invalid access key' })
    };
  }

  if (!songId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Song ID is required' })
    };
  }

  // Map of song IDs to file paths (store this securely)
  const songMapping = {
    'petrichor-01': 'audio/petrichor/1 - Petrichor - Talkin\'Secret Master 2 - 24_48.wav',
    'petrichor-02': 'audio/petrichor/2 - Worth the Way - Talkin\'Secret Master 2 - 24_48.wav',
    'petrichor-03': 'audio/petrichor/3 - Come On - Talkin\'Secret Master 2 - 24_48.wav',
    'petrichor-04': 'audio/petrichor/4 - Changes - Talkin\'Secret Master 2 - 24_48.wav',
    'petrichor-05': 'audio/petrichor/5 - Stranger in Disguise - Talkin\'Secret Master 2 - 24_48.wav',
    'petrichor-06': 'audio/petrichor/6 - Glimpse of the Morning - Talkin\'Secret Master 2 - 24_48.wav',
    'petrichor-07': 'audio/petrichor/7 - Miracles - Talkin\'Secret Master 3 - 24_48.wav',
    'petrichor-08': 'audio/petrichor/8 - Only Friend - Talkin\'Secret Master 2 - 24_48.wav',
    'petrichor-09': 'audio/petrichor/9 - Somehow Somewhere - Talkin\'Secret Master 3 - 24_48.wav'
  };
  const filePath = songMapping[songId];

  if (!filePath) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Song not found' })
    };
  }

  try {
    const fullPath = join(process.cwd(), 'public', filePath);
    
    // Sicherstellen, dass nur Audio-Dateien gestreamt werden
    if (!filePath.match(/\.(wav|mp3|ogg|flac|aac|m4a)$/i)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid file type' })
      };
    }
    
    const stats = statSync(fullPath);
    const range = event.headers.range;
    const fileSize = stats.size;
    
    // Content-Type basierend auf Dateiendung bestimmen
    const fileExtension = filePath.split('.').pop().toLowerCase();
    const contentTypeMap = {
      'wav': 'audio/wav',
      'mp3': 'audio/mpeg',
      'ogg': 'audio/ogg',
      'flac': 'audio/flac',
      'aac': 'audio/aac',
      'm4a': 'audio/mp4'
    };
    const contentType = contentTypeMap[fileExtension] || 'audio/wav';

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const stream = createReadStream(fullPath, { start, end });
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      return {
        statusCode: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'private, max-age=3600',
          'X-Content-Type-Options': 'nosniff' // Verhindert MIME-Sniffing
        },
        body: buffer.toString('base64'),
        isBase64Encoded: true
      };
    } else {
      const stream = createReadStream(fullPath);
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      return {
        statusCode: 200,
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'private, max-age=3600',
          'X-Content-Type-Options': 'nosniff'
        },
        body: buffer.toString('base64'),
        isBase64Encoded: true
      };
    }
  } catch (error) {
    console.error('Error streaming audio:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
