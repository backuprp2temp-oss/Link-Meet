import { useState, useEffect, useRef } from 'react';

function useLocalStream() {
  const [localStream, setLocalStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const streamRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const getMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Request camera and microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        // Only update state if component is still mounted
        if (isMounted) {
          streamRef.current = stream;
          setLocalStream(stream);
          setIsLoading(false);
          console.log('✓ Successfully accessed camera and microphone');
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        
        if (isMounted) {
          setIsLoading(false);
          
          // Handle specific error types
          if (err.name === 'NotAllowedError') {
            setError('Camera/microphone access denied. Please enable permissions in your browser settings.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera or microphone found on this device.');
          } else if (err.name === 'NotReadableError') {
            setError('Camera or microphone is already in use by another application.');
          } else {
            setError(`Unable to access media: ${err.message}`);
          }
        }
      }
    };

    getMedia();

    // Cleanup function
    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        console.log('✓ Local stream tracks stopped');
      }
    };
  }, []);

  return { localStream, error, isLoading };
}

export default useLocalStream;
