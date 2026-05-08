import Head from "next/head";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "~/utils/api";
import { CommandPalette } from "~/components/CommandPalette";
import { InspirationFeed } from "~/components/InspirationFeed";
import { PlanTripForm } from "~/components/PlanTripForm";
import { ItineraryBuilder } from "~/components/ItineraryBuilder";
import { type Itinerary, type TravelPreferences } from "~/lib/schemas";
import { Sparkles, Plane, History, Map as MapIcon, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export default function Home() {
  const [view, setView] = useState<"inspiration" | "plan" | "itinerary">("inspiration");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);

  const generateMutation = api.travel.generateItinerary.useMutation({
    onSuccess: (data) => {
      setGeneratedItinerary(data);
      setView("itinerary");
    },
  });

  const handlePlanTrip = (destination?: string) => {
    setSelectedDestination(destination || "");
    setView("plan");
  };

  const handleFormSubmit = (data: TravelPreferences) => {
    generateMutation.mutate(data);
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
          onSearchPlaces={() => {}} // TODO: Implement search
        />

        {/* Hero Section / Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Plane className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">ANTIGRAVITY</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="hidden md:flex" onClick={() => setView("inspiration")}>
              Inspiration
            </Button>
            <Button variant="ghost" className="hidden md:flex">
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
                  <h2 className="text-5xl font-extrabold tracking-tight">Where to next?</h2>
                  <p className="text-xl text-muted-foreground">
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
                {generateMutation.isPending ? (
                  <div className="flex flex-col items-center justify-center space-y-6 py-24">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <div className="text-center">
                      <h3 className="text-3xl font-bold">Building your itinerary...</h3>
                      <p className="text-muted-foreground">Consulting Gemini Pro for the best local secrets.</p>
                    </div>
                  </div>
                ) : (
                  <PlanTripForm 
                    onSubmit={handleFormSubmit} 
                    initialDestination={selectedDestination} 
                  />
                )}
              </motion.div>
            )}

            {view === "itinerary" && generatedItinerary && (
              <motion.div
                key="itinerary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12"
              >
                <ItineraryBuilder initialData={generatedItinerary} />
                <div className="mt-12 flex justify-center gap-4">
                  <Button variant="outline" size="lg" onClick={() => setView("plan")}>
                    Edit Preferences
                  </Button>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Save Itinerary
                  </Button>
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
            onClick={() => {}} // Open AI Chatbot or Command Palette
          >
            <Sparkles className="w-6 h-6" />
          </Button>
        </div>
      </main>
    </>
  );
}
