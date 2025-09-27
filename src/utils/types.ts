export type BreedKey = string; // e.g. "bulldog" or "bulldog/boston"

export interface DogApiListResponse {
  message: Record<string, string[]>;
  status: "success" | "error";
}

export interface DogApiImagesResponse {
  message: string[] | string; // API can return array or single string depending on endpoint
  status: "success" | "error";
}
