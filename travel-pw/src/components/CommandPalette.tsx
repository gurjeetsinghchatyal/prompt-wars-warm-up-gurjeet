"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Plane,
  MapPin,
  Sparkles,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";

interface CommandPaletteProps {
  onPlanTrip: () => void;
  onShowInspiration: () => void;
  onSearchPlaces: () => void;
}

export function CommandPalette({
  onPlanTrip,
  onShowInspiration,
  onSearchPlaces,
}: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Travel AI">
            <CommandItem
              onSelect={() => {
                onPlanTrip();
                setOpen(false);
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Plan a Trip</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                onShowInspiration();
                setOpen(false);
              }}
            >
              <Plane className="mr-2 h-4 w-4" />
              <span>Inspiration Feed</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                onSearchPlaces();
                setOpen(false);
              }}
            >
              <MapPin className="mr-2 h-4 w-4" />
              <span>Search Places</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘Pr</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
