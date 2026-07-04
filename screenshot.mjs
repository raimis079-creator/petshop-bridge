import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'dd',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbdd.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbdd.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:180000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2RkJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIGlmKCFmdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfdmZfc3luY19yZXByaWNlJykpeyB3cF9zZW5kX2pzb24oYXJyYXkoJ2Vycm9yJz0+J2ZuIG5vdCBsb2FkZWQnKSk7IH0KICAvLyBWeWtkYXUgUkVQUklDRSBkcnktcnVuIHZpc2FtIG1hc3l2dWkgQkFUQ0gnYWlzIHRpZXNpb2dpYWkKICAkYWdnPWFycmF5KCdwcm9kdWN0c19zY2FubmVkJz0+MCwnc2tpcF9sb2NrZWQnPT4wLCdza2lwX25vX2NoYW5nZSc9PjAsJ3dvdWxkX2NoYW5nZV9wcmljZSc9PjAsJ3dvdWxkX2NsZWFyX3NhbGUnPT4wLCd3b3VsZF9hZGRfc2FsZSc9PjApOwogICRzYW1wbGVzPWFycmF5KCk7CiAgZm9yKCRvZmY9MDsgJG9mZjwxNTAwOyAkb2ZmKz0zMDApewogICAgJHIgPSBwZXRzaG9wX3ZmX3N5bmNfcmVwcmljZSgnZHJ5cnVuJywgMzAwLCAkb2ZmLCBhcnJheSgpKTsKICAgIGlmKGlzc2V0KCRyWydlcnJvciddKSl7ICRhZ2dbJ2Vycm9yJ109JHJbJ2Vycm9yJ107IGJyZWFrOyB9CiAgICAkcz0kclsnc3RhdHMnXTsKICAgIGZvcmVhY2goYXJyYXlfa2V5cygkYWdnKSBhcyAkayl7IGlmKGlzc2V0KCRzWyRrXSkgJiYgaXNfbnVtZXJpYygkc1ska10pKSAkYWdnWyRrXSs9JHNbJGtdOyB9CiAgICBmb3JlYWNoKCRyWydleGFtcGxlcyddIGFzICRlKXsgaWYoY291bnQoJHNhbXBsZXMpPDUwKSAkc2FtcGxlc1tdPSRlOyB9CiAgICBpZigoJHNbJ3Byb2R1Y3RzX3NjYW5uZWQnXT8/MCk8MzAwKSBicmVhazsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnYWdnJz0+JGFnZywnc2FtcGxlcyc9PiRzYW1wbGVzKSk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC DD', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 160 "'+BASE+'/?psc_dd=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('direct_dry.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
