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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzNDMg4oCUIEUyRSBwYWdhbGJpbmlzOiBsYWlza28gZ2F1ZHl0b2phcyArIGJ1c2Vub3MKICovCi8vIOKYhSBHTE9CQUxVUyBnYXVkeXRvamFzIOKAlCB2ZWlraWEgVklTT1NFIHV6a2xhdXNvc2UgKGxhaXNrYXMgc2l1bmNpYW1hcyBraXRvamUgdXprbGF1c29qZSkuCmFkZF9maWx0ZXIoJ3dwX21haWwnLCBmdW5jdGlvbigkYXJncyl7CiAgICBpZiAoaXNfYXJyYXkoJGFyZ3MpICYmIGlzc2V0KCRhcmdzWydtZXNzYWdlJ10pICYmIHN0cnBvcygoc3RyaW5nKSRhcmdzWydtZXNzYWdlJ10sJ21hZ2ljJykgIT09IGZhbHNlKSB7CiAgICAgICAgdXBkYXRlX29wdGlvbigncHNfZTJlX21haWwnLCBhcnJheSgna3VyJz0+J3dwX21haWwnLCd0byc9PiRhcmdzWyd0byddID8/ICcnLCdib2R5Jz0+JGFyZ3NbJ21lc3NhZ2UnXSwnbGFpa2FzJz0+dGltZSgpKSwgZmFsc2UpOwogICAgfQogICAgcmV0dXJuICRhcmdzOwp9LCAxKTsKYWRkX2ZpbHRlcigncHJlX2h0dHBfcmVxdWVzdCcsIGZ1bmN0aW9uKCRwcmUsJGEsJHVybCl7CiAgICBpZiAoc3RyaXBvcygkdXJsLCdzZW5kZXInKSAhPT0gZmFsc2UgJiYgIWVtcHR5KCRhWydib2R5J10pKSB7CiAgICAgICAgJGIgPSBpc19zdHJpbmcoJGFbJ2JvZHknXSkgPyAkYVsnYm9keSddIDogd3BfanNvbl9lbmNvZGUoJGFbJ2JvZHknXSk7CiAgICAgICAgaWYgKHN0cmlwb3MoJGIsJ21hZ2ljJykgIT09IGZhbHNlIHx8IHN0cmlwb3MoJGIsJ3ByaXNpanVuZycpICE9PSBmYWxzZSkgewogICAgICAgICAgICB1cGRhdGVfb3B0aW9uKCdwc19lMmVfbWFpbCcsIGFycmF5KCdrdXInPT4nc2VuZGVyJywndG8nPT4nJywnYm9keSc9PiRiLCdsYWlrYXMnPT50aW1lKCkpLCBmYWxzZSk7CiAgICAgICAgfQogICAgfQogICAgcmV0dXJuICRwcmU7ICAgLy8gZmFsc2UtbGlrZSAtPiBzaXVudGltYXMgVEVTSUFNQVMKfSwgMSwgMyk7CgphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19lMmUnXSkgKSByZXR1cm47CiAgICAkdiA9ICRfR0VUWydwc19lMmUnXTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOwogICAgJFREPSR3cGRiLT5wcmVmaXguJ3BzX3BldF9wcm9maWxlX2RyYWZ0cyc7ICRUVD0kd3BkYi0+cHJlZml4Lidwc19hY3Rpb25fdG9rZW5zJzsKICAgICRQRVRTPSR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOyAkRUw9JHdwZGItPnByZWZpeC4ncHNfZXZlbnRfbG9nJzsKICAgICRyPWFycmF5KCdWRVJTSUpBJz0+J2UyZS12MScpOwoKICAgIGlmICgkdj09PSdyZXNldCcpIHsKICAgICAgICBkZWxldGVfb3B0aW9uKCdwc19lMmVfbWFpbCcpOwogICAgICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJHdwZGItPm9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudCVwc19kcl8lJyBPUiBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50JXBzX21sJScgT1Igb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudCVtYWdpYyUnIik7CiAgICAgICAgJHp5bSA9IGlzc2V0KCRfR0VUWyd6eW0nXSkgPyBzYW5pdGl6ZV90ZXh0X2ZpZWxkKCRfR0VUWyd6eW0nXSkgOiAnJzsKICAgICAgICBpZiAoJHp5bSkgewogICAgICAgICAgICBmb3JlYWNoIChnZXRfdXNlcnMoYXJyYXkoJ3NlYXJjaCc9PicqJy4kenltLicqJywnc2VhcmNoX2NvbHVtbnMnPT5hcnJheSgndXNlcl9lbWFpbCcsJ3VzZXJfbG9naW4nKSkpIGFzICR1KSB7CiAgICAgICAgICAgICAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1LT5JRCkpOwogICAgICAgICAgICAgICAgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3VzZXIucGhwJzsgd3BfZGVsZXRlX3VzZXIoJHUtPklEKTsKICAgICAgICAgICAgfQogICAgICAgICAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRQRVRTIFdIRVJFIHBldF9uYW1lIExJS0UgJXMiLCAnJScuJHdwZGItPmVzY19saWtlKCR6eW0pLiclJykpOwogICAgICAgIH0KICAgICAgICAkclsncGV0cyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIik7CiAgICAgICAgJHJbJ2RyYWZ0dSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRURCIpOwogICAgICAgICRyWydldiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRFTCBXSEVSRSBldmVudF9uYW1lPSdwZXRfcHJvZmlsZV9jcmVhdGVkJyIpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmICgkdj09PSdtYWlsJykgewogICAgICAgICRtID0gZ2V0X29wdGlvbigncHNfZTJlX21haWwnKTsKICAgICAgICAkclsnbWFpbF95cmEnXSA9IChib29sKSRtOwogICAgICAgIGlmICgkbSkgewogICAgICAgICAgICAkclsna3VyJ109JG1bJ2t1ciddOyAkclsndG8nXT0kbVsndG8nXTsKICAgICAgICAgICAgLy8gaXNza2lyaWFtIFRJS1JBIG51b3JvZGEgaXMgbGFpc2tvCiAgICAgICAgICAgIGlmIChwcmVnX21hdGNoKCcjaHR0cHM/Oi8vW15ccyJcJzw+XFxcXF0rbWFnaWNbXlxzIlwnPD5cXFxcXSojaScsICRtWydib2R5J10sICRtbSkpIHsKICAgICAgICAgICAgICAgICRyWydudW9yb2RhJ10gPSBodG1sX2VudGl0eV9kZWNvZGUoc3RyX3JlcGxhY2UoJ1xcLycsJy8nLCRtbVswXSkpOwogICAgICAgICAgICB9IGVsc2UgeyAkclsnbnVvcm9kYSddPW51bGw7ICRyWydib2R5X2ZyYWdtZW50YXMnXT1zdWJzdHIoJG1bJ2JvZHknXSwwLDYwMCk7IH0KICAgICAgICB9CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KCiAgICBpZiAoJHY9PT0nc3RhdGUnKSB7CiAgICAgICAgJHp5bSA9IGlzc2V0KCRfR0VUWyd6eW0nXSkgPyBzYW5pdGl6ZV90ZXh0X2ZpZWxkKCRfR0VUWyd6eW0nXSkgOiAnJzsKICAgICAgICAkZW0gID0gaXNzZXQoJF9HRVRbJ2VtJ10pID8gc2FuaXRpemVfZW1haWwoJF9HRVRbJ2VtJ10pIDogJyc7CiAgICAgICAgJHJbJ2RyYWZ0YWknXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGRyYWZ0X2lkLHN0YXR1cyxwYXlsb2FkX2pzb24gSVMgTlVMTCBBUyBwYXlsb2FkX251bGwsY2xhaW1fYXR0ZW1wdF9pZCxjbGFpbV9zdGFydGVkX2F0LGNsYWltZWRfdXNlcl9pZCxjbGFpbWVkX3BldF9pZCBGUk9NICRURCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDUiLCBBUlJBWV9BKTsKICAgICAgICAkclsndG9rZW5haSddID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQscHVycG9zZSxzdWJqZWN0X2VtYWlsLHJlc291cmNlX2lkLHN0YXR1cyx1c2VkX2F0IEZST00gJFRUIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsIEFSUkFZX0EpOwogICAgICAgICR1ID0gJGVtID8gZ2V0X3VzZXJfYnkoJ2VtYWlsJywkZW0pIDogbnVsbDsKICAgICAgICAkclsndmFydG90b2phcyddID0gJHUgPyBhcnJheSgnaWQnPT4kdS0+SUQsJ2VtYWlsJz0+JHUtPnVzZXJfZW1haWwpIDogbnVsbDsKICAgICAgICBpZiAoJHUpIHsKICAgICAgICAgICAgJHJbJ3BldHMnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLHBldF9uYW1lLHNwZWNpZXMsY3VycmVudF93ZWlnaHRfa2csYWN0aXZpdHlfaGludCxzdGF0dXMsY2xpZW50X3JlZixpc19wcmltYXJ5IEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCIsJHUtPklEKSwgQVJSQVlfQSk7CiAgICAgICAgICAgICRyWydwZW5kaW5nJ10gPSBnZXRfdXNlcl9tZXRhKCR1LT5JRCwnX3BzX3BldF9jbGFpbV9wZW5kaW5nJyx0cnVlKTsKICAgICAgICB9CiAgICAgICAgJHJbJ3BldHNfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIik7CiAgICAgICAgJHJbJ3p5bV9wZXRzJ109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMgV0hFUkUgcGV0X25hbWUgTElLRSAlcyIsJyUnLiR3cGRiLT5lc2NfbGlrZSgkenltKS4nJScpKTsKICAgICAgICAkclsnZXYnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkRUwgV0hFUkUgZXZlbnRfbmFtZT0ncGV0X3Byb2ZpbGVfY3JlYXRlZCciKTsKICAgICAgICAkclsndmFydG90b2p1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHdwZGItPnVzZXJzIik7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZXppbm9tYXMnKSk7IGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('e2e_e0n1.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_e2e=reset"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}

const ZYM = 'E2E' + Date.now().toString(36).toUpperCase();
const EM  = 'e2e.' + ZYM.toLowerCase() + '@dev.avesa.lt';
O.zym = ZYM; O.email = EM;
function q(a){ const x=sh('curl -sSk -m 45 "'+SITE+'/?ps_e2e='+a+'"'); try{ return JSON.parse(x.out);}catch(e){ return {raw:x.out.slice(0,300)}; } }
O.reset = q('reset&zym='+ZYM);

const R={};
try{
 const browser = await chromium.launch();

 // ================= IRENGINYS A — anoniminis telefonas =================
 const ctxA = await browser.newContext({viewport:{width:390,height:844}, isMobile:true, hasTouch:true,
   ignoreHTTPSErrors:true, locale:'lt-LT', userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'});
 const A = await ctxA.newPage();
 const netA=[]; A.on('request', r=>{ if(r.url().indexOf('/petshop/v1/')>=0) netA.push(r.method()+' '+r.url().split('/petshop/v1/')[1].split('?')[0]); });
 const errA=[]; A.on('pageerror', e=>errA.push(String(e).slice(0,140)));

 await A.goto(SITE+'/augintinio-profilis/', {waitUntil:'domcontentloaded', timeout:60000});
 await A.waitForTimeout(3200);
 try{ const b=A.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
 await A.waitForTimeout(900);
 await A.getByText('Šuo',{exact:false}).first().click({timeout:15000, force:true});
 await A.waitForTimeout(1000);
 await A.locator('input[type=text]:visible').first().fill(ZYM+'-Rikis');
 await A.waitForTimeout(600);
 // svoris
 const sv = A.locator('input[type=number]:visible, input[inputmode=decimal]:visible').first();
 if (await sv.count()) { await sv.fill('12.5'); await A.waitForTimeout(600); }
 await A.locator('button:visible').filter({hasText:/Sukurti profilį/i}).first().click({timeout:15000});
 await A.waitForTimeout(2200);
 R.A_ekranas = (await A.locator('#pspet-form-host, .pspet, #content').first().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,150);
 await A.locator('input[type=email]:visible').first().fill(EM);
 await A.locator('.pspet-btn-primary:visible').first().click({timeout:15000});
 await A.waitForTimeout(6000);
 R.A_box = (await A.locator('.pspet-save-box').first().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,170);
 R.A_localStorage = await A.evaluate(()=>{ try{ return { draft:(localStorage.getItem('pspet_draft')||'').length,
   srv: JSON.parse(localStorage.getItem('petshop_pet_srv_draft')||'null') }; }catch(e){ return {err:String(e)}; } });
 R.A_uzklausos = netA; R.A_klaidos = errA;
 fs.writeFileSync('/tmp/A.png', await A.screenshot({fullPage:true}));

 // laisko nuoroda
 sh('sleep 3');
 const mail = q('mail');
 R.mail = { yra: mail.mail_yra, kur: mail.kur, to: mail.to, turi_nuoroda: !!mail.nuoroda };
 R.nuoroda = mail.nuoroda || null;
 if (!R.nuoroda) { R.mail_body = mail.body_fragmentas; }
 R.state_po_A = q('state&zym='+ZYM+'&em='+encodeURIComponent(EM));

 // ================= N1 — SKENERIS nesunaudoja tokeno =================
 if (R.nuoroda) {
   const U = R.nuoroda.replace(/"/g,'');
   R.N1 = {};
   R.N1.head = sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}" "'+U+'"').out.trim();
   R.N1.get  = sh('curl -sSkL -m 30 -o /dev/null -w "%{http_code}" "'+U+'"').out.trim();
   R.N1.scanner = sh('curl -sSkL -m 30 -A "Mozilla/5.0 (compatible; Barracuda Link Protect)" -o /dev/null -w "%{http_code}" "'+U+'"').out.trim();
   R.N1.outlook = sh('curl -sSkL -m 30 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SkypeUriPreview Preview/0.5" -o /dev/null -w "%{http_code}" "'+U+'"').out.trim();
   sh('sleep 2');
   R.N1.state = q('state&zym='+ZYM+'&em='+encodeURIComponent(EM));
 }

 await ctxA.close();
 await browser.close();
}catch(err){ R.ERR = String(err && err.stack ? err.stack : err).slice(0,700); }
O.R = R;
try{ putB64('e2e_A.png', fs.readFileSync('/tmp/A.png').toString('base64')); }catch(e){}

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
putB64('e2e_e0n1.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
