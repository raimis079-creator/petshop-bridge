import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const code = Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zYW1wX2luc3BlY3QyJ10pICkgcmV0dXJuOwogIGlmICggKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyApIHsgc3RhdHVzX2hlYWRlcig0MDMpOyBlY2hvICdubyc7IGV4aXQ7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRnZXQgPSBmdW5jdGlvbigkc2x1Zyl7CiAgICAkcCA9IGdldF9wYWdlX2J5X3BhdGgoJHNsdWcsIE9CSkVDVCwgJ3lpdGhfd2Nhbl9wcmVzZXQnKTsKICAgIGlmKCEkcCkgcmV0dXJuIG51bGw7CiAgICAkZiA9IGdldF9wb3N0X21ldGEoJHAtPklELCdfZmlsdGVycycsdHJ1ZSk7CiAgICBpZihpc19zdHJpbmcoJGYpKSAkZiA9IG1heWJlX3Vuc2VyaWFsaXplKCRmKTsKICAgIHJldHVybiBpc19hcnJheSgkZikmJmlzc2V0KCRmWzFdKSA/ICRmWzFdIDogbnVsbDsKICB9OwogICRkID0gJGdldCgnZHJhc2t5a2xpdS1maWx0cmFzJyk7CiAgJHMgPSAkZ2V0KCdzYW1wdW51LWZpbHRyYXMnKTsKICAkZGlmZiA9IGFycmF5KCk7CiAgaWYoaXNfYXJyYXkoJGQpJiZpc19hcnJheSgkcykpewogICAgJGtleXMgPSBhcnJheV91bmlxdWUoYXJyYXlfbWVyZ2UoYXJyYXlfa2V5cygkZCksYXJyYXlfa2V5cygkcykpKTsKICAgIGZvcmVhY2goJGtleXMgYXMgJGspewogICAgICAkZHYgPSAkZFska10gPz8gJyhuaWwpJzsgJHN2ID0gJHNbJGtdID8/ICcobmlsKSc7CiAgICAgIGlmKGlzX2FycmF5KCRkdikpICRkdj0nW2FycmF5ICcuY291bnQoJGR2KS4nXSc7IGlmKGlzX2FycmF5KCRzdikpICRzdj0nW2FycmF5ICcuY291bnQoJHN2KS4nXSc7CiAgICAgIGlmKCRkdiAhPT0gJHN2KSAkZGlmZlska109YXJyYXkoJ2RyYXNrJz0+JGR2LCdzYW1wJz0+JHN2KTsKICAgIH0KICB9CiAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZHJhc2tfZjEnPT4kZCwnc2FtcF9mMSc9PiRzLCdESUZGJz0+JGRpZmYpKTsKICBleGl0Owp9LCA5OSk7Cg==","base64").toString("utf8");
const out = {};
// update 488 su nauja logika (vienintele code-snippets op)
fs.writeFileSync("/tmp/upd.json", JSON.stringify({ id:488, name:"TEMP Samp Inspect", code, scope:"global", active:true }));
try { out.update=execSync(`curl -sk -o /tmp/u.txt -w "%{http_code}" --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "${base}/wp-json/code-snippets/v1/snippets/488"`,{encoding:"utf8",env}).trim(); } catch(e){ out.update_err=(e.stderr||String(e)).slice(0,100); }
try { execSync("sleep 2"); out.data=execSync(`curl -sk --max-time 40 "${base}/?ps_samp_inspect2=1&k=ps2026"`,{encoding:"utf8",env,maxBuffer:5*1024*1024}); } catch(e){ out.run_err=String(e).slice(0,90); }
fs.writeFileSync("screenshots/samp_diff.txt", JSON.stringify(out,null,1));
