import { useRef, useEffect, useState } from 'react';

function VideoCard({ stream, isLocal, participantName, isAudioEnabled = true, isVideoEnabled = true, streamVersion = 0 }) {
  const videoRef = useRef(null);
  const [streamKey, setStreamKey] = useState(0);

  // Update key when video is toggled or stream changes (screen sharing)
  useEffect(() => {
    setStreamKey(prev => prev + 1);
  }, [isVideoEnabled, streamVersion]);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current) {
      if (stream && isVideoEnabled) {
        videoRef.current.srcObject = stream;
        console.log('[VIDEO] Stream attached to video element');
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream, isVideoEnabled, streamKey]);

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const displayName = isLocal ? 'You' : participantName || 'Participant';

  // Check if stream has active video tracks
  const hasActiveVideoTracks = stream && stream.getVideoTracks().some(track => track.readyState === 'live');

  return (
    <div className={`video-card ${!hasActiveVideoTracks || !isVideoEnabled ? 'no-video' : ''}`}>
      {hasActiveVideoTracks && isVideoEnabled ? (
        <video
          key={streamKey}
          ref={videoRef}
          autoPlay
          muted={isLocal}
          playsInline
        />
      ) : (
        <div className="avatar">
          {getInitials(displayName)}
        </div>
      )}
      
      <div className="participant-name">
        {displayName}
        {!isAudioEnabled && (
          <svg className="muted-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 11h-1.7c0 .74-.13 1.45-.35 2.11l1.46 1.46c.38-.84.59-1.77.59-2.57zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l2.97 2.97c-.85.35-1.78.56-2.72.58V21h2v-3.27c1.05-.05 2.06-.3 2.98-.71L19.73 21 21 19.73 4.27 3z"/>
          </svg>
        )}
      </div>
    </div>
  );
}

export default VideoCard;
