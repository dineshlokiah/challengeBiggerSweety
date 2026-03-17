/**
 * Core type definitions for challengeandgrow
 * Validates: Requirements 11.1, 11.2
 */

/**
 * Marathon configuration parameters selected by the user
 */
export interface MarathonConfig {
  subject: 'addition' | 'subtraction' | 'multiplication' | 'division';
  digitCountA: 1 | 2 | 3 | 4;
  digitCountB: 1 | 2 | 3 | 4;
  volume: 10 | 20 | 50 | 'endless';
  speedLimit: 10 | 30 | 60; // seconds per question
}

/**
 * A single math problem with its solution
 */
export interface Question {
  operandA: number;
  operandB: number;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  correctAnswer: number;
  questionNumber: number; // 1-indexed
}

/**
 * The outcome of a single question attempt
 */
export interface QuestionResult {
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
  pointsAwarded: number; // 0, 0.5, or 1
  answeredAfterExpiry: boolean;
  timeSpent: number; // seconds from question display to answer submission
}

/**
 * Current state of an active marathon session
 */
export interface MarathonState {
  config: MarathonConfig;
  currentQuestion: Question;
  questionHistory: QuestionResult[];
  isPaused: boolean;
  startTime: number; // Unix timestamp in milliseconds
  currentQuestionStartTime: number; // Unix timestamp in milliseconds
  timerRemainingSeconds: number;
  timerExpired: boolean;
}

/**
 * Aggregated data from a completed marathon session
 */
export interface MarathonResults {
  config: MarathonConfig;
  questionResults: QuestionResult[];
  totalScore: number;
  percentage: number;
  totalTime: number; // seconds from start to completion
  completedAt: Date;
}

/**
 * Timer component state
 */
export interface TimerState {
  remainingTime: number; // seconds
  isExpired: boolean;
  visualState: 'active' | 'expired';
}
