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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjggRHZpZWrFsyBhdWdpbnRpbmnFsyBVSSB0ZXN0YXMg4oCUIHBhcnVvxaFpbWFzIGlyIHBhdGlrcmEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3R3NiddKSApIHJldHVybjsKICAgICR2ID0gJF9HRVRbJ3BzX3R3NiddOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRQRVRTID0gJHdwZGItPnByZWZpeC4ncHNfcGV0cyc7ICRFTCA9ICR3cGRiLT5wcmVmaXguJ3BzX2V2ZW50X2xvZyc7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J3R3by1wZXRzLXYxJyk7CgogICAgaWYgKCR2ID09PSAncHJlcCcpIHsKICAgICAgICAkbG9naW4gPSAncHNfdHdvX3Rlc3QnOwogICAgICAgICR1ID0gZ2V0X3VzZXJfYnkoJ2xvZ2luJywkbG9naW4pOwogICAgICAgIGlmICghJHUpIHsKICAgICAgICAgICAgJGlkID0gd3BfaW5zZXJ0X3VzZXIoYXJyYXkoJ3VzZXJfbG9naW4nPT4kbG9naW4sJ3VzZXJfZW1haWwnPT4kbG9naW4uJ0BkZXYuYXZlc2EubHQnLAogICAgICAgICAgICAgICAgJ3VzZXJfcGFzcyc9PndwX2dlbmVyYXRlX3Bhc3N3b3JkKDI0KSwncm9sZSc9PidjdXN0b21lcicsJ2ZpcnN0X25hbWUnPT4nRHUnKSk7CiAgICAgICAgICAgICR1ID0gaXNfd3BfZXJyb3IoJGlkKSA/IG51bGwgOiBnZXRfdXNlcl9ieSgnaWQnLCRpZCk7CiAgICAgICAgfQogICAgICAgIGlmICghJHUpIHsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+J25lcGF2eWtvJykpOyBleGl0OyB9CiAgICAgICAgJHVpZCA9IChpbnQpJHUtPklEOwogICAgICAgIC8vIFRJS1NMVVMgdXNlcl9pZCwgbmUgcG96eW1pcwogICAgICAgICRyWydpc3RyaW50YV9zZW51J10gPSAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1aWQpKTsKICAgICAgICAkclsndXNlcl9pZCddID0gJHVpZDsKICAgICAgICAkclsncGV0c19wcmllcyddID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIik7CiAgICAgICAgJHJbJ2V2X3ByaWVzJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEVMIFdIRVJFIGV2ZW50X25hbWU9J3BldF9wcm9maWxlX2NyZWF0ZWQnIik7CiAgICAgICAgJGV4cCA9IHRpbWUoKSs5MDA7CiAgICAgICAgJHJbJ2Nvb2tpZV9uYW1lJ109TE9HR0VEX0lOX0NPT0tJRTsgJHJbJ2Nvb2tpZV92YWx1ZSddPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJyk7CiAgICAgICAgJHJbJ2F1dGhfbmFtZSddPWlzX3NzbCgpP1NFQ1VSRV9BVVRIX0NPT0tJRTpBVVRIX0NPT0tJRTsKICAgICAgICAkclsnYXV0aF92YWx1ZSddPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCxpc19zc2woKT8nc2VjdXJlX2F1dGgnOidhdXRoJyk7CiAgICAgICAgJHJbJ2RvbWFpbiddPXBhcnNlX3VybChob21lX3VybCgpLFBIUF9VUkxfSE9TVCk7CiAgICAgICAgJHJbJ3VybCddPSAnaHR0cHM6Ly9kZXYuYXZlc2EubHQvcGFza3lyYS9hdWdpbnRpbmlzLyc7CiAgICAgICAgJHJbJ3VybF9jcmVhdGUnXT0naHR0cHM6Ly9kZXYuYXZlc2EubHQvcGFza3lyYS9hdWdpbnRpbmlzLz9hY3Rpb249Y3JlYXRlJzsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OwogICAgfQoKICAgIGlmICgkdiA9PT0gJ2NoZWNrJykgewogICAgICAgICR1ID0gZ2V0X3VzZXJfYnkoJ2xvZ2luJywncHNfdHdvX3Rlc3QnKTsKICAgICAgICBpZiAoISR1KSB7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZXJhJykpOyBleGl0OyB9CiAgICAgICAgJHVpZD0oaW50KSR1LT5JRDsKICAgICAgICAkclsnYXVnaW50aW5pYWknXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgICAgICAgICAgIlNFTEVDVCBpZCxwZXRfbmFtZSxzcGVjaWVzLHN0YXR1cyxjbGllbnRfcmVmLGlzX3ByaW1hcnksY3JlYXRlZF9hdAogICAgICAgICAgICAgICBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQgT1JERVIgQlkgaWQiLCAkdWlkKSwgQVJSQVlfQSk7CiAgICAgICAgJHJbJ2tpZWtpcyddID0gY291bnQoJHJbJ2F1Z2ludGluaWFpJ10pOwogICAgICAgICRyWydwZXRzX3Zpc28nXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkUEVUUyIpOwogICAgICAgICRyWydldl9wbyddID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRFTCBXSEVSRSBldmVudF9uYW1lPSdwZXRfcHJvZmlsZV9jcmVhdGVkJyIpOwogICAgICAgICRyWydldmVudGFpJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoCiAgICAgICAgICAgICJTRUxFQ1QgaWQsZXZlbnRfbmFtZSxlbWl0dGVkX2F0IEZST00gJEVMIFdIRVJFIGV2ZW50X25hbWU9J3BldF9wcm9maWxlX2NyZWF0ZWQnCiAgICAgICAgICAgICAgQU5EIGVtaXR0ZWRfYXQgPiBEQVRFX1NVQihOT1coKSwgSU5URVJWQUwgMjAgTUlOVVRFKSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiKSwgQVJSQVlfQSk7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKICAgIH0KCiAgICBpZiAoJHYgPT09ICdjbGVhbnVwJykgewogICAgICAgICR1ID0gZ2V0X3VzZXJfYnkoJ2xvZ2luJywncHNfdHdvX3Rlc3QnKTsKICAgICAgICBpZiAoJHUpIHsKICAgICAgICAgICAgJHVpZD0oaW50KSR1LT5JRDsKICAgICAgICAgICAgJHJbJ2lzdHJpbnRhJ10gPSAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1aWQpKTsKICAgICAgICAgICAgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3VzZXIucGhwJzsKICAgICAgICAgICAgd3BfZGVsZXRlX3VzZXIoJHVpZCk7CiAgICAgICAgfQogICAgICAgICRyWydwZXRzX3Zpc28nXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkUEVUUyIpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+J25lemlub21hcycpKTsgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('twopets2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_tw6=prep"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.prep=uzk(1);
const A=O.prep;
if (A && A.cookie_value) {
 try{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1280,height:1200}, ignoreHTTPSErrors:true, locale:'lt-LT'});
  await ctx.addCookies([
    {name:A.cookie_name, value:A.cookie_value, domain:A.domain, path:'/', httpOnly:true, secure:true},
    {name:A.auth_name,   value:A.auth_value,   domain:A.domain, path:'/', httpOnly:true, secure:true},
  ]);
  const page = await ctx.newPage();
  const REST=[];
  page.on('response', async r=>{
    if (r.url().indexOf('pet-profile')>=0 || r.url().indexOf('/pets')>=0) {
      let b=null; try{ b=await r.text(); }catch(e){}
      REST.push({url:r.url().slice(-60), status:r.status(), body:(b||'').slice(0,400)});
    }
  });
  const errs=[]; page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,140)); });

  async function nuimtiBanerį(){
    for (const sel of ['button:has-text("Priimti")','.cmplz-btn.cmplz-accept','#cmplz-accept']) {
      try{ const b=page.locator(sel).first(); if (await b.count()) { await b.click({timeout:4000}); await page.waitForTimeout(800); return sel; } }catch(e){}
    }
    return 'nerasta';
  }
  async function anketa(vardas, zyme){
    const o={zyme:zyme};
    o.baneris = await nuimtiBanerį();
    await page.waitForTimeout(1200);
    // rusis
    const suo = page.getByText('Šuo', {exact:false}).first();
    o.rusis_matoma = await suo.count();
    if (o.rusis_matoma) await suo.click({timeout:20000, force:true}).catch(e=>{o.e1=String(e).slice(0,100);});
    await page.waitForTimeout(800);
    // vardas
    const nm = page.locator('input[type=text]').first();
    await nm.fill(vardas).catch(e=>{o.e2=String(e).slice(0,100);});
    await page.waitForTimeout(500);
    o.draft_pries = await page.evaluate(()=>{ try{ return localStorage.getItem('petshop_pet_draft')
      || localStorage.getItem('pspet_draft') || Object.keys(localStorage).filter(k=>k.indexOf('draft')>=0).join(','); }catch(e){return 'ERR';} });
    // submit
    const btn = page.getByRole('button', {name:/Sukurti profilį|Išsaugoti|Tęsti|Toliau/i}).first();
    o.mygtukas = await btn.count();
    o.mygtuko_tekstas = (await btn.textContent().catch(()=>'')||'').trim();
    await btn.click({timeout:15000}).catch(e=>{o.e3=String(e).slice(0,140);});
    await page.waitForTimeout(4000);
    o.url_po = page.url();
    o.draft_po = await page.evaluate(()=>{ try{ return Object.keys(localStorage).filter(k=>k.indexOf('draft')>=0).map(k=>k+'='+(localStorage.getItem(k)||'').slice(0,60)).join(' | ') || '(nera draft raktu)'; }catch(e){return 'ERR';} });
    o.state_draft_id = await page.evaluate(()=>{ try{ return (window.PSPetFormState && window.PSPetFormState.data && window.PSPetFormState.data.draft_id) || '(nepasiekiama)'; }catch(e){return 'ERR';} });
    return o;
  }

  // ---- PIRMAS ----
  await page.goto(A.url_create, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(4500);
  O.pirmas = await anketa('TWOTEST Pirmas', 1);
  fs.writeFileSync('/tmp/T1.png', await page.screenshot({fullPage:true}));

  // ---- ANTRAS: BE hard reload, jei UI leidzia ----
  const pridBtn = page.getByText(/Pridėti naują augintinį/i).first();
  O.antras_mygtukas_yra = await pridBtn.count();
  if (O.antras_mygtukas_yra) {
    await pridBtn.click({timeout:12000}).catch(e=>{O.e_prid=String(e).slice(0,140);});
    await page.waitForTimeout(2500);
    O.antras = await anketa('TWOTEST Antras', 2);
    O.antro_kelias = 'be reload';
  } else {
    await page.goto(A.url_create, {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(3000);
    O.antras = await anketa('TWOTEST Antras', 2);
    O.antro_kelias = 'per ?action=create (UI mygtuko nerasta)';
  }
  fs.writeFileSync('/tmp/T2.png', await page.screenshot({fullPage:true}));

  O.REST = REST;
  O.js_klaidos = errs.slice(0,8);
  await browser.close();
  for (const n of ['T1','T2']) { try{ putB64('two_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); }catch(e){} }
 }catch(err){ O.BROWSER_ERR=String(err && err.stack ? err.stack : err).slice(0,600); }
}
sh('sleep 2');
const ck=sh('curl -sSk -m 40 "'+SITE+'/?ps_tw6=check"');
try{ O.check=JSON.parse(ck.out); }catch(e){ O.check_raw=ck.out.slice(0,500); }
sh('sleep 4');
function code(u){ return sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}|%{redirect_url}" "'+u+'"').out.trim(); }
O.t_naujas       = code(SITE+'/paskyra/');
O.t_atsijungti   = code(SITE+'/paskyra/atsijungti/');
O.t_senas_logout = code(SITE+'/my-account/customer-logout/');
O.t_adresai      = code(SITE+'/paskyra/adresai/');
O.t_slaptazodis  = code(SITE+'/paskyra/pamirstas-slaptazodis/');
O.t_augintinis   = code(SITE+'/paskyra/augintinis/');
O.t_uzsakymai    = code(SITE+'/paskyra/uzsakymai/');
O.t_senas        = code(SITE+'/my-account/');
O.t_senas_uzsak  = code(SITE+'/my-account/orders/');
O.t_senas_augint = code(SITE+'/my-account/augintinis/');
O.t_landing      = code(SITE+'/augintinio-profilis/');
O.t_home         = code(SITE+'/');
O.t_shop         = code(SITE+'/parduotuve/');

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('twopets2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
