# Analysis

What we found out, what the user wants, and what is available. How it will be built is in
[specification.md](./specification.md); when things changed is in [CHANGELOG.md](./CHANGELOG.md).

**Terminology.** Our object is called **`boundary`** in code and English text, **`zákres`** in the
Czech UI. iLPIS uses the same Czech word for the result after you paste it, so "record a zákres,
paste it into iLPIS as a zákres" is the real flow. LPIS registry vocabulary (LPIS, DPB, PB, ZP,
EVP, FHPAR) is never translated.

---

## 1. Problem

**Parcelex** is a phone app a farmer takes into a field to record the outline of a parcel or a
landscape element with GPS, name it, keep it on the device, and paste the resulting coordinates
into the Czech land registry (iLPIS / e-Lepis).

iLPIS explicitly supports farmer-drawn features (`FHPAR` is described as refining parcel geometry
"for subsequent use in GPS"), so this is a legitimate activity — no licensed surveyor, no geometric
plan. Legally valid surveying (cm accuracy, external GNSS/RTK receiver) is a different product.

**The core experience is deliberately narrow:** open the map, start walking, watch the shape appear.
Everything else supports that. Anything that adds setup or decisions before the user can start
recording is a candidate for removal.

---

## 2. User stories

IDs are stable and referenced from the specification, which holds the precise rules each story
implies. **P1 = MVP.**

### Recording

| ID | Story | P |
|---|---|---|
| F1 | …open the app, name the boundary, say whether it's an area, a line or a point, and start walking. | P1 |
| F1b | …have those three treated as genuinely different: a line isn't closed and has no area, a point is a single position. | P1 |
| F2 | …have my corners captured the way *I* like — by tapping, by stopping, or by just walking and sorting it out afterwards. | P1 |
| F2b | …pick one capture method as my default and have the app remember it, so I set it once. | P1 |
| F3 | …stand on a corner and hold a button to average the signal, so one fix isn't my only input. | P1 |
| F4 | …have obviously bad fixes thrown away instead of quietly ruining my shape. | P1 |
| F5 | …be told when my polygon doesn't meet up again at the start, or crosses itself. | P1 |
| F6 | …review the shape before saving and add, delete or move vertices — including corners I walked past. | P1 |
| F21 | …walk a long straight side without it filling up with useless vertices. | P2 |

### Seeing where I am

| ID | Story | P |
|---|---|---|
| F9 | …see aerial/satellite imagery, not just a schematic map, so I can tell a ditch from a fence. | P1 |
| F9d | …switch between imagery, a plain map and the cadastral overlay, and have the map stay usable when I zoom past the zoom the source has. | P1 |
| F9a | …see exactly where I am, including how unsure the phone is. | P1 |
| F9b | …watch the shape appear as I go, with the area and perimeter growing. | P1 |
| F9c | …see the line I actually walked, so I can trust that the simplified shape matches the ground. | P1 |
| F18 | …open a finished boundary in the Mapy.com app to show someone. | P3 |

### Getting it into the registry

| ID | Story | P |
|---|---|---|
| F10 | …copy my points as text I can paste straight into iLPIS. **This is the point of the app.** | P1 |
| F11 | …export a shapefile for iLPIS or for a machine. | P2 |
| F12 | …export KML for other tools, knowing iLPIS won't make a feature from it. | P2 |
| F24 | …export everything at once. | P2 |
| F25 | …print a protocol of a boundary. | P2 |
| F30 | …export in S-JTSK as well as WGS-84. | P3 |
| F36 | …have elevations added to my points. | P3 |
| F32 | …export in formats my GPS machine understands (Trimble, Topcon, RAVEN, CHCNAV). | P3 |

### Keeping my records

| ID | Story | P |
|---|---|---|
| F7 | …never lose a boundary, even if the app or phone dies mid-field. | P1 |
| F8 | …browse past boundaries, search them, and see them on the map. | P1 |
| F13 | …back the whole thing up and restore it on another phone. | P1 |
| F14 | …set my own accuracy threshold, decimal places, capture method and map. | P1 |
| F38 | …use the app in Czech by default, and in English if I prefer it or if my phone is set to English. | P1 |
| F37 | …have the cadastral area filled in for me. | P2 |

### Not breaking on the way

| ID | Story | P |
|---|---|---|
| F15 | …measure with no signal at all. | P1 |
| F16 | …not get the app into trouble over map licensing. | P1 |
| F17 | …still be able to measure if the map service key is missing or broken. | P1 |
| F39 | …be asked for location access once, in words I understand, and be told what to do if I accidentally deny it. | P1 |
| F40 | …press the phone's back button without silently losing a walk I've been doing for five minutes. | P1 |
| F41 | …know straight away that the phone hasn't got a fix yet, instead of pressing "Add point" and wondering why nothing appeared. | P1 |

### Dropped after review

| Was | Why it went |
|---|---|
| Photos attached to a boundary (F23) | Suggested during drafting, no stated use case. |
| Numbered vertices drawn in the map (was part of F9b) | The vertex list in review already gives order. |
| Registry boundaries in the map (F33) | Needs the public LPIS export; we don't need registry data to record coordinates. |
| Recording with the screen off (F20) | See [§4.7](#47-screen-on-is-a-feature-not-a-limitation) — the screen being on is what the user wants anyway. |
| Click-in digitising, KML/GPX import | The input is the field, not a mouse or another program. |

---

## 3. What the app must be like

| | |
|---|---|
| Works with no network | GPS, storage and export are all local; only map tiles need the internet. |
| Never loses data | a point is written down the moment it is taken. |
| No setup before measuring | name + shape kind, then go. Everything else has a default. |
| Fast enough | 500 past boundaries open without a pause; recording never stutters. |
| Glove-friendly | large controls, readable in sunlight, usable one-handed. |
| Private | everything stays on the phone. No telemetry, no account, no cloud. |
| Czech first, localisable | the UI ships in Czech and English from day one; Czech is the primary language and wins any wording argument. Number and plural formatting follow the active locale. |
| Honest about accuracy | a phone gives metres, not centimetres. The app always shows accuracy and never claims a survey. |

---

## 4. Research findings

### 4.1 What iLPIS actually accepts

From the [67-page iLPIS manual](https://mze.gov.cz/public/portal/-q335367---Xppydnel/uzivatelska-prirucka);
detail in [lpis-findings.md](./lpis-findings.md).

- The "Enter coordinates" tab takes **plain text, one point per line**, `latitude longitude`,
  decimal degrees, space-separated, dot or comma as decimal mark. An index and description may
  precede each line.
- **It carries no feature type** — iLPIS asks for the type when you paste, not before. So the app
  does not ask either; it only needs to know whether the output is an area, a line or a point.
- S-JTSK must be the negative quadrant-III form (`−Y −X`); WGS-84 is accepted and LPIS converts it.
- **KML import does not create a feature** — it lands in a raw working layer, so KML cannot be the
  primary export. SHP does, but bulk SHP import is disallowed for agricultural parcels, erosion
  plots and vineyards.
- The manual's WGS example closes the polygon by repeating the first point; its S-JTSK example
  doesn't. Closure therefore has to be a switch.
- Unknown, checkable only in the live registry: the **vertex limit** and the **maximum accepted
  precision**.

### 4.2 How accurate a phone GPS really is

Worth understanding properly, because it decides what the app may promise and what the capture
algorithm can rely on. Background:
[GPS error sources](https://en.wikipedia.org/wiki/Error_analysis_for_the_Global_Positioning_System),
[dilution of precision](https://en.wikipedia.org/wiki/Dilution_of_precision_(navigation)),
[gps.gov](https://www.gps.gov/).

**What the reported number means.** Android's
[`Location.getAccuracy()`](https://developer.android.com/reference/android/location/Location#getAccuracy())
is the radius of a circle with **68 % confidence** — one standard deviation, not a worst case. So
roughly one fix in three lands *outside* the circle the app draws. The ring we show is honest about
being a 1σ ring, not a guarantee.

**Realistic magnitudes, open sky, modern phone** (multi-constellation GPS+GLONASS+Galileo):

| Situation | Horizontal error |
|---|---|
| Open field, good sky view | ~2–5 m |
| Near a tree line, hedge, building, or a vehicle | 5–15 m, occasionally worse |
| First fix after a cold start | tens of seconds before anything is usable |
| After 10–30 s of averaging while standing still | ~1.5–3 m |

**The error is not independent between fixes.** This is the finding that matters most for the
design. Satellite geometry and multipath change slowly, so consecutive fixes share most of their
error — it drifts over tens of seconds rather than jittering sample to sample. Two consequences:

1. **Averaging helps less than the textbook √N.** Ten samples ten seconds apart are not ten
   independent measurements; expect roughly a 1.5–2× improvement, not 3.2×. Averaging is still worth
   doing — it removes walking jitter and genuinely improves a stationary point — but the app must
   not imply √10.
2. **A long straight walk carries a slowly drifting error**, so the *shape* of a walked side is more
   trustworthy than the absolute position of any point on it.

**Area is more robust than position.** A common error applied to every vertex translates the whole
polygon without changing its area; only the uncorrelated part distorts it. For a 100 × 100 m parcel
(1 ha, perimeter 400 m) with ~3 m of *independent* per-vertex error, the area error is on the order
of a few hundred m² — a few percent. That is the honest figure to quote when the user compares our
number with LPIS's, which is computed in the S-JTSK plane and is authoritative anyway.

**Missing a corner costs less than feared.** Walking past a 90° corner by distance `d` cuts a
triangle of roughly `d²/2`: 3 m past the corner is ~4.5 m², 5 m is ~12 m². On a parcel of any size
that is negligible — an argument for not obsessing over perfect live corner detection, and for
making corners easy to fix in review.

**Heading is the weak signal.** [`getBearing()`](https://developer.android.com/reference/android/location/Location#getBearing())
is direction of *travel*, derived from successive positions, and is only meaningful while moving. At
walking speed (≈ 1.4 m/s) with 1 Hz fixes, consecutive points are ~1.4 m apart; with a few metres of
error the implied heading is off by tens of degrees — over a 10 m baseline, `atan(3/10)` alone is
~17°. **This is why detecting a corner from GPS positions alone is unreliable.** The phone's
[motion sensors](https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion)
(rotation vector / gyroscope) measure *turning* far better than GPS does, which is how commercial
systems solve it.

**Update rate and battery.** Continuous high-accuracy GPS with the screen on is the dominant power
draw ([Android guidance](https://developer.android.com/guide/topics/location/battery)). 1 Hz is
enough: at walking speed that is a fix every ~1.4 m, finer than the error, so asking for more buys
nothing.

### 4.3 How corners get captured

The user's point, and it is the right one: what matters are the **corners**, not the 200 m of
straight line between them. A parcel boundary is a handful of corners; the walk between them is
noise. Three approaches exist and each has a real failure mode.

| | Manual tap | Walk, simplify later | Live corner detection |
|---|---|---|---|
| What the user does | presses "add point" at every corner | walks, presses nothing | walks; app buzzes when it thinks you turned |
| Corner placement | where the user pressed — but they must press at the right moment | wherever the algorithm decides | wherever the detector decides, corrected in review |
| Long straight side | 1 vertex — perfect | many vertices, then reduced | 1 vertex if the detector holds |
| Rounded corners | no risk | **yes** — simplification cuts the corner off | yes, if detection lags |
| Missed corner | easy to notice, easy to fix | invisible until review | the point of the buzz |
| Depends on | the user's attention | the simplification threshold | the heading estimate — the weak signal (§4.2) |
| Needs | nothing | stored raw track | stored raw track + motion sensors |

Two findings shape the design:

- **Douglas-Peucker is the wrong measure for parcels.** It removes the point that deviates least
  *perpendicularly*, so a small corner on a long side is deleted first — exactly backwards.
  **Visvalingam-Whyatt** removes the point contributing the least *area*, which keeps corners and
  discards wobble. For "keep the corners, drop the straight-line noise", area-based simplification
  fits better.
- **Live detection needs sensors, not just positions.** A heading-change threshold on GPS bearing
  either fires constantly (noise) or fires late (lag), because bearing over a short baseline is
  unusable (§4.2). Fusing the rotation vector makes turning detectable within ~1 s, but it is real
  work and must be tested on the actual device.

**Therefore: all three, behind one interface, with the raw walk always stored.** The user intends to
test in the field which method feels best, and the honest answer is that nobody knows until someone
walks a real parcel. The architectural consequence is the same either way and is cheap:

> **Store the raw track. Derive the boundary from it.**

Recording every accepted fix costs ~1.4 rows per metre and a few hundred rows per parcel — trivial
for SQLite. It makes the capture method a *view* over data we already have, so the method can be
switched, re-run, or improved later without losing anything the user walked. It also makes F9c
(see the line you actually walked) possible, which is what lets a user trust a simplified shape.

The three methods then differ only in what they *propose* as vertices; all three end at the same
review screen (F6) where the user confirms the corners. That keeps the UI identical across methods
and makes the field comparison fair.

### 4.4 Map services: measured, not assumed

Checked by HTTP on 2026-11-25.

| Source | Availability |
|---|---|
| [ČÚZK cadastral WMTS](https://services.cuzk.gov.cz/wmts/local-km-wmts-google/rest/WMTS/default/HP_BAREVNE/17/65535/65535) | **free, keyless**, zoom 17–25, incl. colour parcel boundaries |
| [OpenStreetMap tiles](https://operations.osmfoundation.org/policies/tiles/) | free, keyless |
| [Mapy.com tiles](https://developer.mapy.com/cs/rest-api/map-tiles/) | **needs an API key** (`401` without); free tier after registration. Key created. |
| ČÚZK ZABAK / orthophoto ([legacy endpoints](https://wms.cuzk.gov.cz/)) | **gone** — `404`, now behind Geoportál registration |
| [EOxCloudless](https://cloudless.eox.at/) (Sentinel-2 mosaic, WMTS, keyless) | **free to fetch, wrong licence, far too coarse** — see below |
| **LPIS parcel boundaries** | **not in any public ČÚZK service** |

The last row no longer hurts: we do not need registry boundaries to record coordinates. Orientation
comes from imagery and cadastral borders. Registry boundaries would come from the
[public LPIS data export](https://eagri.cz/public/app/eagriapp/lpisdata) if ever wanted.

**EOxCloudless**, found in a Leaflet app's attribution. Measured 2026-11-26 against
[its own GetCapabilities](https://tiles.maps.eox.at/wmts/?service=WMTS&request=GetCapabilities&version=1.0.0):
keyless, `access-control-allow-origin: *`, 7-day cache, tiles served up to **z18 and 404 above**.
Three reasons it is not ours:

1. **Resolution.** It is a [Sentinel-2](https://sentiwiki.copernicus.eu/web/s2-mission) mosaic —
   **10 m per pixel** native. z18 nominally wants 0.6 m per pixel, so every tile is ~16× overzoom of
   10 m data. Our own GPS is 3–10 m (§4.2), so the imagery would be *blurrier than the line we are
   drawing against it*. It cannot show a parcel edge, which is the only job imagery has here.
2. **Licence.** The attribution string in that Leaflet app says CC BY 4.0. The service's own
   capabilities says **CC BY-NC-SA 4.0** for every vintage from 2017 on — the **NC** forbids
   commercial use, and EOX sells a separate commercial licence. Only the 2016/2017 layers are plain
   CC BY 4.0, and those are the oldest imagery. Attributing it as the Leaflet app does is a licence
   violation, not a citation.
3. It is a **yearly global cloud-free mosaic** — designed to look uniform, not to be current. A field
   this spring is not in it.

Worth keeping in mind as decorative background for a marketing screen, never for measuring.

The ČÚZK half of that same attribution string is a useful negative result: the
`WMTS_ORTOFOTO/WMTService.aspx` endpoint answers **HTTP 200 with a 5 925-byte PNG** to a
GetCapabilities request, and the same PNG to a GetTile. A status code proves nothing here — this is
exactly the Mapy.com behaviour behind F17, from a second provider, which is why F17 says the *content
type* is checked and not the response code.

### 4.5 Mapy.com API: findings that change the design

From the [`maptiles` OpenAPI spec](https://api.mapy.com/v1/docs/maptiles/openapi.yaml), read in
full, plus HTTP probes.

1. **Errors come back as PNG tiles, not HTTP errors.** A bad or exhausted key produces a silently
   grey map with no exception. The key must be probed explicitly at startup.
2. **`tiles.json` needs the key**, so the tile URL template has to be defined by us.
3. **Coordinates are `lon,lat` everywhere** in their API — while iLPIS wants `latitude longitude`.
   Two opposite conventions in one project is a silent bug that puts points in Somalia.
4. **Static map images must not be stored** ("long-term storage or caching is not permitted"), so
   they cannot appear in a saved PDF protocol.
5. Aerial imagery stops at **zoom 20** in CZ while the cadastral overlay goes to 25.
6. Rate limits (500 req/s for tiles) are irrelevant for a single app.

Their [URL schemes](https://github.com/mapycom/developer/tree/master/docs/url-mapy) need **no key
and no attribution** and open the native app — the cheapest possible "open in Mapy.com", if it is
ever wanted. Elevation and reverse geocoding are available for later.

### 4.6 Coordinate systems

- [EPSG:5513 (S-JTSK/Křovák)](https://epsg.io/5513) has two datum-shift variants, 3-parameter and
  7-parameter, differing by up to ~2 m — visible at LPIS scale.
- Křovák axes are inverted and negative (`X` = south, `Y` = west); Czech reports print "Y, X".
  [PROJ documents the projection](https://proj.org/operations/projections/krovak.html).
- LPIS probably converts WGS-84 via S-42/ETRS89, ~0.5–2 m from pure WGS-84 in CZ.
- Since LPIS converts for us, more accurately than we could, **WGS-84 is the primary output** and
  S-JTSK is an optional later export.

### 4.7 Screen-on is a feature, not a limitation

Recording with the screen off was originally a requirement. It is the single largest platform cost:
a separate `ACCESS_BACKGROUND_LOCATION` permission, a Play Store justification, a foreground
service, and a class of "did it keep recording?" bugs
([permissions](https://developer.android.com/develop/sensors-and-location/location/permissions),
[background location](https://developer.android.com/develop/sensors-and-location/location/background),
[foreground services](https://developer.android.com/develop/background-work/services/foreground-services),
[Play policy](https://play.google.com/about/privacy-security-deception/permissions/)).

It is also **not what the user wants**: the point is to watch the shape grow on the map while
walking, so the screen is on regardless. Keeping it awake is one call
([`keep-awake`](https://github.com/capacitor-community/keep-awake)) and removes the permission, the
service and the justification entirely.

Cost: screen drain, on a phone that is in the hand anyway, for the length of a parcel. If field use
ever shows a real need, background recording can be added later as an isolated feature — nothing in
the data model blocks it, because the raw track is written fix by fix either way.

### 4.8 What the domain looks like

A soil block (**PB**) is a physical field, split into parts (**DPB**), which carry agricultural
parcels (**ZP**) — typically one per year and crop, each with its own geometry. Ecologically
significant elements (**EVP**: groves, margins, agroforestry) are recorded separately. Internal
erosion plots (**VEP**) are clipped to the DPB automatically when saved.

We store none of these as entities — we have no registry data — only an optional text reference to
a DPB code and an optional free-text label the user uses to find things again.

### 4.9 Localisation: what Czech actually forces on us

The users are Czech farmers, so Czech is primary — but hard-coding strings would make the second
language a rewrite. Two findings decide the mechanism.

**Czech plural rules are not the three school categories.** Measured with
[`Intl.PluralRules('cs')`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)
in Node:

| n | CLDR category | correct Czech |
|---|---|---|
| 1 | `one` | 1 bod |
| 2, 3, 4 | `few` | 2 body |
| 5, 6, 21, 105 | **`other`** | 5 **bodů** |
| 1.5 | `many` | 1,5 bodu |

So `many` is for **decimals**, and everything from 5 upwards is `other`. Writing "5+ bodů" under
`many` — which is what Czech grammar suggests and what most hand-rolled helpers do — renders
"5 bodu". This is precisely the class of bug a plural-aware library prevents, and it appears in the
app constantly: point counts, vertex counts, boundary counts.

**Number formatting must not leak into the export.** Czech writes `50,6010896`; iLPIS accepts both
marks, but a locale-driven decimal separator in the export text is a needless risk on the one output
that matters. So display formatting is locale-aware and the export is not — a rule, not an accident.

**No runtime is required for the rest.** Dates, numbers and units are handled by the built-in
[`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
in every WebView we target, so only message lookup and plurals need a library.

---

## 5. Technology available

### Rendering the map

| | [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js) | [Leaflet](https://leafletjs.com/) | [OpenLayers](https://openlayers.org/) |
|---|---|---|---|
| Rendering | WebGL | DOM | Canvas/WebGL |
| Redrawing a polygon ~1×/s | good | stutters at hundreds of points | good |
| Continuous walked track | good | heavy | good |
| Offline tiles | [PMTiles](https://github.com/protomaps/PMTiles) | adapter | partial |
| Native S-JTSK | no | no | yes |
| Size | ~850 kB | ~42 kB | ~400 kB |

**MapLibre** fits: our main flow is continuous redraw, which is exactly its data-replacement model.
OpenLayers' unique advantage (native S-JTSK) is only needed for a later export calculation.
[Mapy.com recommend MapLibre themselves](https://developer.mapy.com/cs/map-libraries/).

It is a **library, not a component** — unlike the `RazorAzureMapsComponent` the user knows, you
create a map object and send it commands. We wrap it in our own React component so app code still
looks declarative; a declarative wrapper (`react-map-gl`) would push every GPS update through
React's reconciler for no benefit.

### Everything else

| Need | Available | Note |
|---|---|---|
| App shell | [Capacitor](https://capacitorjs.com/docs) + React + TypeScript | user's experience; Android first, iOS cheap later, web for development |
| Location | `@capacitor/geolocation` | [requesting updates](https://developer.android.com/develop/sensors-and-location/location/request-updates); 1 Hz high-accuracy is enough |
| Motion sensors | [Android motion sensors](https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion) | rotation vector / gyroscope, needed only for live corner detection |
| Storage | [`@capacitor-community/sqlite`](https://github.com/jepiqueau/capacitor-sqlite) | native **and** browser (WASM/OPFS); relational, transactional, one-file backup |
| Geodesy | [geographiclib-js](https://github.com/geographiclib/geographiclib-js) | area on the ellipsoid without any CRS |
| Geometry checks | [Turf.js](https://turfjs.org/) | self-intersection, area, length |
| Simplification | [simplify-js](https://github.com/mourner/simplify-js) (Douglas-Peucker) | area-based Visvalingam-Whyatt likely needed too — §4.3 |
| S-JTSK later | [proj4](https://proj.org/operations/projections/krovak.html) | native Křovák |
| Keep screen on | [`keep-awake`](https://github.com/capacitor-community/keep-awake) | replaces the whole background-location problem (§4.7) |
| Localisation | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) | JSON resources, [CLDR plurals](https://www.i18next.com/translation-function/plurals) matching `Intl.PluralRules`, no build step. Alternatives considered: [Lingui](https://lingui.dev/) and [FormatJS](https://formatjs.github.io/docs/getting-started/installation/) — both need an extraction/compile step, which buys nothing at this size |
| Tests | [Vitest](https://vitest.dev/) | geometry, simplification and export logic are pure and testable without a phone |

### Constraints we cannot design around

- **A Capacitor app has no backend**, so any API key ships inside the APK and is extractable. Treat
  it as semi-public: dedicated to this app, revocable, and the app must work without it.
- **Attribution is mandatory** for Mapy.com (copyright text + clickable logo) and required by the
  ČÚZK terms.
- **MapLibre in a WebView** runs on a mobile GPU; raster-only tiles and throttled updates are the
  safe configuration.
- **GPS bearing is unusable at walking speed** over short baselines (§4.2). Anything depending on
  turn detection must use the motion sensors.

---

## 6. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | Unknown vertex limit / precision in iLPIS | verify after M3; decimal switch; simplification |
| R2 | LPIS may convert via S-42/ETRS89, ~0.5–2 m off pure WGS-84 | compare exports; add a shift only if it matters |
| R3 | ~~Android background location~~ | **removed** — the screen stays on (§4.7) |
| R4 | ČÚZK data terms apply even to free services | read the terms before release; OSM fallback |
| R5 | VEP is auto-clipped to the DPB in iLPIS | warn in the export guide — we cannot check it without DPB boundaries |
| R6 | SQLite on the web lacks encryption and write concurrency | data is local anyway; storage abstraction |
| R7 | MapLibre performance in a WebView, now with a continuous track layer on top | raster only, no 3D, throttled updates, cap track density |
| R8 | Our area ≠ LPIS area (ellipsoid vs S-JTSK plane, plus metres of GPS error) | label it informational; quote the few-percent figure from §4.2 |
| R9 | Aerial imagery ends at z20, cadastral continues to z25 | automatic overzoom; note in settings |
| R10 | Mapy.com needs a key, OSM and ČÚZK do not | keyless default so the app works on install |
| R11 | LPIS boundaries are not publicly available | no longer relevant — we don't need them |
| R12 | `lon,lat` vs `latitude longitude` swap | one coordinate type in code, named conversions only, tested |
| R13 | Mapy.com errors arrive as PNG, not HTTP errors | probe the key at startup, show its state |
| R14 | **Live corner detection may not work on the target phone** — GPS bearing too noisy, sensor fusion may lag or over-trigger | it is one of three interchangeable methods, not a dependency; field test decides (§4.3) |
| R15 | Simplification cuts real corners (Douglas-Peucker measures perpendicular deviation, not area) | prefer area-based simplification; always keep the raw track so it can be re-derived |

---

## 7. References

Only sources we actually used; all fetched and verified on 2026-11-26. Anything we could not reach
is named by title rather than given a guessed link.

### Land registry

- [LPIS for farmers — MZe](https://mze.gov.cz/public/portal/mze/farmar/LPIS) — portal and methodologies.
- [iLPIS manual "Kreslení a výměna dat s GPS"](https://mze.gov.cz/public/portal/-q335367---Xppydnel/uzivatelska-prirucka)
  — **primary source** for the paste format, import tabs and feature types.
- [Public LPIS data export (eAGRI)](https://eagri.cz/public/app/eagriapp/lpisdata) — the only route
  to DPB/parcel boundaries, if we ever want them.
- e-Lepis itself is reached through the MZe portal and needs a farmer login, so no direct URL is
  recorded — we did not want to link an address we could not verify.
- ČÚZK *"Podmínky poskytování prostorových dat a síťových služeb ČÚZK"* — cited by title only;
  ČÚZK reorganises its site often and deep links rot. Search on [cuzk.cz](https://www.cuzk.cz/).

### GPS accuracy and Android sensors

[gps.gov](https://www.gps.gov/) ·
[GPS error analysis](https://en.wikipedia.org/wiki/Error_analysis_for_the_Global_Positioning_System) ·
[dilution of precision](https://en.wikipedia.org/wiki/Dilution_of_precision_(navigation)) ·
[`Location.getAccuracy()`](https://developer.android.com/reference/android/location/Location#getAccuracy()) ·
[`Location.getBearing()`](https://developer.android.com/reference/android/location/Location#getBearing()) ·
[requesting location updates](https://developer.android.com/develop/sensors-and-location/location/request-updates) ·
[battery and location](https://developer.android.com/guide/topics/location/battery) ·
[motion sensors](https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion) ·
[sensors overview](https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview)

### Map data and APIs

- [EOxCloudless](https://cloudless.eox.at/) ·
  [its WMTS GetCapabilities](https://tiles.maps.eox.at/wmts/?service=WMTS&request=GetCapabilities&version=1.0.0)
  — the authoritative licence text, which contradicts the attribution string in apps using it ·
  [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) ·
  [Sentinel-2 mission](https://sentiwiki.copernicus.eu/web/s2-mission) — 10 m native resolution.
- [Mapy.com developer portal](https://developer.mapy.com/cs/rest-api/) ·
  [docs mirror on GitHub](https://github.com/mapycom/developer) ·
  [`llms.txt` index](https://raw.githubusercontent.com/mapycom/developer/master/llms.txt) ·
  [key rules](https://github.com/mapycom/developer/blob/master/docs/rest-api/getting-access.md) ·
  [tiles](https://github.com/mapycom/developer/blob/master/docs/rest-api/map-tiles.md) ·
  [static maps](https://github.com/mapycom/developer/blob/master/docs/rest-api/static-maps.md) ·
  [elevation](https://github.com/mapycom/developer/blob/master/docs/rest-api/elevation.md) ·
  [reverse geocoding](https://github.com/mapycom/developer/blob/master/docs/rest-api/reverse-geocoding.md) ·
  [URL schemes](https://github.com/mapycom/developer/tree/master/docs/url-mapy) ·
  [map libraries](https://developer.mapy.com/cs/map-libraries/) ·
  [copyright endpoint](https://api.mapy.com/copyright)
- OpenAPI specs, free and keyless: [`maptiles`](https://api.mapy.com/v1/docs/maptiles/openapi.yaml)
  (also `static`, `geocode`, `routing`, `elevation`, `timezone`; `.json` as well as `.yaml`).
- **Trap:** the docs repo's default branch is `master`, but its own links point at `main` → 404.
  Use `raw.githubusercontent.com/mapycom/developer/master/…`.
- [ČÚZK WMS/WMTS service list](https://wms.cuzk.gov.cz/) ·
  [cadastral WMTS tile example](https://services.cuzk.gov.cz/wmts/local-km-wmts-google/rest/WMTS/default/HP_BAREVNE/17/65535/65535)
  (note WMTS orders tiles `z/y/x`, unlike [slippy maps](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)) ·
  [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/).

### Coordinate systems

[EPSG:5513](https://epsg.io/5513) · [EPSG:5515](https://epsg.io/5515) ·
[PROJ Křovák](https://proj.org/operations/projections/krovak.html) ·
[EPSG transformer](https://epsg.io/transform) for reference values in tests.

### Libraries and platforms

[MapLibre docs](https://maplibre.org/maplibre-gl-js/docs/) ·
[style spec — layers](https://maplibre.org/maplibre-style-spec/layers/) ·
[MapLibre on GitHub](https://github.com/maplibre/maplibre-gl-js) ·
[PMTiles](https://github.com/protomaps/PMTiles) ·
[`@capacitor-community/sqlite`](https://github.com/jepiqueau/capacitor-sqlite) ·
[keep-awake](https://github.com/capacitor-community/keep-awake) ·
[background geolocation plugin](https://github.com/GachLab/capacitor-background-geolocation) (only
if background recording is ever revived) ·
[geographiclib-js](https://github.com/geographiclib/geographiclib-js) ·
[Turf.js](https://turfjs.org/) ·
[simplify-js](https://github.com/mourner/simplify-js) ·
[Capacitor](https://capacitorjs.com/docs) ·
[i18next](https://www.i18next.com/) ·
[react-i18next](https://react.i18next.com/) ·
[i18next plurals](https://www.i18next.com/translation-function/plurals) ·
[`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) ·
[`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ·
[Vitest](https://vitest.dev/).

### Android constraints

[Location permissions](https://developer.android.com/develop/sensors-and-location/location/permissions) ·
[background location](https://developer.android.com/develop/sensors-and-location/location/background) ·
[foreground services](https://developer.android.com/develop/background-work/services/foreground-services) ·
[Play location policy](https://play.google.com/about/privacy-security-deception/permissions/).
