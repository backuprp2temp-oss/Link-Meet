import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';
import Controls from '../components/Controls';
import useLocalStream from '../hooks/useLocalStream';
import usePeerConnection from '../hooks/usePeerConnection';
import useMediaControls from '../hooks/useMediaControls';
import useScreenShare from '../hooks/useScreenShare';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import useMeetingTimer from '../hooks/useMeetingTimer';
import { getMeetingUrl, copyToClipboard, getParticipantCount } from '../utils/meetingUtils';

function MeetingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [showCopied, setShowCopied] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);

  // Get local stream (camera/microphone)
  const { localStream, error, isLoading } = useLocalStream();

  // Setup peer connection for video calling
  const { peers, isConnected, peersRef } = usePeerConnection(roomId, localStream);
  
  // Setup media controls (mute/camera toggle)
  const { 
    isAudioEnabled, 
    isVideoEnabled, 
    toggleAudio, 
    toggleVideo 
  } = useMediaControls(localStream, peersRef);

  // Setup screen sharing
  const { 
    isScreenSharing, 
    screenShareError,
    startScreenShare, 
    stopScreenShare,
    streamVersion
  } = useScreenShare(localStream, peersRef);

  // Setup meeting timer
  const { formattedDuration } = useMeetingTimer();

  // Leave meeting - cleanup all connections (defined early for keyboard shortcuts)
  const handleLeave = () => {
    console.log('[MEETING] Leaving meeting...');
    navigate('/');
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onToggleAudio: toggleAudio,
    onToggleVideo: toggleVideo,
    onToggleScreenShare: isScreenSharing ? stopScreenShare : startScreenShare,
    onLeave: handleLeave
  });

  // Update participant count when peers change
  useEffect(() => {
    setParticipantCount(getParticipantCount(peers));
  }, [peers]);

  // Copy meeting link to clipboard
  const copyMeetingLink = async () => {
    const meetingLink = getMeetingUrl(roomId);
    const success = await copyToClipboard(meetingLink);
    if (success) {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="meeting-room">
        <div className="loading">
          <div className="spinner"></div>
          <p>Requesting camera and microphone access...</p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Please allow permissions when prompted
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="meeting-room">
        <div className="loading">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--danger-color)">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p style={{ color: 'var(--danger-color)', fontWeight: '500' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="meeting-room">
      <div className="meeting-header">
        <div className="meeting-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span>{participantCount} participant{participantCount > 1 ? 's' : ''}</span>
          <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: '500' }}>{formattedDuration}</span>
          <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
          <span>Code: <strong>{roomId}</strong></span>
          <button onClick={copyMeetingLink} title="Copy meeting link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Copy link
          </button>
          {showCopied && <span className="copied-msg">✓ Copied!</span>}
          {isConnected && (
            <span style={{ color: 'var(--success-color)', marginLeft: '12px' }}>
              ● Connected
            </span>
          )}
          {isScreenSharing && (
            <span style={{ color: 'var(--warning-color)', marginLeft: '12px', fontWeight: '500' }}>
              🖥️ Sharing Screen
            </span>
          )}
        </div>
      </div>

      <VideoGrid 
        localStream={localStream} 
        peers={peers}
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        streamVersion={streamVersion}
      />

      <Controls 
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={isScreenSharing}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={isScreenSharing ? stopScreenShare : startScreenShare}
        onLeave={handleLeave}
      />

      {screenShareError && (
        <div className="toast" style={{ background: 'var(--danger-color)' }}>
          {screenShareError}
        </div>
      )}
    </div>
  );
}

export default MeetingRoom;
