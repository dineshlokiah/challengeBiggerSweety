/**
 * ConfigurationSuite Component
 * Pre-race setup interface for selecting marathon parameters
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 9.3, 9.4, 10.5
 */
import React, { useState } from 'react';
import { MarathonConfig } from '../types';

interface ConfigurationSuiteProps {
  onStartMarathon: (config: MarathonConfig) => void;
}

type Subject = 'addition' | 'subtraction' | 'multiplication' | 'division';
type DigitCount = 1 | 2 | 3 | 4;
type Volume = 10 | 20 | 50 | 'endless';
type SpeedLimit = 10 | 30 | 60;

const ConfigurationSuite: React.FC<ConfigurationSuiteProps> = ({ onStartMarathon }) => {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [digitCountA, setDigitCountA] = useState<DigitCount | null>(null);
  const [digitCountB, setDigitCountB] = useState<DigitCount | null>(null);
  const [volume, setVolume] = useState<Volume | null>(null);
  const [speedLimit, setSpeedLimit] = useState<SpeedLimit | null>(null);

  // Check if all parameters are selected
  const isConfigComplete = 
    subject !== null && 
    digitCountA !== null && 
    digitCountB !== null && 
    volume !== null && 
    speedLimit !== null;

  const handleStartMarathon = () => {
    if (isConfigComplete) {
      onStartMarathon({
        subject: subject!,
        digitCountA: digitCountA!,
        digitCountB: digitCountB!,
        volume: volume!,
        speedLimit: speedLimit!,
      });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>challengeandgrow</h1>
      <p style={styles.subtitle}>Configure Your Math Marathon</p>
      <p style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '1.5rem',
        backgroundColor: 'rgba(46, 204, 113, 0.15)',
        border: '1px solid rgba(46, 204, 113, 0.3)',
        borderRadius: '6px',
        padding: '6px 12px',
        textAlign: 'center',
      }}>
        🔒 Your data never leaves your device — we do not send your data to our servers.
      </p>

      <div style={styles.configSection}>
        {/* Subject Selection */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Subject</h2>
          <div style={styles.buttonGrid}>
            {(['addition', 'subtraction', 'multiplication', 'division'] as Subject[]).map((s) => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                style={{
                  ...styles.optionButton,
                  ...(subject === s ? styles.optionButtonSelected : {}),
                }}
                aria-pressed={subject === s}
              >
                {s === 'addition' && '+'}
                {s === 'subtraction' && '−'}
                {s === 'multiplication' && '×'}
                {s === 'division' && '÷'}
                <span style={styles.optionLabel}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Number A Digit Count */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Number A Digits</h2>
          <div style={styles.buttonGrid}>
            {([1, 2, 3, 4] as DigitCount[]).map((count) => (
              <button
                key={count}
                onClick={() => setDigitCountA(count)}
                style={{
                  ...styles.optionButton,
                  ...(digitCountA === count ? styles.optionButtonSelected : {}),
                }}
                aria-pressed={digitCountA === count}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Number B Digit Count */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Number B Digits</h2>
          <div style={styles.buttonGrid}>
            {([1, 2, 3, 4] as DigitCount[]).map((count) => (
              <button
                key={count}
                onClick={() => setDigitCountB(count)}
                style={{
                  ...styles.optionButton,
                  ...(digitCountB === count ? styles.optionButtonSelected : {}),
                }}
                aria-pressed={digitCountB === count}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Volume Selection */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Questions</h2>
          <div style={styles.buttonGrid}>
            {([10, 20, 50, 'endless'] as Volume[]).map((v) => (
              <button
                key={v}
                onClick={() => setVolume(v)}
                style={{
                  ...styles.optionButton,
                  ...(volume === v ? styles.optionButtonSelected : {}),
                }}
                aria-pressed={volume === v}
              >
                {v === 'endless' ? '∞' : v}
              </button>
            ))}
          </div>
        </div>

        {/* Speed Limit Selection */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Time Per Question</h2>
          <div style={styles.buttonGrid}>
            {([10, 30, 60] as SpeedLimit[]).map((seconds) => (
              <button
                key={seconds}
                onClick={() => setSpeedLimit(seconds)}
                style={{
                  ...styles.optionButton,
                  ...(speedLimit === seconds ? styles.optionButtonSelected : {}),
                }}
                aria-pressed={speedLimit === seconds}
              >
                {seconds}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartMarathon}
        disabled={!isConfigComplete}
        style={{
          ...styles.startButton,
          ...(isConfigComplete ? {} : styles.startButtonDisabled),
        }}
        aria-disabled={!isConfigComplete}
      >
        Start Marathon
      </button>
    </div>
  );
};

// Styles with mobile responsiveness and design system
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontFamily: "'Fredoka One', cursive",
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    color: '#FF8C00',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: 'clamp(1rem, 3vw, 1.5rem)',
    color: '#ffffff',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  configSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginBottom: '2rem',
  },
  parameterGroup: {
    width: '100%',
  },
  parameterLabel: {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '12px',
    textAlign: 'center',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '12px',
    width: '100%',
  },
  optionButton: {
    minWidth: '44px',
    minHeight: '44px',
    padding: '12px 16px',
    fontFamily: "'Quicksand', sans-serif",
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  optionButtonSelected: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
    transform: 'scale(1.05)',
  },
  optionLabel: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: 400,
  },
  startButton: {
    minWidth: '200px',
    minHeight: '44px',
    padding: '16px 32px',
    fontFamily: "'Fredoka One', cursive",
    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    color: '#ffffff',
    backgroundColor: '#FF8C00',
    borderWidth: '0',
    borderStyle: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '1rem',
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(255, 140, 0, 0.3)',
    cursor: 'not-allowed',
    opacity: 0.5,
  },
};

export default ConfigurationSuite;
