import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'dbc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbdbc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbdbc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2Rpc2JyJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogICRvdXQ9YXJyYXkoKTsKICBnbG9iYWwgJHdwZGI7ICR0PSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICAvLyBpxaFqdW5naWFtIGJyaWRnZSA1NjQKICAkd3BkYi0+dXBkYXRlKCR0LCBhcnJheSgnYWN0aXZlJz0+MCksIGFycmF5KCdpZCc9PjU2NCkpOwogICRvdXRbJ2JyaWRnZV9kaXNhYmxlZCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgYWN0aXZlIEZST00gJHQgV0hFUkUgaWQ9NTY0Iik7CgogIC8vIGR1YmVuxJdsacWzIHByZXNldCAoa3VyaXMgVkVJS0lBKSAtIGtva3Mgam8gc2x1ZyBpciBfZmlsdGVycyBUaXBhcyBibG9rbyBjb25maWcKICAvLyBGaWx0cnUgS29udGVrc3RhcyBkdWJlbmVsaWFtcyAtPiAnZHViZW5lbGl1LWZpbHRyYXMnCiAgJGR1YnAgPSBnZXRfcGFnZV9ieV9wYXRoKCdkdWJlbmVsaXUtZmlsdHJhcycsIE9CSkVDVCwgJ3lpdGhfd2Nhbl9wcmVzZXQnKTsKICAkdHVhbHAgPSBnZXRfcGFnZV9ieV9wYXRoKCd0dWFsZXR1LWZpbHRyYXMnLCBPQkpFQ1QsICd5aXRoX3djYW5fcHJlc2V0Jyk7CgogIGZvcmVhY2goYXJyYXkoJ2R1YmVuZWxpdSc9PiRkdWJwLCd0dWFsZXR1Jz0+JHR1YWxwKSBhcyAka2V5PT4kcCl7CiAgICBpZighJHApeyAkb3V0WyRrZXldPSdOT1RfRk9VTkQnOyBjb250aW51ZTsgfQogICAgJGZpbHRlcnMgPSBnZXRfcG9zdF9tZXRhKCRwLT5JRCwnX2ZpbHRlcnMnLHRydWUpOwogICAgJHRpcGFzX2Jsb2NrPW51bGw7CiAgICBmb3JlYWNoKChhcnJheSkkZmlsdGVycyBhcyAkZil7IGlmKCgkZlsndGF4b25vbXknXT8/JycpPT09J3BhX3RpcGFzJyl7ICR0aXBhc19ibG9jaz0kZjsgYnJlYWs7IH0gfQogICAgJG91dFska2V5XT1hcnJheSgKICAgICAgJ2lkJz0+JHAtPklELAogICAgICAnZW5hYmxlZCc9PmdldF9wb3N0X21ldGEoJHAtPklELCdfZW5hYmxlZCcsdHJ1ZSksCiAgICAgICd0aXBhc19ibG9jayc9PiR0aXBhc19ibG9jayA/IGFycmF5KAogICAgICAgICd1c2VfYWxsX3Rlcm1zJz0+JHRpcGFzX2Jsb2NrWyd1c2VfYWxsX3Rlcm1zJ10/PycnLAogICAgICAgICd0ZXJtcyc9PiR0aXBhc19ibG9ja1sndGVybXMnXT8/JycsCiAgICAgICAgJ3JlbGF0aW9uJz0+JHRpcGFzX2Jsb2NrWydyZWxhdGlvbiddPz8nJywKICAgICAgICAnbXVsdGlwbGUnPT4kdGlwYXNfYmxvY2tbJ211bHRpcGxlJ10/PycnLAogICAgICAgICd0eXBlJz0+JHRpcGFzX2Jsb2NrWyd0eXBlJ10/PycnLAogICAgICAgICdjdXN0b21pemVfdGVybXMnPT4kdGlwYXNfYmxvY2tbJ2N1c3RvbWl6ZV90ZXJtcyddPz8nJywKICAgICAgKSA6ICdOT19USVBBU19CTE9DSycsCiAgICApOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC DISBR', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_disbr=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out.compare=m?JSON.parse(m[0]):(r||'').slice(0,300);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  // testuojam 106 BE bridge
  var html = exec('curl -sk -m 30 "'+BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?yith_wcan=1&filter_tipas=uzdaras-namelis&query_type_tipas=or&nc='+Date.now()+'"');
  out.t106_nerasta = html.includes('Produktų nerasta');
  var rc = html.match(/woocommerce-result-count[^>]*>([^<]+)</);
  out.t106_count = rc?rc[1].trim():'(nerasta)';
  commit('disable_bridge.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,500));
})();
