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
function sh(c){try{const o=execSync(c+' 2>&1',{maxBuffer:50e6,shell:'/bin/bash'}).toString();return {out:o};}catch(e){return {out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiDigJQgV1BGb3JtcyB2YWxpZGFjaWpvcyBwcmFuZXNpbWFpCiAqIFRhaXNvbWEgcGVyIFBBUElMRElOSU8gbnVzdGF0eW11cyAod3Bmb3Jtc19zZXR0aW5ncyksIE5FIHBlciBnZXR0ZXh0LgogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfd2YyJ10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfd2YyJ107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nd3Bmb3Jtcy12YWwtdjEnKTsKCiAgICAkbHQgPSBhcnJheSgKICAgICAgICAndmFsaWRhdGlvbi1yZXF1aXJlZCcgICAgICAgID0+ICfFoGlzIGxhdWthcyBwcml2YWxvbWFzLicsCiAgICAgICAgJ3ZhbGlkYXRpb24tZW1haWwnICAgICAgICAgICA9PiAnxK52ZXNraXRlIHRlaXNpbmfEhSBlbC4gcGHFoXRvIGFkcmVzxIUuJywKICAgICAgICAndmFsaWRhdGlvbi1lbWFpbC1zdWdnZXN0aW9uJz0+ICdBciB0dXLEl2pvdGUgb21lbnlqZSB7c3VnZ2VzdGlvbn0/JywKICAgICAgICAndmFsaWRhdGlvbi1udW1iZXInICAgICAgICAgID0+ICfErnZlc2tpdGUgc2thacSNacWzLicsCiAgICAgICAgJ3ZhbGlkYXRpb24tbnVtYmVyLXBvc2l0aXZlJyA9PiAnxK52ZXNraXRlIHRlaWdpYW3EhSBza2FpxI1pxbMuJywKICAgICAgICAndmFsaWRhdGlvbi1jb25maXJtJyAgICAgICAgID0+ICdMYXVrxbMgcmVpa8WhbcSXcyBuZXN1dGFtcGEuJywKICAgICAgICAndmFsaWRhdGlvbi1jaGVjay1saW1pdCcgICAgID0+ICdQYXNpcmlua3RhIHBlciBkYXVnLiBEaWTFvmlhdXNpYXMgbGVpc3RpbmFzIHNrYWnEjWl1czogeyN9LicsCiAgICAgICAgJ3ZhbGlkYXRpb24tY2hhcmFjdGVyLWxpbWl0JyA9PiAnVmlyxaF5dGEgc2ltYm9sacWzIHJpYmE6IHtsaW1pdH0uIMSudmVkxJd0ZSB7Y291bnR9LicsCiAgICAgICAgJ3ZhbGlkYXRpb24td29yZC1saW1pdCcgICAgICA9PiAnVmlyxaF5dGEgxb5vZMW+acWzIHJpYmE6IHtsaW1pdH0uIMSudmVkxJd0ZSB7Y291bnR9LicsCiAgICAgICAgJ3ZhbGlkYXRpb24tZmlsZWV4dGVuc2lvbicgICA9PiAnxaBpbyB0aXBvIGZhaWxhcyBuZWxlaWTFvmlhbWFzLicsCiAgICAgICAgJ3ZhbGlkYXRpb24tZmlsZXNpemUnICAgICAgICA9PiAnRmFpbGFzIHBlciBkaWRlbGlzLicsCiAgICAgICAgJ3ZhbGlkYXRpb24tdXJsJyAgICAgICAgICAgICA9PiAnxK52ZXNraXRlIHRlaXNpbmfEhSBpbnRlcm5ldG8gYWRyZXPEhS4nLAogICAgICAgICd2YWxpZGF0aW9uLXBob25lJyAgICAgICAgICAgPT4gJ8SudmVza2l0ZSB0ZWlzaW5nxIUgdGVsZWZvbm8gbnVtZXLEry4nLAogICAgICAgICd2YWxpZGF0aW9uLXBvc3RfbWF4X3NpemUnICAgPT4gJ0JlbmRyYXMgZmFpbMWzIGR5ZGlzIHZpcsWhaWphIGxlaXN0aW7EhSByaWLEhS4nLAogICAgKTsKCiAgICAkd3MgPSBnZXRfb3B0aW9uKCd3cGZvcm1zX3NldHRpbmdzJywgYXJyYXkoKSk7CiAgICBpZiAoIWlzX2FycmF5KCR3cykpICR3cyA9IGFycmF5KCk7CgogICAgaWYgKCR2ID09PSAnZHJ5JykgewogICAgICAgIGZvcmVhY2ggKCRsdCBhcyAkaz0+JHZhbCkgeyAkclsnZXNhbWEnXVska10gPSBpc3NldCgkd3NbJGtdKSA/ICR3c1ska10gOiAnKG5lcmEg4oCUIG5hdWRvamFtYXMgbnVtYXR5dGFzaXMgYW5nbHUgay4pJzsgfQogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmICgkdiA9PT0gJ2FwcGx5JykgewogICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX3dwZm9ybXNfc2V0dGluZ3NfYmFrXzIwMjYwODAxJywgJHdzLCBmYWxzZSk7CiAgICAgICAgZm9yZWFjaCAoJGx0IGFzICRrPT4kdmFsKSB7ICR3c1ska10gPSAkdmFsOyB9CiAgICAgICAgdXBkYXRlX29wdGlvbignd3Bmb3Jtc19zZXR0aW5ncycsICR3cyk7CiAgICAgICAgJHBvID0gZ2V0X29wdGlvbignd3Bmb3Jtc19zZXR0aW5ncycsIGFycmF5KCkpOwogICAgICAgICRyWydpcmFzeXRhJ10gPSAwOwogICAgICAgIGZvcmVhY2ggKCRsdCBhcyAkaz0+JHZhbCkgeyBpZiAoKCRwb1ska10gPz8gbnVsbCkgPT09ICR2YWwpIHsgJHJbJ2lyYXN5dGEnXSsrOyB9IGVsc2UgeyAkclsnbmVwYXZ5a28nXVtdID0gJGs7IH0gfQogICAgICAgICRyWyd2aXNvJ10gPSBjb3VudCgkbHQpOwogICAgICAgICRyWydiYWNrdXAnXSA9ICdwc193cGZvcm1zX3NldHRpbmdzX2Jha18yMDI2MDgwMSc7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4xKSk7IGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization WPForms Validacija',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,200); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 5');
  // ★ wp_mail blokavimas jau AKTYVUS (snippet'as global) — tik dabar liesim formas
  const d1=sh('curl -sSk -m 40 "'+SITE+'/?ps_wf2=dry"');
  try{O.dry=JSON.parse(d1.out);}catch(e){O.dry_raw=d1.out.slice(0,400);}
  const d2=sh('curl -sSk -m 40 "'+SITE+'/?ps_wf2=apply"');
  try{O.apply=JSON.parse(d2.out);}catch(e){O.apply_raw=d2.out.slice(0,400);}
  sh('sleep 4');
  try{
    const br = await chromium.launch();
    const ctx = await br.newContext({viewport:{width:1280,height:1100}, ignoreHTTPSErrors:true, locale:'lt-LT'});
    const page = await ctx.newPage();
    await page.goto(SITE+'/kontaktai/', {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(3500);
    O.mygtukas = await page.locator('.wpforms-submit').first().textContent().catch(()=>null);
    // TUSCIA forma -> privalomu lauku klaidos
    await page.locator('.wpforms-submit').first().click({timeout:15000});
    await page.waitForTimeout(3000);
    O.klaidos_tuscia = (await page.locator('.wpforms-error').allTextContents()).filter(t=>t.trim());
    // BLOGAS el. pastas — selektorius pagal LAUKU ID (0=vardas,1=email,2=zinute)
    await page.locator('#wpforms-34520-field_0').fill('PS332-TEST vardas').catch(()=>{});
    await page.locator('#wpforms-34520-field_1').fill('blogas-pastas').catch(()=>{});
    await page.locator('#wpforms-34520-field_2').fill('PS332-TEST zinute').catch(()=>{});
    await page.locator('.wpforms-submit').first().click({timeout:15000});
    await page.waitForTimeout(3000);
    O.klaidos_pastas = (await page.locator('.wpforms-error').allTextContents()).filter(t=>t.trim());
    fs.writeFileSync('/tmp/w1.png', await page.screenshot({fullPage:true}));
    O.js_klaidos = [];
    await br.close();
    try{ putB64('wfval.png', fs.readFileSync('/tmp/w1.png').toString('base64')); }catch(e){}
  }catch(err){ O.BROWSER_ERR = String(err).slice(0,400); }

  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
}
putB64('wfval.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
