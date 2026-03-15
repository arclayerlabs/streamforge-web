'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import type { PendingRewardsResponse } from '@/types/api';

export function PendingRewards() {
  const [data, setData] = useState<PendingRewardsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingUser, setClaimingUser] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const rewards = await apiClient.getPendingRewards();
        setData(rewards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pending rewards');
        console.error('Error fetching pending rewards:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleClaim = async (username: string) => {
    setClaimingUser(username);
    // TODO: Implement claim logic when API endpoint is available
    setTimeout(() => {
      setClaimingUser(null);
    }, 1000);
  };

  if (isLoading) {
    return (
      <Card title="Pending Rewards">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Pending Rewards" className="border-red-200 dark:border-red-800">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (!data || data.contributors.length === 0) {
    return (
      <Card title="Pending Rewards">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No pending rewards</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Pending Rewards"
      footer={
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Total pending: <span className="font-semibold text-gray-900 dark:text-white">${(data.totalPendingCents / 100).toFixed(2)}</span>
          </span>
          <Badge variant="warning">{data.contributors.length} pending</Badge>
        </div>
      }
    >
      <div className="space-y-3">
        {data.contributors.map((contributor) => (
          <RewardRow
            key={contributor.username}
            contributor={contributor}
            isClaiming={claimingUser === contributor.username}
            onClaim={() => handleClaim(contributor.username)}
          />
        ))}
      </div>
    </Card>
  );
}

interface RewardRowProps {
  contributor: {
    username: string;
    avatar: string;
    pendingRewardsCents: number;
  };
  isClaiming: boolean;
  onClaim: () => void;
}

function RewardRow({ contributor, isClaiming, onClaim }: RewardRowProps) {
  return (
    <div className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700">
      <Avatar
        src={contributor.avatar}
        alt={contributor.username}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white">
          {contributor.username}
        </p>
        <p className="text-sm text-green-600 dark:text-green-400">
          ${(contributor.pendingRewardsCents / 100).toFixed(2)} USDC
        </p>
      </div>
      <Badge variant="warning" size="sm">
        Pending
      </Badge>
      <Button
        size="sm"
        variant="primary"
        onClick={onClaim}
        isLoading={isClaiming}
        disabled={isClaiming}
      >
        Claim
      </Button>
    </div>
  );
}
