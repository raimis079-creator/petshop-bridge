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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzkg4oCUIGthcmFudGluYXMgKyBhdGt1cmltYXMgaXMgLmJha19TMzM5CiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19yczQnXSkgKSByZXR1cm47CiAgICAkdiA9ICRfR0VUWydwc19yczQnXTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidyZXN0b3JlLXYxJyk7CiAgICAkQSA9IFBFVFNIT1BfQ09SRV9ESVIuJ2Fzc2V0cy8nOwogICAgJEYgPSAkQS4ncGV0LWZvcm0uanMnOwogICAgJEIgPSAkQS4ncGV0LWZvcm0uanMuYmFrX1MzMzknOwogICAgJFEgPSAkQS4ncGV0LWZvcm0uanMucXVhcmFudGluZV9TMzM5XzIwMjYwODAyJzsKCiAgICAkclsnZGFiYXJ0aW5pcyddID0gYXJyYXkoJ3lyYSc9PmZpbGVfZXhpc3RzKCRGKSwnZHlkaXMnPT5maWxlX2V4aXN0cygkRik/ZmlsZXNpemUoJEYpOjAsCiAgICAgICAgJ3NoYTI1Nic9PmZpbGVfZXhpc3RzKCRGKT9oYXNoX2ZpbGUoJ3NoYTI1NicsJEYpOm51bGwsJ210aW1lJz0+ZmlsZV9leGlzdHMoJEYpP2dtZGF0ZSgnWS1tLWQgSDppOnMnLGZpbGVtdGltZSgkRikpOm51bGwpOwogICAgJHJbJ2JhY2t1cCddID0gYXJyYXkoJ3lyYSc9PmZpbGVfZXhpc3RzKCRCKSwnZHlkaXMnPT5maWxlX2V4aXN0cygkQik/ZmlsZXNpemUoJEIpOjAsCiAgICAgICAgJ3NoYTI1Nic9PmZpbGVfZXhpc3RzKCRCKT9oYXNoX2ZpbGUoJ3NoYTI1NicsJEIpOm51bGwsJ210aW1lJz0+ZmlsZV9leGlzdHMoJEIpP2dtZGF0ZSgnWS1tLWQgSDppOnMnLGZpbGVtdGltZSgkQikpOm51bGwpOwogICAgJHJbJ2thcmFudGluYXNfamF1J10gPSBmaWxlX2V4aXN0cygkUSk7CgogICAgaWYgKCR2PT09J2RyeScpIHsgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KCiAgICBpZiAoJHY9PT0nYXBwbHknKSB7CiAgICAgICAgaWYgKCFmaWxlX2V4aXN0cygkQikpIHsgJHJbJ1ZFUkRJS1RBUyddPSdTVVNUQUJEWVRBIOKAlCBiYWNrdXAgTkVSQVNUQVMnOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsgfQogICAgICAgIC8vIDEpIEtBUkFOVElOQVMg4oCUIGRhYmFydGluaXMgTkVUUklOQU1BUwogICAgICAgIGlmICghZmlsZV9leGlzdHMoJFEpKSB7IGNvcHkoJEYsJFEpOyB9CiAgICAgICAgJHJbJ2thcmFudGluYXMnXSA9IGFycmF5KCdmYWlsYXMnPT5iYXNlbmFtZSgkUSksJ2R5ZGlzJz0+ZmlsZXNpemUoJFEpLCdzaGEyNTYnPT5oYXNoX2ZpbGUoJ3NoYTI1NicsJFEpKTsKICAgICAgICBpZiAoJHJbJ2thcmFudGluYXMnXVsnc2hhMjU2J10gIT09ICRyWydkYWJhcnRpbmlzJ11bJ3NoYTI1NiddKSB7CiAgICAgICAgICAgICRyWydWRVJESUtUQVMnXT0nU1VTVEFCRFlUQSDigJQga2FyYW50aW5vIFNIQSBuZXN1dGFtcGEnOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgICAgICB9CiAgICAgICAgLy8gMykgQVRPTUlOSVMgYXRrdXJpbWFzIHBlciB0ZW1wICsgcmVuYW1lCiAgICAgICAgJHRtcCA9ICRGLicudG1wX3Jlc3RvcmUnOwogICAgICAgIGlmICghY29weSgkQiwkdG1wKSkgeyAkclsnVkVSRElLVEFTJ109J1NVU1RBQkRZVEEg4oCUIGNvcHkgbmVwYXZ5a28nOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsgfQogICAgICAgIGlmICghcmVuYW1lKCR0bXAsJEYpKSB7IEB1bmxpbmsoJHRtcCk7ICRyWydWRVJESUtUQVMnXT0nU1VTVEFCRFlUQSDigJQgcmVuYW1lIG5lcGF2eWtvJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KICAgICAgICBjbGVhcnN0YXRjYWNoZSh0cnVlLCRGKTsKICAgICAgICAvLyA0KSBQQVRJS1JBCiAgICAgICAgJHJbJ3BvX2F0a3VyaW1vJ10gPSBhcnJheSgnZHlkaXMnPT5maWxlc2l6ZSgkRiksJ3NoYTI1Nic9Pmhhc2hfZmlsZSgnc2hhMjU2JywkRikpOwogICAgICAgICRyWydkeWRpc190ZWlzaW5nYXMnXSA9IChmaWxlc2l6ZSgkRikgPT09IDcyOTM1KTsKICAgICAgICAkclsnc2hhX3N1dGFtcGEnXSA9ICgkclsncG9fYXRrdXJpbW8nXVsnc2hhMjU2J10gPT09ICRyWydiYWNrdXAnXVsnc2hhMjU2J10pOwogICAgICAgICRyWydWRVJESUtUQVMnXSA9ICgkclsnZHlkaXNfdGVpc2luZ2FzJ10gJiYgJHJbJ3NoYV9zdXRhbXBhJ10pID8gJ0FUS1VSVEEnIDogJ05FU1VUQU1QQSc7CiAgICB9CgogICAgaWYgKCR2PT09J2NvdW50JykgewogICAgICAgICRqcyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRGKTsKICAgICAgICAkZWlsID0gZXhwbG9kZSgiXG4iLCAkanMpOwogICAgICAgICRyWydmYWlsYXMnXSA9IGFycmF5KCdkeWRpcyc9PnN0cmxlbigkanMpLCdzaGEyNTYnPT5oYXNoKCdzaGEyNTYnLCRqcyksJ2VpbHVjaXUnPT5jb3VudCgkZWlsKSk7CiAgICAgICAgZm9yZWFjaCAoYXJyYXkoJ2NsZWFyRHJhZnQnLCdyZXF1ZXN0TWFnaWNMaW5rJywnYWxlcnQoJywnc2F2ZURyYWZ0JywncGV0LWRyYWZ0JywnU1JWX0RSQUZUX0tFWScsJ1MzMzknKSBhcyAkeikgewogICAgICAgICAgICAkclsnc2thaWNpYWknXVskel0gPSBzdWJzdHJfY291bnQoJGpzLCAkeik7CiAgICAgICAgfQogICAgICAgIGZvcmVhY2ggKCRlaWwgYXMgJG49PiRsKSB7CiAgICAgICAgICAgIGZvcmVhY2ggKGFycmF5KCdjbGVhckRyYWZ0JywncmVxdWVzdE1hZ2ljTGluaycsJ2FsZXJ0KCcpIGFzICR6KSB7CiAgICAgICAgICAgICAgICBpZiAoc3RycG9zKCRsLCR6KSE9PWZhbHNlKSB7ICRyWydjYWxsX3NpdGVzJ11bJHpdW10gPSAoJG4rMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDE1MCkpOyB9CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('restore339.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_rs4=dry"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.dry=uzk(1);
sh('sleep 3');
const a=sh('curl -sSk -m 50 "'+SITE+'/?ps_rs4=apply"');
try{ O.apply=JSON.parse(a.out); }catch(e){ O.apply_raw=a.out.slice(0,700); }
sh('sleep 3');
const c=sh('curl -sSk -m 50 "'+SITE+'/?ps_rs4=count"');
try{ O.count=JSON.parse(c.out); }catch(e){ O.count_raw=c.out.slice(0,700); }

// JS SINTAKSE — parsisiunciam TIKRA asseta ir tikrinam node'u
sh('curl -sSk -m 40 -o /tmp/pf.js "'+SITE+'/wp-content/plugins/petshop-core/assets/pet-form.js"');
O.js_dydis = sh('wc -c < /tmp/pf.js').out.trim();
const chk = sh('node --check /tmp/pf.js && echo SINTAKSE_OK');
O.js_sintakse = chk.out.trim().slice(0,200);

// NARSYKLE: anketa atsidaro, autosave veikia, magic mygtukas be JS klaidos
try{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1280,height:1100}, ignoreHTTPSErrors:true, locale:'lt-LT'});
  const page = await ctx.newPage();
  const errs=[]; page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,160)); });
  page.on('pageerror', e=>errs.push('PAGEERROR: '+String(e).slice(0,160)));
  await page.goto(SITE+'/augintinio-profilis/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(4000);
  try{ const b=page.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
  await page.waitForTimeout(1500);
  O.anketa = {
    suo_matomas: await page.getByText('Šuo',{exact:false}).first().isVisible().catch(()=>false),
    inputu: await page.locator('input:visible').count(),
    mygtuku: await page.locator('button:visible').count(),
  };
  // autosave: pasirenkam rusi + irasom varda -> tikrinam localStorage
  try{ await page.getByText('Šuo',{exact:false}).first().click({timeout:12000, force:true}); }catch(e){ O.klik=String(e).slice(0,90); }
  await page.waitForTimeout(1200);
  try{ await page.locator('input[type=text]:visible').first().fill('AUTOSAVE-TESTAS'); }catch(e){ O.fill=String(e).slice(0,90); }
  await page.waitForTimeout(1200);
  O.autosave = await page.evaluate(()=>{ try{ const v=localStorage.getItem('pspet_draft');
    return v ? {yra:true, turi_varda: v.indexOf('AUTOSAVE-TESTAS')>=0, ilgis:v.length} : {yra:false}; }catch(e){ return {err:String(e)}; } });
  O.js_klaidos = errs.slice(0,8);
  await browser.close();
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
putB64('restore339.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
