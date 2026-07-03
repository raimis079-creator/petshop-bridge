import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2NsZWFyY2FjaGUnXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRvdXQ9YXJyYXkoKTsKICAvLyBJZcWha29tIFlJVEggV0NBTiB0cmFuc2llbnTFswogICR0cmFucyA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclX3RyYW5zaWVudCV3Y2FuJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJV90cmFuc2llbnQleWl0aCUnIik7CiAgJG91dFsnZm91bmRfdHJhbnNpZW50cyddPWFycmF5KCk7CiAgZm9yZWFjaCgkdHJhbnMgYXMgJHQpeyAkb3V0Wydmb3VuZF90cmFuc2llbnRzJ11bXT0kdC0+b3B0aW9uX25hbWU7IGRlbGV0ZV9vcHRpb24oJHQtPm9wdGlvbl9uYW1lKTsgfQogIC8vIEJlbmRyYXMgV0MgdHJhbnNpZW50IHZhbHltYXMKICBpZiAoZnVuY3Rpb25fZXhpc3RzKCd3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzJykpIHsKICAgIGRlbGV0ZV90cmFuc2llbnQoJ3djX3Rlcm1fY291bnRzJyk7CiAgfQogIC8vIEZsYXRzb21lL1dQIG9iamVrdMWzIGNhY2hlCiAgd3BfY2FjaGVfZmx1c2goKTsKICAkb3V0WydjbGVhcmVkJ109Y291bnQoJG91dFsnZm91bmRfdHJhbnNpZW50cyddKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC CLEARCACHE', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_clearcache=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('clear_cache.json', m?m[0]:(r||'').slice(0,600)); console.log(m?m[0].slice(0,400):r);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
})();
