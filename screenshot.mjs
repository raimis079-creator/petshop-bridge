import { execSync } from "child_process";
import fs from "fs";
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,300); } }
const CODE_B64 = "YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoIWlzc2V0KCRfR0VUWydwc2NfcHJvYmUnXSkgfHwgJF9HRVRbJ3BzY19wcm9iZSddICE9PSAnbWV0YScpIHJldHVybjsKICAgICRoaWRkZW5faWRzID0gWzM0MTkwLCAzNDE5MSwgMzQxOTIsIDM0MTkzLCAzNDE5NCwgMzQxOTVdOwogICAgJG91dCA9IFtdOwogICAgZm9yZWFjaCAoJGhpZGRlbl9pZHMgYXMgJGhpZCkgewogICAgICAgICRwID0gd2NfZ2V0X3Byb2R1Y3QoJGhpZCk7CiAgICAgICAgaWYgKCEkcCkgeyAkb3V0WyRoaWRdID0gJ25lcmFzdGFzJzsgY29udGludWU7IH0KICAgICAgICAkb3V0WyRoaWRdID0gWwogICAgICAgICAgICAndGl0bGUnID0+ICRwLT5nZXRfbmFtZSgpLAogICAgICAgICAgICAnY2F0YWxvZ192aXNpYmlsaXR5JyA9PiAkcC0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpLAogICAgICAgICAgICAncGFyZW50X21ldGEnID0+IGdldF9wb3N0X21ldGEoJGhpZCwgJ19wZXRzaG9wX2Nob2ljZV9wYXJlbnQnLCB0cnVlKSwKICAgICAgICAgICAgJ2dyYW1fbWV0YScgPT4gZ2V0X3Bvc3RfbWV0YSgkaGlkLCAnX3BldHNob3BfY2hvaWNlX2dyYW0nLCB0cnVlKSwKICAgICAgICAgICAgJ3NpemVfbWV0YScgPT4gZ2V0X3Bvc3RfbWV0YSgkaGlkLCAnX3BldHNob3BfY2hvaWNlX3NpemUnLCB0cnVlKSwKICAgICAgICAgICAgJ2FsbF9wZXRzaG9wX21ldGEnID0+IGFycmF5X2ZpbHRlcihhcnJheV9rZXlzKGdldF9wb3N0X21ldGEoJGhpZCkpLCBmdW5jdGlvbigkayl7IHJldHVybiBzdHJwb3MoJGssICdfcGV0c2hvcCcpID09PSAwOyB9KQogICAgICAgIF07CiAgICB9CiAgICAvLyBJciB0xJd2aW5pbyBjb25maWcKICAgICRwYXJlbnRfY29uZmlnID0gZ2V0X3Bvc3RfbWV0YSgzNDE5NiwgJ19wZXRzaG9wX2Nob2ljZV9jb25maWcnLCB0cnVlKTsKICAgICRvdXRbJ3BhcmVudF8zNDE5Nl9jb25maWcnXSA9ICRwYXJlbnRfY29uZmlnOwogICAgdXBkYXRlX29wdGlvbigncHNjX3Byb2JlX3Jlc3VsdCcsIHdwX2pzb25fZW5jb2RlKCRvdXQpKTsKICAgIHdwX2RpZSgnUFJPQkUgT0snKTsKfSk7Cg==";
const code = Buffer.from(CODE_B64, 'base64').toString('utf8').trim();
(async()=>{
  // Sukuriam temp snippet
  const body = JSON.stringify({ name:'PSC PROBE meta', code:code, scope:'global', active:true });
  fs.writeFileSync('/tmp/b.json', body);
  const raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let cr; try{ cr=JSON.parse(raw); }catch(e){ cr={__raw:raw.slice(0,300)}; }
  var sid = cr.id;
  // Trigginam probe
  exec('curl -sk "'+BASE+'/?psc_probe=meta"');
  await new Promise(r=>setTimeout(r,1500));
  // Skaitom rezultatą per option (2nd trigger)
  const res = exec('curl -sk "'+BASE+'/wp-json/" -H "Authorization: '+AUTH+'"'); // just to have something
  commit('probe_meta.json', JSON.stringify({snippet_id: sid}));
  console.log("SNIPPET_ID:"+sid);
})();
