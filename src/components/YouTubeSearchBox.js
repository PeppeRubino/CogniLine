import React, { useEffect } from 'react';

const YouTubeSearchBox = ({ authorName }) => {
  useEffect(() => {
    const loadYouTubeAPI = async () => {
      try {
        const apiKey = 'AIzaSyAguU9f7vcFhm8xxUfBYddzzphQ-PFEW9M'; // Sostituisci con la tua chiave API
    
        const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${authorName}&maxResults=6&order=relevance&type=video&key=${apiKey}`);
        const data = await response.json();
    
        if (data.items && data.items.length > 0) {
          console.log('Video IDs:', data.items.map(item => item.id.videoId));
          // Puoi fare ulteriori operazioni con gli ID dei video ottenuti
        } else {
          console.log('Nessun video trovato per l\'autore:', authorName);
        }
      } catch (error) {
        console.error('Errore durante la richiesta API di YouTube:', error);
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
    };

    document.head.appendChild(script);

    return () => {
      // Pulisci quando il componente viene smontato
      delete window.onYouTubeIframeAPIReady;
    };
  }, [authorName]);

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
