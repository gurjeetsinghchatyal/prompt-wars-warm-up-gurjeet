"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { type Itinerary, type ItineraryItem } from "~/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { MapPin, Clock, GripVertical } from "lucide-react";

export function ItineraryBuilder({ initialData }: { initialData: Itinerary }) {
  const [itinerary, setItinerary] = useState(initialData);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDayIndex = parseInt(source.droppableId.split("-")[1]!);
    const destDayIndex = parseInt(destination.droppableId.split("-")[1]!);

    const newDays = [...itinerary.days];
    const sourceDay = newDays[sourceDayIndex]!;
    const destDay = newDays[destDayIndex]!;

    const [removed] = sourceDay.items.splice(source.index, 1);
    destDay.items.splice(destination.index, 0, removed!);

    setItinerary({ ...itinerary, days: newDays });
  };

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          {itinerary.title}
        </h1>
        <p className="text-xl text-muted-foreground">{itinerary.description}</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {itinerary.days.map((day, dayIndex) => (
            <div key={day.day} className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Day {day.day}
              </h2>
              <Droppable droppableId={`day-${dayIndex}`}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 min-h-[100px] p-4 bg-muted/30 rounded-xl border-2 border-dashed border-primary/10"
                  >
                    {day.items.map((item, index) => (
                      <Draggable
                        key={`${day.day}-${index}`}
                        draggableId={`${day.day}-${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`transition-shadow ${snapshot.isDragging ? "shadow-2xl ring-2 ring-primary" : "shadow-md"}`}
                          >
                            <CardContent className="p-4 flex items-start gap-4">
                              <div {...provided.dragHandleProps} className="mt-1">
                                <GripVertical className="text-muted-foreground" />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="font-semibold">{item.time}</span>
                                  </div>
                                  <Badge>{item.category}</Badge>
                                </div>
                                <h3 className="font-bold text-lg">{item.activity}</h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {item.location}
                                </div>
                                <p className="text-sm">{item.description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
