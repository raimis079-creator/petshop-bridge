const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZXhkcnknXSl8fCRfR0VUWydwc19leGRyeSddIT09J1MyS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDYwKTsKCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CgkvLyBEQUJBUlRJTkVTIDI0MSBlaWx1dGVzCgkkb1snZGFiYXInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCx3ZWlnaHRfZnJvbV9rZyx3ZWlnaHRfdG9fa2csYW1vdW50X2Zyb21fZyxhbW91bnRfdG9fZyxjZWxsX3R5cGUscm93X29yZGVyIEZST00geyRwZn1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0yNDEgT1JERVIgQlkgcm93X29yZGVyIixBUlJBWV9BKTsKCS8vIGxlbnRlbGVzIG1ldGEKCSRvWydtZXRhJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBpZCxsaW5lLHNwZWNpZXMsc3RhdHVzLGlzX2FjdGl2ZSxyb3dfY291bnQsY2Fub25pY2FsX3RhYmxlX2hhc2gsd2VpZ2h0X2Jhc2lzLHJvd19kaW1lbnNpb24sc291cmNlX3VybCxzb3VyY2Vfa2luZCBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgaWQ9MjQxIixBUlJBWV9BKTsKCS8vIE9GSUNJQUxVUyBza2FpY2lhaSBrdXJpdW9zIHJhc3lzaW0gKGlzIHBsYXRpbnRvam8gcGF2ZWlrc2xlbGlvLCBwYXR2aXJ0aW50aSBSYWltaW8pCgkkb1snb2ZpY2lhbHVzJ109YXJyYXkoCgkJYXJyYXkoJ2tnJz0+MTEsJ2Zyb20nPT4xNTAsJ3RvJz0+MTcwKSwKCQlhcnJheSgna2cnPT4xNSwnZnJvbSc9PjE5MCwndG8nPT4yMTApLAoJCWFycmF5KCdrZyc9PjIwLCdmcm9tJz0+MjIwLCd0byc9PjI0MCksCgkJYXJyYXkoJ2tnJz0+MjUsJ2Zyb20nPT4yODAsJ3RvJz0+MzEwKSwKCQlhcnJheSgna2cnPT4zMCwnZnJvbSc9PjMzMCwndG8nPT4zNjApLAoJCWFycmF5KCdrZyc9PjQwLCdmcm9tJz0+NDQwLCd0byc9PjQ4MCksCgkJYXJyYXkoJ2tnJz0+NTAsJ2Zyb20nPT40ODAsJ3RvJz0+NTIwKSwKCQlhcnJheSgna2cnPT42MCwnZnJvbSc9PjUwMCwndG8nPT41NDApLAoJCWFycmF5KCdrZyc9PjcwLCdmcm9tJz0+NTUwLCd0byc9PjYwMCksCgkpOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync('echo '+b+'|base64 -d|curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'EXDRY (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_exdry=S2Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('PUT:',pr('excldry.json',o));
