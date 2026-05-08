"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Sparkles } from "lucide-react";

const INSPIRATIONS = [
  {
    id: 1,
    title: "Amalfi Coast, Italy",
    description: "Experience the stunning coastal views and vibrant towns.",
    image: "/inspirations/amalfi.webp",
    tags: ["Coastal", "Luxury", "Summer"],
  },
  {
    id: 2,
    title: "Kyoto, Japan",
    description: "Explore the ancient temples and beautiful zen gardens.",
    image: "/inspirations/kyoto.webp",
    tags: ["Urban", "Culture", "Spring"],
  },
  {
    id: 3,
    title: "Swiss Alps, Switzerland",
    description: "Breathtaking mountain peaks and cozy alpine villages.",
    image: "/inspirations/alps.webp",
    tags: ["Mountain", "Nature", "Winter"],
  },
  {
    id: 4,
    title: "Bora Bora, French Polynesia",
    description: "Pristine beaches and overwater bungalows.",
    image: "/inspirations/borabora.webp",
    tags: ["Coastal", "Relaxation", "Tropical"],
  },
];

export function InspirationFeed({ onSelect }: { onSelect: (destination: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {INSPIRATIONS.map((item) => (
        <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="relative h-48 w-full">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
            </div>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            <Button 
              size="sm" 
              className="ml-auto" 
              onClick={() => onSelect(item.title)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Plan
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
