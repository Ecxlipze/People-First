/* Route-change transition.

   Next.js gives `template.tsx` a fresh key on every navigation, so unlike
   `layout.tsx` this element remounts whenever the route changes — which
   restarts the CSS animation. That makes it the cheapest possible page
   transition: no client JS, no animation library.

   `display: contents` is deliberate and load-bearing. The wrapper must NOT
   generate a box of its own, because:

     - The SideNav rail is `position: fixed`. Any ancestor with a transform,
       translate, filter or perspective becomes its containing block, which makes
       the rail resolve against that ancestor instead of the viewport — it then
       scrolls with the page and looks stuck mid-document. `display: contents`
       removes this element from layout entirely, so it can never do that.
       (See the fixed-position containing block trap; a `translate` in the
       page-enter keyframes caused exactly this.)
     - Pages are direct children of the `flex flex-col` <body>. With
       `display: contents` they keep that relationship, so no page's layout
       changes at all.

   Because the wrapper has no box, the animation is applied to the *children*
   via `.pf-page-enter > *` rather than to the wrapper itself.

   Kept as a Server Component (no "use client"): it must not add JS to a site
   whose pages are otherwise fully static. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="pf-page-enter contents">{children}</div>;
}
