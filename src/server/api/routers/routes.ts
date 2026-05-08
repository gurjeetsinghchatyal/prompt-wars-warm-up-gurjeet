import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

export const routesRouter = createTRPCRouter({
  calculateRoute: publicProcedure
    .input(z.object({
      origin: z.object({ lat: z.number(), lng: z.number() }),
      destination: z.object({ lat: z.number(), lng: z.number() }),
      travelMode: z.enum(["DRIVE", "WALK", "BICYCLE", "TRANSIT"]).default("DRIVE"),
    }))
    .mutation(async ({ input }) => {
      const response = await fetch("https://routes.googleapis.com/distanceMatrix/v1:computeRouteMatrix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "originIndex,destinationIndex,duration,distanceMeters,status,condition",
        },
        body: JSON.stringify({
          origins: [{ waypoint: { location: { latLng: input.origin } } }],
          destinations: [{ waypoint: { location: { latLng: input.destination } } }],
          travelMode: input.travelMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate route");
      }

      const data = await response.json();
      return data[0] || null;
    }),
});
