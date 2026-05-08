import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

export const placesRouter = createTRPCRouter({
  searchPlaces: publicProcedure
    .input(z.object({ textQuery: z.string() }))
    .query(async ({ input }) => {
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.photos",
        },
        body: JSON.stringify({
          textQuery: input.textQuery,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch places");
      }

      const data = await response.json();
      return data.places || [];
    }),

  getPlaceDetails: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(async ({ input }) => {
      const response = await fetch(`https://places.googleapis.com/v1/places/${input.placeId}`, {
        headers: {
          "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "id,displayName,formattedAddress,location,photos,rating,editorialSummary",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch place details");
      }

      return await response.json();
    }),
});
