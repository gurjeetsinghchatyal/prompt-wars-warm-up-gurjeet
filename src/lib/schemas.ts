import { z } from "zod";

export const TravelPreferenceSchema = z.object({
  budget: z.enum(["budget", "moderate", "luxury"]),
  pace: z.enum(["relaxed", "balanced", "fast-paced"]),
  geography: z.enum(["urban", "nature", "coastal", "mountain", "rural"]),
  interests: z.array(z.string()),
  duration: z.number().min(1).max(30),
  destination: z.string().min(2),
});

export type TravelPreferences = z.infer<typeof TravelPreferenceSchema>;

export const ItineraryItemSchema = z.object({
  time: z.string(),
  activity: z.string(),
  location: z.string(),
  description: z.string(),
  category: z.enum(["sightseeing", "dining", "relaxation", "transport", "activity"]),
});

export const DayPlanSchema = z.object({
  day: z.number(),
  items: z.array(ItineraryItemSchema),
});

export const ItinerarySchema = z.object({
  title: z.string(),
  description: z.string(),
  days: z.array(DayPlanSchema),
});

export type Itinerary = z.infer<typeof ItinerarySchema>;
export type ItineraryItem = z.infer<typeof ItineraryItemSchema>;
export type DayPlan = z.infer<typeof DayPlanSchema>;
