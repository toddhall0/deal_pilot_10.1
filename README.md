# Deal Pilot

A comprehensive transaction management and due diligence platform for commercial real estate acquisitions and dispositions.

## Features

- **AI-Powered Contract Analysis** - Automated contract review and data extraction using Claude AI
- **Hierarchical Deadline Tracking** - Milestones and nested task management
- **Full-Featured Task Management** - Kanban, list, and calendar views with drag-and-drop
- **Multi-Level Dashboards** - Deal, Client, and Firm-level analytics
- **Role-Based Access Control** - Granular permissions for team members
- **Document Management** - Organized file storage with categorization
- **Rich-Text Notes** - Collaborative note-taking with mentions
- **Financial Tracking** - Purchase price, earnest money, and deadline monitoring
- **Custom Reporting** - Generate reports on deal progress and metrics
- **Notification System** - Email and in-app alerts for deadlines and updates

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14+ (App Router) |
| **UI Components** | shadcn/ui + Tailwind CSS |
| **Backend** | Next.js API Routes + Server Actions |
| **Database** | PostgreSQL (Railway) |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js (Auth.js v5) |
| **State Management** | Zustand + TanStack Query |
| **Forms & Validation** | React Hook Form + Zod |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- PostgreSQL database (Railway recommended)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/deal-pilot.git
   cd deal-pilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Auth encryption secret | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | No |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | No |
| `ANTHROPIC_API_KEY` | Claude AI API key | No |
| `S3_BUCKET_NAME` | S3 bucket for file storage | No |
| `S3_REGION` | S3 region | No |
| `S3_ACCESS_KEY_ID` | S3 access key | No |
| `S3_SECRET_ACCESS_KEY` | S3 secret key | No |
| `RESEND_API_KEY` | Resend email API key | No |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── deals/
│   │   ├── clients/
│   │   ├── tasks/
│   │   ├── reports/
│   │   └── settings/
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── providers/         # Context providers
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # NextAuth configuration
│   ├── utils.ts           # Utility functions
│   └── validations/       # Zod schemas
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

## Deployment

### Railway

1. Create a new project on [Railway](https://railway.app)
2. Add a PostgreSQL database
3. Connect your GitHub repository
4. Set environment variables in Railway dashboard
5. Deploy automatically on push to main

### Environment Setup for Production

Ensure these environment variables are set:
- `DATABASE_URL` - Railway provides this automatically
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Strong random string

## License

Private - All rights reserved
