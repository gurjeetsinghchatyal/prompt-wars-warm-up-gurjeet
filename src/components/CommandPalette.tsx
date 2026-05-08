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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({
  onPlanTrip,
  onShowInspiration,
  onSearchPlaces,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;

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
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
