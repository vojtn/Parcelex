# UI text

The normative Czech wording of the app, with its English translation. Czech is the **primary**
language; English exists so the app can be localised and so a non-Czech reader can follow the design.

M0 seeds `src/i18n/locales/cs.json` and `en.json` from this table. After that this document stays the
place where **wording** is decided — the JSON files are the mechanism, this is the text.

Rules:

* Keys are lowercase dot-separated English, grouped by screen. Never a translated key.
* `{placeholders}` are English and identical in both languages.
* Czech plurals use the four CLDR categories `Intl.PluralRules` reports for `cs`, and they are **not**
  the school grammar three: `one` = exactly 1 (*1 bod*), `few` = 2–4 (*2 body*), **`many` = decimals
  only** (*1,5 bodu*), `other` = 0 and **5 and up** (*5 bodů*). Putting "5+ bodů" under `many`, which
  reads natural from the grammar, is wrong and shows up as "5 bodu". English uses `one`/`other`.
* **Formatting for display uses the active locale** (Czech comma decimal mark). **Export text never
  does** — see [specification §D.1](./specification.md#d1-paste-text--ilpis-new-measurement-from-coordinates--enter-coordinates).
* Where Czech and English differ in idiom, Czech wins; the English column is a translation of the
  Czech, not the other way round.

---

## Common

| Key | cs | en |
|---|---|---|
| `app.name` | Parcelex | Parcelex |
| `common.back` | Zpět | Back |
| `common.cancel` | Zrušit | Cancel |
| `common.save` | Uložit | Save |
| `common.delete` | Smazat | Delete |
| `common.undo` | Vrátit | Undo |
| `common.redo` | Znovu | Redo |
| `common.close` | Zavřít | Close |
| `common.copy` | Kopírovat | Copy |
| `common.share` | Sdílet | Share |
| `common.search` | Hledat | Search |
| `common.warning` | Varování | Warning |
| `common.error` | Chyba | Error |
| `common.offline` | Offline | Offline |
| `common.optional` | nepovinné | optional |
| `units.m` | m | m |
| `units.ha` | ha | ha |
| `units.m2` | m² | m² |

## Overview

| Key | cs | en |
|---|---|---|
| `overview.title` | Přehled | Overview |
| `overview.new` | Nový zákres | New boundary |
| `overview.empty.title` | Zatím žádné zákresy | No boundaries yet |
| `overview.empty.text` | Otevřete mapu, vyjděte do pole a zaznamenejte hranice parcely. | Open the map, walk out into the field and record the parcel outline. |
| `overview.search.hint` | Hledat podle názvu nebo štítku | Search by name or label |
| `overview.count` | `{count, plural, one {1 zákres} few {# zákresy} many {# zákresu} other {# zákresů}}` | `{count, plural, one {1 boundary} other {# boundaries}}` |
| `overview.filter` | Filtrovat | Filter |
| `overview.badge.accuracy` | Prům. přesnost {m} m | Avg. accuracy {m} m |
| `overview.row.continue` | Pokračovat | Continue |
| `overview.status.in_progress` | Rozdělané | In progress |
| `overview.status.saved` | Uloženo | Saved |
| `overview.status.exported` | Exportováno | Exported |

## New boundary

| Key | cs | en |
|---|---|---|
| `new.title` | Nový zákres | New boundary |
| `new.name.label` | Název | Name |
| `new.geometry.label` | Co zakreslujete? | What are you recording? |
| `new.geometry.polygon` | Plocha | Area |
| `new.geometry.polygon.hint` | Uzavřený útvar; exportuje se i výměra. | Closed shape; area is exported too. |
| `new.geometry.line` | Čára | Line |
| `new.geometry.line.hint` | Neuzavírá se; výměra se nepočítá. | Not closed; no area is computed. |
| `new.geometry.point` | Bod | Point |
| `new.geometry.point.hint` | Jeden bod; bez výměry a obvodu. | A single point; no area or perimeter. |
| `new.label.label` | Štítek | Label |
| `new.note.label` | Poznámka | Note |
| `new.dpb.label` | Kód DPB | DPB code |
| `new.start` | Začít zaznamenávat | Start recording |
| `new.label.suggestion` | Parcela; EVP; Erozní pozemek; Mez; Remízek; Plot; Cesta; Jiné | Parcel; EVP; Erosion plot; Margin; Field belt; Fence; Track; Other |

## Recording

| Key | cs | en |
|---|---|---|
| `rec.addPoint` | Přidat bod | Add point |
| `rec.average` | Bod – průměr | Point — average |
| `rec.average.hint` | Podržte na rohu | Hold on a corner |
| `rec.finish` | Dokončit | Finish |
| `rec.status.accuracy` | Přesnost {m} m | Accuracy {m} m |
| `rec.status.points` | `{count, plural, one {1 bod} few {# body} many {# bodu} other {# bodů}}` | `{count, plural, one {1 point} other {# points}}` |
| `rec.status.area` | {ha} ha | {ha} ha |
| `rec.status.perimeter` | Obvod {m} m | Perimeter {m} m |
| `rec.status.length` | Délka {m} m | Length {m} m |
| `rec.method.manual.hint` | Na každém rohu stiskněte „Přidat bod". | Press “Add point” at every corner. |
| `rec.method.walkSimplify.hint` | Jděte podél hranice – rohy vybereme po dokončení. | Walk along the edge — corners are picked when you finish. |
| `rec.method.cornerDetect.hint` | Telefon zavibruje, když pozná odbočení. | The phone buzzes when it detects a turn. |
| `rec.averaging` | Změřeno {count}×, rozptyl {m} m | {count} fixes, spread {m} m |
| `rec.discarded` | Slabý signál – bod vynechán | Weak signal — point skipped |
| `rec.stale` | Žádný nový bod – čekejte | No new fix — waiting |
| `rec.track.show` | Ukázat procházenou stopu | Show walked track |
| `rec.track.hide` | Skrýt procházenou stopu | Hide walked track |

## Review

| Key | cs | en |
|---|---|---|
| `review.title` | Kontrola | Review |
| `review.addHere` | Přidat bod zde | Add point here |
| `review.reverse` | Prohodit směr | Reverse direction |
| `review.hint` | Tahem bod upravte, dlouhým stiskem smažete. | Drag a point to move it, long-press to delete. |
| `review.vertices` | `{count, plural, one {1 bod} few {# body} many {# bodu} other {# bodů}}` | `{count, plural, one {1 vertex} other {# vertices}}` |
| `review.warning.closing` | Uzavírací chyba {m} m – začátek a konec se netrefují. | Closing error {m} m — start and end do not meet. |
| `review.warning.selfIntersection` | Hranice se protíná. | The outline crosses itself. |
| `review.warning.spread` | Rozptyl {m} m – bod není jistý. | Spread {m} m — this point is unsure. |
| `review.save` | Uložit zákres | Save boundary |

## Detail and export

| Key | cs | en |
|---|---|---|
| `detail.tab.text` | Text do iLPIS | iLPIS text |
| `detail.tab.shp` | SHP | SHP |
| `detail.tab.kml` | KML | KML |
| `detail.area.info` | Výměra je orientační; úřední je výměra z LPIS. | The area is informational; the official figure is LPIS's. |
| `detail.extend` | Pokračovat v zaznamenávání | Continue recording |
| `detail.kml.warning` | KML v iLPIS vytvoří jen pracovní vrstvu, ne zákres. | In iLPIS, KML creates only a working layer, not a boundary. |
| `detail.guide.title` | Jak to vložit do iLPIS | How to paste this into iLPIS |
| `detail.guide.step1` | V iLPIS otevřete zákres a zvolte „Nový zákres ze souřadnic". | In iLPIS open the drawing panel and choose “New boundary from coordinates”. |
| `detail.guide.step2` | Přepněte na záložku „Zadat souřadnice". | Switch to the “Enter coordinates” tab. |
| `detail.guide.step3` | Zkopírovaný text vložte do pole. | Paste the copied text into the field. |
| `detail.guide.step4` | Typ zákresu (LZ, FHPAR, EVP…) vyberte až tady v iLPIS. | Choose the feature type (LZ, FHPAR, EVP…) there, in iLPIS. |
| `detail.guide.step5` | Zkontrolujte vykreslený útvar a uložte. | Check the drawn shape and save. |

## Settings

| Key | cs | en |
|---|---|---|
| `settings.title` | Nastavení | Settings |
| `settings.method` | Způsob zaznamenávání | Capture method |
| `settings.method.manual` | Ručně – přidávám body | Manual — I add points |
| `settings.method.walkSimplify` | Procházet a zjednodušit | Walk and simplify |
| `settings.method.cornerDetect` | Automatické rohy | Automatic corners |
| `settings.accuracy` | Práh přesnosti | Accuracy threshold |
| `settings.decimals` | Desetinná místa | Decimal places |
| `settings.closePolygon` | Uzavírat polygon | Close polygon |
| `settings.basemap` | Mapa | Map |
| `settings.basemap.osm` | OpenStreetMap | OpenStreetMap |
| `settings.basemap.mapyBasic` | Mapy – mapa | Mapy – map |
| `settings.basemap.mapyAerial` | Mapy – letecký snímek | Mapy – aerial |
| `settings.overlay.cuzk` | ČÚZK – katastr | ČÚZK – cadastral |
| `settings.language` | Jazyk | Language |
| `settings.language.system` | Podle telefonu | System default |
| `settings.key.ok` | Klíč Mapy.com funguje | Mapy.com key works |
| `settings.key.missing` | Bez klíče – používám OSM a ČÚZK | No key — using OSM and ČÚZK |
| `settings.backup.export` | Zálohovat | Back up |
| `settings.backup.import` | Obnovit ze zálohy | Restore from backup |
| `settings.version` | Verze | Version |

# Permissions

Asked once, when the user starts recording (F39). The rationale screen is ours; the system prompt is
Android's and is not translated here.

| Key | cs | en |
|---|---|---|
| `perm.rationale.title` | Přístup k poloze | Location access |
| `perm.rationale.text` | Parcelex potřebuje znát vaši polohu, aby zaznamenal hranice pozemku. Poloha zůstává pouze v telefonu. | Parcelex needs your location to record the edge of a field. Location stays on your phone. |
| `perm.rationale.cta` | Povolit přístup k poloze | Allow location access |
| `perm.denied.title` | Chybí přístup k poloze | Location access is off |
| `perm.denied.text` | Bez přístupu k poloze Parcelex nezměří žádný bod. Povolte prosím alespoň přesnou polohu. | Without location access Parcelex cannot record a point. Please allow at least precise location. |
| `perm.coarse.title` | Jen přibližná poloha | Approximate location only |
| `perm.coarse.text` | Přibližná poloha se pro měření hranic nehodí – odchylka je v kilometrech. Povolte prosím přesnou polohu. | Approximate location is unusable for boundary work — it is kilometres off. Please allow precise location. |
| `perm.settings` | Otevřít nastavení | Open settings |

## Back button

Intercepted everywhere (F40). Back never saves and never deletes.

| Key | cs | en |
|---|---|---|
| `back.exit.title` | Ukončit Parcelex? | Leave Parcelex? |
| `back.exit.confirm` | Odejít | Leave |
| `back.exit.cancel` | Zůstat | Stay |
| `back.recording.title` | Měření probíhá | Recording in progress |
| `back.recording.text` | `{count, plural, one {Máte zatím 1 bod.} few {Máte zatím # body.} many {Máte zatím # bodu.} other {Máte zatím # bodů.}}` | `{count, plural, one {You have 1 point so far.} other {You have # points so far.}}` |
| `back.recording.keep` | Pokračovat v měření | Keep recording |

## Errors and recovery

| Key | cs | en |
|---|---|---|
| `error.noGps` | Telefon nemá signál GPS – počkejte chvíli. | The phone has no GPS fix — wait a moment. |
| `error.storage` | Nepodařilo se uložit do databáze. | Could not write to the database. |
| `crash.recover.title` | Nedokončený zákres | Unfinished boundary |
| `crash.recover.text` | Máte nedokončený zákres „{name}". Chcete pokračovat? | You have an unfinished boundary “{name}”. Continue? |
| `crash.recover.continue` | Pokračovat | Continue |
| `crash.recover.discard` | Zahodit | Discard |
