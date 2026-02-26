import { randomUUID } from 'crypto';

export interface CrawlResult {
  crawlId: string;
  discoveredUrls: string[];
  total: number;
}

export type Fetcher = (url: string) => Promise<string>;

const assetPattern = /\.(jpg|jpeg|png|gif|svg|css|js|pdf)$/i;
const isAsset = (url: string) => assetPattern.test(url);

export async function crawlSite(baseUrl: string, maxDepth: number, fetcher: Fetcher = defaultFetcher): Promise<CrawlResult> {
  const discovered = await bfs(baseUrl, maxDepth, Infinity, async (url) => fetcher(url));
  return { crawlId: randomUUID(), discoveredUrls: discovered, total: discovered.length };
}

export interface UrlScoutResult {
  discoveredUrls: string[];
}

export async function urlScout(
  baseUrl: string,
  maxDepth: number,
  fetchFn: (url: string) => Promise<{ text(): Promise<string> }>
): Promise<UrlScoutResult> {
  const discovered = await bfs(baseUrl, maxDepth, Infinity, async (url) => (await fetchFn(url)).text());
  return { discoveredUrls: discovered };
}

export class PageLimitExceededError extends Error {
  constructor(limit: number) {
    super(`Page limit exceeded: ${limit}`);
    this.name = 'PageLimitExceededError';
  }
}

export interface CrawlConfig {
  baseUrl: string;
  maxDepth: number;
  maxPages?: number;
  fetchFn?: (url: string) => Promise<string>;
}

async function defaultFetcher(url: string) {
  const res = await fetch(url);
  return res.text();
}

async function bfs(baseUrl: string, maxDepth: number, maxPages: number, fetchFn: (url: string) => Promise<string>) {
  const origin = new URL(baseUrl).origin;
  const visited = new Set<string>();
  const queue: Array<{ url: string; depth: number }> = [{ url: baseUrl, depth: 0 }];

  while (queue.length) {
    const { url, depth } = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);
    if (visited.size > maxPages) throw new PageLimitExceededError(maxPages);
    if (depth >= maxDepth) continue;

    let html = '';
    try {
      html = await fetchFn(url);
    } catch {
      continue;
    }

    for (const match of html.matchAll(/href="(.*?)"/g)) {
      try {
        const next = new URL(match[1], url).href;
        if (new URL(next).origin !== origin || isAsset(next) || visited.has(next)) continue;
        queue.push({ url: next, depth: depth + 1 });
      } catch {
        // ignore malformed urls
      }
    }
  }

  return Array.from(visited);
}

export async function crawl(config: CrawlConfig): Promise<CrawlResult> {
  const { baseUrl, maxDepth, maxPages = Infinity, fetchFn = defaultFetcher } = config;
  const discovered = await bfs(baseUrl, maxDepth, maxPages, fetchFn);
  return { crawlId: randomUUID(), discoveredUrls: discovered, total: discovered.length };
}
