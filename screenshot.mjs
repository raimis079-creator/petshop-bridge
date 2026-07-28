import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2F4J10pIHx8ICRfR0VUWydwc19heCddIT09J0F4eCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgJHJvd3M9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ19yb3dzJzsgJHRhYnM9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ190YWJsZXMnOwogIC8vIDEuIHNpb3MgbGVudGVsZXMgbWV0YWR1b21lbnlzCiAgJG9bJ2xlbnRlbGVfMjQzJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00gJHRhYnMgV0hFUkUgaWQ9MjQzIixBUlJBWV9BKTsKICAkb1snZWlsdXRlc18yNDNfcGlsbm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NICRyb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9MjQzIE9SREVSIEJZIHJvd19vcmRlciBMSU1JVCA0IixBUlJBWV9BKTsKICAvLyAyLiBhciBrdXIgbm9ycyBzaXN0ZW1vamUgWVJBIGFrdHl2dW1vIGFzaXMKICAkb1snc3VfY29uZGl0aW9uJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHJvd3MgV0hFUkUgY29uZGl0aW9uX2RpbWVuc2lvbnMgSVMgTk9UIE5VTEwgQU5EIGNvbmRpdGlvbl9kaW1lbnNpb25zPD4nJyIpOwogICRvWyd2aXNvX2VpbHVjaXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkcm93cyIpOwogICRvWydjb25kaXRpb25fcGF2eXpkemlhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERJU1RJTkNUIGNvbmRpdGlvbl9kaW1lbnNpb25zLCBjb25kaXRpb25fcmF3IEZST00gJHJvd3MKICAgIFdIRVJFIGNvbmRpdGlvbl9kaW1lbnNpb25zIElTIE5PVCBOVUxMIEFORCBjb25kaXRpb25fZGltZW5zaW9uczw+JycgTElNSVQgOCIsQVJSQVlfQSk7CiAgLy8gMy4ga2llayBsZW50ZWxpdSB0dXJpIEtFTElBUyBlaWx1dGVzIHRhbSBwYWNpYW0gc3Zvcml1aSAodC55LiBhc2lzKQogICRvWydsZW50ZWxpdV9zdV9kYXVnaWF1X2VpbHVjaXVfcGVyX3N2b3JpJ109KGludCkkd3BkYi0+Z2V0X3ZhcigKICAgICJTRUxFQ1QgQ09VTlQoKikgRlJPTSAoU0VMRUNUIGZlZWRpbmdfdGFibGVfaWQsIHdlaWdodF9mcm9tX2tnLCBDT1VOVCgqKSBjIEZST00gJHJvd3MKICAgICBHUk9VUCBCWSBmZWVkaW5nX3RhYmxlX2lkLCB3ZWlnaHRfZnJvbV9rZyBIQVZJTkcgYz4xKSB4Iik7CiAgLy8gNC4gVEFTS0lORVMgdnMgSU5URVJWQUxJTkVTIGxlbnRlbGVzCiAgJG9bJ3Rhc2tpbmVzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIGZlZWRpbmdfdGFibGVfaWQpIEZST00gJHJvd3MgV0hFUkUgd2VpZ2h0X2Zyb21fa2cgPSB3ZWlnaHRfdG9fa2ciKTsKICAkb1snaW50ZXJ2YWxpbmVzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIGZlZWRpbmdfdGFibGVfaWQpIEZST00gJHJvd3MgV0hFUkUgd2VpZ2h0X2Zyb21fa2cgPD4gd2VpZ2h0X3RvX2tnIik7CiAgJG9bJ2xlbnRlbGl1X3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgZmVlZGluZ190YWJsZV9pZCkgRlJPTSAkcm93cyIpOwogIC8vIDUuIGFyIGFtb3VudF9mcm9tIDw+IGFtb3VudF90byBkYXpuYWkKICAkb1snZWlsdWNpdV9zdV9hbW91bnRfaW50ZXJ2YWx1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHJvd3MgV0hFUkUgYW1vdW50X2Zyb21fZyA8PiBhbW91bnRfdG9fZyIpOwogICRvWydlaWx1Y2l1X3N1X3ZpZW51X2Ftb3VudCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRyb3dzIFdIRVJFIGFtb3VudF9mcm9tX2cgPSBhbW91bnRfdG9fZyIpOwogIC8vIDYuIGF1Z2ludGluaW8gYWt0eXZ1bW8gbGF1a2FzCiAgJHQ9JHdwZGItPnByZWZpeC4ncHNfcGV0cyc7CiAgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICR0Iik7CiAgJG9bJ3BldHNfYWt0eXZ1bW9fbGF1a2FpJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkY29scyxmdW5jdGlvbigkYyl7cmV0dXJuIHByZWdfbWF0Y2goJy9hY3Rpdnxha3R5di9pJywkYyk7fSkpOwogICRvWydha3R5dnVtb19yZWlrc21lcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGFjdGl2aXR5X2hpbnQgdiwgQ09VTlQoKikgYyBGUk9NICR0IFdIRVJFIGRlbGV0ZWRfYXQgSVMgTlVMTCBHUk9VUCBCWSBhY3Rpdml0eV9oaW50IixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk --max-time 150 '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:170000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  let mk=null;
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'AX '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_ax=Axx"',{maxBuffer:8e6,timeout:110000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,300); }catch(e){ o.e=String(e).slice(0,150); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('ax.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
