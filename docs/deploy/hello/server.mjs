// Rig-proof hello-world server for wayfinder #7.
//
// Zero dependencies (Node built-in http + fs only) so it builds and boots
// without npm install, sidestepping the real app's __exportAll runtime 500
// (that bug is Go live / #24's problem). Its only job is to prove the Coolify
// rig end to end: the image builds, the container serves on $PORT, the domain
// routes to it over HTTPS, and the /data volume persists across redeploys.
//
// Persistence proof: every request bumps a counter stored in a file under
// $DATA_DIR (the mounted volume). Redeploy the app and the count must keep
// climbing from where it was, not reset to 1 — that is the persisted "DB file".

import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = process.env.DATA_DIR || "/data";
const COUNTER = join(DATA_DIR, "rig-visits.txt");

mkdirSync(DATA_DIR, { recursive: true });

function bump() {
	let n = 0;
	try {
		n = Number.parseInt(readFileSync(COUNTER, "utf8"), 10) || 0;
	} catch {
		n = 0;
	}
	n += 1;
	writeFileSync(COUNTER, String(n));
	return n;
}

createServer((req, res) => {
	if (req.url === "/health") {
		res.writeHead(200, { "content-type": "text/plain" });
		res.end("ok");
		return;
	}
	const visits = bump();
	res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
	res.end(
		[
			"Alfredo rig OK",
			"",
			`served from: ${DATA_DIR} (persisted volume)`,
			`persisted visit count: ${visits}`,
			"",
			"Redeploy this app and reload — the count must keep climbing,",
			"not reset to 1. That proves the sqlite DB file will persist.",
		].join("\n"),
	);
}).listen(PORT, () => {
	console.log(`rig hello-world listening on :${PORT}, data at ${DATA_DIR}`);
});
