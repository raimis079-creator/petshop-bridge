import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgTTggQXV0aCB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfYXU5J10pIHx8ICRfR0VUWydwc19hdTknXSAhPT0gJ0t4M3Y5JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOyAkciA9IGFycmF5KCdWRVJTSUpBJz0+J3YzLTIwMjYtMDctMzEnKTsKCiAgICAvLyBUZXN0aW5pcyB2YXJ0b3RvamFzIEJFIGF1Z2ludGluaXUg4oCUIHR1c2Npb3MgYnVzZW5vcyB0ZXN0dWkKICAgICRsb2dpbiA9ICdwc19tOF9lMmUnOwogICAgJHUgPSBnZXRfdXNlcl9ieSgnbG9naW4nLCAkbG9naW4pOwogICAgaWYgKCEkdSkgewogICAgICAgICR1aWQgPSB3cF9pbnNlcnRfdXNlcihhcnJheSgKICAgICAgICAgICAgJ3VzZXJfbG9naW4nID0+ICRsb2dpbiwKICAgICAgICAgICAgJ3VzZXJfZW1haWwnID0+ICdwc19tOF9lMmVAZGV2LmF2ZXNhLmx0JywKICAgICAgICAgICAgJ3VzZXJfcGFzcycgID0+IHdwX2dlbmVyYXRlX3Bhc3N3b3JkKDI0KSwKICAgICAgICAgICAgJ3JvbGUnICAgICAgID0+ICdjdXN0b21lcicsCiAgICAgICAgICAgICdmaXJzdF9uYW1lJyA9PiAnRTJFJywKICAgICAgICApKTsKICAgICAgICAkdSA9IGlzX3dwX2Vycm9yKCR1aWQpID8gbnVsbCA6IGdldF91c2VyX2J5KCdpZCcsICR1aWQpOwogICAgICAgICRyWydzdWt1cnRhcyddID0gdHJ1ZTsKICAgIH0KICAgIGlmICghJHUpIHsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+J25lcGF2eWtvIHZhcnRvdG9qbycpKTsgZXhpdDsgfQogICAgJHVpZCA9IChpbnQpICR1LT5JRDsKCiAgICAvLyBVenRpa3JpbmFtLCBrYWQgYXVnaW50aW5pdSBORVRVUkkgKHR1c2NpYSBidXNlbmEpCiAgICAkclsncGV0c19wcmllcyddID0gKGludCkgJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoCiAgICAgICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3BldHMgV0hFUkUgdXNlcl9pZD0lZCBBTkQgc3RhdHVzPSdhY3RpdmUnIiwgJHVpZCkpOwogICAgaWYgKCRyWydwZXRzX3ByaWVzJ10gPiAwKSB7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKAogICAgICAgICAgICAiVVBEQVRFIHskd3BkYi0+cHJlZml4fXBzX3BldHMgU0VUIHN0YXR1cz0nZGVsZXRlZCcgV0hFUkUgdXNlcl9pZD0lZCIsICR1aWQpKTsKICAgIH0KICAgICRyWyd1c2VyX2lkJ10gPSAkdWlkOwoKICAgIC8vIFRydW1wYWxhaWtpcyBhdXRoIGNvb2tpZSAoMTAgbWluKSDigJQgRTJFIG5hcsWheWtsZWkKICAgICRleHAgPSB0aW1lKCkgKyA2MDA7CiAgICAkclsnY29va2llX25hbWUnXSAgPSBMT0dHRURfSU5fQ09PS0lFOwogICAgJHJbJ2Nvb2tpZV92YWx1ZSddID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwgJGV4cCwgJ2xvZ2dlZF9pbicpOwogICAgJHJbJ2F1dGhfbmFtZSddICAgID0gKGlzX3NzbCgpID8gU0VDVVJFX0FVVEhfQ09PS0lFIDogQVVUSF9DT09LSUUpOwogICAgJHJbJ2F1dGhfdmFsdWUnXSAgID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwgJGV4cCwgaXNfc3NsKCkgPyAnc2VjdXJlX2F1dGgnIDogJ2F1dGgnKTsKICAgICRyWydjb29raWVwYXRoJ10gICA9IENPT0tJRVBBVEg7CiAgICAkclsnZG9tYWluJ10gICAgICAgPSBwYXJzZV91cmwoaG9tZV91cmwoKSwgUEhQX1VSTF9IT1NUKTsKCiAgICAvLyBVUkwnYWkgdGVzdHVpIOKAlCBlbmRwb2ludCBJUyBLTEFTRVMgS09OU1RBTlRPUywgbmUgc3BlbGlvamFudAogICAgLy8gUmFpbWlvIGR1b3RhcyBUSUtSQVMgYWRyZXNhcyDigJQgbmViZXNwZWxpb2phbS4KICAgICRyWyd1cmxfdGFiJ10gICAgPSAnaHR0cHM6Ly9kZXYuYXZlc2EubHQvbXktYWNjb3VudC9hdWdpbnRpbmlzLyc7CiAgICAkclsndXJsX2NyZWF0ZSddID0gJ2h0dHBzOi8vZGV2LmF2ZXNhLmx0L215LWFjY291bnQvYXVnaW50aW5pcy8/YWN0aW9uPWNyZWF0ZSc7CiAgICAkclsnZW5kcG9pbnRfa29uc3RhbnRhJ10gPSAoIGNsYXNzX2V4aXN0cygnUGV0c2hvcF9QZXRfVUknKSAmJiBkZWZpbmVkKCdQZXRzaG9wX1BldF9VSTo6RU5EUE9JTlQnKSApCiAgICAgICAgPyBjb25zdGFudCgnUGV0c2hvcF9QZXRfVUk6OkVORFBPSU5UJykgOiAna2xhc2Uva29uc3RhbnRhIG5lcGFzaWVraWFtYSBhbnQgd3BfbG9hZGVkJzsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BSRVRUWV9QUklOVCk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP M8 Auth v3',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('m8_e2e.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
const a=sh('curl -sSk -m 60 "'+SITE+'/?ps_au9=Kx3v9"');
let A=null; try{A=JSON.parse(a.out);}catch(e){O.auth_raw=a.out.slice(0,800);}
O.auth = A ? {VERSIJA:A.VERSIJA, endpoint_konstanta:A.endpoint_konstanta, user_id:A.user_id, pets_pries:A.pets_pries, endpoint:A.endpoint, url_tab:A.url_tab, url_create:A.url_create, wc_endpoints:A.wc_endpoints, qv:A.wc_query_vars} : null;

if(A && A.cookie_value && A.url_tab){
 try{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1280,height:1000}, ignoreHTTPSErrors:true});
  await ctx.addCookies([
    {name:A.cookie_name, value:A.cookie_value, domain:A.domain, path:'/', httpOnly:true, secure:true},
    {name:A.auth_name,   value:A.auth_value,   domain:A.domain, path:'/', httpOnly:true, secure:true},
  ]);
  const page = await ctx.newPage();
  const errs=[], bad=[];
  page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,200)); });
  page.on('response', r=>{ if(r.status()>=400) bad.push(r.status()+' '+r.url().slice(0,140)); });

  // --- A: tuscia busena ---
  await page.goto(A.url_tab, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(1500);
  O.A_url = page.url();
  O.A_prisijunges = await page.locator('body').evaluate(b=>b.className).catch(()=>'') ;
  O.A_mygtukas_yra = await page.getByText('Sukurti profilį', {exact:false}).count();
  O.A_form_laukai = await page.locator('#pspet-form-host input, #pspet-form input').count();
  fs.writeFileSync('/tmp/A.png', await page.screenshot({fullPage:true}));

  // --- B: paspaudimas ---
  if (O.A_mygtukas_yra > 0) {
    try {
      await page.getByText('Sukurti profilį', {exact:false}).first().click({timeout:15000});
      await page.waitForTimeout(2500);
      O.B_url = page.url();
      O.B_form_laukai = await page.locator('#pspet-form-host input, #pspet-form input').count();
      O.B_rusies_pasirinkimas = await page.getByText('Šuo', {exact:false}).count();
      fs.writeFileSync('/tmp/B.png', await page.screenshot({fullPage:true}));
    } catch(e){ O.B_err = String(e).slice(0,300); }
  }

  // --- C: serverio kelias ?action=create ---
  await page.goto(A.url_create, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(2000);
  O.C_url = page.url();
  O.C_form_laukai = await page.locator('#pspet-form-host input, #pspet-form input').count();
  O.C_rusies_pasirinkimas = await page.getByText('Šuo', {exact:false}).count();
  fs.writeFileSync('/tmp/C.png', await page.screenshot({fullPage:true}));

  O.js_klaidos = errs.slice(0,10);
  O.http_klaidos = bad.slice(0,10);
  await browser.close();
  for (const n of ['A','B','C']) {
    try{ putB64('m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); }catch(e){ O['png_'+n]=String(e).slice(0,120); }
  }
 }catch(err){ O.BROWSER_ERR = String(err && err.stack ? err.stack : err).slice(0,900); }
}
fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('m8_e2e.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
