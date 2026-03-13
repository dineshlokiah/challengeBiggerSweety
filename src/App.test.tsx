/**
 * Unit tests for App component
 * Validates: Requirements 11.1, 11.2, 11.4, 11.5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { marathonStore } from './store/MarathonStore';
import { MarathonConfig } from './types';

// Mock child components
vi.mock('./components', () => ({
  ConfigurationSuite: ({ onStartMarathon }: any) => (
    <div data-testid="configuration-suite">
      <button onClick={() => onStartMarathon({
        subject: 'addition',
        digitCountA: 2,
        digitCountB: 2,
        volume: 10,
        speedLimit: 30,
      })}>
        Start Marathon
      </button>
    </div>
  ),
  MarathonInterface: ({ config, onComplete }: any) => (
    <div data-testid="marathon-interface">
      <div>Subject: {config.subject}</div>
      <button onClick={() => onComplete({
        config,
        questionResults: [],
        totalScore: 0,
        percentage: 0,
        totalTime: 0,
        completedAt: new Date(),
      })}>
        Complete Marathon
      </button>
    </div>
  ),
  ResultGenerator: ({ results, onReturnToConfiguration }: any) => (
    <div data-testid="result-generator">
      <div>Score: {results.totalScore}</div>
      <button onClick={onReturnToConfiguration}>
        Return to Configuration
      </button>
    </div>
  ),
}));

describe('App Component', () => {
  beforeEach(() => {
    // Reset store before each test
    marathonStore.returnToConfiguration();
  });

  describe('Initial Render', () => {
    it('should render configuration suite on initial load', () => {
      render(<App />);
      expect(screen.getByTestId('configuration-suite')).toBeInTheDocument();
    });
  });

  describe('Routing Logic', () => {
    it('should navigate to marathon screen when marathon starts', async () => {
      render(<App />);

      // Initially on configuration screen
      expect(screen.getByTestId('configuration-suite')).toBeInTheDocument();

      // Start marathon
      const startButton = screen.getByText('Start Marathon');
      startButton.click();

      // Should navigate to marathon screen
      await waitFor(() => {
        expect(screen.getByTestId('marathon-interface')).toBeInTheDocument();
      });
    });

    it('should navigate to results screen when marathon completes', async () => {
      render(<App />);

      // Start marathon
      const startButton = screen.getByText('Start Marathon');
      startButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('marathon-interface')).toBeInTheDocument();
      });

      // Complete marathon
      const completeButton = screen.getByText('Complete Marathon');
      completeButton.click();

      // Should navigate to results screen
      await waitFor(() => {
        expect(screen.getByTestId('result-generator')).toBeInTheDocument();
      });
    });

    it('should navigate back to configuration from results', async () => {
      render(<App />);

      // Start marathon
      screen.getByText('Start Marathon').click();

      await waitFor(() => {
        expect(screen.getByTestId('marathon-interface')).toBeInTheDocument();
      });

      // Complete marathon
      screen.getByText('Complete Marathon').click();

      await waitFor(() => {
        expect(screen.getByTestId('result-generator')).toBeInTheDocument();
      });

      // Return to configuration
      screen.getByText('Return to Configuration').click();

      await waitFor(() => {
        expect(screen.getByTestId('configuration-suite')).toBeInTheDocument();
      });
    });
  });

  describe('Component Orchestration', () => {
    it('should pass marathon config to MarathonInterface', async () => {
      render(<App />);

      // Start marathon
      screen.getByText('Start Marathon').click();

      await waitFor(() => {
        expect(screen.getByText('Subject: addition')).toBeInTheDocument();
      });
    });

    it('should pass results to ResultGenerator', async () => {
      render(<App />);

      // Start and complete marathon
      screen.getByText('Start Marathon').click();

      await waitFor(() => {
        expect(screen.getByTestId('marathon-interface')).toBeInTheDocument();
      });

      screen.getByText('Complete Marathon').click();

      await waitFor(() => {
        expect(screen.getByText('Score: 0')).toBeInTheDocument();
      });
    });
  });

  describe('State Management Integration', () => {
    it('should sync with marathonStore state changes', async () => {
      render(<App />);

      // Verify initial state
      expect(marathonStore.getCurrentScreen()).toBe('configuration');

      // Start marathon via store
      const config: MarathonConfig = {
        subject: 'multiplication',
        digitCountA: 3,
        digitCountB: 2,
        volume: 20,
        speedLimit: 60,
      };

      marathonStore.startMarathon(config);

      // App should update to show marathon interface
      await waitFor(() => {
        expect(screen.getByTestId('marathon-interface')).toBeInTheDocument();
      });
    });

    it('should handle fallback to configuration when config is missing', () => {
      // Manually set store to marathon screen without config
      marathonStore['state'] = {
        currentScreen: 'marathon',
        marathonConfig: null,
        marathonState: null,
        marathonResults: null,
      };

      render(<App />);

      // Should fallback to configuration
      expect(screen.getByTestId('configuration-suite')).toBeInTheDocument();
    });

    it('should handle fallback to configuration when results are missing', () => {
      // Manually set store to results screen without results
      marathonStore['state'] = {
        currentScreen: 'results',
        marathonConfig: null,
        marathonState: null,
        marathonResults: null,
      };

      render(<App />);

      // Should fallback to configuration
      expect(screen.getByTestId('configuration-suite')).toBeInTheDocument();
    });
  });

  describe('Data Flow', () => {
    it('should maintain data flow from configuration through marathon to results', async () => {
      render(<App />);

      // Start marathon
      screen.getByText('Start Marathon').click();

      await waitFor(() => {
        expect(screen.getByTestId('marathon-interface')).toBeInTheDocument();
      });

      // Verify config is passed
      expect(marathonStore.getMarathonConfig()).toEqual({
        subject: 'addition',
        digitCountA: 2,
        digitCountB: 2,
        volume: 10,
        speedLimit: 30,
      });

      // Complete marathon
      screen.getByText('Complete Marathon').click();

      await waitFor(() => {
        expect(screen.getByTestId('result-generator')).toBeInTheDocument();
      });

      // Verify results are stored
      const results = marathonStore.getMarathonResults();
      expect(results).toBeDefined();
      expect(results?.config.subject).toBe('addition');
    });
  });

  describe('Client-Side Only Operation', () => {
    it('should operate without server communication', async () => {
      // Mock fetch to ensure no network requests
      const fetchSpy = vi.spyOn(global, 'fetch');

      render(<App />);

      // Navigate through all screens
      screen.getByText('Start Marathon').click();

      await waitFor(() => {
        expect(screen.getByTestId('marathon-interface')).toBeInTheDocument();
      });

      screen.getByText('Complete Marathon').click();

      await waitFor(() => {
        expect(screen.getByTestId('result-generator')).toBeInTheDocument();
      });

      // Verify no fetch calls were made
      expect(fetchSpy).not.toHaveBeenCalled();

      fetchSpy.mockRestore();
    });

    it('should store all state in memory', async () => {
      render(<App />);

      // Start marathon
      screen.getByText('Start Marathon').click();

      await waitFor(() => {
        expect(screen.getByTestId('marathon-interface')).toBeInTheDocument();
      });

      // Verify state is in memory
      const state = marathonStore.getState();
      expect(state.marathonConfig).toBeDefined();
      expect(state.currentScreen).toBe('marathon');

      // Verify no localStorage or sessionStorage usage
      expect(localStorage.length).toBe(0);
      expect(sessionStorage.length).toBe(0);
    });
  });
});
