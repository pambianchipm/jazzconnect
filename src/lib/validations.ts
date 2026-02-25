import { z } from "zod";

export const onboardingSchema = z.object({
  role: z.enum(["musician", "venue"]),
  // Musician fields
  bio: z.string().max(500).optional(),
  instruments: z.string().optional(),
  genres: z.string().optional(),
  // Venue fields
  venueName: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  address: z.string().max(200).optional(),
  venueType: z.string().optional(),
  capacity: z.coerce.number().int().min(0).optional(),
});

export const musicianProfileSchema = z.object({
  bio: z.string().max(500),
  instruments: z.string(),
  genres: z.string(),
  instagram: z.string().max(100),
  website: z.string().url().or(z.literal("")),
  photoUrl: z.string().url().or(z.literal("")),
  sampleTrackUrls: z.string(),
  yearsExperience: z.coerce.number().int().min(0).max(80),
  available: z.boolean(),
});

export const venueProfileSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
  address: z.string().min(1).max(200),
  venueType: z.string(),
  capacity: z.coerce.number().int().min(0),
  website: z.string().url().or(z.literal("")),
  phone: z.string().max(20),
  photoUrls: z.string(),
});

export const gigSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000),
  date: z.string().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  genres: z.string(),
  instruments: z.string(),
  payMin: z.coerce.number().int().min(0),
  payMax: z.coerce.number().int().min(0),
});

export const interestSchema = z.object({
  gigId: z.string().min(1),
  message: z.string().max(500).optional(),
});

export const invitationSchema = z.object({
  gigId: z.string().min(1),
  musicianId: z.string().min(1),
  message: z.string().max(500).optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(["accepted", "declined"]),
});
