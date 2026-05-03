"use client";

import Event from "@/components/Event";
import { api } from "@/convex/_generated/api";
import { useAdmin } from "@/hooks/useAdmin";
import { useQuery } from "convex/react";
import AddEventForm from "@/components/AddEventForm";

export default function Page() {
  const events = useQuery(api.monthEvents.get);
  const { isAdmin } = useAdmin();
  return (
    <div className="px-6">
      <h1 className="sub-header">Upcoming Events:</h1>
      {!events ? (
        <p>Loading Events</p>
      ) : events.length === 0 ? (
        <>No events at this time</>
      ) : (
        events.map(({ _id, title, description, date }) => (
          <Event
            key={_id}
            id={_id}
            title={title}
            description={description}
            date={date}
          />
        ))
      )}
      {isAdmin && <AddEventForm />}
    </div>
  );
}
