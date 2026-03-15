'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import type { Contributor, LeaderboardResponse } from '@/types/api';

export function ContributorLeaderboard({
  initialData,
  pageSize = 10,
}: {
  initialData?: LeaderboardResponse;
  pageSize?: number;
} = {}) {
  const [data, setData] = useState<LeaderboardResponse | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialData ? 1 : 0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (initialData) return;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const leaderboard = await apiClient.getLeaderboard(1, pageSize);
        setData(leaderboard);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [initialData, pageSize]);

  const handleLoadMore = async () => {
    if (!data || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const moreData = await apiClient.getLeaderboard(nextPage, pageSize);

      setData({
        ...moreData,
        contributors: [...data.contributors, ...moreData.contributors],
      });
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more contributors:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <Card title="Contributor Leaderboard">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Contributor Leaderboard" className="border-red-200 dark:border-red-800">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 text-sm mb-2">Error loading data</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  if (!data || data.contributors.length === 0) {
    return (
      <Card title="Contributor Leaderboard">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No contributors yet</p>
        </div>
      </Card>
    );
  }

  const hasMore = currentPage < data.totalPages;

  return (
    <Card title="Contributor Leaderboard">
      <div className="space-y-4">
        {/* Desktop table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Rank</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Contributor</th>
                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Score</th>
                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Contributions</th>
                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Rewards</th>
              </tr>
            </thead>
            <tbody>
              {data.contributors.map((contributor, index) => (
                <ContributorRow key={contributor.username} contributor={contributor} rank={index + 1} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden space-y-3">
          {data.contributors.map((contributor, index) => (
            <ContributorCard key={contributor.username} contributor={contributor} rank={index + 1} />
          ))}
        </div>

        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center pt-6">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              isLoading={isLoadingMore}
            >
              Load More ({data.total - data.contributors.length} remaining)
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

interface ContributorRowProps {
  contributor: Contributor;
  rank: number;
}

function ContributorRow({ contributor, rank }: ContributorRowProps) {
  const badgeVariant = getRankBadgeVariant(rank);

  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <td className="py-4 px-4">
        <Badge variant={badgeVariant} size="sm">
          {rank}
        </Badge>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={contributor.avatar}
            alt={contributor.username}
            size="sm"
          />
          <span className="font-medium text-gray-900 dark:text-white">
            {contributor.username}
          </span>
        </div>
      </td>
      <td className="py-4 px-4 text-right font-bold text-gray-900 dark:text-white">
        {contributor.score.toLocaleString()}
      </td>
      <td className="py-4 px-4 text-right text-gray-600 dark:text-gray-400">
        {contributor.contributionsCount}
      </td>
      <td className="py-4 px-4 text-right text-green-600 dark:text-green-400 font-medium">
        ${(contributor.totalRewardsCents / 100).toFixed(2)}
      </td>
    </tr>
  );
}

function ContributorCard({ contributor, rank }: ContributorRowProps) {
  const badgeVariant = getRankBadgeVariant(rank);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center space-x-3 mb-3">
        <Avatar
          src={contributor.avatar}
          alt={contributor.username}
          size="md"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              {contributor.username}
            </span>
            <Badge variant={badgeVariant} size="sm">
              #{rank}
            </Badge>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
          <p className="font-bold text-gray-900 dark:text-white">{contributor.score.toLocaleString()}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Score</p>
        </div>
        <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
          <p className="font-bold text-gray-900 dark:text-white">{contributor.contributionsCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Contrib</p>
        </div>
        <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
          <p className="font-bold text-green-600 dark:text-green-400">${(contributor.totalRewardsCents / 100).toFixed(2)}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Rewards</p>
        </div>
      </div>
    </div>
  );
}

function getRankBadgeVariant(rank: number): 'gold' | 'silver' | 'bronze' | 'default' {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return 'default';
}
