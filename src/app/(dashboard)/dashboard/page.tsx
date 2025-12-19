import {
  Briefcase,
  CheckSquare,
  Clock,
  TrendingUp,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata = {
  title: 'Dashboard',
};

const stats = [
  {
    name: 'Active Deals',
    value: '0',
    icon: Briefcase,
    description: 'Deals in progress',
  },
  {
    name: 'Open Tasks',
    value: '0',
    icon: CheckSquare,
    description: 'Tasks to complete',
  },
  {
    name: 'Due This Week',
    value: '0',
    icon: Clock,
    description: 'Upcoming deadlines',
  },
  {
    name: 'Overdue Items',
    value: '0',
    icon: AlertTriangle,
    description: 'Need attention',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Deal Pilot. Here&apos;s an overview of your transactions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No recent activity. Start by creating a deal or adding a task.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Recent Documents
            </CardTitle>
            <CardDescription>Recently uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No documents yet. Upload documents to your deals for easy access.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
