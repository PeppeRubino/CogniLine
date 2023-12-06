import React, { useEffect } from 'react';

const YouTubeSearchBox = ({ authorName }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://apis.google.com/js/platform.js?apikey=${process.env.REACT_APP_YOUTUBE_API_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('API di YouTube caricata con successo!');
      // Lascia che la funzione onYouTubeIframeAPIReady si occupi dell'inizializzazione
    };

    script.onerror = () => {
      console.error('Errore durante il caricamento dell\'API di YouTube.');
    };

    document.head.appendChild(script);

    return () => {
      // Pulisci quando il componente viene smontato
      delete window.onYouTubeIframeAPIReady;
    };
  }, [authorName]);

  // Callback chiamata quando l'API di YouTube è completamente pronta
  window.onYouTubeIframeAPIReady = () => {
    console.log('API di YouTube completamente pronta!');
    initializeYouTubeSearch(authorName);
  };

  const initializeYouTubeSearch = (authorName) => {
    // Verifica più sicura di window.YT
    if (window.YT && typeof window.YT.SearchBox !== 'undefined') {
      const searchBox = new window.YT.SearchBox('youtube-search', {
        query: authorName,
        embedded: true,
      });

      // Esegui altre operazioni necessarie con searchBox se necessario
    } else {
      // Riprova dopo un breve ritardo se YT.SearchBox non è ancora definito
      setTimeout(() => initializeYouTubeSearch(authorName), 1000);
    }
  };

  return (
    <div className="w-full max-w-screen-md mx-auto mt-8">
      {/* Aggiungi un messaggio se l'API di YouTube non è stata caricata con successo */}
      {(!window.YT || typeof window.YT.SearchBox === 'undefined') && (
        <div>
          <p>Errore durante il caricamento dell'API di YouTube.</p>
          <p>Controlla la console del tuo browser per ulteriori dettagli.</p>
        </div>
      )}

      {/* Contenitore per il widget di ricerca di YouTube */}
      <div id="youtube-search" className="mb-4"></div>
    </div>
  );
};

export default YouTubeSearchBox;
