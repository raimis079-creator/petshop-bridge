import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lt',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cblt.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cblt.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2xhdGV0cmFwJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIHVwZGF0ZV9vcHRpb24oJ3BzY19sYXRldHJhcF9vbicsIHRpbWUoKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnYXJtZWQnPT50cnVlKSk7IGV4aXQ7Cn0pOwovLyBsYWJhaSB2xJdseXZhcyAtIHBvIHZpc8WzIGtpdMWzCmFkZF9hY3Rpb24oJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfcXVlcnknLCBmdW5jdGlvbigkcSl7CiAgaWYgKCFnZXRfb3B0aW9uKCdwc2NfbGF0ZXRyYXBfb24nKSkgcmV0dXJuOwogIGlmICghaXNzZXQoJF9HRVRbJ2ZpbHRlcl90aXBhcyddKSkgcmV0dXJuOwogIHVwZGF0ZV9vcHRpb24oJ3BzY19sYXRldHJhcF9kdW1wJywgYXJyYXkoJ3RheF9xdWVyeV9hdF85OTk5Jz0+JHEtPmdldCgndGF4X3F1ZXJ5JykpKTsKfSwgOTk5OSk7Ci8vIElyIHBhxI1pdSDFvmVtaWF1c2l1IGx5Z2l1IC0gZ2FsdXRpbmlzIFNRTAphZGRfZmlsdGVyKCdwb3N0c193aGVyZScsIGZ1bmN0aW9uKCR3aGVyZSwgJHEpewogIGlmICghZ2V0X29wdGlvbigncHNjX2xhdGV0cmFwX29uJykpIHJldHVybiAkd2hlcmU7CiAgaWYgKCFpc3NldCgkX0dFVFsnZmlsdGVyX3RpcGFzJ10pKSByZXR1cm4gJHdoZXJlOwogIGlmICghJHEtPmlzX21haW5fcXVlcnkoKSkgcmV0dXJuICR3aGVyZTsKICAkcHJldiA9IGdldF9vcHRpb24oJ3BzY19sYXRldHJhcF93aGVyZScsJycpOwogIHVwZGF0ZV9vcHRpb24oJ3BzY19sYXRldHJhcF93aGVyZScsIHN1YnN0cigkd2hlcmUsMCw1MDApKTsKICByZXR1cm4gJHdoZXJlOwp9LCA5OTk5LCAyKTsK",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b556.json', JSON.stringify({name:'PSC LATETRAP', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b556.json "'+BASE+'/wp-json/code-snippets/v1/snippets/556"');
  exec('curl -sk -m 25 "'+BASE+'/?psc_latetrap=1&k=ps2026"');
  exec('curl -sk -m 30 "'+BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?yith_wcan=1&filter_tipas=uzdaras-namelis&query_type_tipas=or&nc='+Date.now()+'" -o /dev/null');
  await new Promise(r=>setTimeout(r,1500));
  fs.writeFileSync('/tmp/b555.json', JSON.stringify({name:'PSC LATERD', code:"<?php add_action('init',function(){ if(($_GET['psc_laterd']??'')!=='1')return; if(($_GET['k']??'')!=='ps2026'&&!current_user_can('manage_options'))return; $d=array('dump'=>get_option('psc_latetrap_dump','(nėra)'),'where'=>get_option('psc_latetrap_where','(nėra)')); delete_option('psc_latetrap_on'); delete_option('psc_latetrap_dump'); delete_option('psc_latetrap_where'); header('Content-Type: application/json'); echo wp_json_encode($d); exit; });", scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b555.json "'+BASE+'/wp-json/code-snippets/v1/snippets/555"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_laterd=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out=m?JSON.parse(m[0]):(r||'').slice(0,400);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/555"');
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/556"');
  commit('late_trap.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
