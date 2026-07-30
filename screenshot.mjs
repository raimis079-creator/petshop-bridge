import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// pirma deaktyvuoti visus senus TEMP Four Checks snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Four Checks/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgVG9rZW4gTGl2ZSBUZXN0IHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc190ayddKSB8fCAkX0dFVFsncHNfdGsnXSAhPT0gJ1RrM3EnICkgcmV0dXJuOwogICAgJHI9YXJyYXkoKTsKICAgICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0FjdGlvbl9Ub2tlbnMnLCdnZW5lcmF0ZScpOwogICAgJGxpbmVzPWZpbGUoJG0tPmdldEZpbGVOYW1lKCkpOwogICAgJHJbJ2dlbmVyYXRlX2hlYWQnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRsaW5lcywkbS0+Z2V0U3RhcnRMaW5lKCktMSxtaW4oNDAsJG0tPmdldEVuZExpbmUoKS0kbS0+Z2V0U3RhcnRMaW5lKCkrMSkpKTsKICAgICRwPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0FjdGlvbl9Ub2tlbnMnLCdwZWVrJyk7CiAgICAkclsncGVla19oZWFkJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkbGluZXMsJHAtPmdldFN0YXJ0TGluZSgpLTEsbWluKDE4LCRwLT5nZXRFbmRMaW5lKCktJHAtPmdldFN0YXJ0TGluZSgpKzEpKSk7CgogICAgLy8gZ3l2YXMgdGVzdGFzIHN1IFRFSVNJTkdVIG1hc3l2dQogICAgJGFyZ3M9YXJyYXkoJ3B1cnBvc2UnPT4nY2FydF9yZWNvdmVyeScsJ3Jlc291cmNlX2lkJz0+J1RFU1RDQVJUMTIzJywndHRsX3NlY29uZHMnPT45MDApOwogICAgJGdlbj1QZXRzaG9wX0FjdGlvbl9Ub2tlbnM6OmdlbmVyYXRlKCRhcmdzKTsKICAgICRyWydnZW5lcmF0ZV90eXBlJ109Z2V0dHlwZSgkZ2VuKTsKICAgICRyYXc9aXNfc3RyaW5nKCRnZW4pPyRnZW46KGlzX2FycmF5KCRnZW4pJiZpc3NldCgkZ2VuWyd0b2tlbiddKT8kZ2VuWyd0b2tlbiddOm51bGwpOwogICAgJHJbJ2dlbmVyYXRlX29rJ109JHJhdz8xOjA7CiAgICBpZiAoJHJhdykgewogICAgICAgICRyWyd0b2tlbl9sZW4nXT1zdHJsZW4oJHJhdyk7CiAgICAgICAgJHBrMT1QZXRzaG9wX0FjdGlvbl9Ub2tlbnM6OnBlZWsoJHJhdyk7CiAgICAgICAgJHJbJ3BlZWtfMSddPWlzX2FycmF5KCRwazEpP2FycmF5X2ludGVyc2VjdF9rZXkoJHBrMSxhcnJheV9mbGlwKGFycmF5KCdvaycsJ3B1cnBvc2UnLCdyZXNvdXJjZV9pZCcsJ3N0YXR1cycsJ2Vycm9yJykpKTokcGsxOwogICAgICAgICRwazI9UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpwZWVrKCRyYXcpOwogICAgICAgICRyWydwZWVrXzJfc3RpbGxfdmFsaWQnXT1pc19hcnJheSgkcGsyKT8oJHBrMlsnb2snXT8/bnVsbCk6JHBrMjsKICAgICAgICAkYzE9UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpjb25zdW1lKCRyYXcpOwogICAgICAgICRyWydjb25zdW1lXzEnXT1pc19hcnJheSgkYzEpP2FycmF5X2ludGVyc2VjdF9rZXkoJGMxLGFycmF5X2ZsaXAoYXJyYXkoJ29rJywncHVycG9zZScsJ3Jlc291cmNlX2lkJywnZXJyb3InKSkpOiRjMTsKICAgICAgICAkYzI9UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpjb25zdW1lKCRyYXcpOwogICAgICAgICRyWydjb25zdW1lXzJfbXVzdF9mYWlsJ109aXNfYXJyYXkoJGMyKT9hcnJheV9pbnRlcnNlY3Rfa2V5KCRjMixhcnJheV9mbGlwKGFycmF5KCdvaycsJ2Vycm9yJykpKTokYzI7CiAgICAgICAgJHBrMz1QZXRzaG9wX0FjdGlvbl9Ub2tlbnM6OnBlZWsoJHJhdyk7CiAgICAgICAgJHJbJ3BlZWtfYWZ0ZXJfY29uc3VtZSddPWlzX2FycmF5KCRwazMpP2FycmF5X2ludGVyc2VjdF9rZXkoJHBrMyxhcnJheV9mbGlwKGFycmF5KCdvaycsJ3N0YXR1cycsJ2Vycm9yJykpKTokcGszOwogICAgfQogICAgLy8gcGFzaWJhaWdlcyB0b2tlbmFzCiAgICAkZ2VuMj1QZXRzaG9wX0FjdGlvbl9Ub2tlbnM6OmdlbmVyYXRlKGFycmF5KCdwdXJwb3NlJz0+J2NhcnRfcmVjb3ZlcnknLCdyZXNvdXJjZV9pZCc9PidFWFBJUkVEMScsJ3R0bF9zZWNvbmRzJz0+NjApKTsKICAgICRyYXcyPWlzX3N0cmluZygkZ2VuMik/JGdlbjI6bnVsbDsKICAgIGlmICgkcmF3MikgewogICAgICAgIGdsb2JhbCAkd3BkYjsgJHR0PSR3cGRiLT5wcmVmaXguJ3BzX2FjdGlvbl90b2tlbnMnOwogICAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFICR0dCBTRVQgZXhwaXJlc19hdD0lcyBXSEVSRSByZXNvdXJjZV9pZD0lcyIsIGdtZGF0ZSgnWS1tLWQgSDppOnMnLHRpbWUoKS0xMjApLCdFWFBJUkVEMScpKTsKICAgICAgICAkclsnZXhwaXJlZF9wZWVrJ109UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpwZWVrKCRyYXcyKTsKICAgICAgICBpZiAoaXNfYXJyYXkoJHJbJ2V4cGlyZWRfcGVlayddKSkgJHJbJ2V4cGlyZWRfcGVlayddPWFycmF5X2ludGVyc2VjdF9rZXkoJHJbJ2V4cGlyZWRfcGVlayddLGFycmF5X2ZsaXAoYXJyYXkoJ29rJywnZXJyb3InLCdzdGF0dXMnKSkpOwogICAgfQogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Four Checks Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_tk=Tk3q"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_tk=Tk3q"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('tok.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
