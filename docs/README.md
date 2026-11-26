# Parcelex documentation

Three phases — analysis, specification, implementation — and one document per question:
| Document | Answers |
|---|---|
| [analysis.md](./analysis.md) | what we found out, what the user wants (user stories), what technology is available, what can go wrong |
| [specification.md](./specification.md) | how it will be built: decisions, normative rules, data model, formats, implementation |
| [lpis-findings.md](./lpis-findings.md) | evidence from the 67-page iLPIS manual — the target system, not our design |
| [ui-text.md](./ui-text.md) | the exact Czech wording of every screen, with English translation |
| [timeline.md](./timeline.md) | milestones M0–M8, open items, what is deliberately not scheduled |
| [CHANGELOG.md](./CHANGELOG.md) | what changed between working sessions, including reversed decisions |

Documentation files describe the **current state only**. History goes to `CHANGELOG.md`.

**Our object is a `boundary`** — Czech UI label *zákres*. The word "measurement" is reserved for what
iLPIS itself calls it (e.g. its "New measurement from coordinates" tab) and is not our term.

## Where a new fact goes

| You have | It belongs in |
|---|---|
| something the user wants | analysis §2, as a user story |
| a constraint or research result | analysis §4 or §5 |
| a risk | analysis §6 |
| a precise rule the software must follow | specification §B |
| the wording of a button, label or message | ui-text.md (and then the JSON files) |
| an implementation detail, decided beforehand **or discovered while building** | specification §E |
| a decision that changes the shape of the system | specification §A |
| "we used to think X, now Y" | CHANGELOG.md |
| a change of plan or schedule | timeline.md |

If a sentence starts with *because*, *we considered*, *originally* or *the reason is*, it is not
specification text.

## Stable identifiers

| Kind | Format | Defined in |
|---|---|---|
| Requirement / user story | `F1`, `F1b`, `F9a`, … | [analysis §2](./analysis.md#2-user-stories) |
| Risk | `R1`–`R15` | [analysis §6](./analysis.md#6-risks) |
| Milestone | `M0`–`M8` | [timeline](./timeline.md#milestones) |
| UI text key | `rec.addPoint`, `overview.new`, … | [ui-text.md](./ui-text.md) |

IDs are never reused or renumbered. A dropped requirement keeps its ID and is listed as rejected.

## The model is documented at four levels

| Level | Where | Question | Notation |
|---|---|---|---|
| Ours | spec [C.1](./specification.md#c1-our-model) | the four concepts the app has: boundary, vertex, track point, settings | `erDiagram` |
| Registry context | spec [C.2](./specification.md#c2-registry-context--deliberately-not-in-the-model) | the world `dpb_code` points into — drawn so we can say what we are *not* storing | `erDiagram` |
| Relational | spec [E.2](./specification.md#e2-data-model) | what we store, and why nothing else | `classDiagram` |
| Data | spec [E.2](./specification.md#e2-data-model) | DDL, types, indexes, constraints | SQL |

C.2 may hold entities that never reach the database (`PB`, `DPB`, `ZP`, `EVP` — we have no registry
data); E.2 explains why other obvious table candidates (`in_progress`, `sample`, `photo`) are not
tables.

## Language

Documentation and all code/database identifiers are **English**. The **app UI is localised** with
Czech as the primary language and English shipped alongside it — see
[ui-text.md](./ui-text.md) for the wording and [specification §B.5](./specification.md#b5-localisation)
for the rules. Czech domain acronyms (LPIS, DPB, PB, ZP, EVP, FHPAR) stay untranslated in every
language: they are registry vocabulary, not prose.

## Validating diagrams

Mermaid does not report a broken diagram until someone renders it, i.e. while reading the docs.
[../scripts/validate-mermaid.mjs](../scripts/validate-mermaid.mjs) extracts every ` ```mermaid `
block and parses it with the real parser:

```powershell
npm install -D mermaid jsdom
node scripts/validate-mermaid.mjs docs/*.md
```

Exit code 1 on any error, so it belongs in CI. From M0 it becomes the npm script `docs:lint`.

## Conventions

* Files are edited **in place**; no dated copies.
* Anything discovered that changes the implementation is written down immediately, not at
  implementation time.
* Original task notes stay outside `docs/`: [../plan.md](../plan.md) and [../lpis.md](../lpis.md).
