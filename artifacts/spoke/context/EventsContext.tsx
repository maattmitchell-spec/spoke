import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { SAMPLE_EVENTS, type Event, type EventType } from "@/constants/data";

type Difficulty = "easy" | "moderate" | "hard";

interface NewEventInput {
  title: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  distance?: string;
  elevation?: string;
  difficulty: Difficulty;
  maxAttendees: number;
  host: string;
  hostAvatar: string;
  description: string;
  tags: string[];
  ridewithgpsUrl?: string;
}

interface EventsContextType {
  events: Event[];
  toggleJoin: (eventId: string) => void;
  createEvent: (input: NewEventInput) => void;
  joinedCount: number;
  joinedEvents: Event[];
}

const EventsContext = createContext<EventsContextType | null>(null);

const JOINED_KEY = "spoke_joined_events";
const CREATED_KEY = "spoke_created_events";

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS);

  useEffect(() => {
    (async () => {
      const [joinedRaw, createdRaw] = await Promise.all([
        AsyncStorage.getItem(JOINED_KEY),
        AsyncStorage.getItem(CREATED_KEY),
      ]);

      const joinedIds: string[] = joinedRaw ? JSON.parse(joinedRaw) : [];
      const createdEvents: Event[] = createdRaw ? JSON.parse(createdRaw) : [];

      setEvents(() => {
        const all = [...SAMPLE_EVENTS, ...createdEvents];
        return all.map((e) => ({ ...e, isJoined: joinedIds.includes(e.id) }));
      });
    })();
  }, []);

  const toggleJoin = useCallback((eventId: string) => {
    setEvents((prev) => {
      const updated = prev.map((e) => {
        if (e.id !== eventId) return e;
        const joining = !e.isJoined;
        return {
          ...e,
          isJoined: joining,
          attendees: joining ? e.attendees + 1 : e.attendees - 1,
        };
      });
      const joinedIds = updated.filter((e) => e.isJoined).map((e) => e.id);
      AsyncStorage.setItem(JOINED_KEY, JSON.stringify(joinedIds));
      return updated;
    });
  }, []);

  const createEvent = useCallback((input: NewEventInput) => {
    const newEvent: Event = {
      id: `user_${Date.now()}`,
      title: input.title,
      type: input.type,
      date: input.date,
      time: input.time,
      location: input.location,
      distance: input.distance,
      elevation: input.elevation,
      difficulty: input.difficulty,
      attendees: 1,
      maxAttendees: input.maxAttendees,
      host: input.host,
      hostAvatar: input.hostAvatar,
      description: input.description,
      tags: input.tags,
      isJoined: true,
    };

    setEvents((prev) => {
      const updated = [newEvent, ...prev];

      const created = updated.filter((e) => e.id.startsWith("user_"));
      AsyncStorage.setItem(CREATED_KEY, JSON.stringify(created));

      const joinedIds = updated.filter((e) => e.isJoined).map((e) => e.id);
      AsyncStorage.setItem(JOINED_KEY, JSON.stringify(joinedIds));

      return updated;
    });
  }, []);

  const joinedCount = events.filter((e) => e.isJoined).length;
  const joinedEvents = events.filter((e) => e.isJoined);

  return (
    <EventsContext.Provider value={{ events, toggleJoin, createEvent, joinedCount, joinedEvents }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}
