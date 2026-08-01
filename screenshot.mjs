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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBXb29Db21tZXJjZSAubW8gZGlhZ25vc3Rpa2EKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX21vNCddKSB8fCAkX0dFVFsncHNfbW80J10gIT09ICdNbzR2OCcgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nbW8tZGlhZy12MScpOwoKICAgIC8vIDEpIGxvY2FsZQogICAgJHJbJ2dldF9sb2NhbGUnXSA9IGdldF9sb2NhbGUoKTsKICAgICRyWydkZXRlcm1pbmVfbG9jYWxlJ10gPSBmdW5jdGlvbl9leGlzdHMoJ2RldGVybWluZV9sb2NhbGUnKSA/IGRldGVybWluZV9sb2NhbGUoKSA6ICduL2EnOwogICAgJHJbJ1dQTEFORyddID0gZ2V0X29wdGlvbignV1BMQU5HJyk7CiAgICAkclsndGV4dGRvbWFpbl9pa2VsdGFzJ10gPSBhcnJheSgKICAgICAgICAnd29vY29tbWVyY2UnICAgPT4gaXNfdGV4dGRvbWFpbl9sb2FkZWQoJ3dvb2NvbW1lcmNlJyksCiAgICAgICAgJ3dwZm9ybXMtbGl0ZScgID0+IGlzX3RleHRkb21haW5fbG9hZGVkKCd3cGZvcm1zLWxpdGUnKSwKICAgICAgICAnZmxhdHNvbWUnICAgICAgPT4gaXNfdGV4dGRvbWFpbl9sb2FkZWQoJ2ZsYXRzb21lJyksCiAgICApOwogICAgJHJbJ3djX3ZlcnNpamEnXSA9IGRlZmluZWQoJ1dDX1ZFUlNJT04nKSA/IFdDX1ZFUlNJT04gOiAnbi9hJzsKCiAgICAvLyAyKSAubW8gZmFpbGFpCiAgICAka2VsaWFpID0gYXJyYXkoCiAgICAgICAgJ2xhbmd1YWdlcy9wbHVnaW5zJyA9PiBXUF9MQU5HX0RJUi4nL3BsdWdpbnMvd29vY29tbWVyY2UtbHRfTFQubW8nLAogICAgICAgICdsYW5ndWFnZXMnICAgICAgICAgPT4gV1BfTEFOR19ESVIuJy93b29jb21tZXJjZS1sdF9MVC5tbycsCiAgICAgICAgJ3BsdWdpbl9pMThuJyAgICAgICA9PiBXUF9QTFVHSU5fRElSLicvd29vY29tbWVyY2UvaTE4bi9sYW5ndWFnZXMvd29vY29tbWVyY2UtbHRfTFQubW8nLAogICAgICAgICd3cGZvcm1zJyAgICAgICAgICAgPT4gV1BfTEFOR19ESVIuJy9wbHVnaW5zL3dwZm9ybXMtbGl0ZS1sdF9MVC5tbycsCiAgICAgICAgJ2ZsYXRzb21lJyAgICAgICAgICA9PiBXUF9MQU5HX0RJUi4nL3RoZW1lcy9mbGF0c29tZS1sdF9MVC5tbycsCiAgICApOwogICAgZm9yZWFjaCAoJGtlbGlhaSBhcyAkaz0+JHApIHsKICAgICAgICAkclsnZmFpbGFpJ11bJGtdID0gZmlsZV9leGlzdHMoJHApCiAgICAgICAgICAgID8gYXJyYXkoJ2R5ZGlzJz0+ZmlsZXNpemUoJHApLCAnZGF0YSc9PmdtZGF0ZSgnWS1tLWQgSDppJywgZmlsZW10aW1lKCRwKSkpCiAgICAgICAgICAgIDogJ05FUkEnOwogICAgfQogICAgLy8gdmlzaSBsdF9MVCBmYWlsYWkgbGFuZ3VhZ2VzL3BsdWdpbnMKICAgICRyWyd2aXNpX2x0X3BsdWdpbnMnXSA9IGFycmF5KCk7CiAgICBmb3JlYWNoICgoYXJyYXkpIGdsb2IoV1BfTEFOR19ESVIuJy9wbHVnaW5zLypsdF9MVC5tbycpIGFzICRmKSB7CiAgICAgICAgJHJbJ3Zpc2lfbHRfcGx1Z2lucyddW2Jhc2VuYW1lKCRmKV0gPSBhcnJheSgnZHlkaXMnPT5maWxlc2l6ZSgkZiksJ2RhdGEnPT5nbWRhdGUoJ1ktbS1kJyxmaWxlbXRpbWUoJGYpKSk7CiAgICB9CgogICAgLy8gMykgQVIgLm1vIGZhaWxlIFlSQSBzaXUgbXNnaWQKICAgICR0aWtzbGFpID0gYXJyYXkoJ1Byb2R1Y3QnLCdTdWJ0b3RhbCcsJ1NoaXBwaW5nJywnQWRkaXRpb25hbCBpbmZvcm1hdGlvbicsJ1F1YW50aXR5JywKICAgICAgICAgICAgICAgICAgICAgJ0NhcnQgdG90YWxzJywnUGxhY2Ugb3JkZXInLCdCaWxsaW5nIGRldGFpbHMnLCdPcmRlciBub3RlcycpOwogICAgJG1vX3BhdGggPSBudWxsOwogICAgZm9yZWFjaCAoYXJyYXkoJGtlbGlhaVsnbGFuZ3VhZ2VzL3BsdWdpbnMnXSwgJGtlbGlhaVsncGx1Z2luX2kxOG4nXSkgYXMgJHApIHsKICAgICAgICBpZiAoZmlsZV9leGlzdHMoJHApKSB7ICRtb19wYXRoID0gJHA7IGJyZWFrOyB9CiAgICB9CiAgICBpZiAoJG1vX3BhdGgpIHsKICAgICAgICByZXF1aXJlX29uY2UgQUJTUEFUSC5XUElOQy4nL3BvbW8vbW8ucGhwJzsKICAgICAgICAkbW8gPSBuZXcgTU8oKTsKICAgICAgICBpZiAoJG1vLT5pbXBvcnRfZnJvbV9maWxlKCRtb19wYXRoKSkgewogICAgICAgICAgICAkclsnbW9fbmF1ZG90YXMnXSA9ICRtb19wYXRoOwogICAgICAgICAgICAkclsnbW9faXJhc3UnXSA9IGNvdW50KCRtby0+ZW50cmllcyk7CiAgICAgICAgICAgIGZvcmVhY2ggKCR0aWtzbGFpIGFzICR0KSB7CiAgICAgICAgICAgICAgICAkeXJhID0gaXNzZXQoJG1vLT5lbnRyaWVzWyR0XSk7CiAgICAgICAgICAgICAgICAkclsnbW9fdHVyaSddWyR0XSA9ICR5cmEgPyAoJG1vLT5lbnRyaWVzWyR0XS0+dHJhbnNsYXRpb25zWzBdID8/ICcodHVzY2lhKScpIDogJ05FUkEgbXNnaWQnOwogICAgICAgICAgICB9CiAgICAgICAgfSBlbHNlIHsgJHJbJ21vX2tsYWlkYSddID0gJ25lcGF2eWtvIG51c2thaXR5dGknOyB9CiAgICB9IGVsc2UgeyAkclsnbW9fbmF1ZG90YXMnXSA9ICdKT0tJTyAubW8gTkVSQVNUQSc7IH0KCiAgICAvLyA0KSBrYSByZWFsaWFpIGdyYXppbmEgX18oKQogICAgZm9yZWFjaCAoJHRpa3NsYWkgYXMgJHQpIHsKICAgICAgICAkdiA9IF9fKCR0LCAnd29vY29tbWVyY2UnKTsKICAgICAgICAkclsnZ2V0dGV4dF9ncmF6aW5hJ11bJHRdID0gYXJyYXkoJ3ZlcnRpbWFzJz0+JHYsICdpc3ZlcnN0YXMnPT4oJHYgIT09ICR0KSk7CiAgICB9CiAgICBmb3JlYWNoIChhcnJheSgnVGhpcyBmaWVsZCBpcyByZXF1aXJlZC4nLCdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLicsJ0xvYWRpbmcnLCdQaG9uZScsJ1RvdGFsJykgYXMgJHQpIHsKICAgICAgICAkdiA9IF9fKCR0LCAnd3Bmb3Jtcy1saXRlJyk7CiAgICAgICAgJHJbJ3dwZm9ybXNfZ3JhemluYSddWyR0XSA9IGFycmF5KCd2ZXJ0aW1hcyc9PiR2LCAnaXN2ZXJzdGFzJz0+KCR2ICE9PSAkdCkpOwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('modiag.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_mo4=Mo4v8"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
// ---- WPForms klaidu E2E su TEISINGU selektoriumi ----
try{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1280,height:1100}, ignoreHTTPSErrors:true, locale:'lt-LT'});
  const page = await ctx.newPage();
  await page.goto(SITE+'/kontaktai/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(2500);
  const btn = page.locator('button#wpforms-submit-34520');
  O.mygtukas_rastas = await btn.count();
  O.mygtuko_tekstas = (await btn.textContent().catch(()=>'')||'').trim();

  // 1) TUSCIA forma
  await btn.click({timeout:15000}).catch(e=>{O.k1=String(e).slice(0,120);});
  await page.waitForTimeout(2500);
  O.tuscia = {
    klaidos: await page.locator('.wpforms-error').allTextContents(),
    aria_live: await page.locator('[aria-live]').allTextContents(),
    html_ang: (await page.content()).indexOf('This field is required')>=0,
  };
  // 2) BLOGAS el. pastas
  await page.locator('input[type=text]').first().fill('E2E Testas').catch(()=>{});
  await page.locator('input[type=email], input[name*="email"]').first().fill('blogas').catch(e=>{O.k2=String(e).slice(0,120);});
  await page.locator('textarea').first().fill('TESTAS - lokalizacijos auditas, prasome ignoruoti.').catch(()=>{});
  await btn.click({timeout:15000}).catch(()=>{});
  await page.waitForTimeout(2500);
  O.blogas = {
    klaidos: await page.locator('.wpforms-error').allTextContents(),
    html_ang: (await page.content()).indexOf('valid email address')>=0,
  };
  fs.writeFileSync('/tmp/F1.png', await page.screenshot({fullPage:true}));
  await browser.close();
  try{ putB64('form_err.png', fs.readFileSync('/tmp/F1.png').toString('base64')); }catch(e){}
}catch(err){ O.BROWSER_ERR=String(err).slice(0,400); }
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
putB64('modiag.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
