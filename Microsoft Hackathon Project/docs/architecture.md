# Architecture and data notes

## Runtime flow

```text
index.html → app.js sample match records → selected-match calculations
                                      ↘ local recap / insights / Q&A
                                       ↘ timeline, comparison and player views
                                       ↘ downloadable Markdown report
```

`server.mjs` uses Node's built-in HTTP, filesystem and fetch modules; it needs no packages. It serves the browser app on loopback and keeps any optional Foundry key server-side. The browser holds the sample records and derives event totals when the selected match changes.

Language and audience mode are stored in browser `localStorage` as simple preferences. English and Marathi are hand-written UI/narrative variants; this is not automatic translation and other languages are not included yet. Fan mode defaults to a short recap, Analyst mode to a detailed recap. Readers can override recap length. Selecting a player focuses the detail panel on that player's recorded events.

## Record shape

Each match has an id and label, home/away team, synthetic final score, date label, aggregate possession percentages, attempted/completed passes, corners, fouls, card totals, and event records. Each event has an id, minute, team, player, type and detail. Team aggregates are keyed by home/away array position in the sample object.

## Calculations

- Goals: count `goal` events per team; the provided synthetic score is cross-checked against the event list during development.
- Shots: count `shot` events per team.
- Shots on target: count shot events whose outcome says “On target”.
- Pass completion: completed passes ÷ attempts × 100, rounded to an integer.
- Player indicator: goals × 5 + on-target shots × 2 + shots × 0.5 + corners × 1.
- First-half events are minutes 1–45; second-half events are minutes 46–90+.

Possession, attempts/completions, corners/fouls/cards are illustrative aggregate sample fields. They are not calculated from the listed sparse events. All values are fictional.

## Intelligence and failure handling

The recap and local Q&A fallback are deterministic functions in English and Marathi. Q&A routes common supported topics to responses and returns an evidence-oriented fallback for unsupported wording. If a compatible Foundry endpoint, deployed model and key are supplied through local `.env`, the server may also forward the selected synthetic match and question to Foundry's OpenAI-compatible chat-completions API. The browser always keeps the local evidence response; a model answer appears separately when the server returns one. Filtered event lists can be empty and show an empty state. Search text is escaped before HTML display. Markdown export is generated client-side for the currently selected match.

## Known gaps

This first build does not accept CSV uploads, validate user-provided datasets, generate PDF, or deploy to a public host. Foundry is not configured or live-tested in this workspace. The sample log is intentionally a compact demo record, not a full event stream. It cannot make tracking-based tactical claims or explain causation. Although language and audience preferences persist in the same browser, it does not save favorite clubs or players.
