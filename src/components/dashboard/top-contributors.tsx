'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import type { Contributor } from '@/types/api';

export function TopContributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiClient.getTopContributors(5);
        setContributors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load top contributors');
        console.error('Error fetching top contributors:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card title="Top Contributors">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Top Contributors" className="border-red-200 dark:border-red-800">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (contributors.length === 0) {
    return (
      <Card title="Top Contributors">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No contributors yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Top Contributors">
      <div className="space-y-3">
        {contributors.map((contributor, index) => (
          <ContributorRow
            key={contributor.username}
            contributor={contributor}
            rank={index + 1}
          />
        ))}
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
  const medal = getRankMedal(rank);

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center justify-center w-8">
        {medal || (
          <Badge variant={badgeVariant} size="sm" className="min-w-[2rem]">
            {rank}
          </Badge>
        )}
      </div>
      <Avatar
        src={contributor.avatar}
        alt={contributor.username}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white">
          {contributor.username}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {contributor.contributionsCount} contributions
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900 dark:text-white">
          {contributor.score.toLocaleString()}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">points</p>
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

function getRankMedal(rank: number): string | null {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
}
