/**
 * StreamForge API Type Definitions
 *
 * This file defines the TypeScript interfaces for the StreamForge API.
 * These types ensure type safety when communicating with the backend.
 */

/**
 * Represents a contributor in the StreamForge system
 */
export interface Contributor {
  /** GitHub username */
  username: string;
  /** GitHub avatar URL */
  avatar: string;
  /** Total contribution score */
  score: number;
  /** Number of contributions (PRs, commits, reviews) */
  contributionsCount: number;
  /** Total rewards earned in USDC (cents) */
  totalRewardsCents: number;
  /** Number of unclaimed rewards in USDC (cents) */
  unclaimedRewardsCents: number;
}

/**
 * Represents project summary statistics
 */
export interface ProjectSummary {
  /** Project name */
  name: string;
  /** Total number of contributors */
  totalContributors: number;
  /** Total rewards paid in USDC (cents) */
  totalRewardsPaidCents: number;
  /** Total number of contributions */
  totalContributions: number;
}

/**
 * Type of activity event
 */
export type ActivityEventType = 'pr_merged' | 'commit' | 'review' | 'reward_claimed';

/**
 * Represents a recent activity event
 */
export interface ActivityEvent {
  /** Unique event identifier */
  id: string;
  /** Type of event */
  type: ActivityEventType;
  /** Contributor who performed the action */
  contributor: {
    username: string;
    avatar: string;
  };
  /** Event timestamp (ISO 8601) */
  timestamp: string;
  /** Event description/message */
  description: string;
  /** Related metadata (PR number, commit sha, etc.) */
  metadata?: {
    prNumber?: number;
    commitSha?: string;
    rewardAmount?: number;
  };
}

/**
 * Response from the leaderboard API endpoint
 */
export interface LeaderboardResponse {
  /** List of contributors ranked by score */
  contributors: Contributor[];
  /** Current page number */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of contributors */
  total: number;
}

/**
 * Response from the project summary API endpoint
 */
export type ProjectSummaryResponse = ProjectSummary;

/**
 * Response from the activity feed API endpoint
 */
export interface ActivityFeedResponse {
  /** List of recent activity events */
  events: ActivityEvent[];
  /** Current page number */
  page: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Response from the pending rewards API endpoint
 */
export interface PendingRewardsResponse {
  /** Contributors with pending rewards */
  contributors: Array<{
    username: string;
    avatar: string;
    pendingRewardsCents: number;
  }>;
  /** Total pending rewards in USDC (cents) */
  totalPendingCents: number;
}

/**
 * API error response
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** HTTP status code */
  code: number;
  /** Additional error details */
  details?: unknown;
}

/**
 * Helper to format USDC from cents to dollars
 */
export function formatUSDC(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Helper to format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}
