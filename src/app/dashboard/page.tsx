import { ProjectSummaryCard } from '@/components/dashboard/project-summary-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { TopContributors } from '@/components/dashboard/top-contributors';
import { PendingRewards } from '@/components/dashboard/pending-rewards';
import { ContributorLeaderboard } from '@/components/dashboard/contributor-leaderboard';

export const metadata = {
  title: 'Dashboard - StreamForge',
  description: 'Project overview and contributor leaderboard',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Project overview and contributor activity
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Project Summary */}
          <section>
            <ProjectSummaryCard />
          </section>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section>
              <ActivityFeed />
            </section>
            <section>
              <TopContributors />
            </section>
          </div>

          {/* Pending Rewards */}
          <section>
            <PendingRewards />
          </section>

          {/* Full Leaderboard */}
          <section>
            <ContributorLeaderboard />
          </section>
        </div>
      </main>
    </div>
  );
}
