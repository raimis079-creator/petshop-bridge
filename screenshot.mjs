import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}

const OUT={};
const AUTH='-u "'+WU+':'+WP+'"';
const API=SITE+'/wp-json/code-snippets/v1/snippets';
const KEY='Mc9x';

const PHP_B64='PD9waHAKLyoqCiAqIFRFTVAgTWl4ZWQgQ29udGVudCBSZWNvbiB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfbWMnXSkgfHwgJF9HRVRbJ3BzX21jJ10gIT09ICdNYzl4JyApIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsKICAgICRyID0gYXJyYXkoKTsKICAgICRyWydzaXRldXJsJ10gPSBnZXRfb3B0aW9uKCdzaXRldXJsJyk7CiAgICAkclsnaG9tZSddICAgID0gZ2V0X29wdGlvbignaG9tZScpOwogICAgJHVkID0gd3BfdXBsb2FkX2RpcigpOwogICAgJHJbJ3VwbG9hZF9iYXNldXJsJ10gPSAkdWRbJ2Jhc2V1cmwnXTsKICAgICRyWydpc19zc2wnXSA9IGlzX3NzbCgpID8gMSA6IDA7CiAgICAkclsnZm9yY2Vfc3NsX2FkbWluJ10gPSBkZWZpbmVkKCdGT1JDRV9TU0xfQURNSU4nKSA/IChGT1JDRV9TU0xfQURNSU4/MTowKSA6ICd1bmRlZic7CgogICAgLy8gdmlzb3MgY21wbHpfKiBvcGNpam9zIHN1IGh0dHA6Ly8KICAgICRyb3dzID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICJTRUxFQ1Qgb3B0aW9uX25hbWUsIG9wdGlvbl92YWx1ZSBGUk9NIHskd3BkYi0+b3B0aW9uc30KICAgICAgICAgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnY21wbHolJyBBTkQgb3B0aW9uX3ZhbHVlIExJS0UgJyVodHRwOi8vJScgTElNSVQgNjAiLCBBUlJBWV9BKTsKICAgICRoaXRzID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKChhcnJheSkkcm93cyBhcyAkcm93KSB7CiAgICAgICAgJHYgPSAkcm93WydvcHRpb25fdmFsdWUnXTsKICAgICAgICBwcmVnX21hdGNoX2FsbCgnI2h0dHA6Ly9bXlxzIlwnXFxcXDw+KV0rI2knLCAkdiwgJG0pOwogICAgICAgICR1ID0gYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVswXSkpOwogICAgICAgICRoaXRzW10gPSBhcnJheSgnb3B0Jz0+JHJvd1snb3B0aW9uX25hbWUnXSwgJ3VybHMnPT5hcnJheV9zbGljZSgkdSwwLDYpLCAnbGVuJz0+c3RybGVuKCR2KSk7CiAgICB9CiAgICAkclsnY21wbHpfaHR0cF9vcHRpb25zJ10gPSAkaGl0czsKCiAgICAvLyBCRVQgS09LSU9TIG9wY2lqb3Mgc3UgaHR0cDovL2Rldi5hdmVzYS5sdAogICAgJHJvd3MyID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9CiAgICAgICAgIFdIRVJFIG9wdGlvbl92YWx1ZSBMSUtFICclaHR0cDovL2Rldi5hdmVzYS5sdCUnIExJTUlUIDQwIiwgQVJSQVlfQSk7CiAgICAkclsnYW55X29wdGlvbl9odHRwX2RldiddID0gd3BfbGlzdF9wbHVjaygoYXJyYXkpJHJvd3MyLCAnb3B0aW9uX25hbWUnKTsKCiAgICAvLyBDb21wbGlhbnogdmVyc2lqYQogICAgJHJbJ2NtcGx6X3ZlcnNpb24nXSA9IGdldF9vcHRpb24oJ2NtcGx6X3ZlcnNpb24nKTsKICAgICRyWydjbXBsel91cGxvYWRfdXJsJ10gPSBnZXRfb3B0aW9uKCdjbXBsel91cGxvYWRfdXJsJyk7CgogICAgLy8gYXIgQ1NTIGZhaWxhcyBmaXppc2thaSB5cmEKICAgICRjc3MgPSAkdWRbJ2Jhc2VkaXInXS4nL2NvbXBsaWFuei9jc3MvYmFubmVyLTEtb3B0aW4uY3NzJzsKICAgICRyWydjc3NfZmlsZV9leGlzdHMnXSA9IGZpbGVfZXhpc3RzKCRjc3MpID8gMSA6IDA7CiAgICAkclsnY3NzX2V4cGVjdGVkX3VybCddID0gJHVkWydiYXNldXJsJ10uJy9jb21wbGlhbnovY3NzL2Jhbm5lci0xLW9wdGluLmNzcyc7CgogICAgbm9jYWNoZV9oZWFkZXJzKCk7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1VORVNDQVBFRF9VTklDT0RFKTsKICAgIGV4aXQ7Cn0sIDEpOwo=';
const php=Buffer.from(PHP_B64,'base64').toString('utf8');

let sid=null;
try{
  fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Mixed Content Recon v1',code:php,scope:'global',active:true}));
  const r=execSync('curl -s '+AUTH+' -H "Content-Type: application/json" -X POST -d @/tmp/sn.json "'+API+'"',{maxBuffer:20e6}).toString();
  let j=null; try{ j=JSON.parse(r); }catch(e){}
  sid=j&&j.id?j.id:null;
  OUT.snippet_id=sid; if(!sid) OUT.create_raw=r.slice(0,300);

  if(sid){
    execSync('sleep 3');
    const out=execSync('curl -s "'+SITE+'/?ps_mc='+KEY+'"',{maxBuffer:20e6}).toString();
    try{ OUT.data=JSON.parse(out); }catch(e){ OUT.raw=out.slice(0,3000); }
  }
}catch(e){ OUT.err=String(e).slice(0,300); }

try{ if(sid){
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  execSync('curl -s -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST -d @/tmp/de.json "'+API+'/'+sid+'"');
  execSync('curl -s -o /dev/null '+AUTH+' -X DELETE "'+API+'/'+sid+'"');
  const chk=execSync('curl -s '+AUTH+' "'+API+'/'+sid+'"',{maxBuffer:5e6}).toString();
  OUT.cleanup = chk.includes('rest_') || chk.trim()==='' ? 'DELETED' : 'STILL_EXISTS';
}}catch(e){ OUT.cleanup_err=String(e).slice(0,200); }

putB64('mc2.json', Buffer.from(JSON.stringify(OUT,null,1)).toString('base64'));
console.log('done');
