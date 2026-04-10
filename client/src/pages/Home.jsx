import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMeetingCode } from '../utils/meetingUtils';

function Home() {
  const [meetingCode, setMeetingCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  // Create a new meeting
  const handleNewMeeting = () => {
    setIsCreating(true);
    // Small delay for UX feedback
    setTimeout(() => {
      const roomId = generateMeetingCode();
      navigate(`/meet/${roomId}`);
    }, 300);
  };

  // Join an existing meeting
  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (meetingCode.trim()) {
      navigate(`/meet/${meetingCode.trim()}`);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Google Meet Clone</h1>
        <p>Video calls and meetings for everyone</p>
      </div>

      <div className="home-card">
        <h2>Start or join a meeting</h2>

        <button 
          className="btn btn-primary" 
          onClick={handleNewMeeting} 
          disabled={isCreating}
          style={{ width: '100%', marginBottom: '24px' }}
        >
          {isCreating ? (
            <>
              <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
              Creating...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              New Meeting
            </>
          )}
        </button>

        <form onSubmit={handleJoinMeeting}>
          <div className="input-group">
            <label htmlFor="meeting-code">Meeting Code</label>
            <input
              type="text"
              id="meeting-code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value.toLowerCase())}
              placeholder="Enter a meeting code"
              autoComplete="off"
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="btn btn-secondary" 
              style={{ width: '100%' }}
              disabled={!meetingCode.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Join Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
