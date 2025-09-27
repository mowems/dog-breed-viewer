import { useEffect, useState } from "react";
import { addFavourite, removeFavourite, listFavourites } from "../lib/dogApi";

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

  if (loading) return <div>Loading images…</div>;
  if (!images.length)
    return <div className="small">Choose a breed to see images.</div>;

  return (
    <div className="grid">
      {images.map((src) => (
        <div className="card" key={src}>
          <img src={src} alt="Dog" loading="lazy" />
          <div style={{ padding: 12 }} className="row">
            <button
              className="button"
              onClick={() => toggleFav(src)}
              disabled={busy === src}
            >
              {favs.has(src) ? "★ Unfavourite" : "☆ Favourite"}
            </button>
            {busy === src && <span className="small">Saving…</span>}
            {favs.has(src) && <span className="badge">Saved</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
