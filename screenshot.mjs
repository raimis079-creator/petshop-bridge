import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC'; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3ZjdGEnXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkdGFibGU9JHdwZGItPnByZWZpeC4nc25pcHBldHMnOwogICRyb3c9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxuYW1lLHNjb3BlLGFjdGl2ZSBGUk9NICR0YWJsZSBXSEVSRSBuYW1lPSVzIiwgJ1BldHNob3AgUmlua2luaW8gQ1RBIEJhbm5lcmlzIGthdGVnb3Jpam9zZSB2MScpLCBBUlJBWV9BKTsKICAkbGlua3M9YXJyYXkoKTsKICBmb3JlYWNoKGFycmF5KCdrb25zZXJ2YWktc3VuaW1zJywnc2thbmVzdGFpLXN1bmltcycpIGFzICRzbCl7ICR0PWdldF90ZXJtX2J5KCdzbHVnJywkc2wsJ3Byb2R1Y3RfY2F0Jyk7ICRsaW5rc1skc2xdPSR0P2dldF90ZXJtX2xpbmsoJHQpOicnOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnc25pcHBldCc9PiRyb3csJ2xpbmtzJz0+JGxpbmtzKSk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC VCTA', code:pcode, scope:'global', active:true}));
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk "'+BASE+'/?psc_vcta=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('verifycta.json', m?m[0]:r.slice(0,300)); console.log((m?m[0]:r).slice(0,200));
  exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
})();
