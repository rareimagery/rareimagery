/**
 * Server-side Drupal client for use in Next.js server components.
 * No browser APIs (window, document, cookies, import.meta).
 */
export class DrupalServerClient {
  constructor(private baseUrl: string) {}

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/vnd.api+json, application/json' },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Drupal API error ${res.status}: ${(await res.text()).slice(0, 200)}`);
    }

    return res.json();
  }
}
