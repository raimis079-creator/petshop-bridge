import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'mqt',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbmqt.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbmqt.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX21xdCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICB1cGRhdGVfb3B0aW9uKCdwc2NfbXF0X29uJywgdGltZSgpKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdhcm1lZCc9PnRydWUpKTsgZXhpdDsKfSk7Ci8vIEZpa3N1b2phIHBhZ3JpbmRpbsSXcyBrYXRlZ29yaWpvcyB1xb5rbGF1c29zIHRheF9xdWVyeSBrYWkgeXJhIGZpbHRlcl90aXBhcwphZGRfYWN0aW9uKCd3b29jb21tZXJjZV9wcm9kdWN0X3F1ZXJ5JywgZnVuY3Rpb24oJHEpewogIGlmICghZ2V0X29wdGlvbigncHNjX21xdF9vbicpKSByZXR1cm47CiAgaWYgKCFpc3NldCgkX0dFVFsnZmlsdGVyX3RpcGFzJ10pKSByZXR1cm47CiAgdXBkYXRlX29wdGlvbigncHNjX21xdF9kdW1wJywgYXJyYXkoCiAgICAndGF4X3F1ZXJ5Jz0+JHEtPmdldCgndGF4X3F1ZXJ5JyksCiAgICAnZ2V0X2ZpbHRlcl90aXBhcyc9PiRfR0VUWydmaWx0ZXJfdGlwYXMnXSA/PyAnJywKICAgICdmb3VuZCc9Pid3aWxsX2NoZWNrX2FmdGVyJywKICApKTsKfSwgOTk5KTsKLy8gUG8gdcW+a2xhdXNvcyAtIGtpZWsgcmFkbwphZGRfYWN0aW9uKCd3b29jb21tZXJjZV9hZnRlcl9tYWluX2NvbnRlbnQnLCBmdW5jdGlvbigpewogIGlmICghZ2V0X29wdGlvbigncHNjX21xdF9vbicpKSByZXR1cm47CiAgaWYgKCFpc3NldCgkX0dFVFsnZmlsdGVyX3RpcGFzJ10pKSByZXR1cm47CiAgZ2xvYmFsICR3cF9xdWVyeTsKICAkZCA9IGdldF9vcHRpb24oJ3BzY19tcXRfZHVtcCcsIGFycmF5KCkpOwogICRkWydmb3VuZF9wb3N0cyddPSR3cF9xdWVyeS0+Zm91bmRfcG9zdHM7CiAgdXBkYXRlX29wdGlvbigncHNjX21xdF9kdW1wJywgJGQpOwp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b556.json', JSON.stringify({name:'PSC MQT', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b556.json "'+BASE+'/wp-json/code-snippets/v1/snippets/556"');
  exec('curl -sk -m 25 "'+BASE+'/?psc_mqt=1&k=ps2026"');
  // Tiesioginė navigacija su filter_tipas (ne AJAX, o pilnas puslapio užkrovimas)
  var url = BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?yith_wcan=1&filter_tipas=uzdaras-namelis&query_type_tipas=or';
  exec('curl -sk -m 30 "'+url+'" -o /dev/null');
  await new Promise(r=>setTimeout(r,1000));
  // skaitom dump
  fs.writeFileSync('/tmp/b555.json', JSON.stringify({name:'PSC MQTREAD', code:"<?php add_action('init',function(){ if(($_GET['psc_mqtread']??'')!=='1')return; if(($_GET['k']??'')!=='ps2026'&&!current_user_can('manage_options'))return; $d=get_option('psc_mqt_dump','(nėra)'); delete_option('psc_mqt_on'); delete_option('psc_mqt_dump'); header('Content-Type: application/json'); echo wp_json_encode($d); exit; });", scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b555.json "'+BASE+'/wp-json/code-snippets/v1/snippets/555"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_mqtread=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out.dump=m?JSON.parse(m[0]):r.slice(0,300);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/555"');
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/556"');
  commit('mqt_dump.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
