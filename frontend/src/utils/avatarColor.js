const PALETTE = [
  "#4F46E5", "#0F766E", "#B45309", "#BE185D",
  "#4338CA", "#0369A1", "#15803D", "#9333EA",
];

export const colorForName = (name = "?") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

export const initialsFor = (name = "?") => (name.trim() ? name.trim().charAt(0).toUpperCase() : "?");
