"use client";

import { useEditor, EditorContent, type Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useRef, useState } from "react";
import {
  Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Quote, Link2,
  Image as ImageIcon, Undo2, Redo2, Minus, Unlink,
} from "lucide-react";

/* The rich text field. The saved value is plain HTML in a hidden input named
   `content`; the server sanitises it again, so this only has to be convenient. */

const btn =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-md px-2 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40";

function ToolButton({
  label, active, disabled, onClick, children,
}: {
  label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`${btn} ${active ? "bg-[#a02f52]/10 text-[#a02f52]" : ""}`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  initialHtml, onChange,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
}) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true } }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
    ],
    content: initialHtml,
    /* Required with SSR: render only on the client to avoid a hydration mismatch. */
    immediatelyRender: false,
    editorProps: {
      attributes: {
        "aria-label": "Post body",
        class: "pf-prose min-h-[22rem] px-4 py-4 outline-none sm:px-6",
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
  });

  if (!editor) {
    return <div className="min-h-[26rem] rounded-xl border border-zinc-300 bg-white" aria-busy />;
  }

  const openLink = () => {
    setLinkUrl((editor.getAttributes("link").href as string | undefined) ?? "");
    setLinkOpen(true);
  };
  const applyLink = () => {
    const url = linkUrl.trim();
    if (!url) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else {
      const href = /^(https?:|mailto:|tel:|\/)/i.test(url) ? url : `https://${url}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkOpen(false);
  };

  const upload = async (file: File) => {
    setUploadError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/cms/upload", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { url?: string; detail?: string };
      if (!res.ok || !data.url) throw new Error(data.detail ?? "Upload failed.");
      const alt = window.prompt("Describe this image for people who can't see it (alt text):", "") ?? "";
      editor.chain().focus().setImage({ src: data.url, alt }).run();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const c = (fn: (chain: ReturnType<TiptapEditor["chain"]>) => ReturnType<TiptapEditor["chain"]>) => () =>
    fn(editor.chain().focus()).run();

  return (
    <div className="overflow-clip rounded-xl border border-zinc-300 bg-white focus-within:border-[#a02f52] focus-within:ring-2 focus-within:ring-[#a02f52]/25">
      <div role="toolbar" aria-label="Formatting" className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 border-b border-zinc-200 bg-zinc-50/95 px-2 py-1 backdrop-blur">
        <ToolButton label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={c((x) => x.toggleHeading({ level: 2 }))}><Heading2 className="h-5 w-5" /></ToolButton>
        <ToolButton label="Sub-heading" active={editor.isActive("heading", { level: 3 })} onClick={c((x) => x.toggleHeading({ level: 3 }))}><Heading3 className="h-5 w-5" /></ToolButton>
        <span className="mx-1 h-6 w-px bg-zinc-300" aria-hidden />
        <ToolButton label="Bold" active={editor.isActive("bold")} onClick={c((x) => x.toggleBold())}><Bold className="h-5 w-5" /></ToolButton>
        <ToolButton label="Italic" active={editor.isActive("italic")} onClick={c((x) => x.toggleItalic())}><Italic className="h-5 w-5" /></ToolButton>
        <ToolButton label="Underline" active={editor.isActive("underline")} onClick={c((x) => x.toggleUnderline())}><Underline className="h-5 w-5" /></ToolButton>
        <span className="mx-1 h-6 w-px bg-zinc-300" aria-hidden />
        <ToolButton label="Bulleted list" active={editor.isActive("bulletList")} onClick={c((x) => x.toggleBulletList())}><List className="h-5 w-5" /></ToolButton>
        <ToolButton label="Numbered list" active={editor.isActive("orderedList")} onClick={c((x) => x.toggleOrderedList())}><ListOrdered className="h-5 w-5" /></ToolButton>
        <ToolButton label="Quote" active={editor.isActive("blockquote")} onClick={c((x) => x.toggleBlockquote())}><Quote className="h-5 w-5" /></ToolButton>
        <ToolButton label="Divider line" onClick={c((x) => x.setHorizontalRule())}><Minus className="h-5 w-5" /></ToolButton>
        <span className="mx-1 h-6 w-px bg-zinc-300" aria-hidden />
        <ToolButton label="Add link" active={editor.isActive("link")} onClick={openLink}><Link2 className="h-5 w-5" /></ToolButton>
        {editor.isActive("link") && (
          <ToolButton label="Remove link" onClick={c((x) => x.extendMarkRange("link").unsetLink())}><Unlink className="h-5 w-5" /></ToolButton>
        )}
        <ToolButton label={uploading ? "Uploading image…" : "Insert image"} disabled={uploading} onClick={() => fileRef.current?.click()}><ImageIcon className="h-5 w-5" /></ToolButton>
        <span className="mx-1 h-6 w-px bg-zinc-300" aria-hidden />
        <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={c((x) => x.undo())}><Undo2 className="h-5 w-5" /></ToolButton>
        <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={c((x) => x.redo())}><Redo2 className="h-5 w-5" /></ToolButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) void upload(f);
          }}
        />
      </div>

      {linkOpen && (
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-white px-3 py-2">
          <label htmlFor="cms-link-url" className="text-sm font-bold text-zinc-700">Link address</label>
          <input
            id="cms-link-url"
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); applyLink(); }
              if (e.key === "Escape") setLinkOpen(false);
            }}
            placeholder="https://example.com"
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 text-base outline-none focus:border-[#a02f52]"
          />
          <button type="button" onClick={applyLink} className="min-h-11 rounded-lg bg-[#a02f52] px-4 text-sm font-bold text-white">Apply</button>
          <button type="button" onClick={() => setLinkOpen(false)} className="min-h-11 rounded-lg px-3 text-sm font-bold text-zinc-600">Cancel</button>
        </div>
      )}
      {uploadError && <p role="alert" className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{uploadError}</p>}

      <EditorContent editor={editor} />
    </div>
  );
}
