export interface Nominee {
  id: string;
  name: string;
  email: string;
  nominatedBy: string;
  reason?: string;
  votes: number;
  timestamp: Date;
  approved: boolean;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  hasVoted: boolean;
  nominations: string[]; // IDs of people they've nominated
}

export enum PageType {
  LANDING = 'landing',
  NOMINATION = 'nomination',
  VOTING = 'voting',
  LEADERBOARD = 'leaderboard',
  ADMIN = 'admin',
}