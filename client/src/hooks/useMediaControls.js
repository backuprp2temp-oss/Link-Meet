import { useState, useCallback, useRef } from 'react';

function useMediaControls(localStream, peersRef) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const currentStreamRef = useRef(localStream);

  // Update ref when localStream changes
  if (localStream !== currentStreamRef.current) {
    currentStreamRef.current = localStream;
  }

  // Toggle microphone on/off
  const toggleAudio = useCallback(() => {
    const stream = currentStreamRef.current;
    if (!stream) {
      console.warn('[MEDIA] No local stream available');
      return;
    }

    const audioTracks = stream.getAudioTracks();
    
    if (audioTracks.length > 0) {
      const audioTrack = audioTracks[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
      
      console.log(`[MEDIA] Audio ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
    } else {
      console.warn('[MEDIA] No audio tracks found');
    }
  }, []);

  // Toggle camera on/off - Immediate hardware stop/restart
  const toggleVideo = useCallback(async () => {
    const stream = currentStreamRef.current;
    if (!stream) {
      console.warn('[MEDIA] No local stream available');
      return;
    }

    if (isVideoEnabled) {
      // IMMEDIATELY stop ALL video tracks
      const videoTracks = stream.getVideoTracks();
      
      console.log(`[MEDIA] Stopping ${videoTracks.length} video track(s)...`);
      
      // Stop synchronously - this should turn off LED instantly
      videoTracks.forEach(track => {
        console.log(`[MEDIA] Stopping track: ${track.label}, state: ${track.readyState}`);
        track.stop();
        console.log(`[MEDIA] Track stopped, state: ${track.readyState}`);
      });
      
      // Remove tracks from stream immediately
      videoTracks.forEach(track => {
        stream.removeTrack(track);
      });
      
      // Update state immediately
      setIsVideoEnabled(false);
      console.log('[MEDIA] ✓ Camera stopped (LED should turn off NOW)');
      
      // Remove from peers asynchronously (non-blocking)
      setTimeout(() => {
        Object.entries(peersRef.current).forEach(([userId, peer]) => {
          try {
            const senders = peer._pc.getSenders();
            const videoSender = senders.find(s => s.track && s.track.kind === 'video');
            if (videoSender) {
              videoSender.replaceTrack(null);
              console.log(`[MEDIA] Removed video for peer ${userId}`);
            }
          } catch (err) {
            console.error(`[MEDIA] Error removing video for peer ${userId}:`, err);
          }
        });
      }, 0);
      
    } else {
      // START camera immediately
      try {
        console.log('[MEDIA] Requesting new camera...');
        const newStream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });
        
        const newVideoTrack = newStream.getVideoTracks()[0];
        stream.addTrack(newVideoTrack);
        currentStreamRef.current = stream;
        setIsVideoEnabled(true);
        console.log('[MEDIA] ✓ Camera started (LED should turn on NOW)');
        
        // Update peers
        setTimeout(() => {
          Object.entries(peersRef.current).forEach(([userId, peer]) => {
            try {
              const senders = peer._pc.getSenders();
              const videoSender = senders.find(s => s.track && s.track.kind === 'video');
              if (videoSender) {
                videoSender.replaceTrack(newVideoTrack);
                console.log(`[MEDIA] Added video for peer ${userId}`);
              }
            } catch (err) {
              console.error(`[MEDIA] Error adding video for peer ${userId}:`, err);
            }
          });
        }, 0);
      } catch (err) {
        console.error('[MEDIA] Error restarting camera:', err);
        alert('Failed to restart camera. Please refresh the page.');
      }
    }
  }, [isVideoEnabled, peersRef]);

  return {
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo
  };
}

export default useMediaControls;
