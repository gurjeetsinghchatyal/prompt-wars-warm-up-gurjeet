import { z } from "zod";
import { type Prisma } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TravelPreferenceSchema, ItinerarySchema } from "~/lib/schemas";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

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
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to generate itinerary";
        console.error("AI Generation Detailed Error:", error);
        throw new Error(`AI Error: ${message}`);
      }
    }),

  saveItinerary: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      data: z.unknown(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.itinerary.create({
        data: {
          title: input.title,
          description: input.description,
          data: input.data as Prisma.InputJsonValue,
        },
      });
    }),

  getSavedItineraries: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.itinerary.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getDynamicInspirations: publicProcedure.query(async () => {
    // Shuffling the static inspirations for now to make it "dynamic"
    const INSPIRATIONS = [
      { id: 1, title: "Amalfi Coast, Italy", description: "Experience the stunning coastal views and vibrant towns.", image: "/inspirations/amalfi.webp", tags: ["Coastal", "Luxury", "Summer"] },
      { id: 2, title: "Kyoto, Japan", description: "Explore the ancient temples and beautiful zen gardens.", image: "/inspirations/kyoto.webp", tags: ["Urban", "Culture", "Spring"] },
      { id: 3, title: "Swiss Alps, Switzerland", description: "Breathtaking mountain peaks and cozy alpine villages.", image: "/inspirations/alps.webp", tags: ["Mountain", "Nature", "Winter"] },
      { id: 4, title: "Bora Bora, French Polynesia", description: "Pristine beaches and overwater bungalows.", image: "/inspirations/borabora.webp", tags: ["Coastal", "Relaxation", "Tropical"] },
      { id: 5, title: "Santorini, Greece", description: "Iconic white buildings and stunning sunsets.", image: "/inspirations/amalfi.webp", tags: ["Coastal", "Romantic", "Summer"] },
      { id: 6, title: "Reykjavik, Iceland", description: "Northern lights and volcanic landscapes.", image: "/inspirations/alps.webp", tags: ["Nature", "Adventure", "Winter"] },
    ];
    
    return INSPIRATIONS.sort(() => Math.random() - 0.5).slice(0, 4);
  }),
});
