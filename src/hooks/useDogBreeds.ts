import { useEffect, useState } from "react";

type BreedKey = string;

interface BreedMap {
  [key: string]: string[];
}

const RECENT_KEY = "dog-viewer:recent-breeds";

function loadRecents(): BreedKey[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecents(list: BreedKey[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 5)));
}

export function useDogBreeds() {
  const [allBreeds, setAllBreeds] = useState<BreedKey[]>([]);
  const [filtered, setFiltered] = useState<BreedKey[]>([]);
  const [breed, setBreed] = useState<BreedKey | "">("");
  const [images, setImages] = useState<string[]>([]);
  const [loadingBreeds, setLoadingBreeds] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentBreeds, setRecentBreeds] = useState<BreedKey[]>(loadRecents());

  // fetch all breeds
  useEffect(() => {
    async function fetchBreeds() {
      setLoadingBreeds(true);
      try {
        const res = await fetch("https://dog.ceo/api/breeds/list/all");
        const json = await res.json();
        const map: BreedMap = json.message;
        const keys: BreedKey[] = [];
        Object.keys(map).forEach((main) => {
          if (map[main].length) {
            map[main].forEach((sub) => keys.push(`${main}/${sub}`));
          } else {
            keys.push(main);
          }
        });
        setAllBreeds(keys);
        setFiltered(keys);
      } catch (e: unknown) {
        const msg =
          (e as { message?: string })?.message?.trim() || "Failed to load breeds.";
        setError(msg);
      } finally {
        setLoadingBreeds(false);
      }
    }
    fetchBreeds();
  }, []);

  // fetch images when breed changes
  useEffect(() => {
    if (!breed) return;
    async function fetchImages() {
      setLoadingImages(true);
      try {
        const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/3`);
        const json = await res.json();
        setImages(json.message);
      } catch {
        setError("Failed to load images.");
      } finally {
        setLoadingImages(false);
      }
    }
    fetchImages();
  }, [breed]);

  const onSearch = (q: string) => {
    const lower = q.toLowerCase();
    setFiltered(allBreeds.filter((b) => b.toLowerCase().includes(lower)));
  };

  const setBreedTracked = (b: BreedKey | "") => {
    setBreed(b);
    if (b) {
      const next = [b, ...recentBreeds.filter((x) => x !== b)].slice(0, 5);
      setRecentBreeds(next);
      saveRecents(next);
    }
  };

  return {
    allBreeds,
    filtered,
    breed,
    setBreed: setBreedTracked,
    images,
    loadingBreeds,
    loadingImages,
    error,
    onSearch,
    refetchImages: () => setBreedTracked(breed),
    recentBreeds,
  };
}
