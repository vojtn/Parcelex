# Change log

Working notes between the user and the assistant. The documentation files describe the **current
state only** — history, decisions that were reversed, and version bumps live here.

Newest entries first. One entry per working session, a few lines, no marketing.

---

## 2026-11-26 — EOxCloudless assessed and rejected

The user found a satellite source in another app's Leaflet attribution and asked whether we could use
it. Measured against its own GetCapabilities rather than assumed.

- **Rejected on resolution first:** it is a Sentinel-2 mosaic, **10 m per pixel**, served to z18 where
  0.6 m is wanted — so the imagery is blurrier than our own 3–10 m GPS line. It cannot show a parcel
  edge, which is imagery's only job here.
- **Rejected on licence second:** the attribution string circulating in apps says *CC BY 4.0*, but the
  service declares **CC BY-NC-SA 4.0** for every vintage from 2017 on — **NC** bars commercial use and
  EOX sells a separate licence. Only the 2016/2017 layers are plain CC BY, and those are the oldest
  imagery. Copying that attribution would be a licence violation, not a citation.
- **Side effect that changed a rule:** the ČÚZK half of the same string led to
  `WMTS_ORTOFOTO/WMTService.aspx`, which answers **HTTP 200 with a 5 925-byte PNG** to *any* request,
  including GetCapabilities. A status code proves nothing. F17 now requires the probe to check
  `Content-Type`, not the response code — a second provider confirming the Mapy.com behaviour that
  motivated it.
- Analysis §4.4 and §7 References updated. No change to the chosen basemaps.

## 2026-11-26 — readiness review: four MVP gaps closed

The user asked whether the specification was ready. A gap scan (searching for what is *absent*, not
for what is wrong) found seven things a build would trip over. The user chose to close the four that
block MVP and leave the rest for implementation.

- **F39 location permission** — the word "permission" appeared nowhere in the spec. Now: fine +
  coarse declared, `gps` hardware feature required, asked at *start recording* rather than install,
  rationale screen first, and **coarse-only treated as denied** because its error is in kilometres and
  every fix would fail the F4 threshold — so the app says so and links to system settings instead of
  starting a session that can only produce garbage.
- **F40 hardware back button** — zero mentions, and on Android it is the primary navigation. Now
  specified per screen; Recording gets *Finish / Keep recording* rather than leaving mid-walk. Back
  never saves and never deletes.
- **F41 no-fix and stale-fix state** — `watchPosition` had a 30 s timeout but no rule for the time
  before the first fix. Capture controls are disabled with the reason visible; a fix older than 10 s
  marks the strip stale, because a stale fix on a map looks exactly like a live one.
- **F10b `close_polygon`** — the setting was listed with no default and no rule, despite changing the
  exported bytes. Default on, polygon only, never touches stored geometry. The manual's own S-JTSK
  example is *unclosed*, so both forms are accepted by iLPIS and the switch stays until open item 2
  settles which is preferred.
- **F21 moved P1 → P2** (user's decision): `manual` capture never adds straight-side noise, so
  simplification belongs with M6, not with MVP.
- ui-text.md gained 13 keys (permission rationale/denied/coarse, back-button dialogs, `rec.stale`),
  including a Czech plural block for the "you have N points so far" prompt.
- Left open deliberately, to be settled during implementation: schema-migration strategy
  (`PRAGMA user_version`), `minSdk`/`targetSdk`/signing, and tracing R1–R6/R8/R10 to rules. §F
  "Definition of done" is still document hygiene rather than product acceptance.

## 2026-11-26 — entities described in text; every column justified

- C.1 gained a plain-text table describing the four entities and what each one *is*, instead of
  leaving the diagram to speak for itself.
- **New §E.2 table "Why each column is stored rather than computed"**, answering `meta_json`,
  `perimeter_m` and the rest one by one, and holding each column to the standard of having a named
  consumer.
- **Two columns removed for having no consumer:** `boundary.track_count` (nobody displays a count of
  evidence) and `track_point.bearing` (unreliable at walking speed per analysis §4.2 and unused by
  `corner_detect`, which reads the rotation vector — stored but never read).
- Two columns gained the rule that justifies them: `track_point.speed_mps` now has an F4 rule (a fix
  above 8 m/s is kept as evidence but never proposed as a vertex — the phone-left-in-the-car case),
  and `avg_accuracy_m` now has an F8 rule (quality badge in overview and detail, with the threshold
  it was recorded under read from `meta_json`).
- `meta_json` distinguished from the caches: `area_m2`/`perimeter_m`/`vertex_count` are caches that
  can be recomputed, `meta_json` is a **snapshot** that cannot, because settings are editable and
  shared.
- The classDiagram and the DDL were checked column by column for all four tables and now agree
  (`bearing` had survived in the diagram after leaving the DDL).
- **Encoding incident:** an edit wrote `Ø. pøesnost` instead of `Ř…` — a CP1250/Latin-1 mangling of
  the Czech letter. Found by scanning all docs for characters that can only be artefacts, fixed to
  the more natural `Prům. přesnost`, and verified by code point (`ů` U+016F, `ř` U+0159).

## 2026-11-26 — domain model split into ours vs registry context

The user asked why the domain model shows PB/DPB/ZP/EVP at all, since the app only has boundary,
vertex, track point and settings. Correct — the diagram implied they were part of our model.

- **C.1 is now "Our model": four concepts only** (boundary, vertex, track point, settings).
- **C.2 is now "Registry context — deliberately not in the model"**, with the PB/DPB/ZP/EVP diagram
  kept but explicitly labelled as context we do not store, and the three things we actually take from
  it (free-text DPB code, free-text label, geometry kind). Kept rather than deleted because
  `dpb_code` points into that world, and because it becomes real if the public LPIS export is ever
  loaded as an underlay.
- **C.3 glossary now defines vertex vs track point properly**: vertex = confirmed, the product, what
  is exported and what area is computed from; track point = unconfirmed evidence, drawn as the walked
  line, used to recover missed corners and re-run the capture method, **never exported**. Settings
  defined as preferences read at recording start and stamped into `meta_json`.
- README's model table went from three levels to four to match.
- **Fixed a contradiction I had introduced:** `averaging_s` was a settings key and an E.4 default
  while F14 explicitly said no such setting exists. Resolved by removing the setting — holding the
  average button collects for as long as it is held, so the hold is the control; a hold under 5 s or
  3 samples degrades to a plain point instead of storing one noisy fix labelled as an average.

## 2026-11-26 — analysis/spec consistency audit

Audited every F, R and M ID in both directions rather than assuming the two documents agreed. Real
gaps found and closed:

- **F9, F8, F32 had no rule in the spec at all** — the spec's own definition of done says every
  behaviour traces to an F ID, so these were unimplemented by design. Added rules for basemap
  choice (F9), the overview list and its filters (F8), and an explicit "not designed yet" for the
  machine formats (F32, no real sample file to work from).
- **F9d added** as a story: switching basemaps and surviving the zoom mismatch (aerial ends at z20,
  cadastral runs to z25). The spec already had the overzoom rule under R9 with no requirement
  covering it.
- **F36 (elevation) and F18 (open in Mapy.com) were referenced by the spec but missing from the
  analysis story list** — F36 had been dropped in an earlier rewrite without noticing. Both
  restored; F18 now appears once, as P3, instead of in both the story list and the dropped table.
- **Analysis §3 was not normative anywhere.** Performance (500 boundaries), glove-friendly targets
  and offline behaviour were stated as wishes with no rule. New spec §B.6 "Cross-cutting".
- **Stale milestone reference:** the spec said attribution is verified in M6; after the M-numbering
  change that is M4.
- ui-text.md gained the basemap/overlay names and the overview filter/continue labels the new rules
  imply.

Remaining asymmetry is deliberate: `F38a–F38d` are sub-rules of one story, so they exist only in the
spec.

## 2026-11-26 — typo fix and localisation

- **Corrected the Czech term: `zákes` → `zákres`** (my typo in the previous round, 10 places). It is
  the same word iLPIS uses, which is exactly why it is the right UI label.
- **Localisation is now an MVP requirement (F38)** instead of "the UI is Czech". Czech primary,
  English shipped from the start, device locale as the default with a settings override.
- New [ui-text.md](./ui-text.md): the normative Czech wording of every screen with English
  alongside, keyed (`rec.addPoint`, `overview.new`, …). Wording is decided there; the JSON files are
  the mechanism.
- Library: **i18next + react-i18next**. Lingui and FormatJS were considered and declined — both add
  an extraction/compile step for no gain at this size.
- New analysis §4.9 records the finding that actually justifies a library: Czech CLDR plurals are
  `one` / `few` / `many` / `other` where **`many` is decimals only and 5+ is `other`** (verified with
  `Intl.PluralRules('cs')`). Writing "5+ bodů" under `many`, which is what Czech school grammar
  suggests, renders "5 bodu".
- Rule F38c: display formatting follows the locale (Czech comma), **export text never does** — and
  `core/export/*` takes no locale parameter at all, so the rule is enforced by the signature.
- Spec gains §B.5 (localisation rules) and §E.7 (implementation); `settings.language` added; M0 seeds
  the resources and M1 gets the plural + key-parity tests.

## 2026-11-26 — requirements challenged: capture strategy, rename, cuts

Prompted by the user's review of individual requirements against the core idea — *walk with an open
map and start tracking, without much setup*.

- **`measurement` → `boundary`** everywhere in code, DB and English text; Czech UI term **zákres**.
  `vertex` kept. "Measurement" survives only where it quotes iLPIS's own wording.
- **Capture method is now a strategy, not a decision.** The user rejected picking one: all three
  (manual tap, walk-then-simplify, live corner detection) are implemented behind one interface,
  user-selectable with a default, so they can be walked on real parcels and compared (F2, F2b, new
  spec §E.3, milestone M7).
- Consequence: **`track_point` table added**. Storing the raw walk is what makes the strategy a
  replaceable view over data we already have, and it is what F9c draws. It replaces the earlier
  decision that fixes are "averaged and discarded".
- **Simplification switched to area-based (Visvalingam-Whyatt)** as primary, Douglas-Peucker kept
  for comparison: Douglas-Peucker minimises perpendicular deviation, so it deletes small corners on
  long sides first — the exact opposite of what a parcel needs (R15).
- **Screen-off recording (F20, old M4) dropped.** The user watches the map while walking anyway, so
  the screen stays awake; that removes `ACCESS_BACKGROUND_LOCATION`, the Play justification and the
  foreground service. Analysis §4.7.
- **New analysis §4.2 (how accurate a phone GPS really is) and §4.3 (how corners get captured).**
  Key findings: `getAccuracy()` is 68 % confidence, not a worst case; error is correlated between
  fixes so averaging beats √N expectations much less than it seems; area is more robust than
  position; missing a corner by `d` costs ≈ `d²/2`; GPS bearing is unusable for turn detection at
  walking speed, hence the motion sensors.
- **Removed:** F23 photos (suggested during drafting, no use case), numbered vertices in the map,
  F18 open-in-Mapy.com (out of MVP), F33 registry boundaries (we don't need registry data to record
  coordinates).
- **Milestones renumbered** around the new priorities: M4 map, M5 SHP/KML/backup, M6 walked track +
  simplification, M7 corner detection and the field test.
- Settings surface reduced to what recording actually needs (F14); F1 may not require anything
  beyond name + geometry kind.

## 2026-11-26 — documentation slimmed and re-split

- `analysis.md` rewritten as **user stories + research findings + available technology**. Cut:
  acceptance-criteria detail, DDL, directory trees, GPS algorithm steps, tile URL templates,
  code samples — all of that is implementation, so it moved to `specification.md`.
- Requirements are now **user stories** in the analysis; the precise normative rules they imply
  are in `specification.md` §B. IDs (F1, F1b, F9a…) are unchanged, so references still resolve.
- Version headers removed from all documentation files → this file.
- Milestones M0–M8 and open action items moved out of both documents → [timeline.md](./timeline.md).
- `specification.md` chapter **E is now "Implementation"**, explicitly also the place for details
  discovered *while* implementing (not only decisions made beforehand).
- Spec chapters renumbered: requirements became §B, domain model §C, output formats §D,
  implementation §E, screens §F, definition of done §G.

## 2026-11-26 — references added

- `analysis.md` §References: iLPIS manual, Mapy.com portal / docs mirror / OpenAPI specs, ČÚZK
  services, EPSG definitions, library and Android platform docs. All 44 URLs fetched and verified.
- Dropped a guessed `ilpis.mze.cz` link — it does not resolve. The ČÚZK *"Podmínky…"* document is
  cited by title only because ČÚZK deep links rot.

## 2026-11-26 — English + split into why/what

- All documentation rewritten in English; files renamed
  (`01-analyza` → `analysis`, `02-lpis-zjisteni` → `lpis-findings`, `03-specifikace` → `specification`).
- Rationale, requirements and risks moved out of the spec into the analysis; the spec became
  normative only.
- Code and DB identifiers renamed to English: `mereni`→`measurement`, `bod`→`vertex`,
  `geometrie`→`geometry_type`, `stitek`→`label`, `poradi`→`seq`, `rozdelane`→`in_progress`.
  UI text stays Czech. (The user had asked for `geometrie`→`typ_geometrie`; the Czech-identifier
  option was then declined in favour of English.)

## 2026-11-26 — three-level model, broken diagram fixed

- Domain diagram failed to parse: `MERENI ||--o-- ROZDELANE` — `o--` is not a valid cardinality
  marker. Fixed and split into three levels: domain (B), relational (UML), data (DDL).
- `rozdelane` removed as a table — it is `measurement.status`.
- Added `scripts/validate-mermaid.mjs` so diagrams are machine-checked from now on.

## 2026-11-26 — mandatory LPIS measurement type retracted

- Earlier design forced the user to pick LZ / FHPAR / EVP / VEP before measuring. **Wrong**: the
  "Enter coordinates" format carries no type, iLPIS asks for the type at paste time anyway, and we
  cannot validate type rules without DPB boundaries.
- Replaced by an optional free-text `label`, plus a **mandatory geometry kind** (polygon / line /
  point) which genuinely changes the export — that became requirement F1b.

## 2026-11-25 — Mapy.com developer repository studied

- Read the whole `maptiles` OpenAPI spec. Consequences: errors come back as **PNG tiles**, not HTTP
  errors (→ key probe at startup); `tiles.json` needs a key; coordinate order is `lon,lat`
  everywhere while iLPIS wants `latitude longitude`; static maps must not be stored.
- Added "Open in Mapy.com" (keyless URL scheme), elevation and reverse-geocoding as later items.
- Trap recorded: the docs repo default branch is `master`, but its own links point at `main` → 404.

## 2026-11-25 — documentation moved into the repository

- Docs moved from session scratch files to `docs/`, with an index.
- `.env.example` and `.gitignore` added for the Mapy.com key. Tile URL corrected to
  `/v1/maptiles/{mapset}/{tileSize}/{z}/{x}/{y}` — an earlier probe used `/v1/map-tile/…`, got a
  404, and was wrongly recorded as "endpoint does not exist".

## 2026-11-25 — map services measured rather than assumed

- Verified by HTTP: ČÚZK cadastral WMTS is free and keyless (z17–25), OSM is free, Mapy.com needs a
  key, ČÚZK ZABAK/orthophoto endpoints are gone, and **LPIS parcel boundaries are in no public
  ČÚZK service** — which is why the map shows imagery + cadastral borders, not registry borders.
- Renderer chosen: MapLibre GL JS with an own `useMap` hook, over Leaflet, OpenLayers and
  `react-map-gl`.

## 2026-11-25 — phase 1 started

- Three-phase process agreed: analysis → specification → implementation, implementation not to
  start on the user's instruction.
- Scope fixed by user decisions: Capacitor + React, Android first, WGS-84 primary (LPIS converts to
  S-JTSK itself), no geometric plan needed, exports as paste text + SHP + KML, recording with the
  screen off wanted, own position and aerial imagery on the map wanted.
- iLPIS manual (67 p.) mined: exact paste format, four import tabs, measurement types, glossary.
