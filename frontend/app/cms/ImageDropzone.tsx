"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

/* A file input that also accepts a dragged-in picture. The dropped file is
   written back into the real <input type="file">, so the form submits it
   exactly as if it had been picked with the file chooser. */

const isImage = (f: File) => f.type.startsWith("image/");

export default function ImageDropzone({
  id, name, accept = "image/*", preview, onFile,
}: {
  id: string;
  name: string;
  accept?: string;
  /* Image to show inside the drop area (an existing upload or a blob: preview). */
  preview?: string | null;
  onFile?: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* A file dropped just outside the box would otherwise make the browser
     navigate to it and throw away the whole unsaved post. */
  useEffect(() => {
    const guard = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) e.preventDefault();
    };
    window.addEventListener("dragover", guard);
    window.addEventListener("drop", guard);
    return () => {
      window.removeEventListener("dragover", guard);
      window.removeEventListener("drop", guard);
    };
  }, []);

  const take = (file: File) => {
    setError(null);
    setFileName(file.name);
    onFile?.(file);
  };

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          if (!e.dataTransfer.types.includes("Files")) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
          setDragging(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = Array.from(e.dataTransfer.files).find(isImage);
          if (!file || !inputRef.current) {
            if (e.dataTransfer.files.length) setError("That file isn't an image. Use a JPG, PNG, GIF or WebP.");
            return;
          }
          const dt = new DataTransfer();
          dt.items.add(file);
          inputRef.current.files = dt.files;
          take(file);
        }}
        className={`mt-3 block cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#a02f52]/40 ${
          dragging ? "border-[#a02f52] bg-[#a02f52]/5" : "border-zinc-300 hover:border-zinc-400"
        }`}
      >
        {preview ? (
          <span className="relative block aspect-video bg-zinc-100">
            {/* blob: previews and API-hosted images are not in next/image's allow-list at build time */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" className="h-full w-full object-cover" />
            <span className={`absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-bold text-white transition-opacity ${dragging ? "opacity-100" : "opacity-0"}`}>
              Drop to replace
            </span>
          </span>
        ) : (
          <span className="flex flex-col items-center gap-1 px-4 py-8 text-center text-sm text-zinc-500">
            <ImagePlus className="h-6 w-6 text-zinc-400" aria-hidden />
            <span className="font-bold text-zinc-700">{dragging ? "Drop the picture here" : "Drag a picture here"}</span>
            <span>or click to choose a file</span>
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) take(f);
          }}
        />
      </label>
      {preview && <p className="mt-1.5 text-xs text-zinc-500">Drag another picture onto it, or click it, to replace it.</p>}
      {!preview && fileName && <p className="mt-1.5 truncate text-xs text-zinc-600">Selected: {fileName}</p>}
      {error && <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}
