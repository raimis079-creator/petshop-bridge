import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
try { out.run = execSync(`curl -sk --max-time 40 "${base}/?ps_make_sampunai_preset=1&k=ps2026"`,{encoding:"utf8",env}).slice(0,300); } catch(e){ out.run_err=(e.stderr||String(e)).slice(0,100); }
fs.writeFileSync("screenshots/samp_preset2.txt", JSON.stringify(out,null,1));
