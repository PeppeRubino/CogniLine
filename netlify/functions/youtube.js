const { google } = require('googleapis');

exports.handler = async (event) => {
  const q = event.queryStringParameters?.query || '';
  if (!q) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing query parameter' }) };
  }

  const API_KEY = process.env.YT_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing API key' }) };
  }

  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: API_KEY
    });

    const response = await youtube.search.list({
      part: 'snippet',
      q,
      type: 'video',
      maxResults: 1
    });

    const item = response.data.items?.[0];
    if (!item) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Video non trovato' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ videoId: item.id.videoId, title: item.snippet.title })
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error', details: String(err) }) };
  }
};
