"use client";

import { useState, useRef } from "react";
import { addToast } from "@heroui/react";

interface PDFUploadProps {
  studies: { _id: string; title: string }[];
}

function PDFUpload({ studies }: PDFUploadProps) {
  const [form, setForm] = useState({
    title: "",
    studyName: "",
    date: new Date().toISOString().split("T")[0],
    pdf: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.pdf) return;

    // Check if study exists
    const existingStudy = studies.find(
      (s) => s.title.toLowerCase() === form.studyName.toLowerCase(),
    );
    let studyId = existingStudy?._id || "";
    let newStudyName = "";

    // Trigger alert if study is new
    if (!existingStudy) {
      const confirmNew = window.confirm(
        `The study "${form.studyName}" does not exist. Are you sure you want to create a new study?`,
      );
      if (!confirmNew) return;
      newStudyName = form.studyName;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("pdf", form.pdf);
    formData.append("date", form.date);

    if (studyId) formData.append("studyId", studyId);
    if (newStudyName) formData.append("newStudyName", newStudyName);

    try {
      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("admin_token")}`,
        },
      });

      if (res.ok) {
        addToast({
          title: "Success",
          description: newStudyName
            ? "New study created and PDF uploaded!"
            : "PDF uploaded successfully!",
          color: "success",
        });
        setForm({ title: "", studyName: "", pdf: null, date: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (err: any) {
      addToast({ title: "Error", description: err.message, color: "danger" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-sm border"
    >
      <h3 className="font-bold text-lg">Upload Study Material</h3>

      <input
        className="border p-2 rounded-md"
        placeholder="PDF Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <div className="flex flex-col gap-1">
        <input
          className="border p-2 rounded-md"
          placeholder="Study Series Name (New or Existing)"
          value={form.studyName}
          onChange={(e) => setForm({ ...form, studyName: e.target.value })}
          list="study-list"
          required
        />
        <datalist id="study-list">
          {studies.map((s) => (
            <option key={s._id} value={s.title} />
          ))}
        </datalist>
      </div>
      <input
        type="date"
        name="date"
        id="date"
        className="border p-2 rounded-md"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={(e) => setForm({ ...form, pdf: e.target.files?.[0] || null })}
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-100 file:hover:bg-slate-200 cursor-pointer"
        required
      />

      <button
        type="submit"
        disabled={isUploading}
        className="bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
      >
        {isUploading ? "Processing..." : "Upload and Save"}
      </button>
    </form>
  );
}

export default PDFUpload;
