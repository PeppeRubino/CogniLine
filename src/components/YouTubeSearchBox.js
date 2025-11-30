import React, { useEffect, useState } from 'react';

const YouTubeSearchBox = ({ authorName }) => {
  const [videoId, setVideoId] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const fetchVideoId = async () => {
      try {
        const res = await fetch(`/api/youtube?query=${encodeURIComponent(authorName)}`);
        if (!res.ok) throw new Error('Video non trovato o errore server');
        const data = await res.json();
        setVideoId(data.videoId);
      } catch (err) {
        console.error(err);
        // Mostra messaggio di errore dopo 5 secondi
        setTimeout(() => setShowErrorMessage(true), 5000);
      }
    };

    fetchVideoId();
  }, [authorName]);

  return (
    <div className="">
      {showErrorMessage && (
        <div className=''>
          <span>Errore durante il caricamento del video. <hr />Riprova più tardi.</span>
        </div>
      )}

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
          <div className='flex items-center justify-center text-white font-light'>
            <p>Stiamo cercando: {authorName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeSearchBox;
