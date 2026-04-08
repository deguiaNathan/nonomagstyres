
# Redesign landing page

This is a code bundle for the Nono Mags redesign landing page. The original project is available at https://www.figma.com/design/lfHEG2vfYR67WZW8UKY0sP/Redesign-landing-page.

## Running the code

Run `npm install` to install the dependencies.

Run `npm run dev` to start the development server.

## Deploying to Vercel

The repo is configured for a Vite SPA deployment on Vercel:

- Build command: `npm run build`
- Output directory: `dist`
- SPA deep links: handled by [`vercel.json`](./vercel.json) rewriting requests to `/index.html`

No project-specific environment variables are required for the current app build.
  
