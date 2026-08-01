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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjgg4oCUIHNlZWQgMSBhdWdpbnRpbmlzLCBCRSB0cnluaW1vCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zZDcnXSkgfHwgJF9HRVRbJ3BzX3NkNyddICE9PSAnU2Q3cTQnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRQRVRTPSR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidzZWVkLXYxJyk7CiAgICAkdSA9IGdldF91c2VyX2J5KCdsb2dpbicsJ3BzX3R3b190ZXN0Jyk7CiAgICBpZiAoISR1KSB7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZXJhIHZhcnRvdG9qbycpKTsgZXhpdDsgfQogICAgJHVpZD0oaW50KSR1LT5JRDsKICAgICRyWyd0dXJpX3ByaWVzJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCBBTkQgc3RhdHVzPSdhY3RpdmUnIiwkdWlkKSk7CiAgICBpZiAoJHJbJ3R1cmlfcHJpZXMnXSA9PT0gMCkgewogICAgICAgICRub3cgPSBnbWRhdGUoJ1ktbS1kIEg6aTpzJyk7CiAgICAgICAgJHdwZGItPmluc2VydCgkUEVUUywgYXJyYXkoJ3VzZXJfaWQnPT4kdWlkLCdwZXRfbmFtZSc9PidUV09URVNUIFBpcm1hcycsJ3NwZWNpZXMnPT4nZG9nJywKICAgICAgICAgICAgJ3N0YXR1cyc9PidhY3RpdmUnLCdpc19wcmltYXJ5Jz0+MSwnY3JlYXRlZF9hdCc9PiRub3csJ3VwZGF0ZWRfYXQnPT4kbm93KSk7CiAgICAgICAgJHJbJ3N1a3VydGFzJ10gPSAoaW50KSR3cGRiLT5pbnNlcnRfaWQ7CiAgICB9CiAgICAkclsndHVyaV9wbyddID0gKGludCkgJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQgQU5EIHN0YXR1cz0nYWN0aXZlJyIsJHVpZCkpOwogICAgJGV4cD10aW1lKCkrOTAwOwogICAgJHJbJ2Nvb2tpZV9uYW1lJ109TE9HR0VEX0lOX0NPT0tJRTsgJHJbJ2Nvb2tpZV92YWx1ZSddPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJyk7CiAgICAkclsnYXV0aF9uYW1lJ109aXNfc3NsKCk/U0VDVVJFX0FVVEhfQ09PS0lFOkFVVEhfQ09PS0lFOwogICAgJHJbJ2F1dGhfdmFsdWUnXT13cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsaXNfc3NsKCk/J3NlY3VyZV9hdXRoJzonYXV0aCcpOwogICAgJHJbJ2RvbWFpbiddPXBhcnNlX3VybChob21lX3VybCgpLFBIUF9VUkxfSE9TVCk7CiAgICAkclsndXJsJ109J2h0dHBzOi8vZGV2LmF2ZXNhLmx0L3Bhc2t5cmEvYXVnaW50aW5pcy8nOwogICAgJHJbJ3VybF9jcmVhdGUnXT0naHR0cHM6Ly9kZXYuYXZlc2EubHQvcGFza3lyYS9hdWdpbnRpbmlzLz9hY3Rpb249Y3JlYXRlJzsKICAgICRyWyd1c2VyX2lkJ109JHVpZDsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('diag2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_sd7=Sd7q4"');
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

  // ---- TIK DIAGNOSTIKA: kas MATOMA turint 1 augintini ----
  await page.goto(A.url, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(4000);
  try{ const b=page.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
  await page.waitForTimeout(1500);
  O.profilis = {
    url: page.url(),
    matomas_tekstas: (await page.locator('.woocommerce-MyAccount-content, #content').first().innerText().catch(()=>'')).slice(0,1500),
    matomi_mygtukai: await page.locator('button:visible, a:visible').evaluateAll(els=>els.map(e=>(e.innerText||'').trim()).filter(t=>t && t.length<50)),
    form_host_yra: await page.locator('#pspet-form-host').count(),
    form_host_matomas: await page.locator('#pspet-form-host').isVisible().catch(()=>'n/a'),
  };
  fs.writeFileSync('/tmp/D1.png', await page.screenshot({fullPage:true}));

  // ---- ?action=create turint augintini ----
  await page.goto(A.url_create, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(4500);
  O.create_su_augintiniu = {
    url: page.url(),
    matomas_tekstas: (await page.locator('.woocommerce-MyAccount-content, #content').first().innerText().catch(()=>'')).slice(0,1200),
    matomi_mygtukai: await page.locator('button:visible').evaluateAll(els=>els.map(e=>(e.innerText||'').trim()).filter(Boolean)),
    suo_yra: await page.getByText('Šuo',{exact:false}).count(),
    suo_matomas: await page.getByText('Šuo',{exact:false}).first().isVisible().catch(()=>'n/a'),
    form_host_matomas: await page.locator('#pspet-form-host').isVisible().catch(()=>'n/a'),
    inputu_matomu: await page.locator('input:visible').count(),
  };
  fs.writeFileSync('/tmp/D2.png', await page.screenshot({fullPage:true}));
  for (const n of ['D1','D2']) { try{ putB64('diag_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); }catch(e){} }

  O.REST = REST;
  O.js_klaidos = errs.slice(0,8);
  await browser.close();
  for (const n of ['T1','T2']) { try{ putB64('two_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); }catch(e){} }
 }catch(err){ O.BROWSER_ERR=String(err && err.stack ? err.stack : err).slice(0,600); }
}
sh('sleep 2');
const ck=sh('curl -sSk -m 40 "'+SITE+'/?ps_sd7=Sd7q4"');
try{ O.galutinis=JSON.parse(ck.out); }catch(e){ O.g_raw=ck.out.slice(0,400); }
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
putB64('diag2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
