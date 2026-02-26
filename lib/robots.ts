export interface RobotsRules {
  allow: string[];
  disallow: string[];
}

function parseDisallow(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('#'))
    .flatMap((line) => {
      const [directive, value = ''] = line.split(':', 2).map((s) => s.trim());
      return directive.toLowerCase() === 'disallow' && value ? [value] : [];
    });
}

export async function filterAllowedUrls(baseUrl: string, urls: string[], fetchFn: typeof fetch = fetch): Promise<string[]> {
  let disallow: string[] = [];
  try {
    const res = await fetchFn(new URL('/robots.txt', baseUrl));
    if ((res as any)?.ok) {
      disallow = parseDisallow(await (res as any).text());
    }
  } catch {
    // ignore fetch errors
  }

  return urls.filter((url) => {
    const path = new URL(url).pathname;
    return !disallow.some((rule) => path.startsWith(rule));
  });
}

async function fetchRobots(origin: string): Promise<RobotsRules> {
  try {
    const res = await fetch(new URL('/robots.txt', origin));
    if (!res.ok) return { allow: [], disallow: [] };
    const text = await res.text();
    const rules: RobotsRules = { allow: [], disallow: [] };
    let applies = false;
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const [directive, valueRaw] = line.split(':', 2);
      if (!directive || valueRaw === undefined) continue;
      const value = valueRaw.trim();
      const d = directive.toLowerCase();
      if (d === 'user-agent') applies = value === '*';
      else if (applies && d === 'disallow' && value) rules.disallow.push(value);
      else if (applies && d === 'allow' && value) rules.allow.push(value);
    }
    return rules;
  } catch {
    return { allow: [], disallow: [] };
  }
}

function pathAllowed(path: string, rules: RobotsRules): boolean {
  for (const dis of rules.disallow) {
    if (dis && path.startsWith(dis)) {
      for (const allow of rules.allow) if (path.startsWith(allow)) return true;
      return false;
    }
  }
  return true;
}

export async function fetchIfAllowed(url: string, init?: RequestInit, cache = new Map<string, RobotsRules>()) {
  const parsed = new URL(url);
  let rules = cache.get(parsed.origin);
  if (!rules) {
    rules = await fetchRobots(parsed.origin);
    cache.set(parsed.origin, rules);
  }
  if (!pathAllowed(parsed.pathname, rules)) return null;
  return fetch(url, init);
}

export async function isAllowed(url: string, cache = new Map<string, RobotsRules>()) {
  const parsed = new URL(url);
  let rules = cache.get(parsed.origin);
  if (!rules) {
    rules = await fetchRobots(parsed.origin);
    cache.set(parsed.origin, rules);
  }
  return pathAllowed(parsed.pathname, rules);
}
