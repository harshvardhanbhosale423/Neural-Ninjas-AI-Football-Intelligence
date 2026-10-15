# Free deployment on Render

This project is configured as a Docker web service on Render's `free` compute plan. It serves the dashboard and optional server-side Foundry integration. The app listens on Render's `PORT`, binds to the container interface in production, runs as the unprivileged Node user, and has an HTTP health check at `/api/status`. `.env` and credentials are not copied into the image.

## Free plan trade-offs

Render currently offers free web services, but spins a service down after 15 minutes without traffic. A first visit after idle can take about a minute to wake. Free services also have monthly included limits; if a payment method is attached, usage beyond some included bandwidth or build limits can incur charges. Without a payment method, services may be suspended instead. Review the provider's current limits before you deploy. [Render free plan details](https://render.com/docs/free)

## Deploy

1. Put this project in a Git repository. Render Blueprints use a `render.yaml` file from a connected Git repository. If the repository is public, its source code will be visible to everyone; a private repository can be connected after you sign in and grant Render access to it.
2. In Render, create a new Blueprint and connect the repository containing this project.
3. Review the proposed `neural-ninjas-hackathon` web service. Confirm the plan is **Free**, the health check is `/api/status`, and the service's assigned `onrender.com` URL will be public.
4. Apply the Blueprint and wait for the Docker build and health check to pass.
5. Open the assigned HTTPS URL and verify match switching, English/Marathi, Fan/Analyst modes, filters, local Q&A and report download.

`render.yaml` is configured for the Free plan. The public service is intentionally not created from this workspace: it requires connecting a repository and confirming the public URL in your Render account.

## Optional Microsoft Foundry

Foundry is disabled unless credentials are added to the service. If you configure it later, add `FOUNDRY_ENDPOINT`, `FOUNDRY_MODEL` and `FOUNDRY_API_KEY` as Render environment variables/secrets in the service settings. Never put the key in source code, a repository, Docker image, or browser code. Until a real question returns successfully from the configured model, describe the app as a prototype with local evidence-based fallback rather than claiming a verified live AI integration.
