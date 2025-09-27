import type { DogApiListResponse, DogApiImagesResponse, BreedKey } from "../utils/types";

const BASE = "https://dog.ceo/api";

const mem = new Map<string, unknown>();
type CacheShape = Record<string, unknown>;
const LS_KEY = "dog-viewer-cache-v1";

function getLS(): CacheShape {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}") as CacheShape; }
  catch { return {}; }
}
function setLS(key: string, value: unknown) {
  const data = getLS();
  (data as CacheShape)[key] = value;
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}
function getCached<T>(key: string): T | undefined {
  if (mem.has(key)) return mem.get(key) as T;
  const data = getLS();
  if (Object.prototype.hasOwnProperty.call(data, key)) {
    const v = (data as CacheShape)[key] as T;
    mem.set(key, v);
    return v;
  }
}
function setCached<T>(key: string, value: T) {
  mem.set(key, value);
  setLS(key, value);
}

async function fetchWithRetry(input: RequestInfo, init?: RequestInit, retries = 2): Promise<Response> {
  try {
    const res = await fetch(input, init);
    if (res.status === 429 && retries > 0) {
      const ra = Number(res.headers.get("Retry-After")) || 1;
      await new Promise(r => setTimeout(r, ra * 1000));
      return fetchWithRetry(input, init, retries - 1);
    }
    return res;
  } catch (e) {
    if (retries > 0) return fetchWithRetry(input, init, retries - 1);
    throw e;
  }
}

export async function listBreeds(signal?: AbortSignal): Promise<BreedKey[]> {
  const cacheKey = "breeds:list";
  const cached = getCached<BreedKey[]>(cacheKey);
  if (cached?.length) return cached;

  const res = await fetchWithRetry(`${BASE}/breeds/list/all`, { signal });
  if (!res.ok) throw new Error(`Failed to fetch breeds (${res.status})`);
  const data = (await res.json()) as DogApiListResponse;
  if (data.status !== "success") throw new Error("API returned error");

  const flat: BreedKey[] = [];
  for (const [breed, subs] of Object.entries(data.message)) {
    if (!subs?.length) flat.push(breed);
    else subs.forEach(sb => flat.push(`${breed}/${sb}`));
  }
  flat.sort((a, b) => a.localeCompare(b));
  setCached(cacheKey, flat);
  return flat;
}

export async function getThreeImages(breedKey: BreedKey, signal?: AbortSignal): Promise<string[]> {
  const cacheKey = `images:3:${breedKey}`;
  const cached = getCached<string[]>(cacheKey);
  if (cached?.length) return cached;

  const [breed, sub] = breedKey.split("/");
  const url = sub
    ? `${BASE}/breed/${breed}/${sub}/images/random/3`
    : `${BASE}/breed/${breed}/images/random/3`;

  const res = await fetchWithRetry(url, { signal });
  if (!res.ok) throw new Error(`Failed to fetch images (${res.status})`);
  const data = (await res.json()) as DogApiImagesResponse;
  const imgs = Array.isArray(data.message) ? data.message : [data.message];
  setCached(cacheKey, imgs);
  return imgs;
}

export const favApiBase = import.meta.env.VITE_FAV_API_URL?.replace(/\/$/, "");

export async function listFavourites(): Promise<string[]> {
  if (!favApiBase) return JSON.parse(localStorage.getItem("favs") || "[]");
  const r = await fetch(`${favApiBase}/api/favourites`);
  if (!r.ok) throw new Error("Failed to fetch favourites");
  return r.json();
}
export async function addFavourite(imageUrl: string): Promise<void> {
  if (!favApiBase) {
    const f = new Set<string>(JSON.parse(localStorage.getItem("favs") || "[]"));
    f.add(imageUrl);
    localStorage.setItem("favs", JSON.stringify([...f]));
    return;
  }
  const r = await fetch(`${favApiBase}/api/favourites`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageUrl })
  });
  if (!r.ok) throw new Error("Failed to add favourite");
}
export async function removeFavourite(imageUrl: string): Promise<void> {
  if (!favApiBase) {
    const set = new Set<string>(JSON.parse(localStorage.getItem("favs") || "[]"));
    set.delete(imageUrl);
    localStorage.setItem("favs", JSON.stringify([...set]));
    return;
  }
  const r = await fetch(`${favApiBase}/api/favourites`, {
    method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageUrl })
  });
  if (!r.ok) throw new Error("Failed to remove favourite");
}
