export const GENRES = [
  "Bebop",
  "Cool Jazz",
  "Hard Bop",
  "Modal Jazz",
  "Free Jazz",
  "Fusion",
  "Smooth Jazz",
  "Latin Jazz",
  "Swing",
  "Dixieland",
  "Contemporary",
  "Avant-Garde",
  "Soul Jazz",
  "Acid Jazz",
  "Gypsy Jazz",
] as const;

export const INSTRUMENTS = [
  "Saxophone",
  "Trumpet",
  "Trombone",
  "Piano",
  "Guitar",
  "Bass",
  "Drums",
  "Vocals",
  "Clarinet",
  "Flute",
  "Vibraphone",
  "Organ",
  "Violin",
  "Cello",
  "Harmonica",
] as const;

export const VENUE_TYPES = [
  "Restaurant",
  "Bar",
  "Lounge",
  "Club",
  "Hotel",
  "Café",
  "Concert Hall",
  "Rooftop",
  "Speakeasy",
  "Wine Bar",
] as const;

export const GIG_STATUSES = ["open", "filled", "cancelled"] as const;
export const INTEREST_STATUSES = ["pending", "accepted", "declined"] as const;
export const INVITATION_STATUSES = ["pending", "accepted", "declined"] as const;
