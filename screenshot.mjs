import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'va2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbva2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbva2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3Zha2MyJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIAogICRvdXRwdXQgPSBkb19zaG9ydGNvZGUoJ1twc2NfYWtjaWpvcyBwZXJfcGFnZT0iMzAiIGNvbHVtbnM9IjQiXScpOwogIAogIHByZWdfbWF0Y2hfYWxsKCcvPGxpW14+XSpjbGFzcz0iW14iXSpwcm9kdWN0W14iXSoiLycsICRvdXRwdXQsICRtYXRjaGVzKTsKICAkbGlzID0gY291bnQoJG1hdGNoZXNbMF0pOwogIAogIHByZWdfbWF0Y2hfYWxsKCcvcG9zdC0oXGQrKS8nLCAkb3V0cHV0LCAkaWRzKTsKICAkcHJvZHVjdF9pZHMgPSBhcnJheV91bmlxdWUoJGlkc1sxXSk7CiAgCiAgLy8gQXIgeXJhIGZsaWNraXR5IChzbGlkZXIpIGtsYXNlcz8KICAkaGFzX3NsaWRlciA9IHN0cnBvcygkb3V0cHV0LCdmbGlja2l0eScpICE9PSBmYWxzZSB8fCBzdHJwb3MoJG91dHB1dCwncm93LXNsaWRlcicpICE9PSBmYWxzZTsKICAKICAvLyBBciB5cmEgcHJvZHVjdHMgZ3JpZCBrbGFzZXM/CiAgJGhhc19ncmlkID0gc3RycG9zKCRvdXRwdXQsJ3VsLnByb2R1Y3RzJykgIT09IGZhbHNlIHx8IHN0cnBvcygkb3V0cHV0LCdjbGFzcz0icHJvZHVjdHMnKSAhPT0gZmFsc2U7CiAgCiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgKICAgICdvdXRwdXRfbGVuJyA9PiBzdHJsZW4oJG91dHB1dCksCiAgICAncHJvZHVjdF9saV9jb3VudCcgPT4gJGxpcywKICAgICd1bmlxdWVfcHJvZHVjdF9pZHMnID0+IGNvdW50KCRwcm9kdWN0X2lkcyksCiAgICAnaGFzX3NsaWRlcl9yZW5kZXInID0+ICRoYXNfc2xpZGVyLAogICAgJ2hhc19ncmlkX3JlbmRlcicgPT4gJGhhc19ncmlkLAogICAgJ291dHB1dF9maXJzdF84MDAnID0+IHN1YnN0cigkb3V0cHV0LDAsODAwKSwKICApKTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC VAKC2', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_vakc2=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('verify_akc2.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
