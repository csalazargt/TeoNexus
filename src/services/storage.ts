import { BlogPost, FeedResponse, ReaderTheme, FontSize, FontFamily, AppNotification } from '../types/blog';

const CACHE_KEY = 'teonexus_feed_cache';
const SAVED_POSTS_KEY = 'teonexus_saved_offline_posts';
const NOTIFICATIONS_KEY = 'teonexus_notifications_list';
const PUSH_ENABLED_KEY = 'teonexus_push_enabled';
const READER_SETTINGS_KEY = 'teonexus_reader_settings';

export interface ReaderSettings {
  fontSize: FontSize;
  fontFamily: FontFamily;
  readerTheme: ReaderTheme;
}

export const defaultReaderSettings: ReaderSettings = {
  fontSize: 'lg',
  fontFamily: 'serif',
  readerTheme: 'sepia',
};

// Feed Cache
export function getStoredFeed(): FeedResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read feed from storage', e);
    return null;
  }
}

export function saveFeedToStorage(feed: FeedResponse): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(feed));
  } catch (e) {
    console.error('Failed to save feed to storage', e);
  }
}

// Saved Offline Posts
export function getSavedOfflinePosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(SAVED_POSTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function isPostSavedOffline(postId: string): boolean {
  const saved = getSavedOfflinePosts();
  return saved.some((p) => p.id === postId);
}

export function toggleSaveOfflinePost(post: BlogPost): boolean {
  const saved = getSavedOfflinePosts();
  const exists = saved.some((p) => p.id === post.id);
  let updated: BlogPost[];
  if (exists) {
    updated = saved.filter((p) => p.id !== post.id);
  } else {
    updated = [{ ...post, isSavedOffline: true }, ...saved];
  }

  try {
    localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update saved posts in storage', e);
  }
  return !exists;
}

// Reader Settings
export function getStoredReaderSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(READER_SETTINGS_KEY);
    if (!raw) return defaultReaderSettings;
    return { ...defaultReaderSettings, ...JSON.parse(raw) };
  } catch {
    return defaultReaderSettings;
  }
}

export function saveReaderSettings(settings: ReaderSettings): void {
  try {
    localStorage.setItem(READER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save reader settings', e);
  }
}

// Push Preference
export function isPushNotificationsEnabled(): boolean {
  try {
    return localStorage.getItem(PUSH_ENABLED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPushNotificationsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(PUSH_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save push setting', e);
  }
}

// App Notifications List
export function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addStoredNotification(notif: Omit<AppNotification, 'id' | 'read' | 'date'>): AppNotification {
  const list = getStoredNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    date: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    read: false,
  };
  const updated = [newNotif, ...list].slice(0, 20); // keep 20 latest
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save notification', e);
  }
  return newNotif;
}

export function markNotificationsAsRead(): void {
  const list = getStoredNotifications();
  const updated = list.map((n) => ({ ...n, read: true }));
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to mark notifications as read', e);
  }
}
