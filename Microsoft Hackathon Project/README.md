# Neural Ninjas — AI Football Intelligence

**Understand the game beyond the score.** Neural Ninjas is a small, local-first football intelligence prototype. It turns fictional match event logs into match recaps, event-based observations, player summaries and data-backed answers.

> Every match, player and aggregate in this demo is synthetic. This independent prototype is not affiliated with or endorsed by Microsoft or the Premier League. It has no official match feed, external AI connection, or player-tracking data.

## Run it

There are no packages to install. The optional AI connection uses Microsoft Foundry’s OpenAI-compatible v1 chat-completions API; Node.js 20+ serves the app and keeps its key on the server. Without Foundry settings, the app runs with its local evidence-based fallback.

```powershell
cd "C:\Users\Work\OneDrive\Desktop\Microsoft Hackathon Project"
node server.mjs
```

Then visit [http://localhost:8000](http://localhost:8000). Stop the server with **Ctrl+C**. It binds to `127.0.0.1` and serves only this project folder. For local-only mode, you can also open `index.html` directly; the Foundry API feature requires `node server.mjs`.

For the free Render deployment configuration and release steps, see [`DEPLOYMENT.md`](DEPLOYMENT.md). The container config is ready, but no cloud service or public endpoint has been provisioned yet.

To enable optional Foundry Q&A, copy `.env.example` to `.env` and fill in your own compatible Foundry endpoint, deployed model name and API key. Keep `.env` private; it is excluded from Git. When enabled, asking a match question sends only the selected synthetic match record and question to that configured model. The app keeps its local evidence answer visible alongside the model response. This connection has not been configured or verified in this workspace.

## Problem and solution

Match events and statistics can be difficult to interpret without specialist tools. Neural Ninjas demonstrates how a compact event record can become an accessible match story, with evidence and limits shown alongside each interpretation. It is intended for learners, fans, students and coaches exploring a sample—not for scouting decisions or live match operations.

## What works in this prototype

- Three match scenarios, each with its own fictional event log and synthetic aggregate values.
- English / Marathi interface, local narrative output and Fan / Analyst modes. Fan mode defaults to a short recap; Analyst mode defaults to a detailed recap.
- Match switching updates score, summary, comparisons, insights, timeline, player table, Q&A and report.
- Event timeline filters for team, event type and half; event explorer supports search.
- Deterministic, local match recap with quick, standard and detailed levels.
- Rule-based tactical observations that show evidence and caveats.
- Player event summaries and a transparent prototype indicator: goals × 5 + on-target shots × 2 + shots × 0.5 + corners × 1.
- Match Q&A handles common supported topics and returns match-specific evidence; unsupported questions say what the data can answer.
- Downloadable Markdown report containing the currently selected match.
- Responsive layout and no required runtime dependencies.

## Architecture and data

`index.html` provides the page structure, `styles.css` contains the responsive design, `app.js` contains sample records, calculations, local narrative rules, filtering and report export, and `server.mjs` serves the app plus the optional server-side Foundry call. It uses Node's built-in modules; there is no package dependency or database.

Each match contains two fictional teams, the final score, aggregate possession / pass totals / corners / fouls / cards, and timestamped events. Shot totals and shots on target are counted from shot events and outcomes. Goals are counted from goal events. Pass completion is completed passes divided by attempted passes. Possession and pass aggregates are explicitly illustrative synthetic inputs, not inferred from the sparse event log. Sample event goal counts agree with each displayed final score.

## Synthetic match scenarios

| Sample | Score | Scenario |
|---|---:|---|
| Harbor City vs Pinebridge | 2–1 | Close match with a late winner |
| Redmont Athletic vs Westhaven | 3–0 | Home attacking performance |
| Stoneford Town vs Lakeside | 1–1 | High shot volume, limited conversion |

## AI approach and limitations

The local recap and Q&A fallback use transparent rules and selected-match data. If a compatible Microsoft Foundry endpoint and key are configured in the local server, match Q&A can also call a chat model. The key is never sent to the browser. A live Foundry call has not been configured or verified yet; do not claim it worked until you test it with your own resource. Q&A is grounded by a prompt and leaves the local evidence answer visible, but model output can still be wrong and must be checked. Insights report event patterns, not tactical tracking. The data cannot support expected goals, shot quality, formations, pressing structures, player positions, comprehensive player ratings, verified real-world claims or causal explanations. The sample indicator weights are illustrative and omit defensive contributions, role and minutes played.

CSV upload, PDF export, live data and persistent event storage are not implemented in this version. The report exports as Markdown instead. Container deployment files are included, but the app has not been deployed to a public host.

## Hackathon readiness — gaps to close

I checked the official rules published in the Microsoft-owned hackathon repository on 15 October 2026. The current prototype is a functional demo, but it is **not yet submission-ready against the rules**:

- The rules call for an AI-powered solution and ask the pitch to identify Microsoft / Azure technologies. This version includes an optional Microsoft Foundry Models v1 chat-completions code path, but no resource credentials are configured and it has not been tested. Configure and demonstrate a real call before claiming Azure integration or technical-baseline readiness.
- The rules ask for personalized experiences and multi-language storytelling. This version provides English/Marathi, Fan/Analyst summary levels and selectable player details; it does not personalize by saved favorite club/player or translate into every language.
- Submission also requires a public GitHub repository, a functioning judge-accessible project, a public video URL and a demo video under two minutes. These have not been published.

The app can be viewed in Marathi, but the pitch, project description, testing instructions and other submission materials in this repository are in English. Keep the submitted video in English or provide an English translation as the rules require. Re-read the [official rules](https://github.com/microsoft/insidethegamehackathon/blob/main/OFFICIAL%20RULES.md) before submitting; organizers may amend them.

## Verify the app

From this folder, check JavaScript syntax:

```powershell
node --check app.js
```

Then open `index.html`, switch through all three matches, change summary length, filter the event timeline, select a player, ask a match question and export a report. The report filename should change with the selected match. Browser developer tools can show any unexpected client-side errors.

## Hackathon alignment (implemented evidence)

- **Technological implementation:** no-package app; selected-match statistics and exports use the same data record; calculations and local behavior can be inspected in `app.js`. The optional Foundry path is implemented in `server.mjs`, but still needs credentials and a successful live test.
- **Agentic design and innovation:** explainable, event-grounded observation and Q&A helpers; no autonomous-agent or general LLM claim.
- **Real-world impact:** accessible sample explanations for casual users and learners; synthetic prototype is not a decision-grade product.
- **User experience:** responsive dashboard, filters, selectable match and player, English/Marathi text, Fan/Analyst recap modes and export.
- **Category adherence:** synthetic event intelligence, evidence-linked explanations and generated match narratives.

## Submission materials

See [`docs/project_pitch.md`](docs/project_pitch.md), [`docs/demo_script.md`](docs/demo_script.md), [`docs/architecture.md`](docs/architecture.md) and [`docs/submission_checklist.md`](docs/submission_checklist.md). Repository, hosted demo and video URLs have intentionally not been invented.

Before submitting, check the current [official hackathon rules](https://aka.ms/insidethegame/rules). Eligibility, deadlines, required assets and accepted demo access are controlled by the organizers and must be confirmed there. A public repository or video should only be described as public after it is actually published and accessible.
