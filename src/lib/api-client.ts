/**
 * StreamForge API Client
 *
 * Provides typed methods for communicating with the StreamForge backend API.
 * Configure via NEXT_PUBLIC_API_URL environment variable.
 */

import type {
  Contributor,
  ProjectSummaryResponse,
  LeaderboardResponse,
  ActivityFeedResponse,
  PendingRewardsResponse,
  ApiError,
} from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Create an API error from a failed response
 */
async function createApiError(response: Response): Promise<ApiError> {
  let message = 'Failed to fetch data from StreamForge API';
  try {
    const data = await response.json();
    message = data.message || message;
  } catch {
    // JSON parse failed, use default message
  }
  return {
    message,
    code: response.status,
  };
}

/**
 * Handle API response with proper error handling
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw await createApiError(response);
  }
  return response.json() as Promise<T>;
}

/**
 * StreamForge API Client
 *
 * All methods return typed responses or throw ApiError on failure.
 * Components should handle loading, empty, and error states appropriately.
 */
export const apiClient = {
  /**
   * Fetch project summary statistics
   *
   * GET /api/project/summary
   */
  async getProjectSummary(): Promise<ProjectSummaryResponse> {
    const response = await fetch(`${API_URL}/api/project/summary`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<ProjectSummaryResponse>(response);
  },

  /**
   * Fetch contributor leaderboard
   *
   * GET /api/contributors?page=1&limit=10
   */
  async getLeaderboard(
    page: number = 1,
    limit: number = 10
  ): Promise<LeaderboardResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await fetch(`${API_URL}/api/contributors?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<LeaderboardResponse>(response);
  },

  /**
   * Fetch recent activity feed
   *
   * GET /api/activity?page=1&limit=20
   */
  async getActivityFeed(
    page: number = 1,
    limit: number = 20
  ): Promise<ActivityFeedResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await fetch(`${API_URL}/api/activity?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<ActivityFeedResponse>(response);
  },

  /**
   * Fetch contributors with pending rewards
   *
   * GET /api/rewards/pending
   */
  async getPendingRewards(): Promise<PendingRewardsResponse> {
    const response = await fetch(`${API_URL}/api/rewards/pending`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<PendingRewardsResponse>(response);
  },

  /**
   * Fetch top contributors by score
   *
   * GET /api/contributors/top?limit=5
   */
  async getTopContributors(limit: number = 5): Promise<Contributor[]> {
    const params = new URLSearchParams({
      limit: String(limit),
    });
    const response = await fetch(`${API_URL}/api/contributors/top?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<Contributor[]>(response);
  },
};

export default apiClient;
