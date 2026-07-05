import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rp',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrp.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrp.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3JwJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIAogICRtZW51X2l0ZW1faWQgPSAzNDEyODsgLy8gUEFTSVVMWU1BSQogICRwYWdlX2lkID0gMzQ0Nzc7CiAgJHBhZ2VfdXJsID0gZ2V0X3Blcm1hbGluaygkcGFnZV9pZCk7CiAgCiAgLy8gTnVzdGF0b20gcGF2YWRpbmltYSAoc3ZhcmJ1IC0gY3VzdG9tIHB1bmt0dWkpICsgbnVrcmVpcGlhbSBpIHB1c2xhcGkKICB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kbWVudV9pdGVtX2lkLCAncG9zdF90aXRsZSc9PidQQVNJxapMWU1BSScsICdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJykpOwogIHVwZGF0ZV9wb3N0X21ldGEoJG1lbnVfaXRlbV9pZCwgJ19tZW51X2l0ZW1fdHlwZScsICdjdXN0b20nKTsKICB1cGRhdGVfcG9zdF9tZXRhKCRtZW51X2l0ZW1faWQsICdfbWVudV9pdGVtX29iamVjdCcsICdjdXN0b20nKTsKICB1cGRhdGVfcG9zdF9tZXRhKCRtZW51X2l0ZW1faWQsICdfbWVudV9pdGVtX29iamVjdF9pZCcsICRtZW51X2l0ZW1faWQpOwogIHVwZGF0ZV9wb3N0X21ldGEoJG1lbnVfaXRlbV9pZCwgJ19tZW51X2l0ZW1fdXJsJywgJHBhZ2VfdXJsKTsKICB1cGRhdGVfcG9zdF9tZXRhKCRtZW51X2l0ZW1faWQsICdfbWVudV9pdGVtX3RpdGxlJywgJ1BBU0nFqkxZTUFJJyk7CiAgd3BfY2FjaGVfZGVsZXRlKCduYXZfbWVudV9pdGVtcycsJ2RlZmF1bHQnKTsKICAKICAkcCA9IGdldF9wb3N0KCRtZW51X2l0ZW1faWQpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CiAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgKICAgICdtZW51X2lkJz0+JG1lbnVfaXRlbV9pZCwgJ3RpdGxlJz0+JHAtPnBvc3RfdGl0bGUsCiAgICAnbmV3X3VybCc9PmdldF9wb3N0X21ldGEoJG1lbnVfaXRlbV9pZCwnX21lbnVfaXRlbV91cmwnLHRydWUpLAogICAgJ3R5cGUnPT5nZXRfcG9zdF9tZXRhKCRtZW51X2l0ZW1faWQsJ19tZW51X2l0ZW1fdHlwZScsdHJ1ZSksCiAgICAncGFnZV91cmwnPT4kcGFnZV91cmwsCiAgKSk7CiAgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC RP', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_rp=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('redirect_pas.json', m?m[0]:(r||'').slice(0,500));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  // Verify: puslapio turinys + meniu
  var page = exec('curl -sk -m 25 "'+BASE+'/pasiulymai/"');
  var home = exec('curl -sk -m 25 "'+BASE+'/"');
  commit('verify_pas.json', JSON.stringify({
    page_status: exec('curl -sk -m 15 -o /dev/null -w "%{http_code}" "'+BASE+'/pasiulymai/"'),
    page_has_filter: page.includes('psc-po-filter'),
    page_has_visi: page.includes('Visi'),
    page_has_miamor: page.includes('miamor-konservai'),
    page_has_excl: page.includes('exclusion-hypo'),
    page_no_products_msg: page.includes('Produktų nerasta') || page.includes('pasiūlymų nėra'),
    menu_pasiulymai_to_page: home.includes('/pasiulymai/'),
  }));
  console.log('done');
})();
