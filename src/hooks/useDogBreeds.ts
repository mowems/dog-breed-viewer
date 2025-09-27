import { useEffect, useMemo, useRef, useState } from "react";
import { getThreeImages, listBreeds } from "../lib/dogApi";
import type { BreedKey } from "../utils/types";
import { debounce } from "../utils/debounce";

export function useDogBreeds() {
  const [allBreeds, setAllBreeds] = useState<BreedKey[]>([]);
  const [filtered, setFiltered] = useState<BreedKey[]>([]);
  const [breed, setBreed] = useState<BreedKey | "">("");
  const [images, setImages] = useState<string[]>([]);
  const [loadingBreeds, setLoadingBreeds] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // Load breeds on mount
  useEffect(() => {
    (async () => {
      setLoadingBreeds(true);
      setError(null);
      try {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        const list = await listBreeds(abortRef.current.signal);
        setAllBreeds(list);
        setFiltered(list);
      } catch (e: unknown) {
        const name = (e as { name?: string }).name;
        if (name !== "AbortError") {
          const msg = (e as { message?: string }).message || "Failed to load breeds";
          setError(msg);
        }
      } finally {
        setLoadingBreeds(false);
      }
    })();

    return () => abortRef.current?.abort();
  }, []);

  // Fetch images when breed changes
  useEffect(() => {
    if (!breed) {
      setImages([]);
      return;
    }
    (async () => {
      setLoadingImages(true);
      setError(null);
      try {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        const imgs = await getThreeImages(breed, abortRef.current.signal);
        setImages(imgs);
      } catch (e: unknown) {
        const name = (e as { name?: string }).name;
        if (name !== "AbortError") {
          const msg = (e as { message?: string }).message || "Failed to load images";
          setError(msg);
        }
      } finally {
        setLoadingImages(false);
      }
    })();
  }, [breed]);

  // Debounced search/filter
  const onSearch = useMemo(
    () =>
      debounce((q: string) => {
        const s = q.trim().toLowerCase();
        if (!s) {
          setFiltered(allBreeds);
          return;
        }
        setFiltered(allBreeds.filter((b) => b.toLowerCase().includes(s)));
      }, 200),
    [allBreeds]
  );

  return {
    allBreeds,
    filtered,
    breed,
    setBreed,
    images,
    loadingBreeds,
    loadingImages,
    error,
    onSearch,
  };
}
