import { env } from './env';

export interface CrawlOptions {
  baseUrl: string;
  maxDepth: number;
  log?: (depth: number) => void;
}

export interface Page {
  url: string;
  links: string[];
}

export type FetchPage = (url: string) => Promise<Page> | Page;
export type FetchLike = (url: string) => Promise<{ ok: boolean; text(): Promise<string> }>;

async function crawlWithDepthLogger(options: CrawlOptions): Promise<void> {
  const { maxDepth, log = () => {} } = options;
  for (let depth = 0; depth <= maxDepth; depth += 1) log(depth);
}

async function crawlWithHtml(baseUrl: string, fetcher: FetchLike = fetch as any): Promise<string[]> {
  const origin = new URL(baseUrl).origin;
  const visited = new Set<string>();
  const queue: Array<{ url: string; depth: number }> = [{ url: baseUrl, depth: 0 }];

  while (queue.length) {
    const { url, depth } = queue.shift()!;
    if (visited.has(url) || depth > env.MAX_DEPTH) continue;
    visited.add(url);
    if (depth === env.MAX_DEPTH) continue;

    let html = '';
    try {
      const res = await fetcher(url);
      if (!res.ok) continue;
      html = await res.text();
    } catch {
      continue;
    }

    for (const match of html.matchAll(/href="(.*?)"/g)) {
      try {
        const nextUrl = new URL(match[1], url).toString();
        if (nextUrl.startsWith(origin) && !visited.has(nextUrl)) {
          queue.push({ url: nextUrl, depth: depth + 1 });
        }
      } catch {
        // ignore malformed urls
      }
    }
  }

  return Array.from(visited);
}

async function crawlWithPageLimit(startUrl: string, fetchPage: FetchPage, pageLimit: number): Promise<Page[]> {
  const visited = new Set<string>();
  const out: Page[] = [];
  const queue = [startUrl];

  while (queue.length > 0 && visited.size < pageLimit) {
    const url = queue.shift()!;
    if (visited.has(url)) continue;
    const page = await fetchPage(url);
    visited.add(url);
    out.push(page);
    for (const link of page.links) {
      if (!visited.has(link)) queue.push(link);
    }
  }

  return out;
}

export async function crawl(options: CrawlOptions): Promise<void>;
export async function crawl(baseUrl: string, fetcher?: FetchLike): Promise<string[]>;
export async function crawl(startUrl: string, fetchPage: FetchPage, pageLimit: number): Promise<Page[]>;
export async function crawl(arg1: CrawlOptions | string, arg2?: FetchLike | FetchPage, arg3?: number) {
  if (typeof arg1 === 'object') return crawlWithDepthLogger(arg1);
  if (typeof arg3 === 'number' && typeof arg2 === 'function') return crawlWithPageLimit(arg1, arg2 as FetchPage, arg3);
  return crawlWithHtml(arg1, arg2 as FetchLike | undefined);
}
