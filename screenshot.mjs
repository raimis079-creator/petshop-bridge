import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out={};
try { out.rebuild = execSync(`curl -sk --max-time 40 "${base}/?ps_rebuild_samp=1&k=ps2026"`,{encoding:"utf8",env}).slice(0,600); } catch(e){ out.rebuild_err=String(e).slice(0,90); }
try { out.inspect = execSync(`curl -sk --max-time 40 "${base}/?ps_samp_inspect=1&k=ps2026"`,{encoding:"utf8",env}).slice(0,800); } catch(e){ out.inspect_err=String(e).slice(0,90); }
fs.writeFileSync("screenshots/samp_diag2.txt", JSON.stringify(out,null,1));
