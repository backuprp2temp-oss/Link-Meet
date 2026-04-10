import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';

function Controls({ 
  isAudioEnabled = true, 
  isVideoEnabled = true, 
  isScreenSharing = false,
  onToggleAudio, 
  onToggleVideo, 
  onToggleScreenShare,
  onLeave 
}) {
  return (
    <div className="controls">
      {/* Microphone Button */}
      <button 
        className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`} 
        onClick={onToggleAudio}
        title={isAudioEnabled ? 'Mute (Ctrl+D)' : 'Unmute (Ctrl+D)'}
      >
        {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
        <span>{isAudioEnabled ? 'Mute' : 'Unmute'}</span>
      </button>

      {/* Camera Button */}
      <button 
        className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`} 
        onClick={onToggleVideo}
        title={isVideoEnabled ? 'Stop video (Ctrl+E)' : 'Start video (Ctrl+E)'}
      >
        {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        <span>{isVideoEnabled ? 'Stop video' : 'Start video'}</span>
      </button>

      {/* Screen Share Button */}
      <button 
        className={`control-btn ${isScreenSharing ? 'disabled' : ''}`}
        onClick={onToggleScreenShare}
        title={isScreenSharing ? 'Stop sharing (Ctrl+Shift+E)' : 'Present now (Ctrl+Shift+E)'}
      >
        {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
        <span>{isScreenSharing ? 'Stop sharing' : 'Present now'}</span>
      </button>

      {/* Leave Meeting Button */}
      <button className="leave-btn" onClick={onLeave} title="Leave meeting">
        <CallEndIcon />
        <span>Leave</span>
      </button>
    </div>
  );
}

export default Controls;
