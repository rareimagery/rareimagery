export class DrupalClient {
  private csrfToken: string | null = null;
  private csrfPromise: Promise<string> | null = null;
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  async getCsrfToken(): Promise<string> {
    if (this.csrfToken) return this.csrfToken;
    if (this.csrfPromise) return this.csrfPromise;

    this.csrfPromise = fetch(`${this.baseUrl}/session/token`, {
      credentials: 'same-origin',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch CSRF token');
        return res.text();
      })
      .then((token) => {
        this.csrfToken = token;
        this.csrfPromise = null;
        return token;
      });

    return this.csrfPromise;
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.set(key, value),
      );
    }

    const res = await fetch(url.toString(), {
      credentials: 'same-origin',
      headers: { Accept: 'application/vnd.api+json, application/json' },
    });

    if (!res.ok) {
      throw new ApiError(res.status, await res.text());
    }

    return res.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const token = await this.getCsrfToken();

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRF-Token': token,
        Accept: 'application/vnd.api+json, application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new ApiError(res.status, await res.text());
    }

    return res.json();
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    const token = await this.getCsrfToken();

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRF-Token': token,
        Accept: 'application/vnd.api+json, application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new ApiError(res.status, await res.text());
    }

    return res.json();
  }

  async delete(path: string): Promise<void> {
    const token = await this.getCsrfToken();

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'X-CSRF-Token': token,
        Accept: 'application/vnd.api+json',
      },
    });

    if (!res.ok) {
      throw new ApiError(res.status, await res.text());
    }
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`API error ${status}: ${body.slice(0, 200)}`);
    this.name = 'ApiError';
  }
}

export const drupalClient = new DrupalClient();
