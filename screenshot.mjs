import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2Z0diddKSB8fCAkX0dFVFsncHNfZnR2J10hPT0nRnR2eCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICR0PSR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOyAkbz1hcnJheSgpOwogIGlmKGlzc2V0KCRfR0VUWydjbGVhbnVwJ10pKXsgJG9bJ2lzdHJpbnRhJ109JHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkdCBXSEVSRSBwZXRfbmFtZT0nWlpGVCciKTsgfQogICRvWydyb3cnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLGZlZWRpbmdfdHlwZSxmZWVkaW5nX3R5cGVfb3RoZXIsd2V0X2Zvb2RfZyxpc190ZXN0IEZST00gJHQgV0hFUkUgcGV0X25hbWU9J1paRlQnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsQVJSQVlfQSk7CiAgaWYoaXNzZXQoJF9HRVRbJ21hcmtlcnMnXSkpewogICAgJGQ9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS8nOwogICAgJHByPWZpbGVfZ2V0X2NvbnRlbnRzKCRkLidpbmNsdWRlcy9jbGFzcy1wZXQtcHJvZmlsZS5waHAnKTsKICAgICRwZj1maWxlX2dldF9jb250ZW50cygkZC4nYXNzZXRzL3BldC1mb3JtLmpzJyk7CiAgICAkcHA9ZmlsZV9nZXRfY29udGVudHMoJGQuJ2Fzc2V0cy9wZXQtcHJvZmlsZS5qcycpOwogICAgJG9bJ20nXT1hcnJheSgKICAgICAgJ2VudW0nPT5zdHJwb3MoJHByLCInZHJ5X29ubHknLCAnZHJ5X3dldCcsICdkcnlfaG9tZScsICdkcnlfcmF3JywgJ21vc3RseV93ZXQnLCAnb3RoZXInIikhPT1mYWxzZSwKICAgICAgJ3Nhbml0aXplX3dldCc9PnN0cnBvcygkcHIsImNhc2UgJ3dldF9mb29kX2cnIikhPT1mYWxzZSwKICAgICAgJ2NsZWFyX3J1bGVzJz0+c3RycG9zKCRwciwiaWYgKCBcJG91dFsnZmVlZGluZ190eXBlJ10gIT09ICdkcnlfd2V0JyApIHsgXCRvdXRbJ3dldF9mb29kX2cnXSA9IG51bGw7IH0iKSE9PWZhbHNlLAogICAgICAnZm9ybV9mZWVkRmllbGQnPT5zdHJwb3MoJHBmLCdmdW5jdGlvbiBmZWVkRmllbGQoKScpIT09ZmFsc2UsCiAgICAgICdmb3JtX3dldEJsb2NrJz0+c3RycG9zKCRwZiwnZnVuY3Rpb24gd2V0QW1vdW50QmxvY2soKScpIT09ZmFsc2UsCiAgICAgICdmb3JtX3F1aWNrJz0+c3RycG9zKCRwZiwnV0VUX1FVSUNLJykhPT1mYWxzZSwKICAgICAgJ3Byb2ZpbGVfZmVlZERldGFpbCc9PnN0cnBvcygkcHAsJ2Z1bmN0aW9uIGZlZWREZXRhaWxUZXh0JykhPT1mYWxzZSwKICAgICk7CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
const BASE='https://dev.avesa.lt/wp-json/petshop/v1';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function rest(method, path, body){
  fs.writeFileSync('/tmp/rb.json', JSON.stringify(body||{}));
  return execSync('curl -sk '+AUTH+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/rb.json "'+BASE+path+'"',{maxBuffer:20e6,timeout:60000}).toString();
}
function dbg(extra){
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_ftv=Ftvx'+(extra||'')+'"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}');
  try{ return JSON.parse(r.slice(a,b+1)); }catch(e){ return {raw:r.slice(0,200)}; }
}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={marker:'FTVER'}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  const mk=wj('POST','code-snippets/v1/snippets',{name:'FTV (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  o.markers=(dbg('&markers=1').m)||null;
  dbg('&cleanup=1');
  // T1 create dry_wet + 200g
  rest('POST','/pet-profile',{species:'dog',pet_name:'ZZFT',feeding_type:'dry_wet',wet_food_g:200});
  let st=dbg(); o.T1=st.row; const pid=st.row?st.row.id:null; o.pid=pid;
  if(pid){
    rest('PATCH','/pet-profile/'+pid,{feeding_type:'dry_home'});
    o.T2_dry_home=dbg().row;
    rest('PATCH','/pet-profile/'+pid,{feeding_type:'other',feeding_type_other:'<b>seriu</b> is stalo'});
    o.T3_other=dbg().row;
    rest('PATCH','/pet-profile/'+pid,{feeding_type:'dry_only'});
    o.T4_dry_only=dbg().row;
    rest('PATCH','/pet-profile/'+pid,{feeding_type:'mixed'});
    o.T5_sena_mixed=dbg().row;
    rest('PATCH','/pet-profile/'+pid,{feeding_type:'dry_wet',wet_food_g:5000});
    o.T6_riba=dbg().row;
    rest('PATCH','/pet-profile/'+pid,{feeding_type:'dry_wet',wet_food_g:0});
    o.T7_nulis=dbg().row;
  }
  const fin=dbg('&cleanup=1'); o.po_valymo=fin.row;
}catch(e){o.err=String(e).slice(0,250);}
try{ if(sid!=null) execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('ftver.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
