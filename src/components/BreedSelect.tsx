import type { BreedKey } from "../utils/types";

interface Props {
  breeds: BreedKey[];
  value: BreedKey | "";
  onChange: (v: BreedKey) => void;
}

export default function BreedSelect({ breeds, value, onChange }: Props) {
  return (
    <select
      className="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Select a breed"
    >
      <option value="" disabled>
        Browse breeds...
      </option>
      {breeds.map((b) => (
        <option key={b} value={b}>
          {b}
        </option>
      ))}
    </select>
  );
}
