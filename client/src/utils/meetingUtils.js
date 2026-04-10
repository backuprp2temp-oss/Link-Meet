/**
 * Generates a random meeting code
 * @param {number} length - Length of the code (default: 8)
 * @returns {string} Random alphanumeric code
 */
export const generateMeetingCode = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Formats a meeting code for display (adds dashes for readability)
 * @param {string} code - Raw meeting code
 * @param {number} groupSize - Size of each group
 * @returns {string} Formatted meeting code
 */
export const formatMeetingCode = (code, groupSize = 4) => {
  if (!code) return '';
  const regex = new RegExp(`.{1,${groupSize}}`, 'g');
  return code.match(regex)?.join('-') || code;
};

/**
 * Gets the full meeting URL
 * @param {string} roomId - Meeting room ID
 * @returns {string} Full meeting URL
 */
export const getMeetingUrl = (roomId) => {
  return `${window.location.origin}/meet/${roomId}`;
};

/**
 * Copies text to clipboard with fallback for older browsers
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern browsers
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        textArea.remove();
        return false;
      }
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

/**
 * Gets participant count from peers object
 * @param {object} peers - Peers object from usePeerConnection
 * @returns {number} Total participant count (including local user)
 */
export const getParticipantCount = (peers) => {
  return Object.keys(peers || {}).length + 1; // +1 for local user
};
