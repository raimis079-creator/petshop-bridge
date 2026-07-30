import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3BjJ10pIHx8ICRfR0VUWydwc19wYyddIT09J1BjeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgJG89YXJyYXkoKTsKICAkcj1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX1ByaWNpbmcnKTsKICAkZj0kci0+Z2V0RmlsZU5hbWUoKTsKICAkb1snZmFpbGFzJ109JGY7CiAgJHNyYz1AZmlsZV9nZXRfY29udGVudHMoJGYpOwogIGlmKCRzcmMpewogICAgJG9bJ2lsZ2lzJ109c3RybGVuKCRzcmMpOwogICAgLy8gaXN0cmF1a2lhbSBwcmV2aWV3X3ByaWNlIGlyIGNhbGN1bGF0ZQogICAgZm9yZWFjaChhcnJheSgncHJldmlld19wcmljZScsJ2NhbGN1bGF0ZScsJ2dldF9tYXJrdXAnLCdjYWxjdWxhdGVfZmluYWxfcHJpY2UnKSBhcyAkbSl7CiAgICAgIGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvblxzKycuJG0uJ1xzKlwoW14pXSpcKVtee10qXHsvJywkc3JjLCRtbSxQUkVHX09GRlNFVF9DQVBUVVJFKSl7CiAgICAgICAgJG9bJ21ldG9kYWknXVskbV09c3Vic3RyKCRzcmMsJG1tWzBdWzFdLDExMDApOwogICAgICB9CiAgICB9CiAgICAvLyBrYXMga3ZpZWNpYSBzaW9qZSBzaXN0ZW1vamUKICAgIGlmKHByZWdfbWF0Y2hfYWxsKCcvKFx3Kzo6KD86cHJldmlld19wcmljZXxjYWxjdWxhdGV8Y2FsY3VsYXRlX2ZpbmFsX3ByaWNlKSlccypcKChbXildezAsMTIwfSkvJywkc3JjLCRjKSl7CiAgICAgICRvWyd2aWRpbmlhaV9rdmlldGltYWknXT1hcnJheV9zbGljZShhcnJheV9tYXAoZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYS4nKCcuJGI7fSwkY1sxXSwkY1syXSksMCw2KTsKICAgIH0KICB9CiAgLy8ga3VyIGRhciBzaXN0ZW1vamUga3ZpZWNpYW1hCiAgJGhpdHM9YXJyYXkoKTsKICBmb3JlYWNoKGFycmF5KFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbCcsIFdQTVVfUExVR0lOX0RJUiwgV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZScpIGFzICRkKXsKICAgIGlmKCFpc19kaXIoJGQpKSBjb250aW51ZTsKICAgIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYigkZC4nLyoucGhwJyksZ2xvYigkZC4nLyovKi5waHAnKSkgYXMgJGZmKXsKICAgICAgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmZik7CiAgICAgIGlmKCRjICYmIChzdHJwb3MoJGMsJ1BldHNob3BfUHJpY2luZzo6JykhPT1mYWxzZSkpewogICAgICAgIHByZWdfbWF0Y2hfYWxsKCcvUGV0c2hvcF9QcmljaW5nOjooXHcrKVxzKlwoKFteO117MCwxNDB9KS8nLCRjLCRtMik7CiAgICAgICAgZm9yZWFjaCgkbTJbMV0gYXMgJGkyPT4kbm0pICRoaXRzW109YmFzZW5hbWUoJGZmKS4nIOKGkiAnLiRubS4nKCcudHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJG0yWzJdWyRpMl0pKS4n4oCmJzsKICAgICAgfQogICAgfQogIH0KICAkb1sna3ZpZXRpbWFpX3Npc3RlbW9qZSddPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkaGl0cyksMCwxMCk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk --max-time 150 '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:170000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  let mk=null;
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'PC '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_pc=Pcx"',{maxBuffer:20e6,timeout:110000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('pc.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
