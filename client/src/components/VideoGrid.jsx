import VideoCard from './VideoCard';

function VideoGrid({ localStream, peers, isAudioEnabled = true, isVideoEnabled = true, streamVersion = 0 }) {
  const participantCount = Object.keys(peers || {}).length + 1; // +1 for local user
  
  // Determine grid class based on participant count
  const getGridClass = () => {
    if (participantCount === 1) return 'video-grid single-participant';
    if (participantCount === 2) return 'video-grid two-participants';
    return 'video-grid many-participants';
  };

  return (
    <div className={getGridClass()}>
      {/* Local video */}
      <VideoCard 
        stream={localStream} 
        isLocal={true} 
        participantName="You"
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        streamVersion={streamVersion}
      />

      {/* Remote videos */}
      {peers && Object.keys(peers).map(userId => (
        <VideoCard 
          key={userId} 
          stream={peers[userId]?.stream} 
          isLocal={false} 
          participantName={peers[userId]?.name || 'Participant'}
        />
      ))}
    </div>
  );
}

export default VideoGrid;
