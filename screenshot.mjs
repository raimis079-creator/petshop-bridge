import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2RiZzknXSkgfHwgJF9HRVRbJ3BzX2RiZzknXSE9PSdEYmc5eCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICR0PSR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOyAkbz1hcnJheSgpOwogIGlmKGlzc2V0KCRfR0VUWydjbGVhbnVwJ10pKXsKICAgICRvWydpc3RyaW50YSddPSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJHQgV0hFUkUgcGV0X25hbWU9J1paVEVTVFBOJyIpOwogIH0KICAkb1sncm93J109JHdwZGItPmdldF9yb3coIlNFTEVDVCBpZCxwZXRfbmFtZSxwcmltYXJ5X25lZWQscHJpbWFyeV9uZWVkX290aGVyLGlzX3Rlc3Qsc3RhdHVzLGRlbGV0ZWRfYXQgRlJPTSAkdCBXSEVSRSBwZXRfbmFtZT0nWlpURVNUUE4nIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsQVJSQVlfQSk7CiAgJG9bJ2lzX3Rlc3RfMF9laWx1dGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQscGV0X25hbWUsdXNlcl9pZCxjcmVhdGVkX2F0IEZST00gJHQgV0hFUkUgaXNfdGVzdD0wIixBUlJBWV9BKTsKICAkb1snaXNfdGVzdF8xJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgaXNfdGVzdD0xIik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
const BASE='https://dev.avesa.lt/wp-json/petshop/v1';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function rest(method, path, body){
  if(body){ fs.writeFileSync('/tmp/rb.json', JSON.stringify(body));
    return execSync('curl -sk '+AUTH+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/rb.json "'+BASE+path+'"',{maxBuffer:20e6,timeout:60000}).toString(); }
  return execSync('curl -sk '+AUTH+' -X '+method+' "'+BASE+path+'"',{maxBuffer:20e6,timeout:60000}).toString();
}
function dbg(extra){
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_dbg9=Dbg9x'+(extra||'')+'"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}');
  try{ return JSON.parse(r.slice(a,b+1)); }catch(e){ return {raw:r.slice(0,200)}; }
}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  const mk=wj('POST','code-snippets/v1/snippets',{name:'DBG9 (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,200);}
  execSync('sleep 5');
  // svara: pasalinam senus ZZTESTPN
  dbg('&cleanup=1');
  // T1 CREATE per HTTP POST
  const c1=rest('POST','/pet-profile',{species:'dog',pet_name:'ZZTESTPN',primary_need:'other',primary_need_other:'<b>dantu</b> akmenys'});
  o.create_atsakymas=c1.slice(0,220);
  let st=dbg(); o.T1=st.row;
  const pid = st.row ? st.row.id : null; o.pet_id=pid;
  if(pid){
    // T2 PATCH -> joints
    o.p2=rest('PATCH','/pet-profile/'+pid,{primary_need:'joints'}).slice(0,120);
    o.T2=dbg().row;
    // T3 PATCH -> none + tekstas
    o.p3=rest('PATCH','/pet-profile/'+pid,{primary_need:'none',primary_need_other:'neturetu likti'}).slice(0,120);
    o.T3=dbg().row;
    // T4 PATCH -> sena reiksme daily
    o.p4=rest('PATCH','/pet-profile/'+pid,{primary_need:'daily'}).slice(0,120);
    o.T4=dbg().row;
    // T5 PATCH -> other + 200 simboliu
    o.p5=rest('PATCH','/pet-profile/'+pid,{primary_need:'other',primary_need_other:'A'.repeat(200)}).slice(0,120);
    const t5=dbg().row; o.T5={need:t5?t5.primary_need:null, ilgis:t5&&t5.primary_need_other?String(t5.primary_need_other).length:0};
  }
  // isvalom + galutine busena
  const fin=dbg('&cleanup=1');
  o.po_valymo_liko=fin.row;
  o.is_test_0_eilutes=fin.is_test_0_eilutes;
  o.is_test_1=fin.is_test_1;
}catch(e){o.err=String(e).slice(0,250);}
try{ if(sid!=null) execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('httpver.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
