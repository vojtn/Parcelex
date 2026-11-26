# Findings from the iLPIS manual "Kreslení a výměna dat s GPS"

Source: [iLPIS user manual "Kreslení a výměna dat s GPS"](https://mze.gov.cz/public/portal/-q335367---Xppydnel/uzivatelska-prirucka)
(PDF, 67 pages, rev. 2026-08-13). The PDF and the extracted text are not in the repository
(5.5 MB third-party document) — the source URL is above. Supplementary: `lpis.md` in the
repository, and the [LPIS portal for farmers](https://mze.gov.cz/public/portal/mze/farmar/LPIS)
where the manual and the methodology documents are published.
Date of research: 2026-11-25. Full reference list:
[analysis §7](./analysis.md#7-references).

This is **evidence about the target system**, not a decision record. What we concluded from it is
summarised in [analysis §4.1](./analysis.md#41-what-ilpis-actually-accepts); the normative output
formats are in [specification §D](./specification.md#d-output-formats).

**Terminology note.** Below, "measurement" translates iLPIS's own word *zákres* — the feature inside
the registry. Our app's object is also called *zákres* in the Czech UI and `boundary` in code, so the
two coincide in Czech and deliberately do not in English.

---

## 1. The manual coordinate-entry format (OUR PRIMARY EXPORT)

Tool **"Nový zákres ze souřadnic"** (New measurement from coordinates, icon in the drawing panel),
tab **"Zadat souřadnice"** (Enter coordinates). From ch. 3.4.5 (p. 47–49) and ch. 3.3 (p. 34):

| Rule | Manual wording |
|---|---|
| One point per line | "jeden bod na řádek" (one point per line) |
| Coordinate separator | **space** (or several spaces); the "Posunout uzel" (Move node) tool also accepts a **comma** |
| Decimal separator | **dot and comma both accepted** |
| Order | S-JTSK: "v pořadí X Y i Y X" (the manual allows both); WGS-84: example `50.60108964 15.02093970` → **latitude first, then longitude** |
| Optional prefix | "Před souřadnicemi může být i **pořadové číslo a popis bodu**" (an index and a point description may precede the coordinates) |
| WGS-84 | must be **in decimal format** (not degrees/minutes/seconds) |
| S-JTSK | must be the **negative projection (quadrant III)**, i.e. the `−Y, −X` system (swapped and negative) |

Examples from the manual (transcribed exactly):
```
# S-JTSK (quadrant III, negative)
1 bod1 -695034.11 -989920.15
2 bod2 -695019.21 -989911.24
3 bod3 -694983.43 -989887.42

# WGS-84 (decimal)
50.60108964 15.02093970
50.60067024 15.02196713
50.60108964 15.02093970
```

⚠️ **Polygon closure:** the WGS example's 3rd point **equals the 1st** → the polygon is explicitly
closed. The S-JTSK example is not closed. → in the export this must be a **switch** and be tested
against real e-Lepis. Default: close (repeat the first point). Applies to polygon geometry only.

⚠️ **Precision (decimal places):** the manual does not specify. 8 decimals in WGS ≈ 1.1 mm, beyond
what a phone can deliver. Proposal: WGS **7 decimals** (~1 cm), S-JTSK **2 decimals** (cm).
→ verify that LPIS does not truncate or reject long numbers.

## 2. Import into LPIS — four tabs, each doing something different

| Tab | What happens | Consequence for us |
|---|---|---|
| **Zadat souřadnice** (Enter coordinates) | a measurement is created, shown in the map, saved with the disk icon | ✅ primary route, simplest to generate |
| **Importovat z SHP** | measurement(s) created | ZIP with `.shp` + `.dbf` (and `.shx`). Multiple features in one SHP = multiple measurements. **Bulk import (multiple measurements) is NOT allowed for agricultural parcels, erosion plots and OPV.** One polygon is fine. |
| **Importovat z KML** | ⚠️ **no measurement is created** — data goes only into the "Pracovní vrstva – surová data" layer (raw overlay) | KML in LPIS is an **underlay/drawing aid, not a measurement**. This kills the idea of KML as the primary export. |
| **Importovat z ISO-XML** | measurement created | format from surveying applications |

**Consequence for Parcelex:** primary export = **paste text** (WGS-84), secondary = **ZIP
SHP/DBF/SHX**. KML/KMZ only as an optional preview or for other tools, never as a route to a
measurement.

## 3. What LPIS itself EXPORTS (→ our opportunity: importing it back)

Ch. 4.3 "Export of coordinates of the selected measurement to SHP/TXT" + ch. 4.1 bulk exports.
LPIS can export any polygon (DPB, agricultural parcel, working measurement, cadastral parcel,
manure store…) to **SHP** or **TXT**, in S-JTSK or WGS-84, and can put a **text listing on the
clipboard**. Optional WGS-84 formats:

`Standardní` · `Trimble` · `ISO-XML` · `ISO-XML v4` · `RAVEN CRX` · `Topcon 3.20+` · `KML (Fendt)` · `CHCNAV` · `Geojson (EUDR)`

For "Standardní" a helper `*.json` control file can be generated in the ZIP.

💡 **A significant opportunity:** Parcelex could **import an LPIS export** (ideally
`Geojson (EUDR)` and `Standardní TXT`, possibly SHP) and display it as a **map underlay**. The user
would then see in the field "how LPIS has it" and measure a comparison / overwrite precisely. No
generic GPS app can do this. Not scheduled — see [timeline](./timeline.md#deliberately-not-scheduled).

## 4. LPIS measurement types (research)

> **Nothing from this table becomes a picker in the app.** The "Enter coordinates" format carries no
> type, and iLPIS asks for the type at paste time regardless. The table stays because the **export
> guide** needs it — the app has to tell the user what to do in iLPIS — and as suggestions for the
> optional label. Only the **geometry kind** (polygon / line / point) is transferred into the app.

Table 1 (p. 10) + p. 29. Working measurement types (PZ polygon / PZL line / PZB point):

| Code | Type | Geometry | Purpose |
|---|---|---|---|
| **VEP** | Vnitřní erozní pozemek (internal erosion plot) | polygon | areas sown with a crop **inside your own DPB**, triggers erosion calculation; **automatically clipped** to the DPB boundary on save |
| **EEP** | Externí erozní pozemek (external erosion plot) | polygon | erosion areas **outside** your own DPB, must overlap soil block type "Agricultural land (Z)" |
| **LZ** | **Libovolný zákres** (any measurement) | polygon+line+point | general type, anywhere including outside your own DPB → **universal target for our export** |
| **FHDPB** | Farmer's DPB boundaries | polygon | alternative to the DPB type |
| **FHPAR** | **Farmer's agricultural parcel boundaries** | polygon | "e.g. **to refine parcel geometry for subsequent use in GPS**" ← exactly our use case |
| **VLDPB / VLPAR** | Guidance line DPB / parcel | line | machine guidance tracks, export to GPS |
| **SL** | Sloup (post) | point | |
| **EVP** | Ecologically significant elements | polygon | for purposes other than maintaining EVP in the Land Registry |
| **JP** | Jiná překážka (other obstacle) | polygon+line+point | obstacles to driving |

Other measurement types (outside working measurements): **DPB**, **ZP** (agricultural parcel),
**OPV** (planted vineyard area), **PH** (field manure store), **SH** (fertiliser store).

Rules that affect UX:
- VEP/EEP and FHDPB/FHPAR/guidance lines **require overlap with your own DPB**; LZ does not.
- On save an **automatic link to the DPB** is created by dominant overlap (can be changed/removed).
- VEP/EEP have visibility **Private/Public** (default Private); other types are always visible to
  OPŽL staff but not editable by them.
- Manure stores and "any measurement" may be drawn outside your own land.

The app therefore asks only for the geometry kind (polygon / line / point), which changes both the
tool used in iLPIS and the export. The measurement type itself is chosen by the user in iLPIS.

## 5. Concepts (for the data model and UI copy)

- **Půdní blok (PB)**, soil block — corresponds to a physical field; has its own measurement;
  parcels are registered against it.
- **DPB** — a part of a soil block.
- **Zemědělská parcela** (agricultural parcel) — typically **per year and per crop**; if several
  crops are grown on a PB, the PB is split into N parcels and **each has its own geometry**
  (a parcel measurement).
- **EVP** — ecologically significant elements (groves, agroforestry, field margins).
- The **area of a parcel measurement** may differ from the **parcel area**; LPIS has a toggle
  "Použít vým. zákresu" (Use measurement area) → the measurement area is then used as the parcel
  area. → our app shows **its own area calculation as informational**; the official one is LPIS's.
- **S-JTSK variants** (per the manual): quadrant I = `X, Y` positive; **quadrant III = `−Y, −X`**
  (swapped, negative, "a format suitable for GIS applications") ← this is what LPIS wants.
- **WGS-84** notation: sexagesimal (`14° 32' 54.60"`) or **decimal** (`14.5485`); for GPS and LPIS
  use decimal.

## 6. What this means for the app

- **No geometric plan is needed.** FHPAR/FHDPB and the "farmer measurements — DPB change proposals"
  types exist precisely so farmers draw these themselves. The goal is legitimate.
- **The output format is fully specified** (§1), so we generate one concrete format for "Enter
  coordinates" with switches, rather than a generic template kept "just in case".
- **KML cannot be the primary export** — LPIS makes no measurement from it.
- **WGS-84 is the primary output** because LPIS converts to S-JTSK itself, more accurately than we
  could. Křovák math therefore stays out of the MVP, along with the datum-shift and axis-order
  problems that come with it.
- **The app does not choose an LPIS measurement type** (§4 banner); it only needs the geometry kind.

## 7. Questions the manual does not answer

Tracked with owners in [timeline.md](./timeline.md#open-items); listed here because they are
answerable only in the live registry, not from documentation.

1. **Vertex limit** of a polygon — continuous walking recording produces hundreds, which is what
   forces simplification (F21).
2. **Maximum accepted precision** — does LPIS truncate 7–8 decimal places?
3. **Minimum area / tolerance** of a measurement, and what the automatic VEP clipping does to a
   polygon that overshoots the DPB.
4. **S-42 vs WGS-84** — LPIS probably converts via ETRS89/S-42, which differs from pure WGS-84 by
   ~0.5–2 m in CZ. Decides whether our in-map comparison is trustworthy (R2).
5. **EVP methodology** — whether the app should check EVP width/area against the SZIF rules.
   Currently out of scope: record only.
