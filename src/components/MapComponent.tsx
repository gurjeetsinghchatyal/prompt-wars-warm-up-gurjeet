"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { env } from "~/env";

interface MapComponentProps {
  locations: { lat: number; lng: number; title: string }[];
}

export function MapComponent({ locations }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "beta",
        libraries: ["marker"],
      });

      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      if (mapRef.current) {
        const map = new Map(mapRef.current, {
          center: locations[0] || { lat: 0, lng: 0 },
          zoom: 12,
          mapId: "DEMO_MAP_ID", // Replace with actual Map ID for advanced markers
        });

        locations.forEach((loc) => {
          new AdvancedMarkerElement({
            map,
            position: { lat: loc.lat, lng: loc.lng },
            title: loc.title,
          });
        });
      }
    };

    initMap();
  }, [locations]);

  return <div ref={mapRef} className="h-[400px] w-full rounded-xl shadow-2xl border-2 border-primary/20" />;
}
