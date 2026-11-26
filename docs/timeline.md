# Timeline

Working plan. Not a contract — milestones get re-ordered when we learn something.

## Milestones

| # | Milestone | Done when |
|---|---|---|
| **M0** | Repository and scaffold | `git init`, Vite + React + TS, i18n wired with `cs` + `en` seeded from [ui-text.md](./ui-text.md), `npx cap add android` (appId `cz.parcelex.app`, `gps` hardware feature required), build passes, `npm test` and `docs:lint` run |
| **M1** | Pure core with tests | area / perimeter / length / closing / self-intersection switched by geometry type; LPIS text export tested against the manual's literal examples and both `close_polygon` states (F10b); the two coordinate conversions with swap tests; Czech plural test (`1 bod / 3 body / 5 bodů`) and a `cs`/`en` key-parity test |
| **M2** | Storage | schema + migrations incl. `track_point`, repository, same API on Android and web, crash-recovery test |
| **M3** | **MVP: measure → save → paste** | permission flow (F39), back-button handling (F40) and no-fix state (F41) in place; a real boundary on a phone with the `manual` strategy, text pasted into iLPIS, drawing visible in the LPIS map ← **the key demo** |
| **M4** | Map in full | OSM + ČÚZK cadastral keyless, Mapy.com aerial behind the key, tile cache, attribution + logo, key probe |
| **M5** | SHP + KML + backup | a file uploaded into iLPIS creates a feature; restore from backup |
| **M6** | Walked track + `walk_simplify` | track layer drawn live (F9c), area-based simplification, both algorithms compared on recorded walks |
| **M7** | `corner_detect` + field test | rotation-vector heading, haptic corner hint; **all three strategies walked on real parcels and one chosen as the default** |
| **M8** | iOS | `npx cap add ios`, build |

**M3 is where going into the field makes sense** — until the two unknowns below are settled, tuning
simplification thresholds is premature.

**M7 is the milestone the whole capture-strategy design exists for.** The default becomes whatever
the field test says, and that decision is recorded in [CHANGELOG.md](./CHANGELOG.md) and §A of the
specification.

## Status

Phases 1 (analysis) and 2 (specification) are written. **Implementation has not started** — the
user asked twice to hold off.

## Open items

| # | Item | Owner | State |
|---|---|---|---|
| 1 | Vertex-count limit in iLPIS | user, after M3 | open — matters from M6 onwards |
| 2 | Accepted decimal precision in iLPIS (does it truncate 7–8 places?) | user, after M3 | open |
| 3 | Copy `.env.example` → `.env`, set `VITE_MAPY_API_KEY` | user | open (M0 works without it) |
| 4 | Can the Mapy.com key be restricted (domain / mapsets / monthly credits)? Set a cap | user | open |
| 5 | Should the ČÚZK cadastral overlay be on by default? | user | open |
| 6 | Does LPIS convert WGS-84 → S-JTSK via S-42/ETRS89? Compare our export with an LPIS export of the same drawing | user, after M3 | open — decides whether an S-42 shift is ever needed |
| 7 | Read the ČÚZK *"Podmínky poskytování prostorových dat a síťových služeb"* terms | assistant | open, before any release |
| 8 | **Which capture strategy is actually best** — walk one parcel with each | user, at M7 | open; the reason all three exist |
| 9 | Does `corner_detect` work on the target phone at all (R14)? | user, at M7 | open; if not, it is disabled in settings |
| 10 | ČÚZK WMTS access | — | **resolved by measurement**: cadastral free and keyless, orthophoto and LPIS not |
| 11 | App name | — | **resolved**: `cz.parcelex.app` |
| 12 | MVP scope | — | **resolved**: M0–M3, manual capture, screen kept on, no SHP |
| 13 | Mapy.com API key | — | **resolved 2026-11-25**: created, kept out of Git |
| 14 | Recording with the screen off | — | **dropped**: the screen is on while measuring anyway (analysis §4.7) |

## Deliberately not scheduled

| Item | Why not |
|---|---|
| Background / screen-off recording | The user watches the map while walking, so the screen is on regardless. Keeping it awake costs one plugin call; background location costs a permission, a Play justification, a foreground service and a class of "did it record?" bugs. The raw track is written fix by fix either way, so nothing blocks adding it later. |
| Manual offline area download (PMTiles) | Automatic tile caching covers the common case — you drive to the field where there is signal. Starts only if measuring without prior preview proves real. |
| LPIS boundaries in the map | Not in public ČÚZK services, and we don't need registry data to record coordinates. Would need the public LPIS data export as an offline layer. |
| "Open in Mapy.com" (F18) | Pleasant, not needed in order to measure. |
| Photos on a boundary | No stated use case. |
| Click-in digitising, KML/GPX import | The input is the field, not a mouse or another tool. |
| Importing LPIS exports as a map underlay | Genuinely differentiating and no generic GPS app does it — but out of the agreed MVP. Revisit after M3. |
| Legally valid surveying | Needs cm accuracy → external GNSS/RTK receiver. Different class of product. |
