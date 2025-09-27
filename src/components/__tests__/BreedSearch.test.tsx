import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import BreedSearch from "../../components/BreedSearch";

describe("BreedSearch", () => {
  it("calls onChange as user types", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    const { getByLabelText } = render(<BreedSearch onChange={onChange} />);
    const input = getByLabelText(/search breeds/i) as HTMLInputElement;

    await user.type(input, "airedale");
    expect(onChange).toHaveBeenCalledWith("airedale");
  });
});
