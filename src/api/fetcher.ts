declare const __API_BASE_URL__: string | undefined;

export const customFetcher = async <T>(
    url: string,
    options?: RequestInit
): Promise<T> => {
    const base = __API_BASE_URL__ && __API_BASE_URL__.length > 0
        ? __API_BASE_URL__
        : 'http://localhost:8080';

    const res = await fetch(`${base}${url}`, {
        headers: { Accept: 'application/json' },
        ...options,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText}\n${text}`);
    }
    return (await res.json()) as T;
};
