import React, { useEffect, useState } from 'react';

const YouTubeSearchBox = ({ authorName }) => {
  const [videoId, setVideoId] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const loadYouTubeAPI = async () => {
      try {
        const key = process.env.REACT_APP_YOUTUBE_API_KEY;
        const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${authorName}&maxResults=1&order=relevance&type=video&key=${key}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const id = data.items[0].id.videoId;
          setVideoId(id);
        } else {
          console.log('Nessun video trovato per l\'autore:', authorName);
          // Se nessun video è trovato, mostra il messaggio di errore dopo 5 secondi
          setTimeout(() => setShowErrorMessage(true), 5000);
        }
      } catch (error) {
        console.error('Errore durante la richiesta API di YouTube:', error);
        // In caso di errore, mostra il messaggio di errore dopo 5 secondi
        setTimeout(() => setShowErrorMessage(true), 5000);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('API di YouTube caricata con successo!');
      loadYouTubeAPI();
    };

    script.onerror = () => {
      console.error('Errore durante il caricamento dell\'API di YouTube.');
      // In caso di errore nel caricamento dell'API, mostra il messaggio di errore dopo 5 secondi
      setTimeout(() => setShowErrorMessage(true), 5000);
    };

    document.head.appendChild(script);

    return () => {
      // Pulisci quando il componente viene smontato
      delete window.onYouTubeIframeAPIReady;
    };
  }, [authorName]);

  return (
    <div className="flex items-center justify-center h-full w-full">
      {/* Aggiungi un messaggio se l'API di YouTube non è stata caricata con successo */}
      {showErrorMessage && (!window.YT || typeof window.YT.SearchBox === 'undefined') && (
        <div>
          <p>Errore durante il caricamento dell'API di YouTube.</p>
          <p>Controlla la console del tuo browser per ulteriori dettagli.</p>
        </div>
      )}

      {/* Contenitore per il widget di ricerca di YouTube */}
      <div id="youtube-search" className="w-full object-contain">
        {videoId ? (
          <iframe
            title={`Video`}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            allowFullScreen
          ></iframe>
        ) : (
          !showErrorMessage && <p>Nessun video trovato per l'autore: {authorName}</p>
        )}
      </div>
    </div>
  );
};

export default YouTubeSearchBox;
