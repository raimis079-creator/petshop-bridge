import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const dcode = Buffer.from("YWRkX2FjdGlvbignaW5pdCcsZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX21lbnUnXSkpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpe3N0YXR1c19oZWFkZXIoNDAzKTtlY2hvJ25vJztleGl0O30KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvdXQ9YXJyYXkoJ21lbnVzJz0+YXJyYXkoKSk7CiAgZm9yZWFjaCh3cF9nZXRfbmF2X21lbnVzKCkgYXMgJG0pewogICAgJGl0ZW1zPXdwX2dldF9uYXZfbWVudV9pdGVtcygkbS0+dGVybV9pZCk7CiAgICAkY2F0cz1hcnJheSgpOwogICAgZm9yZWFjaCgoYXJyYXkpJGl0ZW1zIGFzICRpdCl7CiAgICAgIGlmKCRpdC0+b2JqZWN0PT09J3Byb2R1Y3RfY2F0Jyl7CiAgICAgICAgJGNhdHNbXT1hcnJheSgnbWlkJz0+JGl0LT5JRCwndGl0bGUnPT4kaXQtPnRpdGxlLCdjYXQnPT4oaW50KSRpdC0+b2JqZWN0X2lkLCdwYXJlbnRfbWlkJz0+KGludCkkaXQtPm1lbnVfaXRlbV9wYXJlbnQpOwogICAgICB9CiAgICB9CiAgICAkb3V0WydtZW51cyddW109YXJyYXkoJ25hbWUnPT4kbS0+bmFtZSwndGVybV9pZCc9PiRtLT50ZXJtX2lkLCd0b3RhbF9pdGVtcyc9PmNvdW50KChhcnJheSkkaXRlbXMpLCdjYXRfaXRlbXMnPT4kY2F0cyk7CiAgfQogIC8vIGt1ciA3NSBpciA2MzkgaXIgNzcgbWVuaXUKICBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpO2V4aXQ7Cn0sOTkpOwo=","base64").toString("utf8");
const out = {};
fs.writeFileSync("/tmp/d.json", JSON.stringify({ name:"TEMP Menu Diag", code:dcode, scope:"global", active:true }));
try { execSync(`curl -sk -o /tmp/dr.txt -w "%{http_code}" --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/d.json "${base}/wp-json/code-snippets/v1/snippets"`,{encoding:"utf8",env}); try{out.diag_id=JSON.parse(fs.readFileSync("/tmp/dr.txt","utf8")).id;}catch(e){} } catch(e){ out.cerr=String(e).slice(0,80); }
try { execSync("sleep 2"); out.menus=execSync(`curl -sk --max-time 40 "${base}/?ps_menu=1&k=ps2026"`,{encoding:"utf8",env,maxBuffer:10000000}); } catch(e){ out.merr=String(e).slice(0,80); }
fs.writeFileSync("screenshots/menus.txt", JSON.stringify(out,null,1));
