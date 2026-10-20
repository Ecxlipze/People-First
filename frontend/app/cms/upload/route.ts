import { NextResponse } from "next/server";
import { ApiError } from "@/app/lib/api";
import { cmsFetch, hasSession } from "@/app/cms/session";

/* Inline-image upload for the editor: forwards to the staff-only API endpoint. */
export async function POST(request: Request) {
  if (!(await hasSession())) return NextResponse.json({ detail: "Not signed in." }, { status: 401 });

  const incoming = await request.formData();
  const file = incoming.get("file");
  if (!(file instanceof File)) return NextResponse.json({ detail: "No file was sent." }, { status: 400 });

  const formData = new FormData();
  formData.set("file", file);
  try {
    const data = await cmsFetch<{ url: string }>(
      "/api/blog-uploads/",
      { method: "POST", formData },
      "action",
    );
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      const detail =
        error.payload && typeof error.payload === "object" && "detail" in error.payload
          ? String((error.payload as { detail: unknown }).detail)
          : "Upload failed.";
      return NextResponse.json({ detail }, { status: error.status === 400 ? 400 : 502 });
    }
    return NextResponse.json({ detail: "Upload failed." }, { status: 502 });
  }
}
