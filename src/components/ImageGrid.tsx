import { useEffect, useState } from "react";
import { addFavourite, removeFavourite, listFavourites } from "../lib/dogApi";

function SkeletonCard() {
  return (
    <div className="card skeleton" aria-hidden="true">
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
        const next = new Set(favs);
        next.delete(url);
        setFavs(next);
      } else {
        await addFavourite(url);
        const next = new Set(favs);
        next.add(url);
        setFavs(next);
      }
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="grid" aria-live="polite" aria-busy="true">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!images.length) {
    return <div className="small">Choose a breed to see images.</div>;
  }

  return (
    <div className="grid">
      {images.map((src) => {
        const isFav = favs.has(src);
        const isBusy = busy === src;

        return (
          <div className="card" key={src}>
            <img
              src={src}
              alt={`Dog image${isFav ? " (favourited)" : ""}`}
              loading="lazy"
            />

            <div className="row button-row">
              <button
                className={`button-fav ${isFav ? "active" : ""}`}
                aria-pressed={isFav}
                aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
                onClick={() => toggleFav(src)}
                disabled={isBusy}
                type="button"
              >
                {/* icon + fixed-width label prevents jumpiness */}
                <span aria-hidden="true">{isFav ? "★" : "☆"}</span>
                <span className="button-fav__label">
                  {isFav ? "Favourited" : "Favourite"}
                </span>
              </button>

              {isBusy && <span className="saving-dot" aria-live="polite">Saving…</span>}
              {isFav && !isBusy && (
                <span className="badge badge--info" role="status" aria-live="polite">
                  <span className="badge__dot" aria-hidden="true" />
                  Saved
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
