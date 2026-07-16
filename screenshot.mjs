const VER_B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcXZyJ10pfHwkX0dFVFsncHNfcXZyJ10hPT0nVnE5WnQ1TG4nKXtyZXR1cm47fQoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJFY9J3F1YXR0cm9fa2dzaG9wX3BldGlydmV0XzIwMjYtMDctMTYnOwoJJG89YXJyYXkoKTsKCSRvWydkYiddPWFycmF5KAoJICd0YWJsZXMnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIiksCgkgJ3Jvd3MnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfcm93cyIpLAoJICdtYXAnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIiksCgkgJ3ZlcmlmaWVkJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwZn1wc19mZWVkaW5nX3RhYmxlcyBXSEVSRSBzdGF0dXM9J3ZlcmlmaWVkJyIpLAoJKTsKCSRvWydxdWF0dHJvJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAoJICAiU0VMRUNUIGlkLGxpbmUsc2hhcGUscm93X2RpbWVuc2lvbix3ZWlnaHRfYmFzaXMsc3RhdHVzLHJvd19jb3VudCx2ZXJpZmllZF9ieSBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgc291cmNlX3ZlcnNpb249JXMgT1JERVIgQlkgaWQiLCRWKSwgQVJSQVlfQSk7Cgkkb1sncXVhdHRyb19uJ109Y291bnQoJG9bJ3F1YXR0cm8nXSk7CgkvLyBzYXJnYWkKCSRvWydjaGVja3MnXT1hcnJheSgKCSAnb3JwaGFuX3Jvd3MnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfcm93cyByIExFRlQgSk9JTiB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIHQgT04gdC5pZD1yLmZlZWRpbmdfdGFibGVfaWQgV0hFUkUgdC5pZCBJUyBOVUxMIiksCgkgJ29ycGhhbl9tYXAnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIG0gTEVGVCBKT0lOIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgdCBPTiB0LmlkPW0uZmVlZGluZ190YWJsZV9pZCBXSEVSRSB0LmlkIElTIE5VTEwiKSwKCSAncHJvZHVjdHNfMnBsdXMnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAoU0VMRUNUIHByb2R1Y3RfaWQgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIEdST1VQIEJZIHByb2R1Y3RfaWQgSEFWSU5HIENPVU5UKCopPjEpIHgiKSwKCSAnaW52ZXJ0ZWRfYW1vdW50Jz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwZn1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgYW1vdW50X2Zyb21fZz5hbW91bnRfdG9fZyIpLAoJICdpbnZlcnRlZF93ZWlnaHQnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfcm93cyBXSEVSRSB3ZWlnaHRfZnJvbV9rZz53ZWlnaHRfdG9fa2ciKSwKCSAndmVyaWZpZWRfbnVsbF9iYXNpcyc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgc3RhdHVzPSd2ZXJpZmllZCcgQU5EIHdlaWdodF9iYXNpcyBJUyBOVUxMIiksCgkpOwoJLy8gcm93X2NvdW50ID0gZmFrdGFzPwoJJGJhZD0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoCgkgICJTRUxFQ1QgdC5pZCx0LnJvd19jb3VudCxDT1VOVChyLmlkKSBhY3QgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIHQgTEVGVCBKT0lOIHskcGZ9cHNfZmVlZGluZ19yb3dzIHIgT04gci5mZWVkaW5nX3RhYmxlX2lkPXQuaWQKCSAgIFdIRVJFIHQuc291cmNlX3ZlcnNpb249JXMgR1JPVVAgQlkgdC5pZCx0LnJvd19jb3VudCBIQVZJTkcgdC5yb3dfY291bnQ8PkNPVU5UKHIuaWQpIiwkViksIEFSUkFZX0EpOwoJJG9bJ2NoZWNrcyddWydyb3djb3VudF9taXNtYXRjaCddPWNvdW50KCRiYWQpOyAkb1sncm93Y291bnRfYmFkJ109JGJhZDsKCS8vIG1hcCAtPiBwcm9kdWt0YWkKCSRvWydxdWF0dHJvX3Byb2R1Y3RzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAoJICAiU0VMRUNUIG0ucHJvZHVjdF9pZCwgdC5saW5lIEZST00geyRwZn1wc19mZWVkaW5nX21hcCBtIEpPSU4geyRwZn1wc19mZWVkaW5nX3RhYmxlcyB0IE9OIHQuaWQ9bS5mZWVkaW5nX3RhYmxlX2lkCgkgICBXSEVSRSB0LnNvdXJjZV92ZXJzaW9uPSVzIE9SREVSIEJZIHQuaWQiLCRWKSwgQVJSQVlfQSk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(name,obj){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'qapply',content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U); fs.writeFileSync('/tmp/wpp',P);
function hit(url){ try{ return execSync(`curl -sk -m 150 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${url}"`,{maxBuffer:60*1024*1024}).toString(); }catch(e){ return 'ERR:'+String(e.message).slice(0,150); } }
function wpJson(method,p,payload){ fs.writeFileSync('/tmp/body.json',JSON.stringify(payload));
 try{ return execSync(`curl -sk -m 60 -X ${method} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:60*1024*1024}).toString(); }catch(e){ return 'ERR'; } }
const o={};

// 1. APPLY per #1013 (ijungiam -> vykdom -> isjungiam)
wpJson('POST','code-snippets/v1/snippets/1013',{active:true});
const ap = hit('https://dev.avesa.lt/?ps_qfw=Qf7Kx2Rm&confirm=APPLY_QUATTRO');
try{ o.apply=JSON.parse(ap); }catch(e){ o.apply_raw=ap.slice(0,1200); }
const off=wpJson('POST','code-snippets/v1/snippets/1013',{active:false});
try{ o.snip1013_off=JSON.parse(off).active===false; }catch(e){}

// 2. NEPRIKLAUSOMA VERIFIKACIJA - atskiras read-only snippetas, kitas kodas
const vphp=Buffer.from(VER_B64,'base64').toString('utf8');
const mk=wpJson('POST','code-snippets/v1/snippets',{name:'Quattro Feeding Verify v1 (read-only)',code:vphp,scope:'front-end',active:true,priority:10});
let vid=null; try{ const j=JSON.parse(mk); vid=j.id; o.verify_snippet={id:j.id,code_error:j.code_error||null}; }catch(e){ o.mk_raw=mk.slice(0,300); }
if(vid){
  const vr=hit('https://dev.avesa.lt/?ps_qvr=Vq9Zt5Ln');
  try{ o.verify=JSON.parse(vr); }catch(e){ o.verify_raw=vr.slice(0,1200); }
  const voff=wpJson('POST',`code-snippets/v1/snippets/${vid}`,{active:false});
  try{ o.verify_off=JSON.parse(voff).active===false; }catch(e){}
}
putResult('qapply.json',o);
console.log('DONE');
