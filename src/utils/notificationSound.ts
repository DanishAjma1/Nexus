/**
 * Play notification sound
 * Uses a simple beep sound generated via Web Audio API if audio file doesn't exist
 */
export const playNotificationSound = () => {
  try {
    // Try to play custom notification sound from public folder
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // If custom sound fails, use Web Audio API to generate a simple beep
      playBeep();
    });
  } catch (error) {
    // Fallback to Web Audio API beep
    playBeep();
  }
};

/**
 * Generate a simple beep sound using Web Audio API
 */
const playBeep = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    // Silently fail if Web Audio API is not supported
    console.log('Notification sound not supported');
  }
};
