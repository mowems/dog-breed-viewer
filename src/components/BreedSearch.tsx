import { useState, type ChangeEvent } from "react";

interface Props {
  onChange: (value: string) => void;
}

export default function BreedSearch({ onChange }: Props) {
  const [value, setValue] = useState("");

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    onChange(v);
  };

  const clear = () => {
    setValue("");
    onChange("");
  };

  return (
    <div className="input-wrap">
      <input
        className="input"
        type="text"
        placeholder="Search breeds…"
        value={value}
        onChange={handle}
        aria-label="Search breeds"
      />
      {value && (
        <button
          className="input-clear"
          type="button"
          onClick={clear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
