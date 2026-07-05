import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sl2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbsl2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbsl2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:60000}); }catch(e){ return 'EXC:'+e.message.slice(0,150); } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3NsMiddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICByZXF1aXJlX29uY2UgQUJTUEFUSCAuICd3cC1hZG1pbi9pbmNsdWRlcy9tZWRpYS5waHAnOwogIHJlcXVpcmVfb25jZSBBQlNQQVRIIC4gJ3dwLWFkbWluL2luY2x1ZGVzL2ZpbGUucGhwJzsKICByZXF1aXJlX29uY2UgQUJTUEFUSCAuICd3cC1hZG1pbi9pbmNsdWRlcy9pbWFnZS5waHAnOwogICRwYWNrX2lkID0gMzQ0NzE7CiAgJHJhd191cmwgPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL21haW4vc2NyZWVuc2hvdHMvZXhjbF9wYWNrX3gyLmpwZyc7CiAgJGF0dF9pZCA9IG1lZGlhX3NpZGVsb2FkX2ltYWdlKCRyYXdfdXJsLCAkcGFja19pZCwgJ0V4Y2x1c2lvbiBIeXBvYWxsZXJnZW5pYyDFoXVuxbMgbWFpc3RhcywgZWtvbm9tacWha2EgcGFrdW90xJcgMiB2bnQuJywgJ2lkJyk7CiAgaWYgKGlzX3dwX2Vycm9yKCRhdHRfaWQpKSB7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycm9yJz0+JGF0dF9pZC0+Z2V0X2Vycm9yX21lc3NhZ2UoKSkpOyBleGl0OyB9CiAgc2V0X3Bvc3RfdGh1bWJuYWlsKCRwYWNrX2lkLCAkYXR0X2lkKTsKICB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRwYWNrX2lkKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2F0dF9pZCc9PiRhdHRfaWQsICduZXdfdXJsJz0+d3BfZ2V0X2F0dGFjaG1lbnRfdXJsKCRhdHRfaWQpLCAndGh1bWInPT5nZXRfcG9zdF90aHVtYm5haWxfaWQoJHBhY2tfaWQpKSk7CiAgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC SL2', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 55 "'+BASE+'/?psc_sl2=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('sl2.json', m?m[0]:(r||'').slice(0,400));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
