import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
const V64="YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfdjInXSl8fCRfR0VUWydwc192MiddIT09J1Z2MktrN1BwJyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgyMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJJG9bJ3RvdGFscyddPWFycmF5KAoJCSd0YWJsZXMnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIiksCgkJJ3Jvd3MnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfcm93cyIpLAoJCSdtYXAnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIiksCgkJJ3Byb2R1Y3RzJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHByb2R1Y3RfaWQpIEZST00geyRwZn1wc19mZWVkaW5nX21hcCIpKTsKCSRvWydieV9zdGF0dXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsIENPVU5UKCopIGMgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIEdST1VQIEJZIHN0YXR1cyIsIEFSUkFZX0EpOwoJJG9bJ2V4Y2wnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxsaW5lLHNoYXBlLHN0YXR1cyxyb3dfY291bnQsdmVyaWZpZWRfYnkgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIHNvdXJjZV92ZXJzaW9uPSdleGNsdXNpb25fdmV0ZmFybWFzXzIwMjYtMDctMTYnIE9SREVSIEJZIGlkIiwgQVJSQVlfQSk7Cglmb3JlYWNoKCRvWydleGNsJ10gYXMgJiR0KXsKCQkkdFsncm93c19hY3R1YWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCB3ZWlnaHRfZnJvbV9rZyB3LGFtb3VudF9mcm9tX2cgYSxhbW91bnRfdG9fZyBiIEZST00geyRwZn1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBPUkRFUiBCWSByb3dfb3JkZXIiLCR0WydpZCddKSwgQVJSQVlfQSk7CgkJJHRbJ3NrdXMnXT1hcnJheSgpOwoJCWZvcmVhY2goJHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkIEZST00geyRwZn1wc19mZWVkaW5nX21hcCBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSVkIiwkdFsnaWQnXSkpIGFzICRwaWQpewoJCQkkdFsnc2t1cyddW109Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc2t1Jyx0cnVlKTsKCQl9CgkJJHRbJ29rJ10gPSAoKGludCkkdFsncm93X2NvdW50J10gPT09IGNvdW50KCR0Wydyb3dzX2FjdHVhbCddKSk7Cgl9Cgl1bnNldCgkdCk7Cgkkb1snb3JwaGFuX3Jvd3MnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfcm93cyByIExFRlQgSk9JTiB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIHQgT04gdC5pZD1yLmZlZWRpbmdfdGFibGVfaWQgV0hFUkUgdC5pZCBJUyBOVUxMIik7Cgkkb1snb3JwaGFuX21hcCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAgbSBMRUZUIEpPSU4geyRwZn1wc19mZWVkaW5nX3RhYmxlcyB0IE9OIHQuaWQ9bS5mZWVkaW5nX3RhYmxlX2lkIFdIRVJFIHQuaWQgSVMgTlVMTCIpOwoJJG9bJ2R1cF9tYXAnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAoU0VMRUNUIHByb2R1Y3RfaWQgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIEdST1VQIEJZIHByb2R1Y3RfaWQgSEFWSU5HIENPVU5UKCopPjEpIHgiKTsKCSRvWydiYWRfcm93cyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGFtb3VudF9mcm9tX2cgPiBhbW91bnRfdG9fZyIpOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=";
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:30*1024*1024});}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
const a=sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_ngw=Ng7Xx3Cc&confirm=APPLY_NG"');
try{ out.apply=JSON.parse(a); }catch(e){ out.apply_raw=a.slice(0,600); }
const php=Buffer.from(V64,'base64').toString('utf8');
fs.writeFileSync('/tmp/v.json',JSON.stringify({name:'TEMP M8 Verify NG',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/v.json "${API}"`);
const v=sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_v2=Vv2Kk7Pp"');
try{ out.verify=JSON.parse(v); }catch(e){ out.verify_raw=v.slice(0,600); }
const k="add_action('wp_loaded',function(){if(!isset($_GET['ps_kn'])||$_GET['ps_kn']!=='Rr3Ww8Yy'){return;}global $wpdb;$p=$wpdb->prefix;$a=$wpdb->query(\"DELETE FROM {$p}snippets WHERE name LIKE 'TEMP M8%'\");$b=$wpdb->query(\"UPDATE {$p}snippets SET active=0 WHERE name LIKE 'Exclusion NG Feeding%'\");echo wp_json_encode(array('temp_deleted'=>$a,'ng_deactivated'=>$b));exit;});";
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill N',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kn=Rr3Ww8Yy"').slice(0,90);
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,300); }
ghPut('screenshots/m8_ngapply.json',Buffer.from(JSON.stringify(out)),'NG apply + verify');
console.log('DONE');
