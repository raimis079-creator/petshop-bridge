import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
try {
  const dry = execSync(`curl -sk --max-time 55 "${base}/?petshop_attr_drask=dry&k=ps2026"`,{encoding:"utf8",env,maxBuffer:10*1024*1024});
  const rows = [...dry.matchAll(/<tr><td>(\d+)<\/td><td>(.*?)<\/td><td class="\w+">(\w+)<\/td>/g)];
  out.review = rows.filter(r=>r[3]==='REVIEW').map(r=>({id:r[1], name:r[2].replace(/&[a-z]+;/g,'')}));
} catch(e){ out.err=(e.stderr||String(e)).slice(0,120); }
fs.writeFileSync("screenshots/drask_review.txt", JSON.stringify(out,null,2));
