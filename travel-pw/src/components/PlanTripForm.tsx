"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TravelPreferenceSchema, type TravelPreferences } from "~/lib/schemas";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function PlanTripForm({ 
  onSubmit, 
  initialDestination = "" 
}: { 
  onSubmit: (data: TravelPreferences) => void;
  initialDestination?: string;
}) {
  const form = useForm<TravelPreferences>({
    resolver: zodResolver(TravelPreferenceSchema),
    defaultValues: {
      destination: initialDestination,
      budget: "moderate",
      pace: "balanced",
      geography: "urban",
      duration: 3,
      interests: [],
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-background/80 backdrop-blur-md border-primary/20">
      <CardHeader>
        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          Plan Your Next Adventure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris, Tokyo, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pace</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pace" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="relaxed">Relaxed</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="fast-paced">Fast-paced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="geography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geography</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select geography" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="urban">Urban</SelectItem>
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="coastal">Coastal</SelectItem>
                        <SelectItem value="mountain">Mountain</SelectItem>
                        <SelectItem value="rural">Rural</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests (comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Food, Art, Hiking..." 
                      onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-primary/20 transition-all">
              Generate Itinerary
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
