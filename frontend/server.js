/* Entry point for Plesk's Node.js extension (Phusion Passenger), which starts
   an app by running a file rather than an npm script. It runs the normal
   `next start` server programmatically (docs: guides/custom-server), so no
   Next.js behaviour changes. Run `npm run build` first. Vercel ignores this
   file; locally use `npm run dev` / `npm run start` as usual.

   Passenger supplies the listening address by intercepting listen(), so the
   port below only matters when the file is run by hand. */
/* eslint-disable @typescript-eslint/no-require-imports -- plain CommonJS entry, not bundled */
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`> People First listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
