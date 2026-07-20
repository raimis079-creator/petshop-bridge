import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=`-u "${U}:${P}"`;
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync(`echo ${b}|base64 -d|curl -sk ${AUTH} -X ${m} -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/${path}"`,{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'proof2',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/pj.json "${u}"`).toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const SNIP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKGlzc2V0KCRfR0VUWydwc19maXgyJ10pICYmICRfR0VUWydwc19maXgyJ109PT0nRml4Mkt3OE54Jyl7CgkJaWYoKCRfR0VUWydjb25maXJtJ10/PycnKSE9PSdTRVQnKXtlY2hvIGpzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nY29uZmlybScpKTtleGl0O30KCQlnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwoJCSR3cGRiLT5xdWVyeSgiVVBEQVRFIHskcGZ9cHNfcGV0cyBTRVQgY3VycmVudF93ZWlnaHRfa2c9NS4wLCB3ZWlnaHRfdXBkYXRlZF9hdD1OT1coKSBXSEVSRSBpZD0yNiIpOwoJCSRwbz0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGN1cnJlbnRfd2VpZ2h0X2tnIEZST00geyRwZn1wc19wZXRzIFdIRVJFIGlkPTI2Iik7CgkJJGJhc2UgPSBmdW5jdGlvbl9leGlzdHMoJ3djX2dldF9hY2NvdW50X2VuZHBvaW50X3VybCcpID8gd2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdhdWdpbnRpbmlzJykgOiBob21lX3VybCgnL215LWFjY291bnQvYXVnaW50aW5pcy8nKTsKCQllY2hvIGpzb25fZW5jb2RlKGFycmF5KCdmaXh0dXJlX3BvJz0+JHBvLCdwZXRfdXJsJz0+JGJhc2UpKTsgZXhpdDsKCX0KCWlmKGlzc2V0KCRfR0VUWydwc19sb2dpbjMnXSkgJiYgJF9HRVRbJ3BzX2xvZ2luMyddPT09J0xvZ2luM0t3OE54Jyl7CgkJd3Bfc2V0X2N1cnJlbnRfdXNlcigyNSk7IHdwX3NldF9hdXRoX2Nvb2tpZSgyNSwgdHJ1ZSk7CgkJJGJhc2UgPSBmdW5jdGlvbl9leGlzdHMoJ3djX2dldF9hY2NvdW50X2VuZHBvaW50X3VybCcpID8gd2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdhdWdpbnRpbmlzJykgOiBob21lX3VybCgnL215LWFjY291bnQvYXVnaW50aW5pcy8nKTsKCQl3cF9zYWZlX3JlZGlyZWN0KGFkZF9xdWVyeV9hcmcoJ3Byb2R1Y3RfaWQnLDE4NTgxLCRiYXNlKSk7IGV4aXQ7Cgl9Cn0sIDEpOwo=';
const mk=wj('POST','code-snippets/v1/snippets',{name:'F1 Proof2 (temp)',code:Buffer.from(SNIP,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let id=null;try{id=JSON.parse(mk).id;o.snip_id=id;}catch(e){o.mk=mk.slice(0,150);}
// fixture
const fixRaw=execSync(`curl -sk ${AUTH} "https://dev.avesa.lt/?ps_fix2=Fix2Kw8Nx&confirm=SET"`,{maxBuffer:10*1024*1024}).toString();
const fi=fixRaw.indexOf('{"');let fix={};try{fix=JSON.parse(fixRaw.slice(fi));}catch(e){}
o.fixture=fix;
const base=fix.pet_url||'https://dev.avesa.lt/my-account/augintinis/';
const testUrl=base+(base.includes('?')?'&':'?')+'product_id=18581';
o.test_url=testUrl;
// login (cookie) — redirect eina i ?product_id URL, bet mes fetchinam explicit
execSync(`rm -f /tmp/cj; curl -sk ${AUTH} -c /tmp/cj -L -o /dev/null "https://dev.avesa.lt/?ps_login3=Login3Kw8Nx"`,{maxBuffer:20*1024*1024});
const cookies=fs.existsSync('/tmp/cj')?fs.readFileSync('/tmp/cj','utf8'):'';
o.auth_cookie=/wordpress_logged_in/i.test(cookies);
// autentifikuotas fetch su ?product_id=18581
const html=execSync(`curl -sk ${AUTH} -b /tmp/cj "${testUrl}"`,{maxBuffer:50*1024*1024}).toString();
o.page_bytes=html.length;
o.feeding_block=html.includes('id="ps-pet-feeding"');
o.shows_testukas=html.includes('Testukas');
o.has_login_form=/name="(log|pwd)"/i.test(html)&&html.toLowerCase().includes('slapta');
const mi=html.indexOf('id="ps-pet-feeding"');
if(mi>=0){const from=html.lastIndexOf('<div',mi);const chunk=html.slice(from,from+2000);
  o.feeding_text=chunk.replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim().slice(0,400);}
// NEGATYVAUS validacijos testas: be product_id blokas neturi rodytis
const htmlNo=execSync(`curl -sk ${AUTH} -b /tmp/cj "${base}"`,{maxBuffer:50*1024*1024}).toString();
o.no_product_id_block_absent=!htmlNo.includes('id="ps-pet-feeding"');
if(id){wj('POST',`code-snippets/v1/snippets/${id}`,{active:false});o.snip_off=true;}
console.log('PUT:',pr('proof2.json',o));
