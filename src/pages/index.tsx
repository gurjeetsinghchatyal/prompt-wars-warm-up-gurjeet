import Head from "next/head";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "~/utils/api";
import { CommandPalette } from "~/components/CommandPalette";
import { InspirationFeed } from "~/components/InspirationFeed";
import { PlanTripForm } from "~/components/PlanTripForm";
import { ItineraryBuilder } from "~/components/ItineraryBuilder";
import { type Itinerary, type TravelPreferences } from "~/lib/schemas";
import { Sparkles, Plane, History, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";

export default function Home() {
  const [view, setView] = useState<"inspiration" | "plan" | "itinerary" | "trips">("inspiration");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const generateMutation = api.travel.generateItinerary.useMutation({
    onSuccess: (data) => {
      setGeneratedItinerary(data);
      setView("itinerary");
    },
  });

  const saveMutation = api.travel.saveItinerary.useMutation({
    onSuccess: () => {
      alert("Itinerary saved successfully!");
      setView("trips");
    },
  });

  const { data: savedTrips } = api.travel.getSavedItineraries.useQuery(undefined, {
    enabled: view === "trips",
  });

  const handlePlanTrip = (destination?: string) => {
    setSelectedDestination(destination ?? "");
    setView("plan");
  };

  const handleFormSubmit = (data: TravelPreferences) => {
    generateMutation.mutate(data);
  };

  const handleSaveItinerary = () => {
    if (!generatedItinerary) return;
    saveMutation.mutate({
      title: generatedItinerary.title,
      description: generatedItinerary.description,
      data: generatedItinerary,
    });
  };

  return (
    <>
      <Head>
        <title>Antigravity Travel | AI-Powered Adventures</title>
        <meta name="description" content="Design your dream trip with Gemini AI" />
      </Head>

      <main className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
        <CommandPalette 
          onPlanTrip={() => setView("plan")} 
          onShowInspiration={() => setView("inspiration")}
          onSearchPlaces={() => { /* TODO: Implement search */ }} 
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
        />

        {/* Hero Section / Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("inspiration")}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Plane className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">ANTIGRAVITY</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="hidden md:flex" onClick={() => setView("inspiration")}>
              Inspiration
            </Button>
            <Button variant="ghost" className="hidden md:flex" onClick={() => setView("trips")}>
              My Trips
            </Button>
            <Button 
              className="bg-white text-black hover:bg-white/90"
              onClick={() => handlePlanTrip()}
            >
              Start Planning
            </Button>
          </div>
        </nav>

        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {view === "inspiration" && (
              <motion.div
                key="inspiration"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4 max-w-2xl mx-auto py-12">
                  <h2 className="text-5xl font-extrabold tracking-tight text-white">Where to next?</h2>
                  <p className="text-xl text-white/60">
                    Get inspired by these curated destinations or let our AI build your custom adventure.
                  </p>
                </div>
                <InspirationFeed onSelect={(dest) => handlePlanTrip(dest)} />
              </motion.div>
            )}

            {view === "plan" && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="py-12"
              >
                <PlanTripForm 
                  onSubmit={handleFormSubmit} 
                  initialDestination={selectedDestination} 
                />
                {generateMutation.isPending && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <p className="text-2xl font-bold animate-pulse text-white">Crafting your masterpiece...</p>
                  </div>
                )}
              </motion.div>
            )}

            {view === "itinerary" && generatedItinerary && (
              <motion.div
                key="itinerary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <ItineraryBuilder initialData={generatedItinerary} />
                <div className="flex justify-center pb-12">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-white px-8 h-14 text-xl font-bold shadow-xl shadow-primary/20"
                    onClick={handleSaveItinerary}
                    disabled={saveMutation.isPending}
                  >
                    {saveMutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                    Save Itinerary
                  </Button>
                </div>
              </motion.div>
            )}

            {view === "trips" && (
              <motion.div
                key="trips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4 max-w-2xl mx-auto py-12">
                  <h2 className="text-5xl font-extrabold tracking-tight text-white">My Trips</h2>
                  <p className="text-xl text-white/60">
                    Your collection of AI-crafted adventures.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedTrips?.map((trip) => (
                    <Card key={trip.id} className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => {
                      setGeneratedItinerary(trip.data as Itinerary);
                      setView("itinerary");
                    }}>
                      <CardHeader>
                        <CardTitle className="text-white group-hover:text-primary transition-colors">{trip.title}</CardTitle>
                        <CardDescription className="text-white/40 line-clamp-2">{trip.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="text-xs text-white/30">
                        Saved on {new Date(trip.createdAt).toLocaleDateString()}
                      </CardFooter>
                    </Card>
                  ))}
                  {savedTrips?.length === 0 && (
                    <div className="col-span-full text-center py-24 space-y-4">
                      <History className="w-16 h-16 text-white/10 mx-auto" />
                      <p className="text-xl text-white/40">No trips saved yet. Start planning!</p>
                      <Button onClick={() => setView("plan")}>Create Trip</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Floating Actions */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button 
            size="icon" 
            className="w-14 h-14 rounded-full shadow-2xl bg-primary hover:scale-110 transition-transform"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <Sparkles className="w-6 h-6" />
          </Button>
        </div>

      </main>
    </>
  );
}
