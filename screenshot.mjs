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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBrb250YWt0dSBwdXNsYXBpcyArIHBvcmFzdGVzIHJlY29uCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19rdDMnXSkgfHwgJF9HRVRbJ3BzX2t0MyddICE9PSAnS3QzdzcnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4na29udGFrdGFpLXJlY29uLXYxJyk7CgogICAgLy8gMSkga29udGFrdHUgcHVzbGFwaXMKICAgIGZvcmVhY2ggKGFycmF5KCdrb250YWt0YWknLCdjb250YWN0Jywnc3VzaXNpZWtpbWUnKSBhcyAkc2x1ZykgewogICAgICAgICRwID0gZ2V0X3BhZ2VfYnlfcGF0aCgkc2x1Zyk7CiAgICAgICAgaWYgKCRwKSB7CiAgICAgICAgICAgICRyWydwdXNsYXBpcyddID0gYXJyYXkoJ2lkJz0+JHAtPklELCdzbHVnJz0+JHNsdWcsJ3RpdGxlJz0+JHAtPnBvc3RfdGl0bGUsCiAgICAgICAgICAgICAgICAnc3RhdHVzJz0+JHAtPnBvc3Rfc3RhdHVzLCd1cmwnPT5nZXRfcGVybWFsaW5rKCRwLT5JRCksJ2lsZ2lzJz0+c3RybGVuKCRwLT5wb3N0X2NvbnRlbnQpKTsKICAgICAgICAgICAgJHJbJ3R1cmlueXMnXSA9ICRwLT5wb3N0X2NvbnRlbnQ7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgIH0KICAgIC8vIGFyIHlyYSBmb3Jtb3MgcGx1Z2luJ2FzCiAgICAkclsnZm9ybW9zX3BsdWdpbmFpJ10gPSBhcnJheSgpOwogICAgZm9yZWFjaCAoYXJyYXkoJ2NvbnRhY3QtZm9ybS03L3dwLWNvbnRhY3QtZm9ybS03LnBocCcsJ3dwZm9ybXMtbGl0ZS93cGZvcm1zLnBocCcsCiAgICAgICAgICAgICAgICAgICAnbmluamEtZm9ybXMvbmluamEtZm9ybXMucGhwJywnZm9ybWluYXRvci9mb3JtaW5hdG9yLnBocCcsCiAgICAgICAgICAgICAgICAgICAnZmx1ZW50Zm9ybS9mbHVlbnRmb3JtLnBocCcsJ2ZsYXRzb21lL2luYy9pbnRlZ3JhdGlvbnMvY29udGFjdC1mb3JtLTcvJykgYXMgJHBsKSB7CiAgICAgICAgaWYgKGZ1bmN0aW9uX2V4aXN0cygnaXNfcGx1Z2luX2FjdGl2ZScpICYmIGlzX3BsdWdpbl9hY3RpdmUoJHBsKSkgeyAkclsnZm9ybW9zX3BsdWdpbmFpJ11bXSA9ICRwbDsgfQogICAgfQogICAgJHJbJ3Zpc2lfYWt0eXZ1cyddID0gZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKTsKCiAgICAvLyAyKSBwb3Jhc3RlcyB0dXJpbnlzIOKAlCBrdXIgZ3l2ZW5hIEtPTlRBS1RBSSBibG9rYXMKICAgICRyWydmb290ZXJfYmxva2FpJ10gPSBhcnJheSgpOwogICAgZm9yZWFjaCAoYXJyYXkoJ2Zvb3Rlcl9sZWZ0X3RleHQnLCdmb290ZXJfcmlnaHRfdGV4dCcsJ2Zvb3Rlcl8yX2xlZnRfdGV4dCcsJ2Zvb3Rlcl8yX3JpZ2h0X3RleHQnKSBhcyAkaykgewogICAgICAgICR2ID0gZ2V0X3RoZW1lX21vZCgkayk7CiAgICAgICAgaWYgKCR2KSB7ICRyWydmb290ZXJfYmxva2FpJ11bJGtdID0gJHY7IH0KICAgIH0KICAgIC8vIEZsYXRzb21lIHBvcmFzdGVzIHdpZGdldCdhaQogICAgJHNpZGViYXJzID0gd3BfZ2V0X3NpZGViYXJzX3dpZGdldHMoKTsKICAgIGZvcmVhY2ggKCRzaWRlYmFycyBhcyAkc2IgPT4gJHdpZGdldHMpIHsKICAgICAgICBpZiAoc3RycG9zKCRzYiwnZm9vdGVyJykgPT09IGZhbHNlKSBjb250aW51ZTsKICAgICAgICBmb3JlYWNoICgoYXJyYXkpJHdpZGdldHMgYXMgJHcpIHsKICAgICAgICAgICAgJHRpcGFzID0gcHJlZ19yZXBsYWNlKCcvLVxkKyQvJywnJywkdyk7CiAgICAgICAgICAgICRuciA9IChpbnQpIHByZWdfcmVwbGFjZSgnL14uKi0vJywnJywkdyk7CiAgICAgICAgICAgICRvcHQgPSBnZXRfb3B0aW9uKCd3aWRnZXRfJy4kdGlwYXMpOwogICAgICAgICAgICBpZiAoaXNzZXQoJG9wdFskbnJdKSkgewogICAgICAgICAgICAgICAgJHR1cmlueXMgPSBpc19hcnJheSgkb3B0WyRucl0pID8gd3BfanNvbl9lbmNvZGUoJG9wdFskbnJdLCBKU09OX1VORVNDQVBFRF9VTklDT0RFKSA6IChzdHJpbmcpJG9wdFskbnJdOwogICAgICAgICAgICAgICAgaWYgKHN0cnBvcygkdHVyaW55cywncGV0c2hvcC5sdCcpICE9PSBmYWxzZSB8fCBzdHJwb3MoJHR1cmlueXMsJzg3Nzg3JykgIT09IGZhbHNlCiAgICAgICAgICAgICAgICAgICAgfHwgc3RyaXBvcygkdHVyaW55cywna29udGFrdCcpICE9PSBmYWxzZSkgewogICAgICAgICAgICAgICAgICAgICRyWyd3aWRnZXRhcyddWyRzYi4nLycuJHddID0gJHR1cmlueXM7CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('matrica6.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_kt3=Kt3w7"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}

const SC = {};
function ok(v){ return !!v; }

try{
 const browser = await chromium.launch();

 async function nauja(stubs){
   const ctx = await browser.newContext({viewport:{width:1280,height:1200}, ignoreHTTPSErrors:true, locale:'lt-LT'});
   const page = await ctx.newPage();
   const log = { draft:[], magic:[], klaidos:[] };
   page.on('pageerror', e=>log.klaidos.push(String(e).slice(0,140)));
   await page.route('**/petshop/v1/pet-draft', async route => {
     log.draft.push(JSON.parse(route.request().postData()||'{}'));
     const s = stubs.draft ? stubs.draft(log.draft.length) : {status:201, body:{ok:true, draft_id:'11111111-2222-4333-8444-'+String(log.draft.length).padStart(12,'0')}};
     if (s.abort) return route.abort('failed');
     await route.fulfill({status:s.status, contentType:'application/json', body:JSON.stringify(s.body||{})});
   });
   await page.route('**/petshop/v1/magic-login/request', async route => {
     log.magic.push(JSON.parse(route.request().postData()||'{}'));
     const s = stubs.magic ? stubs.magic(log.magic.length) : {status:200, body:{ok:true}};
     if (s.abort) return route.abort('failed');
     await route.fulfill({status:s.status, contentType:'application/json', body:JSON.stringify(s.body||{})});
   });
   await page.goto(SITE+'/augintinio-profilis/', {waitUntil:'domcontentloaded', timeout:60000});
   await page.waitForTimeout(3000);
   try{ const b=page.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
   await page.waitForTimeout(1000);
   return {ctx, page, log};
 }
 async function ikiCTA(page, vardas){
   await page.getByText('Šuo',{exact:false}).first().click({timeout:15000, force:true});
   await page.waitForTimeout(1000);
   await page.locator('input[type=text]:visible').first().fill(vardas||'Rikis');
   await page.waitForTimeout(700);
   await page.locator('button:visible').filter({hasText:/Sukurti profilį/i}).first().click({timeout:15000});
   await page.waitForTimeout(2200);
 }
 async function spausk(page, email){
   await page.locator('input[type=email]:visible').first().fill(email);
   await page.waitForTimeout(300);
   await page.locator('.pspet-btn-primary:visible').first().click({timeout:15000});
 }
 async function busena(page){
   return await page.evaluate(()=>{
     const st = document.querySelector('.pspet-save-status');
     const btn = document.querySelector('.pspet-btn-primary');
     let srv=null, dr=null;
     try{ srv = JSON.parse(localStorage.getItem('petshop_pet_srv_draft')||'null'); }catch(e){}
     try{ dr = localStorage.getItem('pspet_draft'); }catch(e){}
     const box = document.querySelector('.pspet-save-box');
     return {
       stat: st ? (st.textContent||'').trim() : null,
       role: st ? st.getAttribute('role') : null,
       live: st ? st.getAttribute('aria-live') : null,
       btnDisabled: btn ? !!btn.disabled : null,
       btnText: btn ? (btn.textContent||'').trim() : null,
       boxText: box ? (box.textContent||'').replace(/\s+/g,' ').trim().slice(0,160) : null,
       srv: srv, draftYra: !!dr, draftIlgis: dr ? dr.length : 0,
     };
   });
 }

 // ===== S1 sekmingas kelias =====
 { const {ctx,page,log} = await nauja({});
   await ikiCTA(page); await spausk(page,'s1@dev.avesa.lt'); await page.waitForTimeout(2500);
   const b = await busena(page);
   SC.S1 = {draft:log.draft.length, magic:log.magic.length, box:b.boxText, srv_draft_id:b.srv&&b.srv.draft_id, draftYra:b.draftYra, klaidos:log.klaidos,
     OK:(log.draft.length===1 && log.magic.length===1 && /Patikrinkite el/i.test(b.boxText||'') && b.draftYra)};
   await ctx.close(); }

 // ===== S2 dvigubas paspaudimas =====
 { const {ctx,page,log} = await nauja({draft:()=>({status:201,body:{ok:true,draft_id:'11111111-2222-4333-8444-aaaaaaaaaaaa'},delay:1})});
   await ikiCTA(page);
   await page.locator('input[type=email]:visible').first().fill('s2@dev.avesa.lt');
   const btn = page.locator('.pspet-btn-primary:visible').first();
   await btn.click({timeout:15000});
   await btn.click({timeout:3000, force:true}).catch(()=>{});
   await btn.click({timeout:3000, force:true}).catch(()=>{});
   await page.waitForTimeout(3000);
   SC.S2 = {draft:log.draft.length, magic:log.magic.length,
     OK:(log.draft.length===1 && log.magic.length===1)};
   await ctx.close(); }

 // ===== S3 400 =====
 { const {ctx,page,log} = await nauja({draft:()=>({status:400, body:{ok:false, code:'empty_payload'}})});
   await ikiCTA(page); await spausk(page,'s3@dev.avesa.lt'); await page.waitForTimeout(2500);
   const b = await busena(page);
   SC.S3 = {draft:log.draft.length, magic:log.magic.length, stat:b.stat, role:b.role, live:b.live,
     btnDisabled:b.btnDisabled, btnText:b.btnText, draftYra:b.draftYra,
     OK:(log.magic.length===0 && b.role==='alert' && b.live===null && b.btnDisabled===false && b.draftYra && /Užpildykite/i.test(b.stat||''))};
   await ctx.close(); }

 // ===== S4 413 =====
 { const {ctx,page,log} = await nauja({draft:()=>({status:413, body:{ok:false, code:'payload_too_large'}})});
   await ikiCTA(page); await spausk(page,'s4@dev.avesa.lt'); await page.waitForTimeout(2500);
   const b = await busena(page);
   SC.S4 = {magic:log.magic.length, stat:b.stat, role:b.role, btnDisabled:b.btnDisabled,
     OK:(log.magic.length===0 && /per didelė/i.test(b.stat||'') && b.role==='alert' && b.btnDisabled===false)};
   await ctx.close(); }

 // ===== S5 429 =====
 { const {ctx,page,log} = await nauja({draft:()=>({status:429, body:{ok:false, code:'rate_limited'}})});
   await ikiCTA(page); await spausk(page,'s5@dev.avesa.lt'); await page.waitForTimeout(3500);
   const b = await busena(page);
   SC.S5 = {draft:log.draft.length, magic:log.magic.length, stat:b.stat, btnDisabled:b.btnDisabled,
     OK:(log.magic.length===0 && log.draft.length===1 && /Per daug bandymų/i.test(b.stat||'') && b.btnDisabled===false)};
   await ctx.close(); }

 // ===== S6 tinklo klaida =====
 { const {ctx,page,log} = await nauja({draft:()=>({abort:true})});
   await ikiCTA(page); await spausk(page,'s6@dev.avesa.lt'); await page.waitForTimeout(2500);
   const b = await busena(page);
   SC.S6 = {magic:log.magic.length, stat:b.stat, role:b.role, btnDisabled:b.btnDisabled, draftYra:b.draftYra,
     OK:(log.magic.length===0 && /Nepavyko išsaugoti/i.test(b.stat||'') && b.btnDisabled===false && b.draftYra)};
   await ctx.close(); }

 // ===== S7 draft OK, magic klysta -> pakartojimas TAS PATS draft_id =====
 { const {ctx,page,log} = await nauja({magic:(n)=> n===1 ? {status:500, body:{}} : {status:200, body:{ok:true}} });
   await ikiCTA(page); await spausk(page,'s7@dev.avesa.lt'); await page.waitForTimeout(2500);
   const b1 = await busena(page);
   await page.locator('.pspet-btn-primary:visible').first().click({timeout:15000});
   await page.waitForTimeout(2500);
   const b2 = await busena(page);
   SC.S7 = {draft_kvietimu:log.draft.length, magic_kvietimu:log.magic.length,
     pirma_klaida:b1.stat, magic_draft_ids:log.magic.map(m=>m.draft_id),
     tas_pats:(log.magic.length===2 && log.magic[0].draft_id===log.magic[1].draft_id),
     box:b2.boxText,
     OK:(log.draft.length===1 && log.magic.length===2 && log.magic[0].draft_id===log.magic[1].draft_id
         && /Patikrinkite el/i.test(b2.boxText||''))};
   await ctx.close(); }

 // ===== S8 pakeitus anketa -> NAUJAS draftas =====
 { const {ctx,page,log} = await nauja({magic:()=>({status:500, body:{}})});
   await ikiCTA(page); await spausk(page,'s8@dev.avesa.lt'); await page.waitForTimeout(2500);
   const po1 = await busena(page);
   // grizti i anketa ir pakeisti duomenis
   await page.evaluate(()=>{ try{ const s=JSON.parse(localStorage.getItem('petshop_pet_srv_draft')); s._t=1; localStorage.setItem('petshop_pet_srv_draft', JSON.stringify(s)); }catch(e){} });
   await page.goBack().catch(()=>{});
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForTimeout(3000);
   try{ const b=page.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:3000}); }catch(e){}
   // keiciam varda -> saveDraft -> markDirty
   const txt = page.locator('input[type=text]:visible').first();
   if (await txt.count()) { await txt.fill('Rikis-PAKEISTAS'); await page.waitForTimeout(900); }
   const dirty = await page.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('petshop_pet_srv_draft')||'null'); }catch(e){ return null; } });
   SC.S8 = {srv_po_pirmo:po1.srv, dirty_po_pakeitimo: dirty && dirty.dirty,
     OK:(!!po1.srv && po1.srv.dirty===false && !!dirty && dirty.dirty===true)};
   await ctx.close(); }

 // ===== S9 pakeitus email -> NAUJAS draftas =====
 { const {ctx,page,log} = await nauja({magic:()=>({status:500, body:{}})});
   await ikiCTA(page); await spausk(page,'s9a@dev.avesa.lt'); await page.waitForTimeout(2500);
   await page.locator('input[type=email]:visible').first().fill('s9b@dev.avesa.lt');
   await page.waitForTimeout(300);
   await page.locator('.pspet-btn-primary:visible').first().click({timeout:15000});
   await page.waitForTimeout(2500);
   SC.S9 = {draft_kvietimu:log.draft.length, emails:log.draft.map(d=>d.email),
     OK:(log.draft.length===2 && log.draft[0].email==='s9a@dev.avesa.lt' && log.draft[1].email==='s9b@dev.avesa.lt')};
   await ctx.close(); }

 // ===== S10 localStorage NEISVALOMAS po sekmes =====
 { const {ctx,page,log} = await nauja({});
   await ikiCTA(page); 
   const pries = await page.evaluate(()=>{ try{ return (localStorage.getItem('pspet_draft')||'').length; }catch(e){ return -1; } });
   await spausk(page,'s10@dev.avesa.lt'); await page.waitForTimeout(3000);
   const b = await busena(page);
   SC.S10 = {pries:pries, po:b.draftIlgis, box:b.boxText,
     OK:(pries>0 && b.draftIlgis>0 && /Patikrinkite el/i.test(b.boxText||''))};
   await ctx.close(); }

 await browser.close();
}catch(err){ SC.BROWSER_ERR = String(err && err.stack ? err.stack : err).slice(0,700); }
O.SC = SC;
let p=0, viso=0;
for (const k of ['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10']) { viso++; if (SC[k] && SC[k].OK) p++; }
O.SUVESTINE = p+'/'+viso;

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
putB64('matrica6.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
