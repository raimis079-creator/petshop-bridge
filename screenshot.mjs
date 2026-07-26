import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2dmcyddKSB8fCAkX0dFVFsncHNfZ2ZzJ10hPT0nR2ZzeCcpIHJldHVybjsKICAkZD1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlLyc7CiAgJG91dD1hcnJheSgpOwogICRmaWxlcz1hcnJheSgKICAgICdzZXJ2aWNlJz0+JGQuJ2luY2x1ZGVzL2NsYXNzLWZlZWRpbmctc2VydmljZS5waHAnLAogICAgJ2NhbGNyZXN0Jz0+V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1mZWVkaW5nLWNhbGMtcmVzdC5waHAnLAogICAgJ2NvcmUnPT4kZC4ncGV0c2hvcC1jb3JlLnBocCcsCiAgKTsKICBmb3JlYWNoKCRmaWxlcyBhcyAkaz0+JGYpewogICAgJG91dFska109YXJyYXkoJ2I2NCc9PmJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJGYpKSwnYnl0ZXMnPT5maWxlc2l6ZSgkZiksJ3NoYSc9PnN1YnN0cihoYXNoX2ZpbGUoJ3NoYTI1NicsJGYpLDAsMTYpKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==';
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
const o={};
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  const mk=wj('POST','code-snippets/v1/snippets',{name:'GFS (temp)',code:php,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_gfs=Gfsx"',{maxBuffer:20e6,timeout:70000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}');
  try{ o.result=JSON.parse(r.slice(a,b+1)); }catch(e){ o.raw=r.slice(0,200); }
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('getfs.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
