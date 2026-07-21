// Workaround for a rolldown 1.1.3 code-splitting bug (rolldown/rolldown#8809,
// #8184). When splitting the SSR bundle, rolldown emits a chunk that both
// imports the `__exportAll` runtime helper (aliased) AND declares a local copy
// that it re-exports — but a top-level use of the local copy is emitted BELOW
// its `var` declaration:
//
//   import { __exportAll as __exportAll$1 } from "../_runtime.mjs";      // line 1
//   var server_exports = __exportAll({ setCookie: () => setCookie$1 });  // line ~1609  (uses local, undefined here)
//   var router_exports = __exportAll$1({ __exportAll: () => __exportAll, ... });  // re-exports the local copy
//   var __exportAll = (all, no_symbols) => { ... };                      // line ~1624  (local def)
//
// `var` hoists the name but not the value, so the local `__exportAll` is
// `undefined` at the early call site and the built server crashes at boot with
// "TypeError: __exportAll is not a function" (every request 500s). No rolldown
// output option or newer release (checked through 1.2.0) avoids it.
//
// The imported alias (`__exportAll$1`) is the same runtime helper and is already
// available at the top of the module. This renderChunk pass repoints only the
// call sites that occur BEFORE the local declaration onto that import. The local
// `var __exportAll` is left intact (it is re-exported and used after its own
// definition). Remove once rolldown ships the upstream fix.
import type { Plugin } from "vite";

const LOCAL_DEF = /\bvar __exportAll = \(all, no_symbols\) =>/;
const IMPORT_ALIAS = /import\s*\{[^}]*\b__exportAll as (__exportAll\$\d+)\b[^}]*\}\s*from/;
// A bare `__exportAll(` call: `__exportAll` immediately followed by `(`, not
// preceded by an identifier/member/`$` char (so `__exportAll$1(` and
// `x.__exportAll(` do not match, only the bare local helper call).
const BARE_CALL = /(?<![\w.$])__exportAll\(/g;

export function fixRolldownExportAll(): Plugin {
	return {
		name: "fix-rolldown-exportall",
		renderChunk(code) {
			const def = code.match(LOCAL_DEF);
			if (!def || def.index === undefined) return null;
			const defPos = def.index;

			const alias = code.match(IMPORT_ALIAS)?.[1];
			if (!alias) return null; // no safe helper to repoint onto

			let changed = false;
			const patched = code.replace(BARE_CALL, (match, offset: number) => {
				if (offset < defPos) {
					changed = true;
					return `${alias}(`;
				}
				return match;
			});
			if (!changed) return null; // no use-before-def in this chunk

			return { code: patched, map: null };
		},
	};
}
