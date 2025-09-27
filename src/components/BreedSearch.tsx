import type { ChangeEvent } from "react";

interface Props {
  onChange: (value: string) => void;
}

export default function BreedSearch({ onChange }: Props) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  return (
    <div>
      <input
        className="input"
        placeholder="Search breeds…"
        onChange={handle}
        aria-label="Search breeds"
      />
      <div className="helper">
        Type to filter. Supports sub-breeds (e.g. “bulldog/boston”).
      </div>
    </div>
  );
}
