import { useState } from "react";
import { addToast, Button, Form, Input, Textarea } from "@heroui/react";

interface PastorMessage {
  id: string;
  author: string;
  message: string;
  coramDeo: string;
}

function PastorsHeartEditor({ message, author, coramDeo, id }: PastorMessage) {
  const [formData, setFormData] = useState({
    message: message,
    author: author,
    coramDeo: coramDeo,
    id: id,
  });
  const variant = "bordered";
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = sessionStorage.getItem("admin_token");

    const res = await fetch("/api/pastorMessage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        ...formData,
      }),
    });

    if (res.ok) {
      addToast({
        title: "Success",
        description: "Updated via API",
        color: "success",
      });
    } else {
      const data = await res.json();
      addToast({ title: "Error", description: data.error, color: "danger" });
    }
  };
  return (
    <>
      <h2 className="sub-header">Edit Pastor's Heart</h2>
      <Form onSubmit={handleSubmit}>
        <Textarea
          label="Message"
          variant={variant}
          name="message"
          id="message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
        <Input
          label="Author"
          variant={variant}
          type="text"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
        <Textarea
          label="Coram Deo"
          variant={variant}
          name="coramDeo"
          id="coramDeo"
          value={formData.coramDeo}
          onChange={(e) =>
            setFormData({ ...formData, coramDeo: e.target.value })
          }
        />
        <Button type="submit" className="general-text button">
          Edit
        </Button>
      </Form>
    </>
  );
}

export default PastorsHeartEditor;
