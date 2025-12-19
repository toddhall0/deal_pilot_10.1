import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata = {
  title: 'Deals',
};

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
          <p className="text-muted-foreground">
            Manage your commercial real estate transactions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          New Deal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="size-5" />
            No deals yet
          </CardTitle>
          <CardDescription>
            Get started by creating your first deal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Deals help you track transactions from initial contract through
            closing. Create a deal to start managing due diligence, deadlines,
            and documents.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
