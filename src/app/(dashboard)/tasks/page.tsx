import { CheckSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata = {
  title: 'Tasks',
};

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Track due diligence items and deadlines
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="size-5" />
            No tasks yet
          </CardTitle>
          <CardDescription>
            Create tasks to track your due diligence items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Tasks help you manage due diligence items, deadlines, and action
            items across all your deals. Create a deal first, then add tasks to
            track progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
