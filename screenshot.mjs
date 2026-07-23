const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfYmMnXSl8fCRfR0VUWydwc19iYyddIT09J1MyS3c4TngnKXtyZXR1cm47fQoJZ2xvYmFsICR3cGRiOyRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJJHJzPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX1BldF9EYXNoYm9hcmQnLCdyZXNvbHZlX3N0YXRlJyk7ICRycy0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKCSRuYT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9QZXRfRGFzaGJvYXJkJywnZ2V0X25leHRfYWN0aW9uJyk7ICRuYS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKCSRtaz1mdW5jdGlvbigkcHBpZCwkYnJhbmQsJGZyZWUsJHcpeyAkcD1uZXcgc3RkQ2xhc3MoKTsgJHAtPnByaW1hcnlfcHJvZHVjdF9pZD0kcHBpZDsgJHAtPmN1cnJlbnRfZm9vZF9icmFuZD0kYnJhbmQ7ICRwLT5jdXJyZW50X2Zvb2RfZnJlZV90ZXh0PSRmcmVlOyAkcC0+Y3VycmVudF93ZWlnaHRfa2c9JHc7IHJldHVybiAkcDsgfTsKCSRjYXNlcz1hcnJheSgKCQknQl90dXNjaWFzJyAgICAgICAgPT4gJG1rKG51bGwsbnVsbCxudWxsLG51bGwpLAoJCSdCX3R1c3RpX3N0cmluZ2FpJyA9PiAkbWsoMCwnJywnJywnJyksCgkJJ0NfYnJhbmQnICAgICAgICAgID0+ICRtayhudWxsLCdSb3lhbCBDYW5pbicsbnVsbCxudWxsKSwKCQknQ19mcmVldGV4dCcgICAgICAgPT4gJG1rKG51bGwsbnVsbCwna2F6a29rcyBtYWlzdGFzJyxudWxsKSwKCQknQ19zdV9zdm9yaXUnICAgICAgPT4gJG1rKG51bGwsJ0pvc2VyYScsbnVsbCwnMTIuNScpLAoJCSdEX2JlX3N2b3JpbycgICAgICA9PiAkbWsoMTgwMTQsJ0pvc2VyYScsbnVsbCxudWxsKSwKCQknRF9zdV9zdm9yaXUnICAgICAgPT4gJG1rKDE4MDE0LCdKb3NlcmEnLG51bGwsJzI1LjAnKSwKCQknRF9waXJtZW55YmUnICAgICAgPT4gJG1rKDE3Mjk5LCdPbnRhcmlvJywndGVrc3RhcycsJzQ3LjAnKSwKCSk7Cglmb3JlYWNoKCRjYXNlcyBhcyAkaz0+JHApewoJCSRvWyRrXT1hcnJheSgnc3RhdGUnPT4kcnMtPmludm9rZShudWxsLCRwKSwnbmV4dCc9PiRuYS0+aW52b2tlKG51bGwsJHApKTsKCX0KCS8vIHJlYWx1cyBwZXQ0MyBzYXZpbmlua2FzCgkkb1sncGV0NDNfdXNlciddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgdXNlcl9pZCBGUk9NIHskcGZ9cHNfcGV0cyBXSEVSRSBpZD00MyIpOwoJZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function pr(n,ob){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(ob)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2'); }return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'BC (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 45 '+AUTH+' "https://dev.avesa.lt/?ps_bc=S2Kw8Nx"',{timeout:50000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,300)};}catch(e){return{err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('bc.json',o));
