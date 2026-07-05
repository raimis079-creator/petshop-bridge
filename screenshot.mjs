import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fxc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfxc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfxc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2Z4YyddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAKICAkb3V0ID0gYXJyYXkoKTsKICAkcGFpcnMgPSBhcnJheSgKICAgIGFycmF5KCdwYWNrJz0+MzQ0NDksICdiYXNlJz0+MTc0OTMpLAogICAgYXJyYXkoJ3BhY2snPT4zNDQ3MSwgJ2Jhc2UnPT4xODU5MCksCiAgKTsKICAKICBmb3JlYWNoICgkcGFpcnMgYXMgJHApIHsKICAgIC8vIEJhemluaW8ga2F0ZWdvcmlqb3MKICAgICRiYXNlX2NhdF9pZHMgPSB3cF9nZXRfcG9zdF90ZXJtcygkcFsnYmFzZSddLCAncHJvZHVjdF9jYXQnLCBhcnJheSgnZmllbGRzJz0+J2lkcycpKTsKICAgIC8vIFBhY2sgPSBiYXppbmlvIGthdGVnb3Jpam9zICsgREFVR0lBVT1QSUdJQVUgKDkxKQogICAgJG5ld19jYXRzID0gYXJyYXlfdW5pcXVlKGFycmF5X21lcmdlKCRiYXNlX2NhdF9pZHMsIGFycmF5KDkxKSkpOwogICAgd3Bfc2V0X29iamVjdF90ZXJtcygkcFsncGFjayddLCAkbmV3X2NhdHMsICdwcm9kdWN0X2NhdCcpOwogICAgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkcFsncGFjayddKTsKICAgIAogICAgLy8gUGF0aWtyaW5hbSBwbwogICAgJGFmdGVyID0gd3BfZ2V0X3Bvc3RfdGVybXMoJHBbJ3BhY2snXSwgJ3Byb2R1Y3RfY2F0JywgYXJyYXkoJ2ZpZWxkcyc9PidhbGwnKSk7CiAgICAkb3V0W10gPSBhcnJheSgKICAgICAgJ3BhY2tfaWQnID0+ICRwWydwYWNrJ10sCiAgICAgICdiYXNlX2NhdHNfY29waWVkJyA9PiAkYmFzZV9jYXRfaWRzLAogICAgICAncGFja19jYXRzX2FmdGVyJyA9PiBhcnJheV9tYXAoZnVuY3Rpb24oJHQpeyByZXR1cm4gJHQtPnRlcm1faWQuJzonLiR0LT5uYW1lOyB9LCAkYWZ0ZXIpLAogICAgKTsKICB9CiAgCiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC FXC', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_fxc=1&k=ps2026"');
  var m=r.match(/(\[.*\])/s); commit('fix_cats.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
