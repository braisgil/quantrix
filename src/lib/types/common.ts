// Minimal shared utility types; use only where they reduce repetition

export type Identifier = string;
export type Timestamp = string; // ISO 8601

export type Paginated<TItem> = {
  items: TItem[];
};


