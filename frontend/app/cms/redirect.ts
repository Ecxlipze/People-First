/* A redirect whose Location is a bare path. NextResponse.redirect needs an
   absolute URL, and building one from request.url uses whatever origin the Node
   process saw — behind a reverse proxy that is the internal
   https://localhost:3000, which sent signed-in editors there. A relative
   Location lets the browser resolve it against the address it actually used. */
export function redirectTo(path: string): Response {
  return new Response(null, { status: 307, headers: { Location: path } });
}
