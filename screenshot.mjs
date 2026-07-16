import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
const Q64="YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcXInXSl8fCRfR0VUWydwc19xciddIT09J1FyNU1tOVNzJyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJJGlkcz1nZXRfcG9zdHMoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsJ2ZpZWxkcyc9PidpZHMnLAoJCSd0YXhfcXVlcnknPT5hcnJheShhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT5hcnJheSgnc2F1c2FzLW1haXN0YXMtc3VuaW1zJywnc2F1c2FzLW1haXN0YXMta2F0ZW1zJykpKSkpOwoJJG1hcHBlZD1hcnJheV9mbGlwKGFycmF5X21hcCgnaW50dmFsJywkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHByb2R1Y3RfaWQgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIikpKTsKCSRxPWFycmF5KCk7Cglmb3JlYWNoKCRpZHMgYXMgJGlkKXsKCQlpZihnZXRfcG9zdF9tZXRhKCRpZCwnX3N0b2NrX3N0YXR1cycsdHJ1ZSkhPT0naW5zdG9jaycpIGNvbnRpbnVlOwoJCWlmKGlzc2V0KCRtYXBwZWRbJGlkXSkpIGNvbnRpbnVlOwoJCSR0PWdldF90aGVfdGl0bGUoJGlkKTsKCQkkbWY9Z2V0X3Bvc3RfbWV0YSgkaWQsJ19sZWdhY3lfbWFudWZhY3R1cmVyJyx0cnVlKTsKCQlpZihzdHJpcG9zKCR0LCdxdWF0dHJvJyk9PT1mYWxzZSAmJiBzdHJpcG9zKCRtZiwncXVhdHRybycpPT09ZmFsc2UpIGNvbnRpbnVlOwoJCSRxW109YXJyYXkoJ2lkJz0+JGlkLCdza3UnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSksCgkJCSdzcCc9Pmhhc190ZXJtKCdzYXVzYXMtbWFpc3Rhcy1rYXRlbXMnLCdwcm9kdWN0X2NhdCcsJGlkKT8nY2F0JzonZG9nJywKCQkJJ3RpdGxlJz0+bWJfc3Vic3RyKCR0LDAsOTApKTsKCX0KCSRvWydjb3VudCddPWNvdW50KCRxKTsgJG9bJ2l0ZW1zJ109JHE7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==";
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:30*1024*1024});}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
const php=Buffer.from(Q64,'base64').toString('utf8');
fs.writeFileSync('/tmp/s.json',JSON.stringify({name:'TEMP M8 Quattro',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/s.json "${API}"`);
const r=sh('curl -sk --max-time 250 "https://dev.avesa.lt/?ps_qr=Qr5Mm9Ss"');
try{ out.q=JSON.parse(r); }catch(e){ out.raw=r.slice(0,400); }
const k="add_action('wp_loaded',function(){if(!isset($_GET['ps_kq'])||$_GET['ps_kq']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query(\"DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'\");echo wp_json_encode(array('d'=>$n));exit;});";
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill Q',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kq=Rr3Ww8Yy"').slice(0,40);
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,300); }
ghPut('screenshots/m8_quattro.json',Buffer.from(JSON.stringify(out)),'quattro recon');
console.log('DONE');
