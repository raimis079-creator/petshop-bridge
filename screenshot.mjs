import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const code = Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc195aXRoX2ZsdXNoJ10pICkgcmV0dXJuOwogIGlmICggKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyApIHsgc3RhdHVzX2hlYWRlcig0MDMpOyBlY2hvICdubyc7IGV4aXQ7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsKICAkbiA9ICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdcX3RyYW5zaWVudFxfeWl0aFxfd2NhbiUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ1xfdHJhbnNpZW50XF90aW1lb3V0XF95aXRoXF93Y2FuJSciKTsKICBkZWxldGVfdHJhbnNpZW50KCd3Y19hdHRyaWJ1dGVfdGF4b25vbWllcycpOwogIGlmICggZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9mbHVzaCcpICkgd3BfY2FjaGVfZmx1c2goKTsKICAvLyBZSVRIIGNhY2hlIGhlbHBlciwgamVpIHlyYQogIGlmICggY2xhc3NfZXhpc3RzKCdZSVRIX1dDQU5fQ2FjaGVfSGVscGVyJykgJiYgbWV0aG9kX2V4aXN0cygnWUlUSF9XQ0FOX0NhY2hlX0hlbHBlcicsJ2ZsdXNoJykgKSB7CiAgICBZSVRIX1dDQU5fQ2FjaGVfSGVscGVyOjpmbHVzaCgpOwogIH0KICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdkZWxldGVkX3RyYW5zaWVudHMnPT4oaW50KSRuLCAnZmx1c2hlZCc9PnRydWUpKTsKICBleGl0Owp9LCA5OSk7Cg==","base64").toString("utf8");
const out = {};
fs.writeFileSync("/tmp/snip.json", JSON.stringify({ name:"TEMP YITH Flush", code, scope:"global", active:true }));
try { const cr=execSync(`curl -sk -o /tmp/cr.txt -w "%{http_code}" --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/snip.json "${base}/wp-json/code-snippets/v1/snippets"`,{encoding:"utf8",env}).trim(); out.create=cr; try{out.flush_id=JSON.parse(fs.readFileSync("/tmp/cr.txt","utf8")).id;}catch(e){} } catch(e){ out.create_err=(e.stderr||String(e)).slice(0,100); }
try { execSync("sleep 2"); out.flush = execSync(`curl -sk --max-time 40 "${base}/?ps_yith_flush=1&k=ps2026"`,{encoding:"utf8",env}).slice(0,200); } catch(e){ out.flush_err=(e.stderr||String(e)).slice(0,100); }
// screenshots abieju kategoriju
const b = await chromium.launch({ args:["--no-sandbox"] });
const ctx = await b.newContext({ viewport:{width:760,height:1200}, ignoreHTTPSErrors:true });
for(const [tag,url] of [["drask","https://dev.avesa.lt/kategorija/katems/draskykles-katems/"],["samp","https://dev.avesa.lt/kategorija/sunims/sampunai-sunims/"]]){
  try {
    const page=await ctx.newPage();
    await page.goto(url,{waitUntil:"networkidle",timeout:60000});
    await page.waitForTimeout(3000);
    await page.screenshot({ path:`screenshots/cmp_${tag}.png`, clip:{x:0,y:120,width:470,height:620} });
    await page.close();
  } catch(e){ out[tag+"_err"]=String(e).slice(0,80); }
}
await b.close();
fs.writeFileSync("screenshots/yith_flush.txt", JSON.stringify(out,null,1));
