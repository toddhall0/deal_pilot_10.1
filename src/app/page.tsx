import Link from 'next/link';
import { Building2, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  'AI-powered contract analysis',
  'Hierarchical deadline tracking',
  'Full-featured task management',
  'Multi-level dashboards',
  'Document management',
  'Custom reporting',
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="text-primary size-8" />
            <span className="text-xl font-bold">Deal Pilot</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Streamline Your Commercial Real Estate Transactions
            </h1>
            <p className="text-muted-foreground mt-6 text-lg md:text-xl">
              AI-powered transaction management and due diligence platform
              designed for commercial real estate professionals.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/50 py-20">
          <div className="container">
            <h2 className="text-center text-3xl font-bold">
              Everything you need to manage deals
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="bg-background flex items-center gap-3 rounded-lg border p-4"
                >
                  <CheckCircle className="text-primary size-5 shrink-0" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Deal Pilot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
