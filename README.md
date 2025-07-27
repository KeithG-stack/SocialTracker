# SocialTracker

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- Social media dashboard with widgets for Facebook, Instagram, Twitter, and sentiment analysis
- Content Calendar for planning influencer activities (record videos, promotions, sponsorships, collabs, etc.)
- Sidebar navigation with connected social accounts
- Authentication with credentials and Google OAuth (NextAuth.js)
- Responsive UI with Tailwind CSS

## How the App Works

### Authentication

- Users can sign in using email/password (credentials) or Google OAuth.
- The sign-in page (`/signin`) provides both options, and social sign-in buttons for Google, Twitter, Facebook, Instagram, and LinkedIn.
- User credentials are securely checked against a PostgreSQL database (via Neon) using NextAuth.js.
- After signing in, users are redirected to the dashboard.

### Dashboard Layout

- The dashboard is accessible at `/dashboard` and is protected by authentication.
- The sidebar on the left provides navigation links (Dashboard, Content Calendar) and lists connected social accounts.
- The main content area displays:
  - **Charts:** Visualize engagement distribution and weekly trends using Recharts.
  - **Widgets:** Show recent engagement for Facebook, Instagram, Twitter, and a sentiment analysis summary.
  - **Content Calendar:** (accessible via sidebar) Shows a table of upcoming influencer activities (e.g., promotions, collabs, sponsorships).

### Content Calendar

- The Content Calendar page (`/dashboard/content-calendar`) displays a schedule of influencer content and activities.
- Each entry includes the date, platform, type (e.g., Promotion, Collab), and a description.
- This helps users plan and track their social media campaigns and collaborations.

### Social Account Integration

- The sidebar fetches and displays connected social accounts for the authenticated user.
- Social account data is retrieved from the backend via an API route (`/api/social-accounts`).

### Technologies Used

- **Next.js App Router** for routing and server/client components.
- **NextAuth.js** for authentication and session management.
- **Tailwind CSS** for styling and responsive design.
- **Recharts** for data visualization (charts).
- **Neon** for serverless PostgreSQL database access.
- **TypeScript** for type safety.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying files in the `app/` directory. The page auto-updates as you edit the file.

## Authentication

- Credentials and Google OAuth are supported via NextAuth.js.
- Configure your environment variables in `.env.local`:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`

## Project Structure

- `app/dashboard` - Main dashboard pages and widgets
  - `page.tsx` - Main dashboard overview
  - `content-calendar.tsx` - Content Calendar page
  - `Sidebar.tsx` - Sidebar navigation
  - Other files: widgets for engagement and sentiment
- `app/signin/page.tsx` - Sign-in page
- `app/auth.ts` - NextAuth.js configuration

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
