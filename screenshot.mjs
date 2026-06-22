import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out={};
try {
  const html=execSync(`curl -sk --max-time 40 "${base}/kategorija/sunims/sukos-sepeciai-zirkles-sunims/"`,{encoding:"utf8",env,maxBuffer:15*1024*1024});
  out.titles=[...html.matchAll(/filter-title">([^<]+)</g)].map(m=>m[1]);
  const pm=html.match(/preset_(\d+)/); out.preset=pm?pm[1]:'none';
  const tm=html.match(/data-taxonomy="([^"]+)"/g); out.taxonomies=tm?tm.slice(0,4):[];
} catch(e){ out.err=String(e).slice(0,80); }
// patikra ar suku-filtras presetas egzistuoja per code-snippets nera; tikrinam per WP REST yith? ne. Pamatuojam per titulus.
fs.writeFileSync("screenshots/titles.txt", JSON.stringify(out,null,1));
