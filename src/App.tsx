import "./styles.css";
import { useDogBreeds } from "./hooks/useDogBreeds";
import BreedSearch from "./components/BreedSearch";
import BreedSelect from "./components/BreedSelect";
import ImageGrid from "./components/ImageGrid";
import ErrorBanner from "./components/ErrorBanner";

export default function App() {
  const {
    allBreeds,
    filtered,
    breed,
    setBreed,
    images,
    loadingBreeds,
    loadingImages,
    error,
    onSearch,
    recentBreeds,
  } = useDogBreeds();

  const isFiltering = filtered.length !== allBreeds.length;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 style={{ marginTop: 0 }}>Dog Breed Viewer</h2>

        <div className="section">
          <div className="label">Search</div>
          <BreedSearch onChange={onSearch} />
          <div className="helper">
            Type to filter. Supports sub-breeds (e.g. “bulldog/boston”).
          </div>
        </div>

        {loadingBreeds && <div className="section">Loading breed list…</div>}

        {!loadingBreeds && (
          <div className="section">
            <div className="label">Select a breed</div>
            <BreedSelect breeds={filtered} value={breed} onChange={setBreed} />

            <div className="helper">
              {!isFiltering
                ? `Showing all ${allBreeds.length} breeds.`
                : filtered.length === 0
                ? "No breeds match your search."
                : filtered.length === 1
                ? "1 breed match your search."
                : `${filtered.length} breeds match your search.`}
            </div>
          </div>
        )}

        {recentBreeds.length > 0 && (
          <div className="section">
            <div className="label">Recent</div>
            <div className="chips">
              {recentBreeds.map((r) => (
                <button
                  key={r}
                  className="chip"
                  onClick={() => setBreed(r)}
                  aria-label={`Select ${r}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <ErrorBanner message={error} />}
      </aside>

      <main className="main">
        <div className="header">
          <h3 className="header-title">{breed || "Pick a breed"}</h3>
          <span className="header-note small">
            Shows 3 random images per selection. Changes update automatically.
          </span>
        </div>

        <ImageGrid images={images} loading={loadingImages} />
      </main>
    </div>
  );
}
