/**
 * ConfigurationSuite Component
 * Pre-race setup interface for selecting marathon parameters
 */
import React, { useState } from 'react';
import type { MarathonConfig, Subject, AnswerMode } from '../types';
import { Stepper } from './Stepper';

interface ConfigurationSuiteProps {
  onStartMarathon: (config: MarathonConfig) => void;
}

type PresetVolume = 10 | 20 | 50 | 'endless';
type PresetSpeed = 10 | 30 | 60;
type PresetDigit = 1 | 2 | 3 | 4;

const SUBJECT_OPTIONS: { value: Subject; label: string; icon: string }[] = [
  { value: 'addition', label: 'Addition', icon: '➕' },
  { value: 'subtraction', label: 'Subtraction', icon: '➖' },
  { value: 'multiplication', label: 'Multiply', icon: '✖️' },
  { value: 'division', label: 'Division', icon: '➗' },
  { value: 'greater-than-lesser-than', label: 'Compare', icon: '⚖️' },
  { value: 'fill-the-missing-number', label: 'Fill Gap', icon: '🔍' },
];

const ConfigurationSuite: React.FC<ConfigurationSuiteProps> = ({ onStartMarathon }) => {
  const [subject, setSubject] = useState<Subject | null>(null);

  // Digit counts
  const [digitCountA, setDigitCountA] = useState<number | null>(null);
  const [digitCountB, setDigitCountB] = useState<number | null>(null);
  const [customDigitA, setCustomDigitA] = useState<string>('');
  const [customDigitB, setCustomDigitB] = useState<string>('');

  // Volume
  const [presetVolume, setPresetVolume] = useState<PresetVolume | null>(null);
  const [customVolume, setCustomVolume] = useState<number>(10);
  const [useCustomVolume, setUseCustomVolume] = useState(false);

  // Speed
  const [presetSpeed, setPresetSpeed] = useState<PresetSpeed | null>(null);
  const [customSpeed, setCustomSpeed] = useState<number>(15);
  const [useCustomSpeed, setUseCustomSpeed] = useState(false);

  // Answer mode & decimals
  const [answerMode, setAnswerMode] = useState<AnswerMode | null>(null);
  const [allowDecimals, setAllowDecimals] = useState(false);

  const volume = useCustomVolume ? customVolume : presetVolume;
  const speedLimit = useCustomSpeed ? customSpeed : presetSpeed;

  const isConfigComplete =
    subject !== null &&
    digitCountA !== null &&
    digitCountB !== null &&
    volume !== null &&
    speedLimit !== null &&
    answerMode !== null;

  const handleStartMarathon = () => {
    if (isConfigComplete) {
      onStartMarathon({
        subject: subject!,
        digitCountA: digitCountA!,
        digitCountB: digitCountB!,
        volume: volume!,
        speedLimit: speedLimit!,
        answerMode: answerMode!,
        allowDecimals,
      });
    }
  };

  const clampDigit = (val: string): number => Math.min(6, Math.max(1, parseInt(val) || 1));

  const handleCustomDigitA = (val: string) => {
    setCustomDigitA(val);
    if (val !== '') {
      setDigitCountA(clampDigit(val));
    }
  };

  const handleCustomDigitB = (val: string) => {
    setCustomDigitB(val);
    if (val !== '') {
      setDigitCountB(clampDigit(val));
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>challengeandgrow</h1>
      <p style={styles.subtitle}>Configure Your Math Marathon</p>
      <p style={styles.privacyNote}>
        🔒 Your data never leaves your device — we do not send your data to our servers.
      </p>


      <div style={styles.configSection}>

        {/* Subject */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Subject</h2>
          <div style={{ ...styles.buttonGrid, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {SUBJECT_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSubject(s.value)}
                style={{ ...styles.optionButton, ...styles.subjectButton, ...(subject === s.value ? styles.selected : {}) }}
                aria-pressed={subject === s.value}
              >
                <span style={styles.subjectIcon}>{s.icon}</span>
                <span style={styles.subjectLabel}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Number A Digits */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Number A Digits</h2>
          <div style={styles.buttonGrid}>
            {([1, 2, 3, 4] as PresetDigit[]).map((d) => (
              <button
                key={d}
                onClick={() => { setDigitCountA(d); setCustomDigitA(''); }}
                style={{ ...styles.optionButton, ...(digitCountA === d && customDigitA === '' ? styles.selected : {}) }}
                aria-pressed={digitCountA === d && customDigitA === ''}
              >
                {d}
              </button>
            ))}
            <div style={styles.customInputWrap}>
              <input
                type="number"
                min={1}
                max={6}
                placeholder="5–6"
                value={customDigitA}
                onChange={(e) => handleCustomDigitA(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value !== '') {
                    const clamped = clampDigit(e.target.value);
                    setCustomDigitA(String(clamped));
                    setDigitCountA(clamped);
                  }
                }}
                style={styles.customInput}
                aria-label="Custom digit count for Number A"
              />
            </div>
          </div>
        </div>

        {/* Number B Digits */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Number B Digits</h2>
          <div style={styles.buttonGrid}>
            {([1, 2, 3, 4] as PresetDigit[]).map((d) => (
              <button
                key={d}
                onClick={() => { setDigitCountB(d); setCustomDigitB(''); }}
                style={{ ...styles.optionButton, ...(digitCountB === d && customDigitB === '' ? styles.selected : {}) }}
                aria-pressed={digitCountB === d && customDigitB === ''}
              >
                {d}
              </button>
            ))}
            <div style={styles.customInputWrap}>
              <input
                type="number"
                min={1}
                max={6}
                placeholder="5–6"
                value={customDigitB}
                onChange={(e) => handleCustomDigitB(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value !== '') {
                    const clamped = clampDigit(e.target.value);
                    setCustomDigitB(String(clamped));
                    setDigitCountB(clamped);
                  }
                }}
                style={styles.customInput}
                aria-label="Custom digit count for Number B"
              />
            </div>
          </div>
        </div>

        {/* Number of Questions */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Number of Questions</h2>
          <div style={styles.inlineRow}>
            {([10, 20, 50] as PresetVolume[]).map((v) => (
              <button
                key={v}
                onClick={() => { setPresetVolume(v); setUseCustomVolume(false); }}
                style={{ ...styles.optionButton, ...styles.compactButton, ...(!useCustomVolume && presetVolume === v ? styles.selected : {}) }}
                aria-pressed={!useCustomVolume && presetVolume === v}
              >
                {v}
              </button>
            ))}
            <button
              onClick={() => { setPresetVolume('endless'); setUseCustomVolume(false); }}
              style={{ ...styles.optionButton, ...styles.compactButton, ...(!useCustomVolume && presetVolume === 'endless' ? styles.selected : {}) }}
              aria-pressed={!useCustomVolume && presetVolume === 'endless'}
            >
              ∞
            </button>
            <div style={styles.inlineStepper}>
              <Stepper
                value={customVolume}
                min={1}
                max={999}
                step={1}
                label="Custom question count"
                onChange={(v) => { setCustomVolume(v); setUseCustomVolume(true); setPresetVolume(null); }}
              />
            </div>
          </div>
        </div>

        {/* Time Per Question */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Time Per Question</h2>
          <div style={styles.inlineRow}>
            {([10, 30, 60] as PresetSpeed[]).map((s) => (
              <button
                key={s}
                onClick={() => { setPresetSpeed(s); setUseCustomSpeed(false); }}
                style={{ ...styles.optionButton, ...styles.compactButton, ...(!useCustomSpeed && presetSpeed === s ? styles.selected : {}) }}
                aria-pressed={!useCustomSpeed && presetSpeed === s}
              >
                {s}s
              </button>
            ))}
            <div style={styles.inlineStepper}>
              <Stepper
                value={customSpeed}
                min={5}
                max={300}
                step={5}
                unit="s"
                label="Custom time per question"
                onChange={(v) => { setCustomSpeed(v); setUseCustomSpeed(true); setPresetSpeed(null); }}
              />
            </div>
          </div>
        </div>

        {/* Answer Mode */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Answer Mode</h2>
          <div style={styles.buttonGrid}>
            <button
              onClick={() => setAnswerMode('multiple-choice')}
              style={{ ...styles.optionButton, ...(answerMode === 'multiple-choice' ? styles.selected : {}) }}
              aria-pressed={answerMode === 'multiple-choice'}
            >
              <span style={{ fontSize: '18px' }}>🔘</span>
              <span style={styles.optionLabel}>Multiple Choice</span>
            </button>
            <button
              onClick={() => setAnswerMode('fill-in-the-blank')}
              style={{ ...styles.optionButton, ...(answerMode === 'fill-in-the-blank' ? styles.selected : {}) }}
              aria-pressed={answerMode === 'fill-in-the-blank'}
            >
              <span style={{ fontSize: '18px' }}>✏️</span>
              <span style={styles.optionLabel}>Fill in Blank</span>
            </button>
          </div>
        </div>

        {/* Decimal Mode */}
        <div style={styles.parameterGroup}>
          <h2 style={styles.parameterLabel}>Decimal Numbers</h2>
          <div style={styles.buttonGrid}>
            <button
              onClick={() => setAllowDecimals(false)}
              style={{ ...styles.optionButton, ...(!allowDecimals ? styles.selected : {}) }}
              aria-pressed={!allowDecimals}
            >
              <span style={{ fontSize: '18px' }}>🔢</span>
              <span style={styles.optionLabel}>Whole Numbers</span>
            </button>
            <button
              onClick={() => setAllowDecimals(true)}
              style={{ ...styles.optionButton, ...(allowDecimals ? styles.selected : {}) }}
              aria-pressed={allowDecimals}
            >
              <span style={{ fontSize: '18px' }}>🔣</span>
              <span style={styles.optionLabel}>With Decimals</span>
            </button>
          </div>
        </div>

      </div>

      <button
        onClick={handleStartMarathon}
        disabled={!isConfigComplete}
        style={{ ...styles.startButton, ...(!isConfigComplete ? styles.startButtonDisabled : {}) }}
        aria-disabled={!isConfigComplete}
      >
        Start Marathon 🚀
      </button>
    </div>
  );
};

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
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  privacyNote: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '1.5rem',
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    border: '1px solid rgba(46, 204, 113, 0.3)',
    borderRadius: '6px',
    padding: '6px 12px',
    textAlign: 'center',
  },
  configSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginBottom: '2rem',
  },
  parameterGroup: { width: '100%' },
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
  selected: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
    transform: 'scale(1.05)',
  },
  optionLabel: {
    fontSize: 'clamp(0.65rem, 2vw, 0.8rem)',
    fontWeight: 400,
  },
  customInputWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customInput: {
    width: '100%',
    minHeight: '44px',
    padding: '8px 12px',
    fontSize: '16px',
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    textAlign: 'center',
    outline: 'none',
  },
  customLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subjectButton: {
    minHeight: '80px',
    padding: '14px 10px',
    borderRadius: '16px',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
  },
  subjectIcon: {
    fontSize: '32px',
    lineHeight: '1',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
  subjectLabel: {
    fontSize: 'clamp(0.65rem, 2vw, 0.85rem)',
    fontWeight: 600,
    marginTop: '4px',
  },
  inlineRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    width: '100%',
    alignItems: 'center',
  },
  compactButton: {
    flex: '0 0 auto',
    minWidth: '56px',
    padding: '10px 12px',
  },
  inlineStepper: {
    flex: '1 1 160px',
    minWidth: '160px',
  },
  startButton: {
    minWidth: '200px',
    minHeight: '44px',
    padding: '16px 32px',
    fontFamily: "'Fredoka One', cursive",
    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    color: '#ffffff',
    backgroundColor: '#FF8C00',
    border: 'none',
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
