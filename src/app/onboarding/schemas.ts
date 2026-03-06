import { z } from "zod";

export const step1Schema = z.object({
  role: z.enum(["musician", "venue"], {
    required_error: "Please select a role",
  }),
});

export const step2MusicianSchema = z.object({
  bio: z.string().min(1, "Bio is required").max(500, "Bio must be 500 characters or less"),
  instruments: z.array(z.string()).min(1, "Select at least one instrument"),
  genres: z.array(z.string()).min(1, "Select at least one genre"),
});

export const step2VenueSchema = z.object({
  venueName: z.string().min(1, "Venue name is required").max(100, "Name must be 100 characters or less"),
  description: z.string().min(1, "Description is required").max(500, "Description must be 500 characters or less"),
  address: z.string().min(1, "Address is required").max(200, "Address must be 200 characters or less"),
  venueType: z.string().min(1, "Please select a venue type"),
  capacity: z.string().optional(),
});

export const step3MusicianSchema = z.object({
  instagram: z
    .string()
    .regex(/^@?[a-zA-Z0-9._]{0,30}$/, "Invalid Instagram handle")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export const step3VenueSchema = z.object({
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^[+\d\s()-]{0,20}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
});
