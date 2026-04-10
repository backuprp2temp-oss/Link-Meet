import { useState, useRef, useCallback } from 'react';

function useScreenShare(localStream, peersRef) {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareError, setScreenShareError] = useState(null);
  const [streamVersion, setStreamVersion] = useState(0); // Force re-render
  const screenStreamRef = useRef(null);
  const originalVideoTrackRef = useRef(null);
  const localStreamRef = useRef(localStream);

  // Update ref when localStream changes
  if (localStream !== localStreamRef.current) {
    localStreamRef.current = localStream;
  }

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      console.log('[SCREEN] Requesting screen share permission...');
      setScreenShareError(null);

      // Get screen share stream with video and audio
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: true
      });

      console.log('[SCREEN] Screen share permission granted');
      screenStreamRef.current = screenStream;

      // Store original video track
      const stream = localStreamRef.current;
      if (stream) {
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length > 0) {
          originalVideoTrackRef.current = videoTracks[0];
          console.log('[SCREEN] Original video track stored');
        }
      }

      // Get the screen share video track
      const screenTrack = screenStream.getVideoTracks()[0];

      if (!screenTrack) {
        throw new Error('No video track in screen stream');
      }

      // Replace in local stream FIRST
      if (stream) {
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length > 0) {
          stream.removeTrack(videoTracks[0]);
          stream.addTrack(screenTrack);
          console.log('[SCREEN] Local stream updated with screen track');
        }
      }

      // Force React to re-render the video element
      setStreamVersion(prev => prev + 1);

      // Replace video track in all peer connections
      const peerCount = Object.keys(peersRef.current).length;
      console.log(`[SCREEN] Replacing video track in ${peerCount} peer connection(s)`);

      Object.entries(peersRef.current).forEach(([userId, peer]) => {
        try {
          const senders = peer._pc.getSenders();
          const videoSender = senders.find(s =>
            s.track && s.track.kind === 'video'
          );

          if (videoSender) {
            videoSender.replaceTrack(screenTrack);
            console.log(`[SCREEN] Video track replaced for peer: ${userId}`);
          } else {
            console.warn(`[SCREEN] No video sender found for peer: ${userId}`);
          }
        } catch (err) {
          console.error(`[SCREEN] Error replacing track for peer ${userId}:`, err);
        }
      });

      setIsScreenSharing(true);

      // Handle user stopping share via browser UI
      screenTrack.onended = () => {
        console.log('[SCREEN] Screen share stopped via browser UI');
        stopScreenShare();
      };

    } catch (err) {
      console.error('[SCREEN] Error starting screen share:', err);
      
      if (err.name === 'NotAllowedError') {
        setScreenShareError('Screen share permission denied. Please try again.');
      } else if (err.name === 'NotFoundError') {
        setScreenShareError('No screen or window found for sharing.');
      } else {
        setScreenShareError(`Unable to share screen: ${err.message}`);
      }
    }
  }, [peersRef]);

  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    console.log('[SCREEN] Stopping screen share...');

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('[SCREEN] Screen share track stopped');
      });
      screenStreamRef.current = null;
    }

    // Restore original camera video track
    const stream = localStreamRef.current;
    if (originalVideoTrackRef.current && stream) {
      const videoTracks = stream.getVideoTracks();

      if (videoTracks.length > 0) {
        stream.removeTrack(videoTracks[0]);
      }

      stream.addTrack(originalVideoTrackRef.current);
      console.log('[SCREEN] Original camera track restored');

      // Force React to re-render
      setStreamVersion(prev => prev + 1);

      // Restore in peer connections
      const peerCount = Object.keys(peersRef.current).length;
      console.log(`[SCREEN] Restoring video track in ${peerCount} peer connection(s)`);

      Object.entries(peersRef.current).forEach(([userId, peer]) => {
        try {
          const senders = peer._pc.getSenders();
          const videoSender = senders.find(s =>
            s.track && s.track.kind === 'video'
          );

          if (videoSender) {
            videoSender.replaceTrack(originalVideoTrackRef.current);
            console.log(`[SCREEN] Video track restored for peer: ${userId}`);
          }
        } catch (err) {
          console.error(`[SCREEN] Error restoring track for peer ${userId}:`, err);
        }
      });

      originalVideoTrackRef.current = null;
    }

    setIsScreenSharing(false);
    setScreenShareError(null);
    console.log('[SCREEN] Screen share stopped');
  }, [peersRef]);

  return {
    isScreenSharing,
    screenShareError,
    startScreenShare,
    stopScreenShare,
    streamVersion // Return this so VideoCard can use it
  };
}

export default useScreenShare;
