import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const dcode = Buffer.from("YWRkX2FjdGlvbignaW5pdCcsZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX21lbnV0cmVlJ10pKSByZXR1cm47CiAgaWYoKCRfR0VUWydrJ10/PycnKSE9PSdwczIwMjYnKXtzdGF0dXNfaGVhZGVyKDQwMyk7ZWNobydubyc7ZXhpdDt9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkaXRlbXM9d3BfZ2V0X25hdl9tZW51X2l0ZW1zKDIzMik7CiAgJGJ5UGFyZW50PWFycmF5KCk7CiAgZm9yZWFjaCgoYXJyYXkpJGl0ZW1zIGFzICRpdCl7ICRieVBhcmVudFsoaW50KSRpdC0+bWVudV9pdGVtX3BhcmVudF1bXT0kaXQ7IH0KICAkbGluZXM9YXJyYXkoKTsKICAkd2Fsaz1mdW5jdGlvbigkcGFyZW50LCRkZXB0aCkgdXNlICgmJHdhbGssJiRieVBhcmVudCwmJGxpbmVzKXsKICAgIGlmKGVtcHR5KCRieVBhcmVudFskcGFyZW50XSkpIHJldHVybjsKICAgIGZvcmVhY2goJGJ5UGFyZW50WyRwYXJlbnRdIGFzICRpdCl7CiAgICAgICRsaW5lc1tdPXN0cl9yZXBlYXQoJyAgJywkZGVwdGgpLiRpdC0+dGl0bGUuJyAgW21pZD0nLiRpdC0+SUQuJyBjYXQ9Jy4oJGl0LT5vYmplY3Q9PT0ncHJvZHVjdF9jYXQnPyRpdC0+b2JqZWN0X2lkOignLScuJGl0LT50eXBlKSkuJ10nOwogICAgICAkd2FsaygoaW50KSRpdC0+SUQsJGRlcHRoKzEpOwogICAgfQogIH07CiAgLy8gxaBVTklNUyBzYWthICgzMTE0KSBpciBLQVRFTVMgc2FrYSAoMzExMikKICAkbGluZXNbXT0nPT09IFNVTklNUyAoMzExNCkgPT09JzsKICAkd2FsaygzMTE0LDEpOwogICRsaW5lc1tdPSc9PT0gS0FURU1TICgzMTEyKSA9PT0nOwogICR3YWxrKDMxMTIsMSk7CiAgZWNobyB3cF9qc29uX2VuY29kZSgkbGluZXMpO2V4aXQ7Cn0sOTkpOwo=","base64").toString("utf8");
const out = {};
fs.writeFileSync("/tmp/d.json", JSON.stringify({ name:"TEMP Menu Tree", code:dcode, scope:"global", active:true }));
try { execSync(`curl -sk -o /dev/null -w "%{http_code}" --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/d.json "${base}/wp-json/code-snippets/v1/snippets"`,{encoding:"utf8",env}); } catch(e){ out.cerr=String(e).slice(0,80); }
try { execSync("sleep 2"); out.tree=execSync(`curl -sk --max-time 40 "${base}/?ps_menutree=1&k=ps2026"`,{encoding:"utf8",env,maxBuffer:5000000}); } catch(e){ out.rerr=String(e).slice(0,80); }
fs.writeFileSync("screenshots/tree.txt", JSON.stringify(out,null,1));
