export interface OnboardingFormData {
  role: "musician" | "venue" | null;
  // Musician fields
  bio: string;
  instruments: string[];
  genres: string[];
  // Venue fields
  venueName: string;
  description: string;
  address: string;
  venueType: string;
  capacity: string;
  // Social & links
  instagram: string;
  website: string;
  phone: string;
}

export const initialFormData: OnboardingFormData = {
  role: null,
  bio: "",
  instruments: [],
  genres: [],
  venueName: "",
  description: "",
  address: "",
  venueType: "",
  capacity: "",
  instagram: "",
  website: "",
  phone: "",
};
