"use client";

import { useState } from "react";
import { Button, Input, Textarea, addToast } from "@heroui/react";

function AddEventForm() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/add-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          token: sessionStorage.getItem("admin_token"),
        }),
      });

      if (res.ok) {
        addToast({
          title: "Success",
          description: "Event added!",
          color: "success",
        });
        setFormData({ title: "", date: "", description: "" });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
    } catch (err: any) {
      addToast({ title: "Error", description: err.message, color: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto my-8 w-[90%] lg:w-4/5 p-6 bg-white rounded-xl border shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Add New Event</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Event Title"
          placeholder="e.g. Wednesday Night Bible Study"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <Input
          type="date"
          label="Date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <Textarea
          label="Description"
          placeholder="Enter event details..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
        <Button
          type="submit"
          color="success"
          className="font-bold text-white"
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Create Event"}
        </Button>
      </form>
    </section>
  );
}

export default AddEventForm;
