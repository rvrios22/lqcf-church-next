"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatDate } from "@/lib/formatDate";
import { addToast } from "@heroui/react";

interface PDFModalProps {
  studies: { _id: string; title: string }[];
  defaultStudyId: string;
  isAdmin: boolean;
}
function PDFModal({ studies, defaultStudyId, isAdmin }: PDFModalProps) {
  // 1. Initialize with the prop directly
  const [selectedStudyId, setSelectedStudyId] =
    useState<string>(defaultStudyId);

  // 2. Add a safeguard: If the ID in state isn't in our 'studies' list,
  // it's likely a cached/wrong ID. Skip the query.
  const isActuallyAStudy = studies?.some((s) => s._id === selectedStudyId);

  const pdfs = useQuery(
    api.pdfs.getByStudy,
    isActuallyAStudy ? { studyId: selectedStudyId as Id<"studies"> } : "skip",
  );

  // 3. Keep state in sync with the environment variable
  useEffect(() => {
    if (defaultStudyId) {
      setSelectedStudyId(defaultStudyId);
    }
  }, [defaultStudyId]);

  const handleDelete = async (pdfId: string, storageId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this PDF? This cannot be undone.",
    );
    if (!confirmDelete) return;

    const token = sessionStorage.getItem("admin_token");

    try {
      const res = await fetch("/api/delete-pdf", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, id: pdfId, storageId }),
      });

      if (res.ok) {
        // Because useQuery is reactive, the list will update automatically!
        addToast({
          title: "Deleted",
          description: "PDF has been deleted",
          color: "success",
        });
      } else {
        const data = await res.json();
        addToast({
          title: "Something went wrong",
          color: "danger",
        });
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="mx-auto my-4 h-[60vh] w-[90%] overflow-y-auto rounded-xl border bg-white shadow-md lg:w-4/5">
      <div className="sticky top-0 flex flex-col justify-between items-center border-b bg-white px-6 py-4 md:flex-row">
        <h2 className="font-bold hidden md:block">Title</h2>
        <div>
          <h2 className="text-center font-bold text-slate-800">
            Study Materials
          </h2>
          <select
            className="cursor-pointer rounded-lg border p-2 bg-slate-50 text-sm"
            value={selectedStudyId}
            onChange={(e) => setSelectedStudyId(e.target.value)}
          >
            {studies.map(({ _id, title }) => (
              // Use _id as the value, title as the label
              <option key={_id} value={_id}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <h2 className="font-bold hidden md:block">Date</h2>
      </div>

      <div className="flex flex-col">
        {!pdfs ? (
          <p className="p-10 text-center text-slate-400">Loading PDFs...</p>
        ) : pdfs.length === 0 ? (
          <p className="p-10 text-center text-slate-400">
            No PDFs found for this study.
          </p>
        ) : (
          pdfs.map((pdf) => (
            <div
              key={pdf._id}
              className="flex justify-between items-center px-6 py-4 border-b hover:bg-slate-50"
            >
              <a
                href={pdf.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow flex flex-col md:flex-row items-center justify-between"
              >
                <span className="text-blue-600 font-medium">{pdf.title}</span>
                <span className="text-xs text-slate-400">
                  {formatDate(pdf.date)}
                </span>
              </a>

              {isAdmin && (
                <button
                  onClick={() => handleDelete(pdf._id, pdf.storageId)}
                  className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete PDF"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PDFModal;
