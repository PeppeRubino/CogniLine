import React, { useEffect, useState } from 'react';

const YouTubeSearchBox = ({ authorName }) => {
  const [videoId, setVideoId] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const fetchVideoId = async () => {
      try {
        if (!authorName) {
          console.log('[YouTubeSearchBox] authorName is empty, skipping fetch.');
          return;
        }

        const url = `/.netlify/functions/youtube?query=${encodeURIComponent(authorName)}`;
        console.log('[YouTubeSearchBox] fetching video for author:', authorName);
        console.log('[YouTubeSearchBox] fetch URL:', url);

        const res = await fetch(url);
        console.log('[YouTubeSearchBox] response status:', res.status, res.statusText);

        // Leggi sempre il body come text per poterlo loggare; poi prova a parsearlo in JSON.
        const text = await res.text();
        console.log('[YouTubeSearchBox] response body (raw):', text);

        let data;
        try {
          data = JSON.parse(text);
          console.log('[YouTubeSearchBox] parsed JSON response:', data);
        } catch (parseErr) {
          // Se non è JSON, manteniamo raw nel data per debug
          console.warn('[YouTubeSearchBox] response is not valid JSON:', parseErr);
          data = { raw: text };
        }

        if (!res.ok) {
          console.error('[YouTubeSearchBox] Function returned non-ok status:', res.status, data);
          throw new Error(`Server error: ${res.status}`);
        }

        if (!data || !data.videoId) {
          console.warn('[YouTubeSearchBox] No videoId in response:', data);
          throw new Error('Video non trovato o risposta malformata dalla function');
        }

        console.log('[YouTubeSearchBox] setting videoId:', data.videoId);
        setVideoId(data.videoId);
      } catch (err) {
        // Log completo per debug
        console.error('[YouTubeSearchBox] fetchVideoId error:', err && (err.stack || err.message || err));
        // manteniamo il timeout che avevi per mostrare il messaggio all'utente
        setTimeout(() => setShowErrorMessage(true), 5000);
      }
    };

    fetchVideoId();
  }, [authorName]);

  return (
    <div className="flex items-center justify-center h-full w-full relative select-none">
      {/* Messaggio di errore */}
      {showErrorMessage && (
        <div className="absolute text-center mx-2 text-white font-light">
          <span>Errore durante il caricamento del video. <hr />Riprova più tardi.</span>
        </div>
      )}

      {/* Contenitore video */}
      <div className="w-full h-full">
        {videoId ? (
          <iframe
            title={`Video di ${authorName}`}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            allowFullScreen
          />
        ) : !showErrorMessage && (
          <div className="flex items-center justify-center text-white font-light">
            <p>Stiamo cercando: {authorName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeSearchBox;
