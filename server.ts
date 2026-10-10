import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

// Feed cache in memory
interface FeedCache {
  timestamp: number;
  data: {
    channel: {
      title: string;
      description: string;
      link: string;
      lastBuildDate: string;
      language: string;
      image?: string;
    };
    posts: Array<{
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
    }>;
  };
}

let feedCache: FeedCache | null = null;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

// HTML Entities decode helper
function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '…')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// Clean excerpt text helper
function cleanExcerpt(raw: string): string {
  if (!raw) return '';
  // Remove anchor tags like <a class="more-link"...>Leer más...</a>
  let clean = raw.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '');
  // Remove remaining HTML tags
  clean = clean.replace(/<[^>]+>/g, '');
  // Decode entities
  clean = decodeHtmlEntities(clean).trim();
  // Clean trailing punctuation or ellipses
  clean = clean.replace(/[\s…]+$/, '…');
  return clean;
}

// Extract full entry-content from a post URL
async function fetchPostContent(postUrl: string): Promise<string> {
  try {
    const res = await fetch(postUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TeoNexusReader/1.0',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) return '';
    const html = await res.text();
    const match = html.match(/<div class=\"entry-content\">([\s\S]*?)<\/div>/i);
    if (match && match[1]) {
      let content = match[1];
      // Clean up WordPress share buttons and script tags
      content = content.replace(/<div class=\"sharedaddy[\s\S]*?<\/div>/gi, '');
      content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      return content.trim();
    }
  } catch (err) {
    console.error('Error fetching post content for:', postUrl, err);
  }
  return '';
}

// Feed parser logic
async function fetchAndParseFeed() {
  const FEED_URL = 'https://csalazar.org/feed/';
  const res = await fetch(FEED_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TeoNexusReader/1.0 (RSS Reader)',
      Accept: 'application/rss+xml, application/xml, text/xml',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch RSS feed: ${res.status} ${res.statusText}`);
  }

  const xmlText = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
  });

  const parsed = parser.parse(xmlText);
  const channel = parsed.rss?.channel || {};
  const rawItems = Array.isArray(channel.item)
    ? channel.item
    : channel.item
    ? [channel.item]
    : [];

  const channelData = {
    title: decodeHtmlEntities(channel.title || 'TeoNexus'),
    description: decodeHtmlEntities(channel.description || 'Pensar la fe con profundidad, vivirla con sencillez.'),
    link: channel.link || 'https://csalazar.org',
    lastBuildDate: channel.lastBuildDate || new Date().toUTCString(),
    language: channel.language || 'es',
    image: channel.image?.url || 'https://csalazar.org/wp-content/uploads/2026/09/cropped-csalazar-org.png?w=32',
  };

  const parsedPosts = await Promise.all(
    rawItems.map(async (item: any) => {
      const rawTitle = typeof item.title === 'string' ? item.title : item.title?.['#text'] || '';
      const title = decodeHtmlEntities(rawTitle);
      const link = typeof item.link === 'string' ? item.link : item.link?.['#text'] || '';
      const pubDate = item.pubDate || '';

      // Guid
      let guid = link;
      if (item.guid) {
        guid = typeof item.guid === 'string' ? item.guid : item.guid['#text'] || link;
      }

      // Author
      let author = 'Carlos Salazar';
      if (item['dc:creator']) {
        author = typeof item['dc:creator'] === 'string' ? item['dc:creator'] : item['dc:creator']['#text'] || author;
      }

      // Categories
      const categories: string[] = [];
      if (item.category) {
        if (Array.isArray(item.category)) {
          item.category.forEach((cat: any) => {
            const val = typeof cat === 'string' ? cat : cat['#text'];
            if (val && !categories.includes(val)) categories.push(decodeHtmlEntities(val));
          });
        } else {
          const val = typeof item.category === 'string' ? item.category : item.category['#text'];
          if (val) categories.push(decodeHtmlEntities(val));
        }
      }

      // Excerpt / description
      const rawDesc = typeof item.description === 'string' ? item.description : item.description?.['#text'] || '';
      const excerpt = cleanExcerpt(rawDesc);

      // Media / Images
      let featuredImage: string | null = null;
      let authorAvatar: string | null = null;

      const mediaContent = item['media:content'];
      if (mediaContent) {
        const mediaList = Array.isArray(mediaContent) ? mediaContent : [mediaContent];
        for (const m of mediaList) {
          const url = m['@_url'];
          if (url) {
            if (url.includes('gravatar.com')) {
              authorAvatar = url;
            } else if (url.includes('wp-content/uploads') || !featuredImage) {
              featuredImage = url;
            }
          }
        }
      }

      // Fetch full content if possible
      let fullContent = '';
      if (link) {
        fullContent = await fetchPostContent(link);
      }

      // Calculate reading time
      const textForCalc = (fullContent || excerpt).replace(/<[^>]+>/g, ' ');
      const words = textForCalc.trim().split(/\s+/).filter(Boolean).length;
      const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

      // Format date in Spanish
      let formattedDate = pubDate;
      try {
        const d = new Date(pubDate);
        if (!isNaN(d.getTime())) {
          formattedDate = new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(d);
        }
      } catch {
        // keep pubDate
      }

      return {
        id: guid || link,
        title,
        link,
        pubDate,
        formattedDate,
        author,
        categories: categories.length > 0 ? categories : ['General'],
        excerpt,
        featuredImage,
        authorAvatar,
        content: fullContent,
        readingTimeMinutes,
      };
    })
  );

  return {
    channel: channelData,
    posts: parsedPosts,
  };
}

// API Routes
app.get('/api/feed', async (_req, res) => {
  try {
    const now = Date.now();
    if (feedCache && now - feedCache.timestamp < CACHE_TTL_MS) {
      return res.json({
        ...feedCache.data,
        fromCache: true,
        cachedAt: new Date(feedCache.timestamp).toISOString(),
      });
    }

    const data = await fetchAndParseFeed();
    feedCache = {
      timestamp: now,
      data,
    };

    return res.json({
      ...data,
      fromCache: false,
      cachedAt: new Date(now).toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching feed:', error);
    // If we have any cached data, serve it gracefully
    if (feedCache) {
      return res.json({
        ...feedCache.data,
        fromCache: true,
        stale: true,
      });
    }
    return res.status(500).json({
      error: 'No se pudo obtener el feed RSS',
      message: error?.message || 'Error desconocido',
    });
  }
});

// Dedicated article content fetcher
app.get('/api/article', async (req, res) => {
  const postUrl = req.query.url as string;
  if (!postUrl) {
    return res.status(400).json({ error: 'Falta el parámetro url' });
  }

  try {
    const content = await fetchPostContent(postUrl);
    return res.json({ url: postUrl, content });
  } catch (err: any) {
    return res.status(500).json({ error: 'Error al obtener el contenido', details: err?.message });
  }
});

// Push subscription simulation endpoint
app.post('/api/subscribe-push', (req, res) => {
  const { subscription, enabled } = req.body;
  // In a full production app, this would save to a database or VAPID sender
  return res.json({
    success: true,
    message: enabled
      ? 'Suscripción a notificaciones push registrada con éxito.'
      : 'Suscripción desactivada.',
    timestamp: new Date().toISOString(),
  });
});

// Vite or Static files handling
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TeoNexus Blog Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
