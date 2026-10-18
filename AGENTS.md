# robotik — Counting Mission console

React 19 + TS + Vite 8 + Tailwind v4 + shadcn (Base UI) + Supabase (local Docker stack).
Control console for an elementary robotics math competition: participants, questions, match
control/timer, leaderboard, and a login-free arena public view.

## Commands

- `npm run dev` — Vite dev server (port 5173; no port override in `vite.config.ts`).
- `npx supabase start` — local stack (Docker, project id `robotik`). API `54321`, DB `54322`,
  Studio `54323`. `.env` points at `127.0.0.1:54321`.
- `npx supabase db reset` — drop + re-run migrations + `supabase/seed.sql` (note: there is **no**
  top-level `supabase reset` subcommand in this CLI version).
- Verification: `npx tsc -b` then `npm run lint` (oxlint). Both currently pass: `tsc` is clean and
  lint exits 0 with warnings only (mostly `react/set-state-in-effect` on fetch-on-mount effects) —
  treat those warnings as expected, not a regression signal. No test framework, no ESLint, no
  Prettier; there is no `typecheck` script (`npm run build` = `tsc -b && vite build`).
- `supabase/config.toml` `site_url` / `additional_redirect_urls` are `http://127.0.0.1:5173` to
  match Vite. Any auth redirect change belongs in the config, not in code.

## Data / backend

- Schema changes go in `supabase/migrations/<timestamp>_<name>.sql`; `supabase/seed.sql` is applied
  on every `supabase db reset`.
- `src/types/supabase.ts` is CLI-generated (`npx supabase gen types typescript --local`) — regenerate
  after schema changes, never hand-edit.
- `match_state` is a singleton row `id = 1`; every timer read/write filters `.eq('id', 1)`.
- Timer is derived client-side from `timer_status` (IDLE/RUNNING/PAUSED) + `remaining_ms_at_pause` +
  `timer_started_at`. That derivation and the 37ms interval live in `src/hooks/useMatchState.ts`;
  never re-inline it in a component. Every "go" (IDLE→RUNNING and PAUSED→RUNNING) parks
  `timer_started_at` 3s in the future, so the clock holds the budget while the projector plays the
  3-2-1 intro countdown (`countdownMs` off the same hook, rendered by
  `src/pages/PublicViewPage/StartCountdown.tsx`; the console badge reads `SIAP n`). `remainingFor`
  clamps to `remaining_ms_at_pause` so the readout can never exceed the budget, and the audit row
  is written at the button press — so lap times include the countdown and any pause (wall-clock,
  not the timer's elapsed).
- Realtime: `match_state`, `participants`, `questions`, `audit_logs` are all in the
  `supabase_realtime` publication. Fetch them via `useParticipants` / `useQuestions` /
  `useAuditLogs` / `useTeamLaps` / `useLastFinish` / `useMatchState` in `src/hooks/` instead of
  re-writing a fetch + subscription.
  Subscriptions go through `subscribeToTable(table, cb)` in `src/lib/tableRealtime.ts` — never call
  `supabase.channel('<name>')` from a component: a repeated topic returns the *already subscribed*
  channel and `.on()` then throws `cannot add postgres_changes callbacks ... after subscribe()`.
- There is no match/match_answers table. Audit rows are the match record:
  `Benar` awards +10 and `Lewati` records 0; both insert an `audit_logs` row via `writeAudit()`
  in `src/lib/auditLog.ts`. The award goes through `awardPoints()` in `src/lib/scoring.ts`,
  which calls the `award_participant_points()` SQL function so the increment is atomic —
  never read `total_score` and write it back from the client (that drops a point when two
  awards race). The function is `SECURITY INVOKER`, so it returns `null` when RLS filters the
  update; that is a failure, not a success. Every arena event is
  stamped with `participant_id` + `question_id`, and `created_by` comes from the session.
  The action vocabulary lives in `AUDIT` (`match_started`, `timer_paused`, `timer_resumed`,
  `question_shown`, `question_correct`, `question_skipped`, `match_finished`, `match_reset`,
  `time_budget_changed`) — add new events there, never inline action strings. Deleting a
  participant cascades its audit rows.
- The queue rule on the participants page is **score-based**: a team is queued while
  `total_score === 0` (first correct answer removes it) and `status` is neither `locked` nor
  `done` (a team that already ran must not be offered again). Reset Match restores `active`
  so the team re-enters the queue. Don't switch this back to a pure status filter.
- Match lifecycle writes only happen from the console pages; `PublicViewPage` uses the same
  `useMatchState` hook purely for reading, so never call its action functions from there.
- The console publishes the team in the arena on `match_state.current_participant_id` (written by
  `MatchControlPage` on mount). `PublicViewPage` reads it so the projector keeps showing the last
  team's score until the next Match Start — it is never cleared on finish.
- `PublicViewPage` is a two-screen projector. `LeaderboardView` (the classement) is the resting
  screen — before the first match, between matches, and after every run — and `ArenaView` takes
  over only while `timer_status` is `RUNNING` or `PAUSED`, i.e. the screen changes when the referee
  presses "Mulai Match", not when a point is awarded. A run that ends switches back to the
  classement, which reveals itself rank by rank around the team that just arrived at its new place:
  the banner, the `Selesai` chip and the row highlight come from the newest `match_finished` row
  (`src/hooks/useLastFinish.ts`) and last `REVEAL_MS` (12s), while the staggered entrance is tied to
  the view mounting. Both are siblings of the page and fetch what they need themselves — never give
  either one a console action.
- No-repeat rule: `useMatchState.nextUnansweredQuestion()` filters out any question with a
  `question_correct` audit row **from any team**, plus the question currently on screen, and picks
  randomly from what's left. There is no per-match question quota, so when that pool is empty the
  console advances with `nextActiveQuestion()` (any other active question — a repeat) instead of
  parking the team on one question.
- Both ends of a match hand the arena clock back to a full budget — `resetTimer()`, i.e. IDLE with
  `remaining_ms_at_pause = base_duration_ms` — before leaving: the manual `Selesai` button
  (`MatchHeader`) and the automatic clock-expiry finish (`MatchControlPage`). The projector keeps
  rendering that team after the console navigates away, so a clock left RUNNING would go on
  draining on the wall display, and a clock left PAUSED would start the next team on this team's
  leftovers (or finish it instantly when it expired). Read the elapsed duration *before* the reset.
- Auto-finish (`MatchControlPage`): the only automatic end is the clock, i.e. `remainingMs <= 0`.
  It resets the clock, marks the team `done`, writes `match_finished` with the elapsed duration,
  and navigates to `/participants`. Gated on `timer_status = 'RUNNING'` so it cannot fire on page
  load, and guarded by a ref so it fires once. Finishing when *all questions are answered* was
  removed on purpose — the arena has no question cap, so that must not stop a run.
- Lap record (`src/hooks/useTeamLaps.ts`): one entry per question **attempt** — `question_correct`
  (Benar) and `question_skipped` (Salah) — not just correct answers, so the list is not bounded by
  how many questions exist. Times are microseconds since that team's run start (first
  `match_started`/`timer_resumed` after its last `match_reset`); parsing/formatting lives in
  `src/lib/lapTime.ts` because JS `Date` would truncate Postgres' microsecond precision, and
  `formatLapTime` renders it as `mm:ss.cc` — two fractional digits, the µs fraction truncated.
  Rendered as `Soal N (Benar|Salah)` by both `LapRecord` (console) and `PublicViewPage`.
- Answered-question counters are never capped by the question count: `Soal Terjawab` on the
  projector is the arena team's own correct-lap count, and `MatchTelemetry` shows
  `teamSolved.size`. Don't reintroduce `Math.min(..., totalQuestions)`.
- Every question is worth the same: `CORRECT_POINTS` in `src/lib/scoring.ts` is the only place that
  number is defined. `difficulty_level` never affects scoring — don't add a multiplier.
- `useMatchState` takes `{ participantId }` to stamp audit rows. `/match-control` takes the team
  as `?participant=<uuid>` and is reachable only from the Match Start button / per-row Start
  buttons; it is not in the navbar.
- Auth lives in `src/hooks/useAuthSession.ts` (session + `profiles.role`); `RequireAuth` in
  `src/components/auth/` wraps the whole console layout, `/login` and `/public-view` sit outside it.
- `supabase/seed.sql` seeds two operator accounts on every `db reset`:
  `admin@arena.local` / `arena-admin-2026` (admin, may delete participants) and
  `referee@arena.local` / `arena-referee-2026`. Migration `20261008170000_auto_profile_on_signup.sql`
  inserts a `referee` profile on every new `auth.users` row; admin-only actions are hidden in the UI
  via `isAdmin` rather than relying on RLS errors.
- Seeded users must be inserted with `confirmation_token`/`recovery_token`/`email_change_token_new`
  set to `''`, not NULL — this GoTrue version scans them into `string` and sign-in 500s otherwise.
- RLS: anon can SELECT participants/questions/match_state; every write requires a session whose
  `profiles.role` is `admin` or `referee`. A policy violation returns `42501` on insert/update, but a
  DELETE/UPDATE filtered out by RLS returns **204 with zero rows** — verify the change actually
  happened (refetch) rather than trusting the status code.

## Frontend conventions

- `@/` → `src` (alias declared in both `vite.config.ts` and tsconfig paths).
- UI primitives are **Base UI** (`@base-ui/react`), not Radix — props/refs differ from shadcn's
  Radix docs. Add components with `npx shadcn@latest add ...`; `components.json` style is
  `base-nova`.
- `cn` comes from the `cn` package (`src/lib/utils.ts` just re-exports it). Don't add clsx/
  tailwind-merge.
- Tailwind v4 is CSS-first — there is no `tailwind.config.js`. Design tokens live in the `@theme`
  block of `src/index.css`: use `bg-surface-base`, `bg-surface-raised`, `text-text-muted`,
  `border-border-subtle`, `font-label-mono-stat`, `text-status-success`, `text-status-warning`
  instead of raw hex/zinc values.
- `DESIGN.md` is the design source of truth (obsidian surfaces, 1px hairline borders, depth from
  tone not shadow). Hard rules: `status-warning` only for time-critical timer states (<30s), and no
  red/error states on student-facing UI.
- Structure: `src/pages/<Name>Page/index.tsx` exports the page and composes sibling components in
  the same folder. Pages sit inside the centered `max-w-[1720px]` container from `AppLayout`, which
  already applies `pt-20` for the fixed header — pages add only their own `pt-4`/padding.
- `/match-control` is a fixed-height console for a desktop monitor, not a scrolling page:
  `lg:h-[calc(100vh_-_5rem)]` on the page (exactly the space `AppLayout`'s `pt-20` leaves bare) and
  `lg:grid-rows-[minmax(0,1fr)]` on the grid, with the column wrappers owning `lg:col-span-*` (the
  cards themselves carry no col-span). Left is the timer hero (`ArenaController`, 7 cols) with the
  Benar/Lewati row pinned under it; right (5 cols) stacks the compact telemetry tiles over
  `LapRecord`, whose list is the only thing that scrolls (`flex-1 lg:min-h-0` + `overflow-y-auto`) —
  flipping the wrapper back to a content height makes the list grow the whole page instead. There is
  deliberately **no** `min-h` on the page: a floor taller than the browser viewport (which is always
  shorter than the screen) is what puts a scrollbar back on a laptop, so anything with a fixed size
  must instead shrink — the timer digits are `clamp(3.5rem,min(11vh,7.5vw),8rem)`, i.e. sized off
  the viewport rather than off breakpoints.
- Routes live in `src/App.tsx` (`/login` and `/public-view` outside auth, everything else inside
  `RequireAuth`; `/` redirects to `/participants`).
- UI copy is Indonesian; code identifiers and comments are English.
