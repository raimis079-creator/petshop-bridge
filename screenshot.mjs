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
if(!sid){ putB64('probe6.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_kt3=Kt3w7"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
try{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1280,height:1100}, ignoreHTTPSErrors:true, locale:'lt-LT'});
  const page = await ctx.newPage();
  const uzkl=[]; page.on('request', r=>{ const u=r.url(); if(u.indexOf('pet-draft')>=0||u.indexOf('magic-login')>=0) uzkl.push(r.method()+' '+u.slice(-40)); });
  const errs=[]; page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,120)); });

  await page.goto(SITE+'/augintinio-profilis/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(3500);
  try{ const b=page.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
  await page.waitForTimeout(1200);

  O.z1_pradzia = {
    url: page.url(),
    matomi_mygtukai: await page.locator('button:visible').evaluateAll(els=>els.map(e=>(e.innerText||'').trim()).filter(t=>t&&t.length<40)).catch(()=>[]),
    tekstas: (await page.locator('#pspet-form-host, .pspet-wrap, #content').first().innerText().catch(()=>'')).slice(0,500),
  };

  // 1) rusis
  const suo = page.getByText('Šuo', {exact:false}).first();
  O.z2_suo = await suo.count();
  if (O.z2_suo) { await suo.click({timeout:15000, force:true}).catch(e=>{O.e_suo=String(e).slice(0,100);}); }
  await page.waitForTimeout(1500);
  // 2) vardas
  const nm = page.locator('input[type=text]:visible').first();
  await nm.fill('Zondas').catch(e=>{O.e_nm=String(e).slice(0,100);});
  await page.waitForTimeout(600);
  O.z3_po_vardo = {
    mygtukai: await page.locator('button:visible').evaluateAll(els=>els.map(e=>(e.innerText||'').trim()).filter(t=>t&&t.length<40)).catch(()=>[]),
  };
  // 3) toliau kol pasieksim email lauka
  for (let i=0;i<6;i++){
    const em = page.locator('input[type=email]:visible');
    if (await em.count()) { O.z4_email_ekranas = 'pasiektas po '+i+' zingsniu'; break; }
    const nx = page.getByRole('button', {name:/Toliau|Tęsti|Sukurti profilį|Išsaugoti|Baigti/i}).first();
    if (!(await nx.count())) { O.z4_email_ekranas = 'mygtuko nera, i='+i; break; }
    O['z4_paspaustas_'+i] = (await nx.textContent().catch(()=>''))?.trim();
    await nx.click({timeout:12000}).catch(e=>{O['e_nx'+i]=String(e).slice(0,90);});
    await page.waitForTimeout(1800);
  }
  const em2 = page.locator('input[type=email]:visible');
  O.z5_email_laukas = await em2.count();
  O.z5_tekstas = (await page.locator('.pspet-wrap, #pspet-form-host').first().innerText().catch(()=>'')).slice(0,600);
  O.z5_mygtukai = await page.locator('button:visible').evaluateAll(els=>els.map(e=>(e.innerText||'').trim()).filter(Boolean)).catch(()=>[]);
  O.uzklausos = uzkl;
  O.js_klaidos = errs.slice(0,6);
  fs.writeFileSync('/tmp/Z.png', await page.screenshot({fullPage:true}));
  await browser.close();
  try{ putB64('probe6.png', fs.readFileSync('/tmp/Z.png').toString('base64')); }catch(e){}
}catch(err){ O.BROWSER_ERR=String(err && err.stack ? err.stack : err).slice(0,600); }
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
putB64('probe6.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
