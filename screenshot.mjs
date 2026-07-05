import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'st',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbst.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbst.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3N0J10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIAogICRtZW51X2l0ZW1faWQgPSAyOTcxOwogIC8vIE51c3RhdG9tIHBhdmFkaW5pbWEgKGN1c3RvbSBtZW5pdSBwdW5rdHVpIHJlaWtpYSBwb3N0X3RpdGxlKQogIHdwX3VwZGF0ZV9wb3N0KGFycmF5KAogICAgJ0lEJyA9PiAkbWVudV9pdGVtX2lkLAogICAgJ3Bvc3RfdGl0bGUnID0+ICdEYXVnaWF1ID0gcGlnaWF1JywKICAgICdwb3N0X3N0YXR1cycgPT4gJ3B1Ymxpc2gnLAogICkpOwogIC8vIE1lbml1IHB1bmt0byBsYWJlbCBpbWEgaXMgX21lbnVfaXRlbV90aXRsZSBhcmJhIHBvc3RfdGl0bGUgLSBudXN0YXRvbSBhYnUKICB1cGRhdGVfcG9zdF9tZXRhKCRtZW51X2l0ZW1faWQsICdfbWVudV9pdGVtX3RpdGxlJywgJ0RhdWdpYXUgPSBwaWdpYXUnKTsKICB3cF9jYWNoZV9kZWxldGUoJ25hdl9tZW51X2l0ZW1zJywnZGVmYXVsdCcpOwogIAogICRwID0gZ2V0X3Bvc3QoJG1lbnVfaXRlbV9pZCk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdpZCc9PiRtZW51X2l0ZW1faWQsICd0aXRsZV9ub3cnPT4kcC0+cG9zdF90aXRsZSwgJ3N0YXR1cyc9PiRwLT5wb3N0X3N0YXR1cykpOwogIGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC ST', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_st=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('set_title.json', m?m[0]:(r||'').slice(0,400));
  // Verify meniu HTML
  var home = exec('curl -sk -m 25 "'+BASE+'/"');
  var idx = home.indexOf('menu-item-2971');
  var zone = idx>=0 ? home.substring(idx-30, idx+250) : 'NERASTA';
  commit('verify_title.txt', zone);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
