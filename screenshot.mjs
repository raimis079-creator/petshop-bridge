const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZmFybSddKXx8JF9HRVRbJ3BzX2Zhcm0nXSE9PSdTMkt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg0MCk7Cgkkb3V0PWFycmF5KCk7Cglmb3JlYWNoKGFycmF5KDE0NjIzLDMzMzA1KSBhcyAkcGlkKXsKCQkkb3V0WyRwaWRdPWFycmF5KAoJCQkndGl0bGUnPT5odG1sX2VudGl0eV9kZWNvZGUoZ2V0X3RoZV90aXRsZSgkcGlkKSksCgkJCSdza3UnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19za3UnLHRydWUpLAoJCQkndGVybSc9PndwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3BhX3Bha3VvdGVzX2R5ZGlzJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpLAoJCQknX3dlaWdodCc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3dlaWdodCcsdHJ1ZSksCgkJCSdfemJfd2VpZ2h0Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfemJfd2VpZ2h0Jyx0cnVlKSwKCQkJJ196Yl9jb3N0Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfemJfY29zdCcsdHJ1ZSksCgkJCSdfbGVnYWN5X3dlaWdodF9yYXcnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19sZWdhY3lfd2VpZ2h0X3JhdycsdHJ1ZSksCgkJCSdfdmZfcXR5Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfdmZfcXR5Jyx0cnVlKSwKCQkJJ3ByaWNlJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHJpY2UnLHRydWUpLAoJCSk7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:60000}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'FARM (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){try{const r=execSync('curl -sk --max-time 35 '+AUTH+' "https://dev.avesa.lt/?ps_farm=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:45000}).toString();const i=r.indexOf('{');return JSON.parse(r.slice(i));}catch(e){return {err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('farm.json',o));
