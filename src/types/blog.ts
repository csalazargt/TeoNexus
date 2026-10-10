export interface BlogPost {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  formattedDate: string;
  author: string;
  categories: string[];
  excerpt: string;
  featuredImage: string | null;
  authorAvatar: string | null;
  content: string;
  readingTimeMinutes: number;
  isSavedOffline?: boolean;
}

export interface BlogChannel {
  title: string;
  description: string;
  link: string;
  lastBuildDate: string;
  language: string;
  image?: string;
}

export interface FeedResponse {
  channel: BlogChannel;
  posts: BlogPost[];
  fromCache?: boolean;
  cachedAt?: string;
  stale?: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type ReaderTheme = 'light' | 'dark' | 'sepia';

export type FontSize = 'sm' | 'base' | 'lg' | 'xl';

export type FontFamily = 'serif' | 'sans';

export type SortOrder = 'newest' | 'oldest' | 'readingTime';

export type ViewMode = 'grid' | 'list';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  postLink?: string;
  read: boolean;
}
