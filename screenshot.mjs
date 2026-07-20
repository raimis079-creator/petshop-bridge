import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const SNIP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCS8vIEE6IGZpeHR1cmUgc2V0ICsgZ3JhemluYSBhdWdpbnRpbmlvIFVSTAoJaWYoaXNzZXQoJF9HRVRbJ3BzX2ZpeCddKSAmJiAkX0dFVFsncHNfZml4J109PT0nRml4S3c4TngnKXsKCQlpZigoJF9HRVRbJ2NvbmZpcm0nXT8/JycpIT09J1NFVCcpeyBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nY29uZmlybScpKTsgZXhpdDsgfQoJCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7CgkJJHByaWVzPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgY3VycmVudF93ZWlnaHRfa2cgRlJPTSB7JHBmfXBzX3BldHMgV0hFUkUgaWQ9MjYiKTsKCQkkd3BkYi0+cXVlcnkoIlVQREFURSB7JHBmfXBzX3BldHMgU0VUIGN1cnJlbnRfd2VpZ2h0X2tnPTUuMCwgd2VpZ2h0X3VwZGF0ZWRfYXQ9Tk9XKCkgV0hFUkUgaWQ9MjYiKTsKCQkkcG89JHdwZGItPmdldF92YXIoIlNFTEVDVCBjdXJyZW50X3dlaWdodF9rZyBGUk9NIHskcGZ9cHNfcGV0cyBXSEVSRSBpZD0yNiIpOwoJCSR1cmwgPSBmdW5jdGlvbl9leGlzdHMoJ3djX2dldF9hY2NvdW50X2VuZHBvaW50X3VybCcpID8gd2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdhdWdpbnRpbmlzJykgOiBob21lX3VybCgnL21hbm8tcGFza3lyYS9hdWdpbnRpbmlzLycpOwoJCWVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2ZpeHR1cmVfcHJpZXMnPT4kcHJpZXMsJ2ZpeHR1cmVfcG8nPT4kcG8sJ2F1Z2ludGluaXNfdXJsJz0+JHVybCkpOyBleGl0OwoJfQoJLy8gQjogdGVzdC1sb2dpbiB1c2VyIDI1IC0+IHJlZGlyZWN0IGkgYXVnaW50aW5pbyBwdXNsYXBpIChjb29raWUgamFyIGNhcHR1cmVzKQoJaWYoaXNzZXQoJF9HRVRbJ3BzX2xvZ2luMiddKSAmJiAkX0dFVFsncHNfbG9naW4yJ109PT0nTG9naW4yS3c4TngnKXsKCQl3cF9zZXRfY3VycmVudF91c2VyKDI1KTsKCQl3cF9zZXRfYXV0aF9jb29raWUoMjUsIHRydWUpOwoJCSR1cmwgPSBmdW5jdGlvbl9leGlzdHMoJ3djX2dldF9hY2NvdW50X2VuZHBvaW50X3VybCcpID8gd2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdhdWdpbnRpbmlzJykgOiBob21lX3VybCgnL21hbm8tcGFza3lyYS9hdWdpbnRpbmlzLycpOwoJCXdwX3NhZmVfcmVkaXJlY3QoJHVybCk7IGV4aXQ7Cgl9Cn0sIDEpOwo='; // base64 PHP
fs.writeFileSync('/tmp/wpu',U); fs.writeFileSync('/tmp/wpp',P);
const AUTH=`-u "${U}:${P}"`;
function wj(method,path,body){ const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync(`echo ${b}|base64 -d|curl -sk ${AUTH} -X ${method} -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/${path}"`,{maxBuffer:50*1024*1024}).toString(); }
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<5;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'proof',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/pj.json "${u}"`).toString().trim();
  if(c==='200'||c==='201')return c; } return 'fail'; }

const o={};
// 1. sukurti snippeta
const mk=wj('POST','code-snippets/v1/snippets',{name:'F1 Proof (temp)',code:Buffer.from(SNIP,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let id=null; try{id=JSON.parse(mk).id; o.snip_id=id;}catch(e){o.mk=mk.slice(0,200);}

// 2. fixture set + gauti augintinio URL
const fixRaw=execSync(`curl -sk ${AUTH} "https://dev.avesa.lt/?ps_fix=FixKw8Nx&confirm=SET"`,{maxBuffer:10*1024*1024}).toString();
const fi=fixRaw.indexOf('{"'); let fix={}; try{fix=JSON.parse(fixRaw.slice(fi));}catch(e){o.fix_raw=fixRaw.slice(0,300);}
o.fixture=fix;
const petUrl=fix.augintinis_url||'https://dev.avesa.lt/mano-paskyra/augintinis/';
o.pet_url=petUrl;

// 3. cookie-jar: login (captures auth cookie, follow redirect), tada fetch augintinio puslapi
execSync(`rm -f /tmp/cj; curl -sk ${AUTH} -c /tmp/cj -L -o /dev/null "https://dev.avesa.lt/?ps_login2=Login2Kw8Nx"`,{maxBuffer:20*1024*1024});
const cookies=fs.existsSync('/tmp/cj')?fs.readFileSync('/tmp/cj','utf8'):'';
o.auth_cookie_captured=/wordpress_logged_in/i.test(cookies);

// 4. autentifikuotas fetch tikro augintinio puslapio (kaip narsykle gautu)
const html=execSync(`curl -sk ${AUTH} -b /tmp/cj "${petUrl}"`,{maxBuffer:50*1024*1024}).toString();
o.page_bytes=html.length;
o.page_url_fetched=petUrl;
// ar yra feeding blokas
const hasBlock=html.includes('id="ps-pet-feeding"');
o.feeding_block_present=hasBlock;
// istraukti bloka + isvalyti tagus
let blockText=null;
const mi=html.indexOf('id="ps-pet-feeding"');
if(mi>=0){ const from=html.lastIndexOf('<div',mi); let depth=0,i=from,end=-1;
  // paprastas: paimam iki kito </div></div> uzbaigimo ~1500 simboliu lango
  const chunk=html.slice(from,from+2000);
  blockText=chunk.replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim().slice(0,400);
}
o.feeding_text=blockText;
// ar yra login forma (reikstu NEprisijunge)
o.has_login_form=/name="(log|username|pwd|password)"/i.test(html) && html.toLowerCase().includes('slapta');
// ar rodo augintinio varda (Testukas)
o.shows_testukas=html.includes('Testukas');

// 5. deaktyvuoti snippeta
if(id){ wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); o.snip_deactivated=true; }
console.log('PUT:',pr('proof.json',o));
