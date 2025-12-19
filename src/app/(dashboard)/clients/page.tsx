import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata = {
  title: 'Clients',
};

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            No clients yet
          </CardTitle>
          <CardDescription>
            Add your first client to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Clients are the parties involved in your real estate transactions.
            Add clients to associate them with deals and track their contact
            information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
