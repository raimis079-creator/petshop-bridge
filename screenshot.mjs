import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
const VER64="YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfdmVyJ10pfHwkX0dFVFsncHNfdmVyJ10hPT0nVnI2SmoyTGwnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDIwMCk7IGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7Cgkkb1sndG90YWxzJ109YXJyYXkoCgkJJ3RhYmxlcyc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMiKSwKCQkncm93cyc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9cHNfZmVlZGluZ19yb3dzIiksCgkJJ21hcCc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAiKSwKCQkncHJvZHVjdHMnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgcHJvZHVjdF9pZCkgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIikpOwoJJG9bJ2J5X3N0YXR1cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgYyBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgR1JPVVAgQlkgc3RhdHVzIiwgQVJSQVlfQSk7Cgkkb1snbmV3J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsYnJhbmQsbGluZSxzcGVjaWVzLHNoYXBlLHN0YXR1cyxyb3dfY291bnQsc291cmNlX3ZlcnNpb24sdmVyaWZpZWRfYnkgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIHNvdXJjZV92ZXJzaW9uPSdleGNsdXNpb25fdmV0ZmFybWFzXzIwMjYtMDctMTYnIiwgQVJSQVlfQSk7Cglmb3JlYWNoKCRvWyduZXcnXSBhcyAmJHQpewoJCSR0Wydyb3dzX2FjdHVhbCddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHJvd19vcmRlcix3ZWlnaHRfZnJvbV9rZyxhbW91bnRfZnJvbV9nLGFtb3VudF90b19nIEZST00geyRwZn1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBPUkRFUiBCWSByb3dfb3JkZXIiLCR0WydpZCddKSwgQVJSQVlfQSk7CgkJJHRbJ21hcHBlZCddPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcHJvZHVjdF9pZCBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCIsJHRbJ2lkJ10pKTsKCQkkdFsnc2t1cyddPWFycmF5KCk7CgkJZm9yZWFjaCgkdFsnbWFwcGVkJ10gYXMgJHBpZCl7ICR0Wydza3VzJ11bXT1nZXRfcG9zdF9tZXRhKCRwaWQsJ19za3UnLHRydWUpOyB9CgkJJHRbJ3Jvd19jb3VudF9vayddID0gKChpbnQpJHRbJ3Jvd19jb3VudCddID09PSBjb3VudCgkdFsncm93c19hY3R1YWwnXSkpOwoJfQoJdW5zZXQoJHQpOwoJJG9bJ29ycGhhbl9yb3dzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwZn1wc19mZWVkaW5nX3Jvd3MgciBMRUZUIEpPSU4geyRwZn1wc19mZWVkaW5nX3RhYmxlcyB0IE9OIHQuaWQ9ci5mZWVkaW5nX3RhYmxlX2lkIFdIRVJFIHQuaWQgSVMgTlVMTCIpOwoJJG9bJ29ycGhhbl9tYXAnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIG0gTEVGVCBKT0lOIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgdCBPTiB0LmlkPW0uZmVlZGluZ190YWJsZV9pZCBXSEVSRSB0LmlkIElTIE5VTEwiKTsKCSRvWydkdXBfbWFwJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gKFNFTEVDVCBwcm9kdWN0X2lkIEZST00geyRwZn1wc19mZWVkaW5nX21hcCBHUk9VUCBCWSBwcm9kdWN0X2lkIEhBVklORyBDT1VOVCgqKT4xKSB4Iik7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==";
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:30*1024*1024});}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR:'+String(e.message).slice(0,90);}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
// 1) APPLY
const a=sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_hyw=Hw4Nn8Bb&confirm=APPLY_HY"');
try{ out.apply=JSON.parse(a); }catch(e){ out.apply_raw=a.slice(0,600); }
// 2) NEPRIKLAUSOMA verifikacija atskiru snippetu
const php=Buffer.from(VER64,'base64').toString('utf8');
fs.writeFileSync('/tmp/v.json',JSON.stringify({name:'TEMP M8 Verify',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/v.json "${API}"`);
const v=sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_ver=Vr6Jj2Ll"');
try{ out.verify=JSON.parse(v); }catch(e){ out.verify_raw=v.slice(0,600); }
// 3) valymas: TEMP + HY snippetas isjungiamas
const k="add_action('wp_loaded',function(){if(!isset($_GET['ps_kf'])||$_GET['ps_kf']!=='Rr3Ww8Yy'){return;}global $wpdb;$p=$wpdb->prefix;$a=$wpdb->query(\"DELETE FROM {$p}snippets WHERE name LIKE 'TEMP M8%'\");$b=$wpdb->query(\"UPDATE {$p}snippets SET active=0 WHERE name LIKE 'Exclusion HY Feeding%'\");echo wp_json_encode(array('temp_deleted'=>$a,'hy_deactivated'=>$b));exit;});";
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill F',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kf=Rr3Ww8Yy"').slice(0,90);
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,300); }
ghPut('screenshots/m8_apply.json',Buffer.from(JSON.stringify(out)),'HY apply + verify');
console.log('DONE');
