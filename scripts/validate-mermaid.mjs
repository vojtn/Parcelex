/**
 * Ověří, že všechny mermaid bloky v Markdown dokumentaci skutečně projdou parserem.
 *
 * Důvod: mermaid neodhalí chybu v diagramu do okamžiku, než se vykreslí – a to bývá až
 * při čtení dokumentace. Tento skript ji odhalí dřív.
 *
 * Spuštění (až po `npm install`, tj. od milníku M0; potřebuje devDeps mermaid + jsdom):
 *   node scripts/validate-mermaid.mjs docs/*.md
 * Vrací exit kód 1 při jakékoli chybě parse, takže se dá zařadit do CI.
 */
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><body></body>', { pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.Element = dom.window.Element;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.HTMLElement = dom.window.HTMLElement;

const mermaid = (await import('mermaid')).default;
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });

const soubory = process.argv.slice(2);
if (soubory.length === 0) {
  console.error('použití: node scripts/validate-mermaid.mjs <soubor.md> ...');
  process.exit(2);
}

let celkem = 0;
let spatne = 0;

for (const soubor of soubory) {
  const md = readFileSync(soubor, 'utf8');
  const re = /```mermaid\r?\n([\s\S]*?)```/g;
  let m;
  let i = 0;
  while ((m = re.exec(md)) !== null) {
    i += 1;
    celkem += 1;
    const code = m[1];
    const radek = md.slice(0, m.index).split(/\r?\n/).length;
    const typ = code.split(/\r?\n/)[0].trim();
    try {
      await mermaid.parse(code);
      console.log(`OK    ${soubor}:${radek}  blok #${i} (${typ})`);
    } catch (e) {
      spatne += 1;
      console.error(`CHYBA ${soubor}:${radek}  blok #${i} (${typ})`);
      console.error(
        String(e?.message ?? e)
          .split('\n')
          .slice(0, 8)
          .map((l) => '        ' + l)
          .join('\n'),
      );
    }
  }
}

console.log('---------------------------------');
console.log(`celkem bloků: ${celkem}, chyb: ${spatne}`);
process.exit(spatne > 0 ? 1 : 0);
