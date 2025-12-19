import { BarChart3 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata = {
  title: 'Reports',
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Analytics and insights for your transactions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Reports coming soon
          </CardTitle>
          <CardDescription>
            Analytics and reporting features are in development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Soon you&apos;ll be able to generate reports on deal progress, task
            completion rates, and other key metrics to help you manage your
            transaction pipeline.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
