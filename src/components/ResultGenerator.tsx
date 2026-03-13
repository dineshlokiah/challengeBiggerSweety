import React, { useState } from 'react';
import type { MarathonResults } from '../types';

/**
 * ResultGenerator Component
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 9.1, 11.3
 * 
 * Creates downloadable performance reports:
 * - Displays summary statistics (score, percentage, time)
 * - Renders "Claim Your Medal" button (44x44px minimum)
 * - Generates text file with formatted report on button click
 * - Uses client-side file download APIs (Blob, URL.createObjectURL)
 * - Formats report with human-readable labels
 * - Includes timestamp in filename
 * - Handles download failures gracefully
 */

interface ResultGeneratorProps {
  results: MarathonResults;
  onRestart?: () => void;
  onReturnToConfiguration?: () => void;
}

export const ResultGenerator: React.FC<ResultGeneratorProps> = ({ 
  results, 
  onRestart, 
  onReturnToConfiguration 
}) => {
  const [downloadError, setDownloadError] = useState<string | null>(null);

  /**
   * Format time in MM:SS format
   */
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /**
   * Get subject name in readable format
   */
  const getSubjectName = (subject: string): string => {
    return subject.charAt(0).toUpperCase() + subject.slice(1);
  };

  /**
   * Generate report text content
   */
  const generateReportContent = (): string => {
    const date = results.completedAt.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = results.completedAt.toTimeString().split(' ')[0]; // HH:MM:SS
    const maxScore = results.questionResults.length;

    return `challengeBiggerSweety Marathon Report
=====================================
Date: ${date}
Time: ${time}
Subject: ${getSubjectName(results.config.subject)}
Number A Digits: ${results.config.digitCountA}
Number B Digits: ${results.config.digitCountB}
Questions Completed: ${results.questionResults.length}
Total Score: ${results.totalScore} / ${maxScore}
Percentage: ${results.percentage.toFixed(1)}%
Total Time: ${formatTime(results.totalTime)}
`;
  };

  /**
   * Generate filename with timestamp
   */
  const generateFilename = (): string => {
    const timestamp = results.completedAt.toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '')
      .replace('T', '-');
    return `marathon-report-${timestamp}.txt`;
  };

  /**
   * Handle download button click
   * Uses Blob and URL.createObjectURL for client-side file generation
   */
  const handleDownload = () => {
    try {
      setDownloadError(null);

      // Generate report content
      const content = generateReportContent();

      // Create Blob with text content
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

      // Create object URL
      const url = URL.createObjectURL(blob);

      // Create temporary anchor element for download
      const link = document.createElement('a');
      link.href = url;
      link.download = generateFilename();

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up object URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error('Download failed:', error);
      setDownloadError('Download failed. Please check your browser settings and try again.');
    }
  };

  return (
    <div
      className="result-generator"
      style={{
        minHeight: '100vh',
        backgroundColor: '#2C3E50',
        color: '#FFFFFF',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Quicksand, sans-serif'
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: '36px',
          fontFamily: 'Fredoka One, Quicksand, sans-serif',
          marginBottom: '32px',
          color: '#FF8C00'
        }}>
          Marathon Complete! 🎉
        </h1>

        {/* Summary Statistics */}
        <div style={{
          backgroundColor: '#34495E',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {/* Score */}
            <div>
              <div style={{
                fontSize: '14px',
                color: '#BDC3C7',
                marginBottom: '4px'
              }}>
                Total Score
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#2ECC71'
              }}>
                {results.totalScore} / {results.questionResults.length}
              </div>
            </div>

            {/* Percentage */}
            <div>
              <div style={{
                fontSize: '14px',
                color: '#BDC3C7',
                marginBottom: '4px'
              }}>
                Accuracy
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#FF8C00'
              }}>
                {results.percentage.toFixed(1)}%
              </div>
            </div>

            {/* Time */}
            <div>
              <div style={{
                fontSize: '14px',
                color: '#BDC3C7',
                marginBottom: '4px'
              }}>
                Total Time
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}>
                {formatTime(results.totalTime)}
              </div>
            </div>

            {/* Subject and Complexity */}
            <div style={{
              paddingTop: '16px',
              borderTop: '1px solid #2C3E50'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#BDC3C7',
                marginBottom: '8px'
              }}>
                Configuration
              </div>
              <div style={{
                fontSize: '16px'
              }}>
                {getSubjectName(results.config.subject)} • {results.config.digitCountA}-digit × {results.config.digitCountB}-digit
              </div>
            </div>
          </div>
        </div>

        {/* Claim Your Medal Button */}
        <button
          onClick={handleDownload}
          style={{
            minHeight: '44px',
            minWidth: '44px',
            width: '100%',
            padding: '16px 24px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: '#FF8C00',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          🏅 Claim Your Medal
        </button>

        {/* Download Error Message */}
        {downloadError && (
          <div style={{
            backgroundColor: '#E74C3C',
            color: '#FFFFFF',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {downloadError}
          </div>
        )}

        {/* Restart Button */}
        {(onRestart || onReturnToConfiguration) && (
          <button
            onClick={onRestart || onReturnToConfiguration}
            style={{
              minHeight: '44px',
              minWidth: '44px',
              width: '100%',
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#34495E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Start New Marathon
          </button>
        )}

        {/* Credits */}
        <div style={{
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid #34495E',
          fontSize: '14px',
          color: '#95A5A6'
        }}>
          <p>Created by Dinesh Lokiah</p>
          <p style={{ marginTop: '4px', fontSize: '12px' }}>
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};
