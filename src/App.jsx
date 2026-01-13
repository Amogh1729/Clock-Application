import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [time, setTime] = useState(new Date());
  const [timerState, setTimerState] = useState({
    isActive: false,
    element: null,
    remainingSeconds: 0,
    duration: 0
  });
  const [isFlashing, setIsFlashing] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef(null);

  // Time Update
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (timerState.isActive) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (prev.remainingSeconds <= 1) {
            completedTimer();
            return { ...prev, remainingSeconds: 0, isActive: false };
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState.isActive]);


  const completedTimer = () => {
    playDongSound();
    setIsFlashing(true);
    // Stop flashing after 5 seconds
    setTimeout(() => {
      setIsFlashing(false);
      setTimerState(prev => ({ ...prev, duration: 0 })); // Reset timer mode to show clock again
    }, 5000);
  };

  const playDongSound = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Bell/Dong simulation: Lower frequency, decay
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime); // Low fundamental
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.5); // Drop pitch slightly

    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2); // Long decay

    oscillator.start();
    oscillator.stop(ctx.currentTime + 2.5);
  };

  const startTimer = (minutes) => {
    // Init audio context on user interaction if needed
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Resume if suspended (browser autoplay policy)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const seconds = minutes * 60;
    setTimerState({
      isActive: true,
      remainingSeconds: seconds,
      duration: seconds
    });
    setIsFlashing(false);
  };

  const stopTimer = () => {
    setTimerState({ isActive: false, remainingSeconds: 0, duration: 0 });
    setIsFlashing(false);
  };

  const getTimeParts = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const strHours = hours < 10 ? '0' + hours : hours;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;

    return { hours: strHours, minutes: strMinutes, ampm };
  };

  const getTimerParts = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    let left, right, label;

    if (h > 0) {
      left = h < 10 ? '0' + h : h;
      right = m < 10 ? '0' + m : m;
      label = "HR : MIN";
    } else {
      left = m < 10 ? '0' + m : m;
      right = s < 10 ? '0' + s : s;
      label = "MIN : SEC";
    }

    return { left, right, label };
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Render Data Preparation
  const isTimerMode = timerState.duration > 0 || isFlashing;

  let displayLeft, displayRight, displayAmpm, displayBottomText;

  if (isTimerMode) {
    const { left, right, label } = getTimerParts(timerState.remainingSeconds);
    displayLeft = left;
    displayRight = right;
    displayAmpm = label;

    const t = getTimeParts(time);
    displayBottomText = `${t.hours}:${t.minutes} ${t.ampm}`;
  } else {
    const t = getTimeParts(time);
    displayLeft = t.hours;
    displayRight = t.minutes;
    displayAmpm = t.ampm;
    displayBottomText = formatDate(time);
  }

  return (
    <div className={`digital-clock-page ${isFlashing ? 'flashing' : ''}`}>
      {/* Top Controls */}
      {/* Removed More Widget Button */}

      <button className="nav-btn top-right" onClick={toggleFullScreen} title="Toggle Full Screen">
        ⛶
      </button>

      {/* Main Display */}
      <div className="clock-container">
        <div className="flip-clock-display">
          <div className="time-card">
            <span className="card-digit">{displayLeft}</span>
            <div className="card-flap"></div>
            <span className="ampm-text">{displayAmpm}</span>
          </div>
          <div className="time-card">
            <span className="card-digit">{displayRight}</span>
            <div className="card-flap"></div>
          </div>
        </div>
        <p className={`clock-date ${isTimerMode ? 'is-time' : ''}`}>
          {displayBottomText}
        </p>

        {isTimerMode && (
          <button className="cancel-timer-btn" onClick={stopTimer}>
            ✕ Stop Timer
          </button>
        )}
      </div>

      {/* Bottom Controls - Timer Presets */}
      {!isTimerMode && (
        <div className="bottom-controls">
          <div className="corner-group left">
            <button className="timer-btn" onClick={() => startTimer(5)}>5m</button>
            <button className="timer-btn" onClick={() => startTimer(25)}>25m</button>
          </div>

          <div className="corner-group right">
            <button className="timer-btn" onClick={() => startTimer(60)}>1h</button>
            <button className="timer-btn" onClick={() => startTimer(480)}>8h</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
