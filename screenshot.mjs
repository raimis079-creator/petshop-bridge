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
if(!sid){ putB64('js6test.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_kt3=Kt3w7"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}

const browser = await chromium.launch();
async function naujas(){
  const ctx = await browser.newContext({viewport:{width:1280,height:1000}, ignoreHTTPSErrors:true, locale:'lt-LT'});
  const page = await ctx.newPage();
  const st = {draft:0, magic:0, klaidos:[]};
  page.on('request', r=>{ const u=r.url(); if(u.indexOf('/pet-draft')>=0) st.draft++; if(u.indexOf('magic-login/request')>=0) st.magic++; });
  page.on('console', m=>{ if(m.type()==='error') st.klaidos.push(m.text().slice(0,100)); });
  return {ctx, page, st};
}
async function iEkrana(page, vardas){
  await page.goto(SITE+'/augintinio-profilis/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(3000);
  try{ const b=page.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
  await page.waitForTimeout(1000);
  if (await page.locator('input[type=email]:visible').count()) return true;
  const suo = page.getByText('Šuo', {exact:false}).first();
  if (await suo.count()) await suo.click({timeout:15000, force:true}).catch(()=>{});
  await page.waitForTimeout(1200);
  await page.locator('input[type=text]:visible').first().fill(vardas||'Testas').catch(()=>{});
  await page.waitForTimeout(500);
  await page.getByRole('button',{name:/Sukurti profilį/i}).first().click({timeout:12000}).catch(()=>{});
  await page.waitForTimeout(2000);
  return (await page.locator('input[type=email]:visible').count()) > 0;
}
async function siusk(page, email){
  await page.locator('input[type=email]:visible').first().fill(email);
  await page.getByRole('button',{name:/Gauti prisijungimo nuorodą/i}).first().click({timeout:12000}).catch(()=>{});
}
async function busena(page){
  return {
    tekstas: (await page.locator('.pspet-save-box').first().innerText().catch(()=>'')).slice(0,260),
    status_klase: await page.locator('.pspet-save-status').first().getAttribute('class').catch(()=>null),
    role: await page.locator('.pspet-save-status').first().getAttribute('role').catch(()=>null),
    aria: await page.locator('.pspet-save-status').first().getAttribute('aria-live').catch(()=>null),
    mygtukas_disabled: await page.getByRole('button',{name:/Gauti prisijungimo nuorodą/i}).first().isDisabled().catch(()=>null),
    ls_draftas: await page.evaluate(()=>{ try{ return !!localStorage.getItem('petshop_pet_draft_v1') || !!Object.keys(localStorage).filter(k=>k.indexOf('draft')>=0 && k.indexOf('srv')<0).length; }catch(e){ return 'ERR'; } }),
    srv: await page.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('petshop_pet_srv_draft')||'null'); }catch(e){ return 'ERR'; } }),
  };
}
try{
// ===== T1 sekmingas =====
{ const {ctx,page,st} = await naujas();
  O.T1_pasiekta = await iEkrana(page,'T1');
  await siusk(page,'js6.t1@dev.avesa.lt'); await page.waitForTimeout(5000);
  O.T1 = Object.assign({draft:st.draft, magic:st.magic}, await busena(page));
  await ctx.close(); }

// ===== T2 dvigubas paspaudimas =====
{ const {ctx,page,st} = await naujas();
  await iEkrana(page,'T2');
  await page.locator('input[type=email]:visible').first().fill('js6.t2@dev.avesa.lt');
  const b = page.getByRole('button',{name:/Gauti prisijungimo nuorodą/i}).first();
  await Promise.all([ b.click({timeout:12000}).catch(()=>{}), b.click({timeout:12000, force:true}).catch(()=>{}) ]);
  await page.waitForTimeout(5500);
  O.T2 = {draft:st.draft, magic:st.magic, LAUKTA:'po 1'};
  await ctx.close(); }

// ===== T3 /pet-draft 400 =====
{ const {ctx,page,st} = await naujas();
  await page.route('**/petshop/v1/pet-draft', r=>r.fulfill({status:400, contentType:'application/json', body:JSON.stringify({ok:false,code:'empty_payload'})}));
  await iEkrana(page,'T3');
  await siusk(page,'js6.t3@dev.avesa.lt'); await page.waitForTimeout(3500);
  O.T3 = Object.assign({draft:st.draft, magic:st.magic}, await busena(page));
  await ctx.close(); }

// ===== T4 429 =====
{ const {ctx,page,st} = await naujas();
  await page.route('**/petshop/v1/pet-draft', r=>r.fulfill({status:429, contentType:'application/json', body:JSON.stringify({ok:false,code:'rate_limited'})}));
  await iEkrana(page,'T4');
  await siusk(page,'js6.t4@dev.avesa.lt'); await page.waitForTimeout(4500);
  O.T4 = Object.assign({draft:st.draft, magic:st.magic}, await busena(page));
  await ctx.close(); }

// ===== T5 tinklo klaida =====
{ const {ctx,page,st} = await naujas();
  await page.route('**/petshop/v1/pet-draft', r=>r.abort('failed'));
  await iEkrana(page,'T5');
  await siusk(page,'js6.t5@dev.avesa.lt'); await page.waitForTimeout(3500);
  O.T5 = Object.assign({draft:st.draft, magic:st.magic}, await busena(page));
  await ctx.close(); }

// ===== T6+T7 draftas OK, magic KRENTA, tada pakartojimas =====
{ const {ctx,page,st} = await naujas();
  await page.route('**/petshop/v1/magic-login/request', r=>r.fulfill({status:500, contentType:'application/json', body:'{}'}));
  await iEkrana(page,'T6');
  await siusk(page,'js6.t67@dev.avesa.lt'); await page.waitForTimeout(5000);
  const po1 = await busena(page);
  O.T6 = {draft:st.draft, magic:st.magic, srv_draft_id: po1.srv && po1.srv.draft_id, tekstas: po1.tekstas, mygtukas_disabled: po1.mygtukas_disabled};
  // PAKARTOJIMAS
  await siusk(page,'js6.t67@dev.avesa.lt'); await page.waitForTimeout(5000);
  const po2 = await busena(page);
  O.T7 = {draft:st.draft, magic:st.magic, srv_draft_id: po2.srv && po2.srv.draft_id,
          tas_pats: !!(po1.srv && po2.srv && po1.srv.draft_id === po2.srv.draft_id),
          LAUKTA:'draft LIEKA 1, magic 2, tas pats draft_id'};
  await ctx.close(); }

// ===== T8 forma pakeista po serverinio drafto =====
{ const {ctx,page,st} = await naujas();
  await iEkrana(page,'T8-pirmas');
  await siusk(page,'js6.t8@dev.avesa.lt'); await page.waitForTimeout(5000);
  const a = await busena(page);
  // griztam i forma ir keiciam varda
  await page.goto(SITE+'/augintinio-profilis/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(3000);
  const tesk = page.getByRole('button',{name:/Tęsti|Pradėti iš naujo|Redaguoti/i}).first();
  O.T8_tesimo_mygtukas = await tesk.count();
  const inp = page.locator('input[type=text]:visible').first();
  if (await inp.count()) { await inp.fill('T8-PAKEISTAS'); await page.waitForTimeout(800); }
  O.T8_dirty_po_keitimo = await page.evaluate(()=>{ try{ const s=JSON.parse(localStorage.getItem('petshop_pet_srv_draft')||'null'); return s? s.dirty : 'nera'; }catch(e){ return 'ERR'; } });
  O.T8 = {draft_pries: a && 1, dirty: O.T8_dirty_po_keitimo, LAUKTA:'dirty=true -> kitas submit kurs NAUJA drafta'};
  await ctx.close(); }

}catch(err){ O.BROWSER_ERR=String(err && err.stack ? err.stack : err).slice(0,700); }
await browser.close();

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
putB64('js6test.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
