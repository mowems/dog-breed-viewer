import "./styles.css";
import { useDogBreeds } from "./hooks/useDogBreeds";
import BreedSearch from "./components/BreedSearch";
import BreedSelect from "./components/BreedSelect";
import ImageGrid from "./components/ImageGrid";
import ErrorBanner from "./components/ErrorBanner";

export default function App() {
  const {
    filtered,
    breed,
    setBreed,
    images,
    loadingBreeds,
    loadingImages,
    error,
    onSearch,
  } = useDogBreeds();

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 style={{ marginTop: 0 }}>Dog Breed Viewer</h2>

        <BreedSearch onChange={onSearch} />

        {loadingBreeds && <div>Loading breed list…</div>}

        {!loadingBreeds && (
          <>
            <BreedSelect breeds={filtered} value={breed} onChange={setBreed} />
            <div className="helper">Breeds: {filtered.length}</div>
          </>
        )}

        {error && <ErrorBanner message={error} />}
      </aside>

      <main className="main">
        <div className="header">
          <h3 style={{ margin: 0 }}>{breed || "Pick a breed"}</h3>
          <span className="small">
            Shows 3 random images per selection. Changes update automatically.
          </span>
        </div>

        <ImageGrid images={images} loading={loadingImages} />
      </main>
    </div>
  );
}
