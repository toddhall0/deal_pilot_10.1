import { Building2 } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="bg-primary text-primary-foreground hidden flex-1 flex-col justify-between p-10 lg:flex">
        <div className="flex items-center gap-2">
          <Building2 className="size-10" />
          <span className="text-2xl font-bold">Deal Pilot</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">
            Streamline Your Commercial Real Estate Transactions
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            AI-powered contract analysis, deadline tracking, and comprehensive
            deal management for acquisitions and dispositions.
          </p>
        </div>
        <p className="text-primary-foreground/60 text-sm">
          &copy; {new Date().getFullYear()} Deal Pilot. All rights reserved.
        </p>
      </div>

      {/* Right panel - auth form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 lg:hidden">
            <Building2 className="text-primary size-8" />
            <span className="text-xl font-bold">Deal Pilot</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
