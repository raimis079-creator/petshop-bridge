import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const makerPhp = Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19tYWtlX2tyYWlrdV9wcmVzZXQnXSkgKSByZXR1cm47CiAgaWYgKCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICkgeyBzdGF0dXNfaGVhZGVyKDQwMyk7IGVjaG8gJ25vJzsgZXhpdDsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJHRwbCA9IGdldF9wYWdlX2J5X3BhdGgoJ2R1YmVuZWxpdS1maWx0cmFzJywgT0JKRUNULCAneWl0aF93Y2FuX3ByZXNldCcpOwogIGlmKCEkdHBsKXsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyb3InPT4nbm8gdHBsJykpOyBleGl0OyB9CiAgJGYgPSBnZXRfcG9zdF9tZXRhKCR0cGwtPklELCdfZmlsdGVycycsdHJ1ZSk7CiAgaWYoaXNfc3RyaW5nKCRmKSkgJGYgPSBtYXliZV91bnNlcmlhbGl6ZSgkZik7CiAgaWYoIWlzX2FycmF5KCRmKSl7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycm9yJz0+J2JhZCBmaWx0ZXJzJykpOyBleGl0OyB9CiAgJGYxID0gJGZbMV07ICRmMVsndGF4b25vbXknXT0ncGFfa3JhaWtvX3RpcGFzJzsgJGYxWyd0aXRsZSddPSdLcmFpa28gdGlwYXMnOyAkZjFbJ3RvZ2dsZV9zdHlsZSddPSdvcGVuZWQnOwogICRmMiA9ICRmWzJdOyAkZjJbJ3RheG9ub215J109J3BhX2t2YXBhcyc7ICRmMlsndGl0bGUnXT0nS3ZhcGFzJzsgJGYyWyd0b2dnbGVfc3R5bGUnXT0nY2xvc2VkJzsKICAkZjMgPSAkZlszXTsKICAkbmYgPSBhcnJheSgxPT4kZjEsIDI9PiRmMiwgMz0+JGYzKTsKICAkZXggPSBnZXRfcGFnZV9ieV9wYXRoKCdrcmFpa3UtZmlsdHJhcycsIE9CSkVDVCwgJ3lpdGhfd2Nhbl9wcmVzZXQnKTsKICAkcGlkID0gJGV4ID8gJGV4LT5JRCA6IHdwX2luc2VydF9wb3N0KGFycmF5KCdwb3N0X3RpdGxlJz0+IktyYWlrXHV7MDE3M30gZmlsdHJhcyIsJ3Bvc3RfbmFtZSc9PidrcmFpa3UtZmlsdHJhcycsJ3Bvc3RfdHlwZSc9Pid5aXRoX3djYW5fcHJlc2V0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcpKTsKICBpZighJHBpZCB8fCBpc193cF9lcnJvcigkcGlkKSl7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycm9yJz0+J2luc2VydCBmYWlsJykpOyBleGl0OyB9CiAgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfZW5hYmxlZCcsJ3llcycpOwogIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX2xheW91dCcsJ2RlZmF1bHQnKTsKICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19maWx0ZXJzJywkbmYpOwogIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ3ByZXNldF9pZCc9PiRwaWQsJ3NsdWcnPT4na3JhaWt1LWZpbHRyYXMnLCdmaWx0ZXJzJz0+Y291bnQoJG5mKSkpOwogIGV4aXQ7Cn0sIDk5KTsK","base64").toString("utf8");
const out = {};
fs.writeFileSync("/tmp/mk.json", JSON.stringify({ name:"Petshop Kraiku Preset Maker TEMP2", code: makerPhp, scope:"global", active:true }));
try {
  const cr = execSync(`curl -sk -o /tmp/cr.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/mk.json "${base}/wp-json/code-snippets/v1/snippets"`,{encoding:"utf8",env}).trim();
  out.maker_create = cr;
  try { const j=JSON.parse(fs.readFileSync("/tmp/cr.txt","utf8")); out.maker_id=j.id; out.active=j.active; } catch(e){ out.head=fs.readFileSync("/tmp/cr.txt","utf8").slice(0,150); }
} catch(e){ out.err=String(e).slice(0,120); }
try { execSync("sleep 2"); const r = execSync(`curl -sk --max-time 30 "${base}/?ps_make_kraiku_preset=1&k=ps2026"`,{encoding:"utf8",env}); out.preset = r.slice(0,250); } catch(e){ out.preset_err=String(e).slice(0,120); }
if(out.maker_id){ try { execSync(`curl -sk -o /dev/null --max-time 20 -u "$WP_USER:$WP_PASS_CLEAN" -X DELETE "${base}/wp-json/code-snippets/v1/snippets/${out.maker_id}"`,{encoding:"utf8",env}); out.maker_deactivated=true; } catch(e){} }
fs.writeFileSync("screenshots/kraiku_preset2.txt", JSON.stringify(out,null,2));
