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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgVG9rZW4gTGl2ZSBUZXN0IHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc190ayddKSB8fCAkX0dFVFsncHNfdGsnXSAhPT0gJ1RrM3EnICkgcmV0dXJuOwogICAgJHI9YXJyYXkoKTsKICAgICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0FjdGlvbl9Ub2tlbnMnLCdnZW5lcmF0ZScpOwogICAgJGxpbmVzPWZpbGUoJG0tPmdldEZpbGVOYW1lKCkpOwogICAgJHJbJ2dlbmVyYXRlX2hlYWQnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRsaW5lcywkbS0+Z2V0U3RhcnRMaW5lKCktMSxtaW4oNDAsJG0tPmdldEVuZExpbmUoKS0kbS0+Z2V0U3RhcnRMaW5lKCkrMSkpKTsKICAgICRwPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0FjdGlvbl9Ub2tlbnMnLCdwZWVrJyk7CiAgICAkclsncGVla19oZWFkJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkbGluZXMsJHAtPmdldFN0YXJ0TGluZSgpLTEsbWluKDE4LCRwLT5nZXRFbmRMaW5lKCktJHAtPmdldFN0YXJ0TGluZSgpKzEpKSk7CgogICAgLy8gZ3l2YXMgdGVzdGFzIHN1IFRFSVNJTkdVIG1hc3l2dQogICAgJGFyZ3M9YXJyYXkoJ3B1cnBvc2UnPT4nY2FydF9yZWNvdmVyeScsJ3Jlc291cmNlX2lkJz0+J1RFU1RDQVJUMTIzJywndHRsJz0+OTAwKTsKICAgICRnZW49UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpnZW5lcmF0ZSgkYXJncyk7CiAgICAkclsnZ2VuZXJhdGVfcmVzdWx0J109aXNfYXJyYXkoJGdlbik/YXJyYXlfaW50ZXJzZWN0X2tleSgkZ2VuLGFycmF5X2ZsaXAoYXJyYXkoJ29rJywndG9rZW4nLCdleHBpcmVzX2F0JywnZXJyb3InLCdwdXJwb3NlJykpKTokZ2VuOwogICAgJHJhdz1pc19hcnJheSgkZ2VuKSYmaXNzZXQoJGdlblsndG9rZW4nXSk/JGdlblsndG9rZW4nXTpudWxsOwogICAgaWYgKCRyYXcpIHsKICAgICAgICAkclsndG9rZW5fbGVuJ109c3RybGVuKCRyYXcpOwogICAgICAgICRwazE9UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpwZWVrKCRyYXcpOwogICAgICAgICRyWydwZWVrXzEnXT1pc19hcnJheSgkcGsxKT9hcnJheV9pbnRlcnNlY3Rfa2V5KCRwazEsYXJyYXlfZmxpcChhcnJheSgnb2snLCdwdXJwb3NlJywncmVzb3VyY2VfaWQnLCdzdGF0dXMnLCdlcnJvcicpKSk6JHBrMTsKICAgICAgICAkcGsyPVBldHNob3BfQWN0aW9uX1Rva2Vuczo6cGVlaygkcmF3KTsKICAgICAgICAkclsncGVla18yX3N0aWxsX3ZhbGlkJ109aXNfYXJyYXkoJHBrMik/KCRwazJbJ29rJ10/P251bGwpOiRwazI7CiAgICAgICAgJGMxPVBldHNob3BfQWN0aW9uX1Rva2Vuczo6Y29uc3VtZSgkcmF3KTsKICAgICAgICAkclsnY29uc3VtZV8xJ109aXNfYXJyYXkoJGMxKT9hcnJheV9pbnRlcnNlY3Rfa2V5KCRjMSxhcnJheV9mbGlwKGFycmF5KCdvaycsJ3B1cnBvc2UnLCdyZXNvdXJjZV9pZCcsJ2Vycm9yJykpKTokYzE7CiAgICAgICAgJGMyPVBldHNob3BfQWN0aW9uX1Rva2Vuczo6Y29uc3VtZSgkcmF3KTsKICAgICAgICAkclsnY29uc3VtZV8yX211c3RfZmFpbCddPWlzX2FycmF5KCRjMik/YXJyYXlfaW50ZXJzZWN0X2tleSgkYzIsYXJyYXlfZmxpcChhcnJheSgnb2snLCdlcnJvcicpKSk6JGMyOwogICAgICAgICRwazM9UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpwZWVrKCRyYXcpOwogICAgICAgICRyWydwZWVrX2FmdGVyX2NvbnN1bWUnXT1pc19hcnJheSgkcGszKT9hcnJheV9pbnRlcnNlY3Rfa2V5KCRwazMsYXJyYXlfZmxpcChhcnJheSgnb2snLCdzdGF0dXMnLCdlcnJvcicpKSk6JHBrMzsKICAgIH0KICAgIC8vIHBhc2liYWlnZXMgdG9rZW5hcwogICAgJGdlbjI9UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpnZW5lcmF0ZShhcnJheSgncHVycG9zZSc9PidjYXJ0X3JlY292ZXJ5JywncmVzb3VyY2VfaWQnPT4nRVhQSVJFRDEnLCd0dGwnPT4xKSk7CiAgICBpZiAoaXNfYXJyYXkoJGdlbjIpJiZpc3NldCgkZ2VuMlsndG9rZW4nXSkpIHsKICAgICAgICBnbG9iYWwgJHdwZGI7ICR0dD0kd3BkYi0+cHJlZml4Lidwc19hY3Rpb25fdG9rZW5zJzsKICAgICAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIlVQREFURSAkdHQgU0VUIGV4cGlyZXNfYXQ9JXMgV0hFUkUgcmVzb3VyY2VfaWQ9JXMiLCBnbWRhdGUoJ1ktbS1kIEg6aTpzJyx0aW1lKCktMTIwKSwnRVhQSVJFRDEnKSk7CiAgICAgICAgJHJbJ2V4cGlyZWRfcGVlayddPVBldHNob3BfQWN0aW9uX1Rva2Vuczo6cGVlaygkZ2VuMlsndG9rZW4nXSk7CiAgICAgICAgaWYgKGlzX2FycmF5KCRyWydleHBpcmVkX3BlZWsnXSkpICRyWydleHBpcmVkX3BlZWsnXT1hcnJheV9pbnRlcnNlY3Rfa2V5KCRyWydleHBpcmVkX3BlZWsnXSxhcnJheV9mbGlwKGFycmF5KCdvaycsJ2Vycm9yJywnc3RhdHVzJykpKTsKICAgIH0KICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
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
