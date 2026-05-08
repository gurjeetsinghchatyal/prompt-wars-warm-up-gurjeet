import { api } from "~/utils/api";
import { Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export function InspirationFeed({ onSelect }: { onSelect: (destination: string) => void }) {
  const { data: inspirations, isLoading } = api.travel.getDynamicInspirations.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {inspirations?.map((item) => (
        <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white/5 border-white/10 backdrop-blur-sm">
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
              <CardTitle className="text-xl font-bold text-white">{item.title}</CardTitle>
            </div>
            <CardDescription className="text-white/60">{item.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/10 text-white/80 hover:bg-white/20 border-none">
                {tag}
              </Badge>
            ))}
            <Button 
              size="sm" 
              className="ml-auto bg-primary hover:bg-primary/90 text-white" 
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
