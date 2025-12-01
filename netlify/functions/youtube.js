const fetch = globalThis.fetch || require('node-fetch');

exports.handler = async (event) => {
  try {
    console.log('[youtube] invoked, queryStringParameters=', event.queryStringParameters);

    const q = event.queryStringParameters?.query || '';
    if (!q) {
      console.log('[youtube] missing query param');
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing query parameter' }) };
    }

    const API_KEY = process.env.YT_API_KEY;
    console.log('[youtube] YT_API_KEY present?:', !!API_KEY);

    if (!API_KEY) {
      console.error('[youtube] YT_API_KEY is missing in process.env');
      return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfiguration: missing API key' }) };
    }

    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&key=${API_KEY}&type=video&maxResults=1`;
    console.log('[youtube] calling YouTube API URL:', youtubeUrl);

    const res = await fetch(youtubeUrl);
    console.log('[youtube] YouTube response status:', res.status, res.statusText);

    const text = await res.text();
    console.log('[youtube] YouTube raw body (truncated 2000 chars):', text?.slice?.(0, 2000));

    let json;
    try {
      json = JSON.parse(text);
    } catch (parseErr) {
      console.warn('[youtube] failed to parse YouTube response as JSON', parseErr);
      return { statusCode: 502, body: JSON.stringify({ error: 'Invalid response from YouTube', details: text.slice(0, 1000) }) };
    }

    if (!res.ok) {
      console.error('[youtube] YouTube API returned error', res.status, json);
      return { statusCode: 502, body: JSON.stringify({ error: 'YouTube API error', status: res.status, details: json }) };
    }

    const item = json.items && json.items[0];
    if (!item || !item.id || !item.id.videoId) {
      console.warn('[youtube] no video found for query:', q, 'response:', json);
      return { statusCode: 404, body: JSON.stringify({ error: 'Video non trovato', details: json }) };
    }

    console.log('[youtube] found videoId:', item.id.videoId, 'title:', item.snippet?.title);
    return { statusCode: 200, body: JSON.stringify({ videoId: item.id.videoId, title: item.snippet?.title }) };

  } catch (err) {
    console.error('[youtube] unexpected error:', err && (err.stack || err));
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error', details: String(err) }) };
  }
};
