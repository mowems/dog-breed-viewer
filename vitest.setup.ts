import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest"; // wires matchers into Vitest

afterEach(() => {
  cleanup();
});
