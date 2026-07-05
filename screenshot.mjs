import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'gei',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbgei.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbgei.json "'+url+'"',{encoding:'utf8'}); }
function commitTxt(name,str){ commit(name, Buffer.from(str,'utf8').toString('base64')); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2dlaSddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAkYmFzZSA9IHdjX2dldF9wcm9kdWN0KDE4NTkwKTsKICAkaW1nX2lkID0gJGJhc2UtPmdldF9pbWFnZV9pZCgpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CiAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnaW1nX2lkJz0+JGltZ19pZCwgJ2ltZ191cmwnPT4kaW1nX2lkP3dwX2dldF9hdHRhY2htZW50X3VybCgkaW1nX2lkKTonTkVSQScpKTsKICBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC GEI', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_gei=1&k=ps2026"');
  var mm=r.match(/(\{.*\})/s); var info=mm?JSON.parse(mm[0]):{};
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  // Parsisiunciam nuotrauka
  if (info.img_url && info.img_url!=='NERA') {
    exec('curl -sk -m 25 -o /tmp/excl_base.jpg "'+info.img_url+'"');
    var b64 = fs.readFileSync('/tmp/excl_base.jpg').toString('base64');
    commit('excl_base.b64.txt', Buffer.from(b64).toString('base64'));
    commitTxt('gei_info.json', JSON.stringify(info));
  } else {
    commitTxt('gei_info.json', JSON.stringify(info));
  }
  console.log('done');
})();
