import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2ZmJ10pIHx8ICRfR0VUWydwc19mZiddIT09J0ZmeCcpIHJldHVybjsKICAkbz1hcnJheSgpOwogIC8vIDEuIEZ1bGZpbGxtZW50X1NvdXJjZSBrbGFzZQogICRvWydrbGFzZV95cmEnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfRnVsZmlsbG1lbnRfU291cmNlJyk7CiAgaWYoJG9bJ2tsYXNlX3lyYSddKXsKICAgICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0Z1bGZpbGxtZW50X1NvdXJjZScpOwogICAgJG9bJ2ZhaWxhcyddPWJhc2VuYW1lKCRyYy0+Z2V0RmlsZU5hbWUoKSk7CiAgICAkbXM9YXJyYXkoKTsgZm9yZWFjaCgkcmMtPmdldE1ldGhvZHMoKSBhcyAkbSl7IGlmKCRtLT5jbGFzcz09PSdQZXRzaG9wX0Z1bGZpbGxtZW50X1NvdXJjZScpICRtc1tdPSgkbS0+aXNTdGF0aWMoKT8nc3RhdGljICc6JycpLiRtLT5uYW1lOyB9CiAgICAkb1snbWV0b2RhaSddPSRtczsKICAgICRjcz1hcnJheSgpOyBmb3JlYWNoKCRyYy0+Z2V0Q29uc3RhbnRzKCkgYXMgJGs9PiR2KXsgJGNzWyRrXT1pc19hcnJheSgkdik/anNvbl9lbmNvZGUoJHYpOiR2OyB9CiAgICAkb1sna29uc3RhbnRvcyddPSRjczsKICAgIC8vIHNhbHRpbml1IHBhc2lza2lyc3R5bWFzIFZJU0FNRSBrYXRhbG9nZQogICAgZ2xvYmFsICR3cGRiOwogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIExJTUlUIDE1MDAiKTsKICAgICRzcmM9YXJyYXkoKTsKICAgIGZvcmVhY2goJGlkcyBhcyAkcGlkKXsgJHM9UGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2U6OnJlc29sdmUoJHBpZCk7CiAgICAgICRrPWlzX3N0cmluZygkcyk/JHM6KGlzX2FycmF5KCRzKSYmaXNzZXQoJHNbJ3NvdXJjZSddKT8kc1snc291cmNlJ106KGlzX29iamVjdCgkcykmJmlzc2V0KCRzLT5zb3VyY2UpPyRzLT5zb3VyY2U6anNvbl9lbmNvZGUoJHMpKSk7CiAgICAgICRrPShzdHJpbmcpJGs7IGlmKCFpc3NldCgkc3JjWyRrXSkpJHNyY1ska109MDsgJHNyY1ska10rKzsgfQogICAgYXJzb3J0KCRzcmMpOyAkb1snc2FsdGluaWFpX2thdGFsb2dlJ109JHNyYzsKICB9CiAgLy8gMi4gQXIga3JlcHNlbGlzIGphdSBpc3BlamEgLyByaWJvamEgcHJpc3RhdHltYQogICRmb3VuZD1hcnJheSgpOwogIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzLyoucGhwJyksIGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSwgZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlLyoucGhwJykpIGFzICRmKXsKICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgICRoaXQ9YXJyYXkoKTsKICAgIGlmKHN0cnBvcygkYywnd29vY29tbWVyY2VfcGFja2FnZV9yYXRlcycpIT09ZmFsc2UpICRoaXRbXT0ncGFja2FnZV9yYXRlcyAocHJpc3RhdHltbyByaWJvamltYXMpJzsKICAgIGlmKHN0cnBvcygkYywnd29vY29tbWVyY2VfY2FydF90b3RhbHMnKSE9PWZhbHNlIHx8IHN0cnBvcygkYywnd29vY29tbWVyY2VfYmVmb3JlX2NhcnQnKSE9PWZhbHNlIHx8IHN0cnBvcygkYywnd29vY29tbWVyY2VfYWZ0ZXJfY2FydCcpIT09ZmFsc2UpICRoaXRbXT0nY2FydCBob29rJzsKICAgIGlmKHByZWdfbWF0Y2goJy9zaXVudHxzaGlwbWVudHxhdHNraXJhIHNpdW50YXxkdmkgc2l1bnRvcy9pdScsJGMpKSAkaGl0W109J1RFS1NUQVMgYXBpZSBzaXVudGFzJzsKICAgIGlmKHN0cnBvcygkYywnRnVsZmlsbG1lbnRfU291cmNlJykhPT1mYWxzZSkgJGhpdFtdPSduYXVkb2phIEZ1bGZpbGxtZW50X1NvdXJjZSc7CiAgICBpZigkaGl0KSAkZm91bmRbYmFzZW5hbWUoJGYpXT0kaGl0OwogIH0KICAkb1sna3VyX25hdWRvamFtYSddPSRmb3VuZDsKICAvLyAzLiBBciB5cmEgaG9vaydhcyByaWJvamFudGlzIHByaXN0YXR5bW8gYnVkdXMKICBnbG9iYWwgJHdwX2ZpbHRlcjsKICAkb1sncGFja2FnZV9yYXRlc19ob29rcyddPWlzc2V0KCR3cF9maWx0ZXJbJ3dvb2NvbW1lcmNlX3BhY2thZ2VfcmF0ZXMnXSkgPyBjb3VudCgkd3BfZmlsdGVyWyd3b29jb21tZXJjZV9wYWNrYWdlX3JhdGVzJ10tPmNhbGxiYWNrcykgOiAwOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  const mk=wj('POST','code-snippets/v1/snippets',{name:'FF (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_ff=Ffx"',{maxBuffer:10e6,timeout:90000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}');
  try{ o.result=JSON.parse(r.slice(a,b+1)); }catch(e){ o.raw=r.slice(0,300); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('ffrec.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
