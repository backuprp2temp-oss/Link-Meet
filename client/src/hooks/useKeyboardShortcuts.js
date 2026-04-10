import { useEffect } from 'react';

function useKeyboardShortcuts({ onToggleAudio, onToggleVideo, onToggleScreenShare, onLeave }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl+D or Cmd+D - Toggle microphone
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (onToggleAudio) {
          onToggleAudio();
          console.log('[SHORTCUT] Toggle microphone');
        }
      }

      // Ctrl+E or Cmd+E - Toggle camera
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (onToggleVideo) {
          onToggleVideo();
          console.log('[SHORTCUT] Toggle camera');
        }
      }

      // Ctrl+Shift+E or Cmd+Shift+E - Toggle screen share
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        if (onToggleScreenShare) {
          onToggleScreenShare();
          console.log('[SHORTCUT] Toggle screen share');
        }
      }

      // Ctrl+Shift+D or Cmd+Shift+D - Leave meeting
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        if (onLeave) {
          const confirmLeave = window.confirm('Are you sure you want to leave the meeting?');
          if (confirmLeave) {
            onLeave();
            console.log('[SHORTCUT] Leave meeting');
          }
        }
      }

      // Space - Toggle microphone (when not in input)
      if (e.key === ' ' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (onToggleAudio) {
          onToggleAudio();
          console.log('[SHORTCUT] Toggle microphone (space)');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onToggleAudio, onToggleVideo, onToggleScreenShare, onLeave]);
}

export default useKeyboardShortcuts;
