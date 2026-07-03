import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'c107',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbc107.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbc107.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2NtcDEwNyddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAkb3V0PWFycmF5KCk7CiAgLy8gMTA3IHN1IGtyYWlrb190aXBhcyAtIGFyIHRlcm1fdGF4b25vbXlfaWQgZmlsdHJhcyBIVE1MJ2UgdmVpa2lhCiAgLy8gUGF0aWtyaW5hbSBhYmllasWzIGthdGVnb3JpasWzIHByb2R1Y3RfY2F0IHRlcm0gbnVzdGF0eW11cwogIGZvcmVhY2goYXJyYXkoMTA2LDEwNykgYXMgJGNpZCl7CiAgICAkdGVybT1nZXRfdGVybSgkY2lkLCdwcm9kdWN0X2NhdCcpOwogICAgJG91dFskY2lkXT1hcnJheSgKICAgICAgJ3NsdWcnPT4kdGVybS0+c2x1ZywKICAgICAgJ2NvdW50Jz0+JHRlcm0tPmNvdW50LAogICAgICAnZGlzcGxheV90eXBlJz0+Z2V0X3Rlcm1fbWV0YSgkY2lkLCdkaXNwbGF5X3R5cGUnLHRydWUpLAogICAgICAncGVycGFnZSc9PmdldF90ZXJtX21ldGEoJGNpZCwnd3BzZW9fcGFnaW5hdGUnLHRydWUpLAogICAgKTsKICB9CiAgLy8gQXIgeXJhIHNuaXBwZXQga3VyaXMga2VpxI1pYSBwb3N0c19wZXJfcGFnZSBhciBsb29wIGthdCAxMDY/CiAgLy8gUGF0aWtyaW5hbSBGbGF0c29tZSBzaG9wIG51c3RhdHltdXMKICAkb3V0WydmbGF0c29tZV9jYXRfc3R5bGUnXT1nZXRfb3B0aW9uKCdjYXRlZ29yeV9zdHlsZScsJz8nKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC CMP107', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_cmp107=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out.info=m?JSON.parse(m[0]):(r||'').slice(0,200);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  // 107 HTML su kraiko_tipas filtru - suskaičiuojam produktus
  var html107 = exec('curl -sk -m 30 "'+BASE+'/kategorija/katems/kraikai-kaciu-tualetams/?yith_wcan=1&filter_kraiko_tipas=tofu&query_type_kraiko_tipas=or&nc='+Date.now()+'"');
  out.html107_nerasta = html107.includes('Produktų nerasta');
  var rc107 = html107.match(/woocommerce-result-count[^>]*>([^<]+)</);
  out.html107_count = rc107?rc107[1].trim():'(nerasta)';
  commit('compare_107.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
