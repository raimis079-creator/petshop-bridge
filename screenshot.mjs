import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cmv',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcmv.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcmv.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2NtdiddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dCA9IGFycmF5KCk7CiAgCiAgLy8gUEFTSVVMWU1BSSAoMzQxMjgpIGlyIGpvIHZhaWthaSBidXNlbm9zCiAgJGlkcyA9IGFycmF5KDM0MTI4LCAyOTcxLCAzNDEzNik7IC8vIFBBU0lVTFlNQUksIERBVUdJQVU9UElHSUFVLCBBa2Npam9zCiAgZm9yZWFjaCAoJGlkcyBhcyAkaWQpIHsKICAgICRwID0gZ2V0X3Bvc3QoJGlkKTsKICAgICRvdXRbJ2l0ZW1fJy4kaWRdID0gJHAgPyBhcnJheSgKICAgICAgJ3RpdGxlJyA9PiAkcC0+cG9zdF90aXRsZSwKICAgICAgJ3N0YXR1cycgPT4gJHAtPnBvc3Rfc3RhdHVzLAogICAgICAncGFyZW50X21ldGEnID0+IGdldF9wb3N0X21ldGEoJGlkLCdfbWVudV9pdGVtX21lbnVfaXRlbV9wYXJlbnQnLHRydWUpLAogICAgICAndXJsJyA9PiBnZXRfcG9zdF9tZXRhKCRpZCwnX21lbnVfaXRlbV91cmwnLHRydWUpLAogICAgICAndHlwZScgPT4gZ2V0X3Bvc3RfbWV0YSgkaWQsJ19tZW51X2l0ZW1fdHlwZScsdHJ1ZSksCiAgICApIDogJ05FUkEnOwogIH0KICAKICAvLyBBciBEQVVHSUFVPVBJR0lBVSAoMjk3MSkgdGlrcmFpIHByaXNraXJ0YXMgbWVuaXVpIDIzMgogICR0ZXJtcyA9IHdwX2dldF9vYmplY3RfdGVybXMoMjk3MSwgJ25hdl9tZW51Jyk7CiAgJG91dFsnMjk3MV9tZW51X3Rlcm1zJ10gPSBhcnJheV9tYXAoZnVuY3Rpb24oJHQpeyByZXR1cm4gJHQtPnRlcm1faWQuJzonLiR0LT5uYW1lOyB9LCAkdGVybXMpOwogIAogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG91dCk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC CMV', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_cmv=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('check_menu_vis.json', m?m[0]:(r||'').slice(0,700));
  // Ir home meniu HTML - ar DAUGIAU=PIGIAU matosi PASIULYMAI submeniu
  var home = exec('curl -sk -m 25 "'+BASE+'/"');
  var idx = home.indexOf('PASIŪLYMAI');
  var zone = idx>=0 ? home.substring(idx-100, idx+800) : 'PASIULYMAI NERASTA';
  commit('home_menu_zone.txt', zone);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
