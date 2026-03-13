import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultGenerator } from './ResultGenerator';
import type { MarathonResults, MarathonConfig, QuestionResult } from '../types';

/**
 * Test suite for ResultGenerator component
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 9.1, 11.3
 */

describe('ResultGenerator', () => {
  let mockResults: MarathonResults;
  let mockConfig: MarathonConfig;
  let mockQuestionResults: QuestionResult[];

  // Mock URL.createObjectURL and URL.revokeObjectURL
  const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
  const mockRevokeObjectURL = vi.fn();

  beforeEach(() => {
    // Setup URL mocks
    (global as any).URL.createObjectURL = mockCreateObjectURL;
    (global as any).URL.revokeObjectURL = mockRevokeObjectURL;

    // Mock document.createElement for anchor element
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const mockLink = originalCreateElement('a');
        mockLink.click = vi.fn();
        mockLink.download = '';
        return mockLink;
      }
      return originalCreateElement(tagName);
    });

    // Create mock configuration
    mockConfig = {
      subject: 'addition',
      digitCountA: 2,
      digitCountB: 2,
      volume: 10,
      speedLimit: 30
    };

    // Create mock question results
    mockQuestionResults = [
      {
        question: {
          operandA: 23,
          operandB: 45,
          operation: 'addition',
          correctAnswer: 68,
          questionNumber: 1
        },
        userAnswer: 68,
        isCorrect: true,
        pointsAwarded: 1,
        answeredAfterExpiry: false,
        timeSpent: 5.2
      },
      {
        question: {
          operandA: 87,
          operandB: 34,
          operation: 'addition',
          correctAnswer: 121,
          questionNumber: 2
        },
        userAnswer: 121,
        isCorrect: true,
        pointsAwarded: 0.5,
        answeredAfterExpiry: true,
        timeSpent: 35.8
      },
      {
        question: {
          operandA: 56,
          operandB: 12,
          operation: 'addition',
          correctAnswer: 68,
          questionNumber: 3
        },
        userAnswer: 67,
        isCorrect: false,
        pointsAwarded: 0,
        answeredAfterExpiry: false,
        timeSpent: 8.1
      }
    ];

    // Create mock results
    mockResults = {
      config: mockConfig,
      questionResults: mockQuestionResults,
      totalScore: 1.5,
      percentage: 50.0,
      totalTime: 125.5,
      completedAt: new Date('2024-01-15T14:30:00.000Z')
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Display Summary Statistics', () => {
    it('should display total score with correct format', () => {
      render(<ResultGenerator results={mockResults} />);
      
      expect(screen.getByText('Total Score')).toBeInTheDocument();
      expect(screen.getByText('1.5 / 3')).toBeInTheDocument();
    });

    it('should display percentage with one decimal place', () => {
      render(<ResultGenerator results={mockResults} />);
      
      expect(screen.getByText('Accuracy')).toBeInTheDocument();
      expect(screen.getByText('50.0%')).toBeInTheDocument();
    });

    it('should display total time in MM:SS format', () => {
      render(<ResultGenerator results={mockResults} />);
      
      expect(screen.getByText('Total Time')).toBeInTheDocument();
      expect(screen.getByText('02:05')).toBeInTheDocument();
    });

    it('should display subject and complexity configuration', () => {
      render(<ResultGenerator results={mockResults} />);
      
      expect(screen.getByText('Configuration')).toBeInTheDocument();
      expect(screen.getByText('Addition • 2-digit × 2-digit')).toBeInTheDocument();
    });

    it('should format time correctly for values under 1 minute', () => {
      const quickResults = {
        ...mockResults,
        totalTime: 45.3
      };
      
      render(<ResultGenerator results={quickResults} />);
      expect(screen.getByText('00:45')).toBeInTheDocument();
    });

    it('should format time correctly for values over 10 minutes', () => {
      const longResults = {
        ...mockResults,
        totalTime: 725.8
      };
      
      render(<ResultGenerator results={longResults} />);
      expect(screen.getByText('12:05')).toBeInTheDocument();
    });
  });

  describe('Claim Your Medal Button', () => {
    it('should render button with minimum 44x44px dimensions', () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      expect(button).toBeInTheDocument();
      
      const styles = window.getComputedStyle(button);
      expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
      expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(44);
    });

    it('should have accessible button text', () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      expect(button).toHaveTextContent('Claim Your Medal');
    });
  });

  describe('Report Generation', () => {
    it('should generate text file with all required fields when button clicked', () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      // Verify Blob was created
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
      const blobArg = mockCreateObjectURL.mock.calls[0]?.[0];
      expect(blobArg).toBeInstanceOf(Blob);
      expect(blobArg?.type).toBe('text/plain;charset=utf-8');
    });

    it('should include date in report content', async () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      const blob = mockCreateObjectURL.mock.calls[0]?.[0] as Blob;
      const text = await blob.text();
      
      expect(text).toContain('Date: 2024-01-15');
    });

    it('should include time in report content', async () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      const blob = mockCreateObjectURL.mock.calls[0]?.[0] as Blob;
      const text = await blob.text();
      
      // Check that time field exists (timezone-agnostic)
      expect(text).toMatch(/Time: \d{2}:\d{2}:\d{2}/);
    });

    it('should include subject in report content', async () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      const blob = mockCreateObjectURL.mock.calls[0]?.[0] as Blob;
      const text = await blob.text();
      
      expect(text).toContain('Subject: Addition');
    });

    it('should include complexity levels in report content', async () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      const blob = mockCreateObjectURL.mock.calls[0]?.[0] as Blob;
      const text = await blob.text();
      
      expect(text).toContain('Number A Digits: 2');
      expect(text).toContain('Number B Digits: 2');
    });

    it('should include total score in report content', async () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      const blob = mockCreateObjectURL.mock.calls[0]?.[0] as Blob;
      const text = await blob.text();
      
      expect(text).toContain('Total Score: 1.5 / 3');
    });

    it('should include percentage in report content', async () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      const blob = mockCreateObjectURL.mock.calls[0]?.[0] as Blob;
      const text = await blob.text();
      
      expect(text).toContain('Percentage: 50.0%');
    });

    it('should include total time in report content', async () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      const blob = mockCreateObjectURL.mock.calls[0]?.[0] as Blob;
      const text = await blob.text();
      
      expect(text).toContain('Total Time: 02:05');
    });

    it('should format report with human-readable labels', async () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      const blob = mockCreateObjectURL.mock.calls[0]?.[0] as Blob;
      const text = await blob.text();
      
      expect(text).toContain('challengeBiggerSweety Marathon Report');
      expect(text).toContain('=====================================');
      expect(text).toContain('Date:');
      expect(text).toContain('Time:');
      expect(text).toContain('Subject:');
      expect(text).toContain('Questions Completed:');
    });
  });

  describe('Filename Generation', () => {
    it('should include timestamp in filename', () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      // Get the mock calls to createElement
      const createElementCalls = (document.createElement as any).mock.calls;
      const anchorCall = createElementCalls.find((call: any[]) => call[0] === 'a');
      expect(anchorCall).toBeDefined();
      
      // Get the created anchor element from the mock results
      const mockLink = (document.createElement as any).mock.results.find(
        (_: any, index: number) => createElementCalls[index][0] === 'a'
      )?.value as HTMLAnchorElement;
      
      expect(mockLink.download).toContain('marathon-report-');
      expect(mockLink.download).toContain('2024-01-15');
      expect(mockLink.download).toMatch(/\.txt$/);
    });

    it('should format timestamp without colons for filename compatibility', () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      // Get the mock calls to createElement
      const createElementCalls = (document.createElement as any).mock.calls;
      const mockLink = (document.createElement as any).mock.results.find(
        (_: any, index: number) => createElementCalls[index][0] === 'a'
      )?.value as HTMLAnchorElement;
      
      // Filename should not contain colons (replaced with hyphens)
      expect(mockLink.download).not.toContain(':');
      expect(mockLink.download).toContain('14-30-00');
    });
  });

  describe('Download Mechanism', () => {
    it('should use Blob for file creation', () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      const blobArg = mockCreateObjectURL.mock.calls[0]?.[0];
      expect(blobArg).toBeInstanceOf(Blob);
    });

    it('should use URL.createObjectURL for download', () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    });

    it('should trigger download via anchor element click', () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      // Get the mock calls to createElement
      const createElementCalls = (document.createElement as any).mock.calls;
      const mockLink = (document.createElement as any).mock.results.find(
        (_: any, index: number) => createElementCalls[index][0] === 'a'
      )?.value as HTMLAnchorElement;
      
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should clean up object URL after download', () => {
      vi.useFakeTimers();
      
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      expect(mockRevokeObjectURL).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
      
      vi.useRealTimers();
    });
  });

  describe('Download Failure Handling', () => {
    it('should display error message when download fails', () => {
      mockCreateObjectURL.mockImplementation(() => {
        throw new Error('Download blocked');
      });

      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      fireEvent.click(button);

      expect(screen.getByText(/download failed/i)).toBeInTheDocument();
      expect(screen.getByText(/check your browser settings/i)).toBeInTheDocument();
    });

    it('should clear error message on successful retry', () => {
      mockCreateObjectURL
        .mockImplementationOnce(() => {
          throw new Error('Download blocked');
        })
        .mockImplementationOnce(() => 'blob:mock-url');

      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      
      // First click - should fail
      fireEvent.click(button);
      expect(screen.getByText(/download failed/i)).toBeInTheDocument();
      
      // Second click - should succeed
      fireEvent.click(button);
      expect(screen.queryByText(/download failed/i)).not.toBeInTheDocument();
    });
  });

  describe('Subject Name Formatting', () => {
    it('should capitalize subject names', () => {
      const subjects: Array<'addition' | 'subtraction' | 'multiplication' | 'division'> = [
        'addition',
        'subtraction',
        'multiplication',
        'division'
      ];

      subjects.forEach(subject => {
        const results = {
          ...mockResults,
          config: { ...mockConfig, subject }
        };

        const { unmount } = render(<ResultGenerator results={results} />);
        
        const expectedName = subject.charAt(0).toUpperCase() + subject.slice(1);
        expect(screen.getByText(new RegExp(expectedName))).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('Optional Restart Button', () => {
    it('should render restart button when onRestart prop is provided', () => {
      const mockRestart = vi.fn();
      render(<ResultGenerator results={mockResults} onRestart={mockRestart} />);
      
      const restartButton = screen.getByRole('button', { name: /start new marathon/i });
      expect(restartButton).toBeInTheDocument();
    });

    it('should not render restart button when onRestart prop is not provided', () => {
      render(<ResultGenerator results={mockResults} />);
      
      const restartButton = screen.queryByRole('button', { name: /start new marathon/i });
      expect(restartButton).not.toBeInTheDocument();
    });

    it('should call onRestart when restart button is clicked', () => {
      const mockRestart = vi.fn();
      render(<ResultGenerator results={mockResults} onRestart={mockRestart} />);
      
      const restartButton = screen.getByRole('button', { name: /start new marathon/i });
      fireEvent.click(restartButton);
      
      expect(mockRestart).toHaveBeenCalledTimes(1);
    });

    it('should have minimum 44x44px dimensions for restart button', () => {
      const mockRestart = vi.fn();
      render(<ResultGenerator results={mockResults} onRestart={mockRestart} />);
      
      const restartButton = screen.getByRole('button', { name: /start new marathon/i });
      const styles = window.getComputedStyle(restartButton);
      
      expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
      expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(44);
    });
  });

  describe('Responsive Design', () => {
    it('should apply mobile-responsive styling', () => {
      const { container } = render(<ResultGenerator results={mockResults} />);
      
      const mainDiv = container?.firstChild as HTMLElement;
      const styles = window.getComputedStyle(mainDiv);
      
      expect(styles.minHeight).toBe('100vh');
      expect(styles.display).toBe('flex');
      expect(styles.flexDirection).toBe('column');
    });
  });

  describe('Visual Design System', () => {
    it('should use deep navy background color', () => {
      const { container } = render(<ResultGenerator results={mockResults} />);
      
      const mainDiv = container?.firstChild as HTMLElement;
      const styles = window.getComputedStyle(mainDiv);
      
      expect(styles.backgroundColor).toBe('rgb(44, 62, 80)'); // #2C3E50
    });

    it('should use vivid orange for primary button', () => {
      render(<ResultGenerator results={mockResults} />);
      
      const button = screen.getByRole('button', { name: /claim your medal/i });
      const styles = window.getComputedStyle(button);
      
      expect(styles.backgroundColor).toBe('rgb(255, 140, 0)'); // #FF8C00
    });

    it('should use mint green for success indicator (score)', () => {
      const { container } = render(<ResultGenerator results={mockResults} />);
      
      const scoreElement = screen.getByText('1.5 / 3');
      const styles = window.getComputedStyle(scoreElement);
      
      expect(styles.color).toBe('rgb(46, 204, 113)'); // #2ECC71
    });
  });
});
