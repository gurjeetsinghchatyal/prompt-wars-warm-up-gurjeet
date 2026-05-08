import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TravelPreferenceSchema, ItinerarySchema } from "~/lib/schemas";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { env } from "~/env";

export const travelRouter = createTRPCRouter({
  generateItinerary: publicProcedure
    .input(TravelPreferenceSchema)
    .mutation(async ({ input }) => {
      const { budget, pace, geography, interests, duration, destination } = input;

      const prompt = `
        Generate a detailed travel itinerary for a ${duration}-day trip to ${destination}.
        Preferences:
        - Budget: ${budget}
        - Pace: ${pace}
        - Geography: ${geography}
        - Interests: ${interests.join(", ")}

        Please provide a title, a brief description, and a day-by-day plan with specific activities, locations, and categories.
      `;

      try {
        console.log("Generating itinerary with params:", { destination, duration, budget });
        const { object } = await generateObject({
          model: google("gemini-2.5-flash"),
          schema: ItinerarySchema,
          prompt,
        });

        console.log("Successfully generated itinerary");
        return object;
      } catch (error: any) {
        console.error("AI Generation Detailed Error:", JSON.stringify(error, null, 2));
        console.error("Error Message:", error.message);
        throw new Error(`AI Error: ${error.message || "Failed to generate itinerary"}`);
      }
    }),
});
