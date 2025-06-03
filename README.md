# Goblet of Fire | Leadership Nominations

A modern web application for managing leadership nominations and voting, built with React, Supabase, and TailwindCSS.

![Goblet of Fire](https://images.pexels.com/photos/7236739/pexels-photo-7236739.jpeg)

## Features

- 🔐 Secure authentication with email/password
- 🗳️ Vote for leadership nominees
- 📊 Real-time leaderboard updates
- 🎯 Profile pages for nominees
- 📱 Responsive design
- 📈 Vote tracking and analytics
- 📥 Export voter data to Excel

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Context + Zustand
- **Icons**: Lucide React
- **Data Export**: XLSX

## Prerequisites

- Node.js 18+
- npm 9+
- Supabase account

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

### Tables

#### nominees
- `id` (uuid, primary key)
- `displayname` (text)
- `department` (text)
- `location` (text)
- `votes` (integer)
- `created_at` (timestamp)
- `approved` (boolean)
- `imageurl` (text)

#### votes
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `nominee_id` (uuid, foreign key)
- `created_at` (timestamp)

#### config
- `key` (text, primary key)
- `value` (jsonb)
- `updated_at` (timestamp)

### Row Level Security (RLS)

- Nominees table: Public read access, admin-only write
- Votes table: Authenticated users can create votes and read their own votes
- Config table: Public read access, admin-only write

## Authentication Flow

1. User signs up/signs in with email and password
2. Supabase handles authentication and session management
3. AuthContext provides user state throughout the application
4. Protected routes ensure authenticated access

## Real-time Subscriptions

- Real-time vote updates on the leaderboard
- Live nominee data synchronization
- Instant vote confirmation

## Component Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   └── Header.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Input.tsx
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── LandingPage.tsx
│   ├── VotingPage.tsx
│   ├── LeaderboardPage.tsx
│   └── ProfilePage.tsx
├── store/
│   └── useStore.ts
└── utils/
    └── cn.ts
```

## State Management

- **AuthContext**: Handles user authentication state
- **Zustand Store**: Manages application state
  - User data
  - Nominations
  - Voting status

## API Integration

- Supabase Client for database operations
- Real-time subscriptions for live updates
- Edge Functions for secure operations

## Error Handling

- Form validation
- API error handling
- Authentication error management
- Fallback UI components

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Deployment

The application is deployed on Netlify. Automatic deployments are triggered on main branch updates.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify environment variables
   - Check Supabase project settings
   - Ensure email confirmation is disabled

2. **Database Connection Issues**
   - Confirm Supabase URL and API keys
   - Check RLS policies
   - Verify table permissions

3. **Build Errors**
   - Clear npm cache
   - Remove node_modules and reinstall
   - Update dependencies

### Support

For issues and feature requests, please create an issue in the repository.