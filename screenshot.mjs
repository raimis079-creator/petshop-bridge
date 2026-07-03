import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'brt',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbbrt.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbbrt.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2JydHJhcCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICB1cGRhdGVfb3B0aW9uKCdwc2NfYnJ0cmFwX29uJywgdGltZSgpKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdhcm1lZCc9PnRydWUpKTsgZXhpdDsKfSk7CmFkZF9hY3Rpb24oJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfcXVlcnknLCBmdW5jdGlvbigkcSl7CiAgaWYgKCFnZXRfb3B0aW9uKCdwc2NfYnJ0cmFwX29uJykpIHJldHVybjsKICBpZiAoIWlzc2V0KCRfR0VUWydmaWx0ZXJfdGlwYXMnXSkpIHJldHVybjsKICAkcW8gPSBnZXRfcXVlcmllZF9vYmplY3QoKTsKICB1cGRhdGVfb3B0aW9uKCdwc2NfYnJ0cmFwX2R1bXAnLCBhcnJheSgKICAgICdpc19wcm9kdWN0X2NhdGVnb3J5X2ZuJz0+IChmdW5jdGlvbl9leGlzdHMoJ2lzX3Byb2R1Y3RfY2F0ZWdvcnknKSAmJiBpc19wcm9kdWN0X2NhdGVnb3J5KCd0dWFsZXRhaS1rcmFpa2FpLXNlbXR1dmVsaWFpJykpID8gJ3RydWUnOidmYWxzZScsCiAgICAnaXNfcHJvZHVjdF9jYXRlZ29yeV9hbnknPT4gKGZ1bmN0aW9uX2V4aXN0cygnaXNfcHJvZHVjdF9jYXRlZ29yeScpICYmIGlzX3Byb2R1Y3RfY2F0ZWdvcnkoKSkgPyAndHJ1ZSc6J2ZhbHNlJywKICAgICdxdWVyaWVkX29iamVjdF90eXBlJz0+ICRxbyA/IGdldF9jbGFzcygkcW8pIDogJ251bGwnLAogICAgJ3F1ZXJpZWRfdGVybV9pZCc9PiAoJHFvICYmIGlzc2V0KCRxby0+dGVybV9pZCkpID8gJHFvLT50ZXJtX2lkIDogJ25vbmUnLAogICAgJ3F1ZXJpZWRfc2x1Zyc9PiAoJHFvICYmIGlzc2V0KCRxby0+c2x1ZykpID8gJHFvLT5zbHVnIDogJ25vbmUnLAogICAgJ3RheF9xdWVyeV9maW5hbCc9PiAkcS0+Z2V0KCd0YXhfcXVlcnknKSwKICAgICdmaWx0ZXJfdGlwYXMnPT4gJF9HRVRbJ2ZpbHRlcl90aXBhcyddLAogICkpOwp9LCAyNSk7IC8vIHBvIGJyaWRnZSAoMjApCg==",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b556.json', JSON.stringify({name:'PSC BRTRAP', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b556.json "'+BASE+'/wp-json/code-snippets/v1/snippets/556"');
  exec('curl -sk -m 25 "'+BASE+'/?psc_brtrap=1&k=ps2026"');
  // pilnas puslapio užkrovimas su filter
  exec('curl -sk -m 30 "'+BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?yith_wcan=1&filter_tipas=uzdaras-namelis&query_type_tipas=or&nc='+Date.now()+'" -o /dev/null');
  await new Promise(r=>setTimeout(r,1500));
  // skaitom
  fs.writeFileSync('/tmp/b555.json', JSON.stringify({name:'PSC BRTRAPRD', code:"<?php add_action('init',function(){ if(($_GET['psc_brtraprd']??'')!=='1')return; if(($_GET['k']??'')!=='ps2026'&&!current_user_can('manage_options'))return; $d=get_option('psc_brtrap_dump','(nėra)'); delete_option('psc_brtrap_on'); delete_option('psc_brtrap_dump'); header('Content-Type: application/json'); echo wp_json_encode($d); exit; });", scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b555.json "'+BASE+'/wp-json/code-snippets/v1/snippets/555"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_brtraprd=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out.dump=m?JSON.parse(m[0]):(r||'').slice(0,300);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/555"');
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/556"');
  commit('bridge_trap.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
