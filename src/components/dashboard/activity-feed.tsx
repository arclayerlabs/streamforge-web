'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { formatRelativeTime } from '@/types/api';
import type { ActivityEvent, ActivityFeedResponse } from '@/types/api';

export function ActivityFeed() {
  const [data, setData] = useState<ActivityFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const feed = await apiClient.getActivityFeed(1, 10);
        setData(feed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity feed');
        console.error('Error fetching activity feed:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card title="Recent Activity">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
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
      <Card title="Recent Activity" className="border-red-200 dark:border-red-800">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (!data || data.events.length === 0) {
    return (
      <Card title="Recent Activity">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Recent Activity"
      footer={
        data.totalPages > 1 && (
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all activity
          </button>
        )
      }
    >
      <div className="space-y-4">
        {data.events.map((event) => (
          <ActivityItem key={event.id} event={event} />
        ))}
      </div>
    </Card>
  );
}

interface ActivityItemProps {
  event: ActivityEvent;
}

function ActivityItem({ event }: ActivityItemProps) {
  const eventConfig = getEventConfig(event.type);

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <Avatar
        src={event.contributor.avatar}
        alt={event.contributor.username}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-gray-900 dark:text-white">
            {event.contributor.username}
          </span>
          <Badge variant={eventConfig.badgeVariant} size="sm">
            {eventConfig.label}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {event.description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {formatRelativeTime(event.timestamp)}
        </p>
      </div>
    </div>
  );
}

function getEventConfig(type: ActivityEvent['type']) {
  switch (type) {
    case 'pr_merged':
      return { label: 'PR Merged', badgeVariant: 'success' as const };
    case 'commit':
      return { label: 'Commit', badgeVariant: 'default' as const };
    case 'review':
      return { label: 'Review', badgeVariant: 'default' as const };
    case 'reward_claimed':
      return { label: 'Reward', badgeVariant: 'gold' as const };
    default:
      return { label: 'Activity', badgeVariant: 'default' as const };
  }
}
