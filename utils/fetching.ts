export async function getData(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    cache: process.env.NEXT_PUBLIC_PREVIEW_MODE
      ? "no-store"
      : options?.cache
        ? options.cache
        : "force-cache",
  });

  if (!res.ok) {
    console.error(`Error fetching ${url}:`, res.status, res.statusText);

    return {};
  }

  return res.json();
}
