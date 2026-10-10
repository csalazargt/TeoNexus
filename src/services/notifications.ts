import { isPushNotificationsEnabled, setPushNotificationsEnabled, addStoredNotification } from './storage';
import { BlogPost } from '../types/blog';

// Gentle chime sound using Web Audio API
function playChimeSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (err) {
    // Ignore audio autoplay restrictions
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setPushNotificationsEnabled(true);
      // Notify backend if needed
      fetch('/api/subscribe-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: true }),
      }).catch(() => {});
    } else {
      setPushNotificationsEnabled(false);
    }
    return permission;
  } catch (e) {
    console.error('Error requesting notification permission', e);
    return 'denied';
  }
}

export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

export function sendLocalNotification(title: string, message: string, postLink?: string) {
  playChimeSound();
  
  // Store notification in internal notification center
  addStoredNotification({
    title,
    message,
    postLink,
  });

  // If browser notification is permitted, trigger system push notification
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const n = new Notification(title, {
        body: message,
        icon: 'https://csalazar.org/wp-content/uploads/2026/09/cropped-csalazar-org.png?w=192',
        badge: 'https://csalazar.org/wp-content/uploads/2026/09/cropped-csalazar-org.png?w=96',
        tag: 'teonexus-post',
      });
      if (postLink) {
        n.onclick = () => {
          window.focus();
          n.close();
        };
      }
    } catch (e) {
      console.warn('System notification failed (running inside iframe?), notification saved in-app.', e);
    }
  }
}

// Check for new posts and notify
export function checkForNewPostsNotification(currentPosts: BlogPost[]) {
  if (!currentPosts || currentPosts.length === 0) return;
  const lastSeenId = localStorage.getItem('teonexus_last_seen_post_id');
  const latestPost = currentPosts[0];

  if (lastSeenId && lastSeenId !== latestPost.id) {
    // There is a new post!
    if (isPushNotificationsEnabled()) {
      sendLocalNotification(
        '🔔 Nueva publicación en TeoNexus',
        `"${latestPost.title}" por Carlos Salazar`,
        latestPost.link
      );
    }
  }
  
  // Update last seen
  localStorage.setItem('teonexus_last_seen_post_id', latestPost.id);
}
