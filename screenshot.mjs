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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzNDNjIOKAlCBFMkU6IGdhdWR5dG9qYXMgUEFHQUwgR0FWRUpBICsgYnVzZW5vcwogKi8KYWRkX2ZpbHRlcignd3BfbWFpbCcsIGZ1bmN0aW9uKCRhcmdzKXsKICAgICR0byA9IGlzX2FycmF5KCRhcmdzWyd0byddID8/ICcnKSA/IGltcGxvZGUoJywnLCAkYXJnc1sndG8nXSkgOiAoc3RyaW5nKSgkYXJnc1sndG8nXSA/PyAnJyk7CiAgICBpZiAoc3RycG9zKCR0bywnZTJlLicpID09PSAwIHx8IHN0cnBvcygkdG8sJ2UyZS4nKSAhPT0gZmFsc2UpIHsKICAgICAgICAkc2VuYSA9IGdldF9vcHRpb24oJ3BzX2UyZV9tYWlscycsIGFycmF5KCkpOwogICAgICAgIGlmICghaXNfYXJyYXkoJHNlbmEpKSAkc2VuYSA9IGFycmF5KCk7CiAgICAgICAgJHNlbmFbXSA9IGFycmF5KCd0byc9PiR0bywnc3ViamVjdCc9PiRhcmdzWydzdWJqZWN0J10gPz8gJycsJ21lc3NhZ2UnPT4kYXJnc1snbWVzc2FnZSddID8/ICcnLCdsYWlrYXMnPT50aW1lKCkpOwogICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2UyZV9tYWlscycsIGFycmF5X3NsaWNlKCRzZW5hLC01KSwgZmFsc2UpOwogICAgfQogICAgcmV0dXJuICRhcmdzOyAgIC8vIE5FS0VJQ0lBTSwgTkVCTE9LVU9KQU0KfSwgMSk7CmFkZF9maWx0ZXIoJ3ByZV9odHRwX3JlcXVlc3QnLCBmdW5jdGlvbigkcHJlLCRhLCR1cmwpewogICAgaWYgKHN0cmlwb3MoJHVybCwnc2VuZGVyJykgIT09IGZhbHNlICYmICFlbXB0eSgkYVsnYm9keSddKSkgewogICAgICAgICRiID0gaXNfc3RyaW5nKCRhWydib2R5J10pID8gJGFbJ2JvZHknXSA6IHdwX2pzb25fZW5jb2RlKCRhWydib2R5J10pOwogICAgICAgIGlmIChzdHJpcG9zKCRiLCdlMmUuJykgIT09IGZhbHNlKSB7CiAgICAgICAgICAgICRzZW5hID0gZ2V0X29wdGlvbigncHNfZTJlX21haWxzJywgYXJyYXkoKSk7CiAgICAgICAgICAgIGlmICghaXNfYXJyYXkoJHNlbmEpKSAkc2VuYSA9IGFycmF5KCk7CiAgICAgICAgICAgICRzZW5hW10gPSBhcnJheSgndG8nPT4nKHNlbmRlciknLCdzdWJqZWN0Jz0+JycsJ21lc3NhZ2UnPT4kYiwnbGFpa2FzJz0+dGltZSgpKTsKICAgICAgICAgICAgdXBkYXRlX29wdGlvbigncHNfZTJlX21haWxzJywgYXJyYXlfc2xpY2UoJHNlbmEsLTUpLCBmYWxzZSk7CiAgICAgICAgfQogICAgfQogICAgcmV0dXJuICRwcmU7Cn0sIDEsIDMpOwoKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfZTJiJ10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfZTJiJ107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsKICAgICRURD0kd3BkYi0+cHJlZml4Lidwc19wZXRfcHJvZmlsZV9kcmFmdHMnOyAkVFQ9JHdwZGItPnByZWZpeC4ncHNfYWN0aW9uX3Rva2Vucyc7CiAgICAkUEVUUz0kd3BkYi0+cHJlZml4Lidwc19wZXRzJzsgJEVMPSR3cGRiLT5wcmVmaXguJ3BzX2V2ZW50X2xvZyc7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidlMmUtYi12MScpOwoKICAgIGlmICgkdj09PSdyZXNldCcpIHsKICAgICAgICBkZWxldGVfb3B0aW9uKCdwc19lMmVfbWFpbHMnKTsKICAgICAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICR3cGRiLT5vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnQlcHNfZHJfJScgT1Igb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudCVwc19tbCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnQlbWFnaWMlJyIpOwogICAgICAgICRyWydwZXRzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKTsKICAgICAgICAkclsndmFydG90b2p1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHdwZGItPnVzZXJzIik7CiAgICAgICAgJHJbJ2V2J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEVMIFdIRVJFIGV2ZW50X25hbWU9J3BldF9wcm9maWxlX2NyZWF0ZWQnIik7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CiAgICBpZiAoJHY9PT0nbWFpbCcpIHsKICAgICAgICAkZW0gPSBpc3NldCgkX0dFVFsnZW0nXSkgPyBzYW5pdGl6ZV9lbWFpbCgkX0dFVFsnZW0nXSkgOiAnJzsKICAgICAgICAkbXMgPSBnZXRfb3B0aW9uKCdwc19lMmVfbWFpbHMnLCBhcnJheSgpKTsKICAgICAgICAkclsnbGFpc2t1J109aXNfYXJyYXkoJG1zKT9jb3VudCgkbXMpOjA7CiAgICAgICAgJHJhc3Rhcz1udWxsOwogICAgICAgIGZvcmVhY2ggKChhcnJheSkkbXMgYXMgJG0pIHsgaWYgKCRlbSAmJiAoc3RycG9zKCRtWyd0byddLCRlbSkhPT1mYWxzZSB8fCBzdHJwb3MoJG1bJ21lc3NhZ2UnXSwkZW0pIT09ZmFsc2UpKSB7ICRyYXN0YXM9JG07IH0gfQogICAgICAgIGlmICghJHJhc3RhcyAmJiBpc19hcnJheSgkbXMpICYmICRtcykgeyAkcmFzdGFzID0gZW5kKCRtcyk7IH0KICAgICAgICBpZiAoJHJhc3RhcykgewogICAgICAgICAgICAkclsndG8nXT0kcmFzdGFzWyd0byddOyAkclsnc3ViamVjdCddPSRyYXN0YXNbJ3N1YmplY3QnXTsKICAgICAgICAgICAgJGJvZHkgPSAkcmFzdGFzWydtZXNzYWdlJ107CiAgICAgICAgICAgICRib2R5ID0gc3RyX3JlcGxhY2UoJ1xcLycsJy8nLCRib2R5KTsKICAgICAgICAgICAgLy8gUElSTUlBVVNJQSBocmVmLCByZWdleCB0aWsgZmFsbGJhY2sKICAgICAgICAgICAgJG51b3JvZG9zPWFycmF5KCk7CiAgICAgICAgICAgIGlmIChwcmVnX21hdGNoX2FsbCgnI2hyZWY9WyJcJ10oW14iXCddKylbIlwnXSNpJywgJGJvZHksICRobSkpIHsKICAgICAgICAgICAgICAgIGZvcmVhY2ggKCRobVsxXSBhcyAkaCkgeyAkbnVvcm9kb3NbXSA9IGh0bWxfZW50aXR5X2RlY29kZSgkaCwgRU5UX1FVT1RFUyk7IH0KICAgICAgICAgICAgfQogICAgICAgICAgICAkclsndmlzb3NfbnVvcm9kb3MnXSA9ICRudW9yb2RvczsKICAgICAgICAgICAgZm9yZWFjaCAoJG51b3JvZG9zIGFzICRoKSB7IGlmIChzdHJwb3MoJGgsJ3BldHNob3AtbG9naW4nKSAhPT0gZmFsc2UgJiYgc3RycG9zKCRoLCd0b2tlbj0nKSAhPT0gZmFsc2UpIHsgJHJbJ251b3JvZGEnXT0kaDsgYnJlYWs7IH0gfQogICAgICAgICAgICBpZiAoZW1wdHkoJHJbJ251b3JvZGEnXSkgJiYgcHJlZ19tYXRjaCgnI2h0dHBzPzovL1teXHMiXCc8Pl0qcGV0c2hvcC1sb2dpblteXHMiXCc8Pl0qI2knLCAkYm9keSwgJGZtKSkgewogICAgICAgICAgICAgICAgJHJbJ251b3JvZGEnXSA9IGh0bWxfZW50aXR5X2RlY29kZSgkZm1bMF0sIEVOVF9RVU9URVMpOyAkclsnZmFsbGJhY2snXT10cnVlOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGlmIChlbXB0eSgkclsnbnVvcm9kYSddKSkgeyAkclsnYm9keV9mcmFnbWVudGFzJ109c3Vic3RyKCRib2R5LDAsNzAwKTsgfQogICAgICAgIH0KICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgaWYgKCR2PT09J3N0YXRlJykgewogICAgICAgICRlbSA9IGlzc2V0KCRfR0VUWydlbSddKSA/IHNhbml0aXplX2VtYWlsKCRfR0VUWydlbSddKSA6ICcnOwogICAgICAgICRkciA9IGlzc2V0KCRfR0VUWydkciddKSA/IHNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ2RyJ10pIDogJyc7CiAgICAgICAgaWYgKCRkcikgeyAkclsnZHJhZnRhcyddID0gJHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBkcmFmdF9pZCxzdGF0dXMscGF5bG9hZF9qc29uIElTIE5VTEwgQVMgcGF5bG9hZF9udWxsLGNsYWltX2F0dGVtcHRfaWQsY2xhaW1fc3RhcnRlZF9hdCxjbGFpbWVkX3VzZXJfaWQsY2xhaW1lZF9wZXRfaWQgRlJPTSAkVEQgV0hFUkUgZHJhZnRfaWQ9JXMiLCRkciksIEFSUkFZX0EpOyB9CiAgICAgICAgaWYgKCRlbSkgewogICAgICAgICAgICAkclsndG9rZW5hcyddID0gJHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxzdWJqZWN0X2VtYWlsLHJlc291cmNlX2lkLHN0YXR1cyx1c2VkX2F0IEZST00gJFRUIFdIRVJFIHN1YmplY3RfZW1haWw9JXMgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIiwkZW0pLCBBUlJBWV9BKTsKICAgICAgICAgICAgJHUgPSBnZXRfdXNlcl9ieSgnZW1haWwnLCRlbSk7CiAgICAgICAgICAgICRyWyd2YXJ0b3RvamFzJ10gPSAkdSA/IGFycmF5KCdpZCc9PiR1LT5JRCkgOiBudWxsOwogICAgICAgICAgICBpZiAoJHUpIHsKICAgICAgICAgICAgICAgICRyWydwZXRzJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxwZXRfbmFtZSxzcGVjaWVzLGN1cnJlbnRfd2VpZ2h0X2tnLGFjdGl2aXR5X2hpbnQsc3RhdHVzLGNsaWVudF9yZWYsaXNfcHJpbWFyeSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1LT5JRCksIEFSUkFZX0EpOwogICAgICAgICAgICAgICAgJHJbJ3BlbmRpbmcnXSA9IGdldF91c2VyX21ldGEoJHUtPklELCdfcHNfcGV0X2NsYWltX3BlbmRpbmcnLHRydWUpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgICRyWydwZXRzX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkUEVUUyIpOwogICAgICAgICRyWyd2YXJ0b3RvanUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkd3BkYi0+dXNlcnMiKTsKICAgICAgICAkclsnZXYnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkRUwgV0hFUkUgZXZlbnRfbmFtZT0ncGV0X3Byb2ZpbGVfY3JlYXRlZCciKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+MSkpOyBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('e2e_full.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_e2b=reset"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}

const ZYM = 'E2E' + Date.now().toString(36).toUpperCase();
const EM  = 'e2e.' + ZYM.toLowerCase() + '@dev.avesa.lt';
O.zym = ZYM; O.email = EM;
function q(a){ const x=sh('curl -sSk -m 45 "'+SITE+'/?ps_e2b='+a+'"'); try{ return JSON.parse(x.out);}catch(e){ return {raw:x.out.slice(0,300)}; } }
O.pradzia = q('reset');

const R={};
try{
 const browser = await chromium.launch();

 // ============ IRENGINYS A — anoniminis telefonas ============
 const ctxA = await browser.newContext({viewport:{width:390,height:844}, isMobile:true, hasTouch:true,
   ignoreHTTPSErrors:true, locale:'lt-LT',
   userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'});
 const A = await ctxA.newPage();
 const netA=[]; A.on('request', r=>{ if(r.url().indexOf('/petshop/v1/')>=0) netA.push(r.method()+' '+r.url().split('/petshop/v1/')[1].split('?')[0]); });
 await A.goto(SITE+'/augintinio-profilis/', {waitUntil:'domcontentloaded', timeout:60000});
 await A.waitForTimeout(3200);
 try{ const b=A.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
 await A.waitForTimeout(900);
 await A.getByText('Šuo',{exact:false}).first().click({timeout:15000, force:true});
 await A.waitForTimeout(1000);
 await A.locator('input[type=text]:visible').first().fill(ZYM+'-Rikis');
 await A.waitForTimeout(600);
 const sv = A.locator('input[type=number]:visible, input[inputmode=decimal]:visible').first();
 if (await sv.count()) { await sv.fill('12.5'); await A.waitForTimeout(600); }
 await A.locator('button:visible').filter({hasText:/Sukurti profilį/i}).first().click({timeout:15000});
 await A.waitForTimeout(2200);
 await A.locator('input[type=email]:visible').first().fill(EM);
 await A.locator('.pspet-btn-primary:visible').first().click({timeout:15000});
 await A.waitForTimeout(7000);
 R.A_box = (await A.locator('.pspet-save-box').first().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,150);
 R.A_ls = await A.evaluate(()=>{ try{ return { draft:(localStorage.getItem('pspet_draft')||'').length,
   srv: JSON.parse(localStorage.getItem('petshop_pet_srv_draft')||'null') }; }catch(e){ return {err:String(e)}; } });
 R.A_net = netA;
 const DRAFT = R.A_ls && R.A_ls.srv ? R.A_ls.srv.draft_id : null;
 R.draft_id = DRAFT;

 // ============ LAISKO NUORODA ============
 sh('sleep 4');
 const mail = q('mail&em='+encodeURIComponent(EM));
 R.mail = { laisku: mail.laisku, to: mail.to, subject: mail.subject, fallback: !!mail.fallback,
            visos_nuorodos: mail.visos_nuorodos };
 R.nuoroda = mail.nuoroda || null;
 if (!R.nuoroda) R.mail_body = mail.body_fragmentas;
 R.pries_N1 = q('state&em='+encodeURIComponent(EM)+'&dr='+(DRAFT||''));

 if (R.nuoroda) {
  const U = R.nuoroda;
  // ============ N1 — PASYVUS atidarymas ============
  R.N1 = {};
  R.N1.head    = sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}" "'+U+'"').out.trim();
  R.N1.po_head = q('state&em='+encodeURIComponent(EM)+'&dr='+DRAFT);
  R.N1.get     = sh('curl -sSkL -m 30 -o /dev/null -w "%{http_code}" "'+U+'"').out.trim();
  R.N1.po_get  = q('state&em='+encodeURIComponent(EM)+'&dr='+DRAFT);
  R.N1.scanner = sh('curl -sSkL -m 30 -A "Mozilla/5.0 (compatible; Barracuda Link Protect)" -o /dev/null -w "%{http_code}" "'+U+'"').out.trim();
  R.N1.outlook = sh('curl -sSkL -m 30 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SkypeUriPreview Preview/0.5" -o /dev/null -w "%{http_code}" "'+U+'"').out.trim();
  R.N1.po_skeneriu = q('state&em='+encodeURIComponent(EM)+'&dr='+DRAFT);

  // ============ E0-B — SVARUS kompiuterio kontekstas ============
  const ctxB = await browser.newContext({viewport:{width:1366,height:900}, ignoreHTTPSErrors:true, locale:'lt-LT'});
  const B = await ctxB.newPage();
  const errB=[]; B.on('pageerror', e=>errB.push(String(e).slice(0,140)));
  await B.goto(U, {waitUntil:'domcontentloaded', timeout:60000});
  await B.waitForTimeout(2500);
  // PIRMA pamatom, KA atidare
  R.B_ekranas = (await B.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,320);
  R.B_url = B.url();
  R.B_mygtukai = (await B.locator('button:visible, input[type=submit]:visible, a.button:visible').allTextContents()).map(t=>t.trim()).filter(Boolean).slice(0,10);
  R.B_formu = await B.locator('form').count();
  fs.writeFileSync('/tmp/B1.png', await B.screenshot({fullPage:true}));
  R.B_po_atidarymo = q('state&em='+encodeURIComponent(EM)+'&dr='+DRAFT);

  // SAMONINGAS patvirtinimas — spaudziam TIKRA mygtuka
  const patv = B.locator('button[type=submit]:visible, input[type=submit]:visible').first();
  R.B_patv_rasta = await patv.count();
  if (R.B_patv_rasta) {
    R.B_patv_tekstas = (await patv.textContent().catch(()=>'')||'').trim() || (await patv.getAttribute('value').catch(()=>''));
    await patv.click({timeout:20000});
    await B.waitForTimeout(6000);
  }
  R.B_url_po = B.url();
  R.B_ekranas_po = (await B.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300);
  R.B_klaidos = errB;
  fs.writeFileSync('/tmp/B2.png', await B.screenshot({fullPage:true}));
  sh('sleep 3');
  R.po_claim = q('state&em='+encodeURIComponent(EM)+'&dr='+DRAFT);
  await ctxB.close();
 }
 await ctxA.close();
 await browser.close();
}catch(err){ R.ERR = String(err && err.stack ? err.stack : err).slice(0,700); }
O.R = R;
for (const n of ['B1','B2']) { try{ putB64('e2e_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); }catch(e){} }

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
putB64('e2e_full.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
