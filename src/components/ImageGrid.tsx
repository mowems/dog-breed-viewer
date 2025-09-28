import { useEffect, useState } from "react";
import { addFavourite, removeFavourite, listFavourites } from "../lib/dogApi";

function SkeletonCard() {
  return (
    <div className="card skeleton">
      <div className="sk-img" />
      <div className="sk-row" />
    </div>
  );
}

export default function ImageGrid({
  images,
  loading,
}: {
  images: string[];
  loading: boolean;
}) {
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    (async () => setFavs(new Set(await listFavourites())))();
  }, []);

  const toggleFav = async (url: string) => {
    try {
      setBusy(url);
      if (favs.has(url)) {
        await removeFavourite(url);
        favs.delete(url);
        setFavs(new Set(favs));
      } else {
        await addFavourite(url);
        favs.add(url);
        setFavs(new Set(favs));
      }
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="grid" aria-live="polite" aria-busy="true">
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    );
  }
  if (!images.length)
    return <div className="small">Choose a breed to see images.</div>;

  return (
    <div className="grid">
      {images.map((src) => (
        <div className="card" key={src}>
          <img src={src} alt={`Dog image${favs.has(src) ? " (favourited)" : ""}`} loading="lazy" />
          <div style={{ padding: 12 }} className="row">
            <button
              className="button"
              aria-pressed={favs.has(src)}
              aria-label={favs.has(src) ? "Remove from favourites" : "Add to favourites"}
              onClick={() => toggleFav(src)}
              disabled={busy === src}
            >
              {favs.has(src) ? "★ Favourited" : "☆ Favourite"}
            </button>
            {busy === src && <span className="small">Saving…</span>}
            {favs.has(src) && <span className="badge">Saved</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
