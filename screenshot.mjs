import { execSync } from 'child_process';
import { chromium } from 'playwright';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// ★ Senu TEMP snippet'u valymas — kitaip senas atsako i ta pati rakta.
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjggUGFnZSBDcmVhdGUg4oCUIC9hdWdpbnRpbmlvLXByb2ZpbGlzLwogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfcGc4J10pIHx8ICRfR0VUWydwc19wZzgnXSAhPT0gJ1BnOGszJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidwYWdlLWNyZWF0ZS12MScpOwogICAgJFNMVUcgPSAnYXVnaW50aW5pby1wcm9maWxpcyc7CgogICAgLy8gMSkgYXIgamF1IHlyYSAoaWRlbXBvdGVudGlza3VtYXMg4oCUIGthcnRvdGluaXMgcnVuJ2FzIG5la3VyaWEgYW50cm8pCiAgICAkZXNhbWFzID0gZ2V0X3BhZ2VfYnlfcGF0aCgkU0xVRyk7CiAgICBpZiAoJGVzYW1hcykgewogICAgICAgICRyWydqYXVfYnV2byddID0gJGVzYW1hcy0+SUQ7CiAgICAgICAgJHJbJ3VybCddID0gZ2V0X3Blcm1hbGluaygkZXNhbWFzLT5JRCk7CiAgICAgICAgJHJbJ3N0YXR1c2FzJ10gPSAkZXNhbWFzLT5wb3N0X3N0YXR1czsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KCiAgICAvLyAyKSBrdXJpYW0KICAgICRpZCA9IHdwX2luc2VydF9wb3N0KGFycmF5KAogICAgICAgICdwb3N0X3RpdGxlJyAgID0+ICdBdWdpbnRpbmlvIHByb2ZpbGlzJywgICAvLyBXUCBhZG1pbmlzdHJhdmltdWkKICAgICAgICAncG9zdF9uYW1lJyAgICA9PiAkU0xVRywKICAgICAgICAncG9zdF9jb250ZW50JyA9PiAnW3BldHNob3BfcGV0X2Zvcm1dJywKICAgICAgICAncG9zdF9zdGF0dXMnICA9PiAncHVibGlzaCcsCiAgICAgICAgJ3Bvc3RfdHlwZScgICAgPT4gJ3BhZ2UnLAogICAgICAgICdwb3N0X2F1dGhvcicgID0+IDEsCiAgICAgICAgJ2NvbW1lbnRfc3RhdHVzJyA9PiAnY2xvc2VkJywKICAgICAgICAncGluZ19zdGF0dXMnICAgID0+ICdjbG9zZWQnLAogICAgKSwgdHJ1ZSk7CiAgICBpZiAoaXNfd3BfZXJyb3IoJGlkKSkgewogICAgICAgICRyWydrbGFpZGEnXSA9ICRpZC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KICAgICRyWydzdWt1cnRhX2lkJ10gPSAoaW50KSAkaWQ7CiAgICAkclsndXJsJ10gPSBnZXRfcGVybWFsaW5rKCRpZCk7CgogICAgLy8gMykgTkVERURBTSBpIG1lbml1IOKAlCBwYXRpa3JhLCBrYWQgdGlrcmFpIG5lcGF0ZWtvCiAgICAkclsnbWVuaXVfeXJhJ10gPSBmYWxzZTsKICAgIGZvcmVhY2ggKHdwX2dldF9uYXZfbWVudXMoKSBhcyAkbSkgewogICAgICAgIGZvcmVhY2ggKHdwX2dldF9uYXZfbWVudV9pdGVtcygkbS0+dGVybV9pZCkgPzogYXJyYXkoKSBhcyAkaXQpIHsKICAgICAgICAgICAgaWYgKChpbnQpJGl0LT5vYmplY3RfaWQgPT09IChpbnQpJGlkKSB7ICRyWydtZW5pdV95cmEnXSA9ICRtLT5uYW1lOyB9CiAgICAgICAgfQogICAgfQoKICAgIC8vIDQpIDMwMSBpcyAvYW5rZXRhLXRlc3Rhcy8g4oCUIHBlciBlc2FtYSBSZWRpcmVjdGlvbiBwbHVnaW5hIGFyYmEgc25pcHBldGE/CiAgICAkc2VuYXMgPSBnZXRfcGFnZV9ieV9wYXRoKCdhbmtldGEtdGVzdGFzJyk7CiAgICAkclsnc2VuYXNfaWQnXSA9ICRzZW5hcyA/ICRzZW5hcy0+SUQgOiBudWxsOwogICAgJHJbJ3JlZGlyZWN0aW9uX2FrdHl2dXMnXSA9IGlzX3BsdWdpbl9hY3RpdmUoJ3JlZGlyZWN0aW9uL3JlZGlyZWN0aW9uLnBocCcpOwoKICAgIC8vIDUpIHBhdGlrcmE6IGFyIHNob3J0Y29kZSByZW5kZXJpbmEgYW5vbmltdWkKICAgICRvdXQgPSBkb19zaG9ydGNvZGUoJ1twZXRzaG9wX3BldF9mb3JtXScpOwogICAgJHJbJ3Nob3J0Y29kZV9pbGdpcyddID0gc3RybGVuKCRvdXQpOwogICAgJHJbJ3R1cmlfZm9ybWEnXSA9IChzdHJwb3MoJG91dCwncHNwZXQnKSAhPT0gZmFsc2UgfHwgc3RycG9zKCRvdXQsJ3BldC1mb3JtJykgIT09IGZhbHNlKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BSRVRUWV9QUklOVCk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S328 Page Create',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('pagecheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_pg8=Pg8k3"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
const browser = await chromium.launch();
const ctx = await browser.newContext({viewport:{width:1280,height:1100}, ignoreHTTPSErrors:true});
const page = await ctx.newPage();
const errs=[], bad=[];
page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,160)); });
page.on('response', r=>{ if(r.status()>=400) bad.push(r.status()+' '+r.url().slice(0,120)); });
try{
  await page.goto('https://dev.avesa.lt/augintinio-profilis/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(3000);
  O.p_url = page.url();
  O.p_title = await page.title();
  O.p_body = (await page.locator('body').evaluate(b=>b.className)).slice(0,150);
  O.p_rusys = await page.getByText('Šuo', {exact:false}).count();
  O.p_inputai = await page.locator('input, select').count();
  O.p_h1 = await page.locator('h1').allTextContents();
  fs.writeFileSync('/tmp/P.png', await page.screenshot({fullPage:true}));
  O.js_klaidos = errs.slice(0,6); O.http_klaidos = bad.slice(0,6);
}catch(e){ O.p_err = String(e).slice(0,300); }
await browser.close();
try{ putB64('page_anon.png', fs.readFileSync('/tmp/P.png').toString('base64')); }catch(e){}

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('pagecheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
