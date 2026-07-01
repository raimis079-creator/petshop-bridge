import { execSync } from "child_process";
import fs from "fs";
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,300); } }
const CODE_B64 = "YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoIWlzc2V0KCRfR0VUWydwc2NfcHJvYmUnXSkpIHJldHVybjsKICAgIGlmICgkX0dFVFsncHNjX3Byb2JlJ10gPT09ICdyZWFkJykgewogICAgICAgIHdwX2RpZShnZXRfb3B0aW9uKCdwc2NfcHJvYmVfcmVzdWx0JywgJ05FUkEnKSk7CiAgICB9CiAgICBpZiAoJF9HRVRbJ3BzY19wcm9iZSddID09PSAnbWV0YScpIHsKICAgICAgICAkaGlkZGVuX2lkcyA9IFszNDE5MCwgMzQxOTEsIDM0MTkyLCAzNDE5MywgMzQxOTQsIDM0MTk1XTsKICAgICAgICAkb3V0ID0gW107CiAgICAgICAgZm9yZWFjaCAoJGhpZGRlbl9pZHMgYXMgJGhpZCkgewogICAgICAgICAgICAkcCA9IHdjX2dldF9wcm9kdWN0KCRoaWQpOwogICAgICAgICAgICBpZiAoISRwKSB7ICRvdXRbJGhpZF0gPSAnbmVyYXN0YXMnOyBjb250aW51ZTsgfQogICAgICAgICAgICAkb3V0WyRoaWRdID0gWwogICAgICAgICAgICAgICAgJ3RpdGxlJyA9PiAkcC0+Z2V0X25hbWUoKSwKICAgICAgICAgICAgICAgICd2aXNpYmlsaXR5JyA9PiAkcC0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpLAogICAgICAgICAgICAgICAgJ3BldHNob3BfbWV0YScgPT4gYXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9rZXlzKGdldF9wb3N0X21ldGEoJGhpZCkpLCBmdW5jdGlvbigkayl7IHJldHVybiBzdHJwb3MoJGssICdfcGV0c2hvcCcpID09PSAwOyB9KSkKICAgICAgICAgICAgXTsKICAgICAgICB9CiAgICAgICAgdXBkYXRlX29wdGlvbigncHNjX3Byb2JlX3Jlc3VsdCcsIHdwX2pzb25fZW5jb2RlKCRvdXQpKTsKICAgICAgICB3cF9kaWUoJ1BST0JFIE9LJyk7CiAgICB9Cn0pOwo=";
const code = Buffer.from(CODE_B64, 'base64').toString('utf8').trim();
(async()=>{
  // Atnaujinam #557
  const body = JSON.stringify({ name:'PSC PROBE meta', code:code, scope:'global', active:true });
  fs.writeFileSync('/tmp/b.json', body);
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  exec('curl -sk "'+BASE+'/?psc_probe=meta"');
  await new Promise(r=>setTimeout(r,1500));
  const res = exec('curl -sk "'+BASE+'/?psc_probe=read"');
  commit('probe_meta2.json', res.slice(0, 3000));
  console.log(res.slice(0,1500));
})();
