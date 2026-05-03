"use client";

import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { Button, Input, Textarea } from "@heroui/react";
import { Id } from "@/convex/_generated/dataModel";

interface EventProps {
  id: Id<"monthEvents">;
  title: string;
  description: string;
  date: number; // Unix timestamp from Convex
}

function Event({ id, title, description, date }: EventProps) {
  const { isAdmin } = useAdmin();
  const [isEventEditable, setIsEventEditable] = useState(false);

  // Convert Unix to YYYY-MM-DD for the input field
  const initialDateString = new Date(date).toISOString().split("T")[0];

  const [updatedEventData, setUpdatedEventData] = useState({
    title,
    description,
    date: initialDateString,
  });

  const handleDelete = async () => {
    if (!window.confirm("Delete this event?")) return;

    await fetch(`/api/delete-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: sessionStorage.getItem("admin_token"),
        id,
      }),
    });
    // Note: No need to manually filter state.
    // The parent's useQuery(api.monthEvents.get) will auto-update.
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/update-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("admin_token"),
        id,
        ...updatedEventData,
      }),
    });

    if (res.ok) setIsEventEditable(false);
  };

  const readJSX = (
    <div className="py-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-slate-600">{description}</p>
      <p className="text-sm text-slate-400">
        {new Date(date).toLocaleDateString()}
      </p>

      {isAdmin && (
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            color="warning"
            onPress={() => setIsEventEditable(true)}
          >
            Edit
          </Button>
          <Button size="sm" color="danger" onPress={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );

  const editJSX = (
    <form onSubmit={handleEdit} className="flex flex-col gap-3 py-4">
      <Input
        label="Title"
        value={updatedEventData.title}
        onChange={(e) =>
          setUpdatedEventData({ ...updatedEventData, title: e.target.value })
        }
      />
      <Input
        type="date"
        label="Date"
        value={updatedEventData.date}
        onChange={(e) =>
          setUpdatedEventData({ ...updatedEventData, date: e.target.value })
        }
      />
      <Textarea
        label="Description"
        value={updatedEventData.description}
        onChange={(e) =>
          setUpdatedEventData({
            ...updatedEventData,
            description: e.target.value,
          })
        }
      />
      <div className="flex gap-2">
        <Button type="submit" color="success">
          Save Changes
        </Button>
        <Button color="default" onPress={() => setIsEventEditable(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <figure className="mx-auto w-full border-b last:border-b-0">
      {isEventEditable ? editJSX : readJSX}
    </figure>
  );
}

export default Event;
