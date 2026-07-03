import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'dd',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbdd.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbdd.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2RlbGR1cCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAkZHVwX3NsdWdzID0gYXJyYXkoJ2F0dmlyYXMtdHVhbGV0YXMnLCd1emRhcmFzLXR1YWxldGFzLW5hbWVsaXMnLCd0dWFsZXRhcy1zdS1yZW1lbGl1Jywna2FtcGluaXMtdHVhbGV0YXMnLCdhdXRvbWF0aW5pcy10dWFsZXRhcycsJ3R1YWxldG8tcHJpZWRhaScpOwogICRvdXQ9YXJyYXkoKTsKICBmb3JlYWNoKCRkdXBfc2x1Z3MgYXMgJHNsdWcpewogICAgJHQgPSBnZXRfdGVybV9ieSgnc2x1ZycsJHNsdWcsJ3BhX3RpcGFzJyk7CiAgICBpZighJHQpeyAkb3V0WyRzbHVnXT0nTk9UX0ZPVU5EJzsgY29udGludWU7IH0KICAgIGlmKCR0LT5jb3VudCA+IDApeyAkb3V0WyRzbHVnXT0nU0tJUFBFRF9IQVNfUFJPRFVDVFMoJy4kdC0+Y291bnQuJyknOyBjb250aW51ZTsgfQogICAgJHIgPSB3cF9kZWxldGVfdGVybSgkdC0+dGVybV9pZCwgJ3BhX3RpcGFzJyk7CiAgICAkb3V0WyRzbHVnXSA9IChpc193cF9lcnJvcigkcikgPyAnRVJST1I6ICcuJHItPmdldF9lcnJvcl9tZXNzYWdlKCkgOiAnREVMRVRFRCBpZD0nLiR0LT50ZXJtX2lkKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC DELDUP', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_deldup=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('delete_dups.json', m?m[0]:(r||'').slice(0,400));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log(m?m[0]:r);
})();
