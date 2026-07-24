import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2VucSddKSB8fCAkX0dFVFsncHNfZW5xJ10hPT0nRXEyNHgnKSByZXR1cm47CiAgJG89YXJyYXkoKTsgJGRpcj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlLyc7CiAgLy8gcmFzdGkga2FpcCBlbnF1ZXVlJ2luYW1hIHBldC1wcm9maWxlLmpzIOKAlCB2ZXJzaWphCiAgZm9yZWFjaChnbG9iKCRkaXIuJyoucGhwJykgYXMgJGYpewogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgaWYoc3RycG9zKCRjLCdwZXQtcHJvZmlsZS5qcycpIT09ZmFsc2UgfHwgc3RycG9zKCRjLCd3cF9lbnF1ZXVlX3NjcmlwdCcpIT09ZmFsc2UpewogICAgICBwcmVnX21hdGNoX2FsbCgnL3dwX2VucXVldWVfc2NyaXB0XHMqXChbXjtdezAsMzAwfTsvcycsJGMsJG0pOwogICAgICBmb3JlYWNoKCRtWzBdIGFzICRsaW5lKXsgaWYoc3RycG9zKCRsaW5lLCdwZXQtcHJvZmlsZScpIT09ZmFsc2V8fHN0cnBvcygkbGluZSwncGV0LWZvcm0nKSE9PWZhbHNlKXsgJG9bJ2VucXVldWUnXVtdPXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkbGluZSk7IH0gfQogICAgICBwcmVnX21hdGNoKCcvKD86VkVSU0lPTnxfVkVSfHZlcnNpb24pXHMqWz1cJywoXVxzKltcJyJdPyhbMC05XVswLTkuXSspLycsJGMsJG12KTsKICAgICAgaWYoJG12KSAkb1sndmVyc2lvbl9jb25zdCddW2Jhc2VuYW1lKCRmKV09JG12WzFdOwogICAgfQogIH0KICAvLyBmYWlsbyBtb2RpZmlrYWNpam9zIGxhaWthcyBpciByZWFsdXMgZHlkaXMgKGFyIG5hdWphcyBzZXJ2ZXJ5amUpCiAgJG9bJ3BldF9wcm9maWxlJ109YXJyYXkoCiAgICAnbXRpbWUnPT5kYXRlKCdZLW0tZCBIOmk6cycsZmlsZW10aW1lKCRkaXIuJ2Fzc2V0cy9wZXQtcHJvZmlsZS5qcycpKSwKICAgICdieXRlcyc9PmZpbGVzaXplKCRkaXIuJ2Fzc2V0cy9wZXQtcHJvZmlsZS5qcycpLAogICAgJ3NoYSc9PnN1YnN0cihoYXNoX2ZpbGUoJ3NoYTI1NicsJGRpci4nYXNzZXRzL3BldC1wcm9maWxlLmpzJyksMCwxNiksCiAgICAnaGFzX3BhcGlsZHlraXRlJz0+c3RycG9zKGZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJ2Fzc2V0cy9wZXQtcHJvZmlsZS5qcycpLCdQYXBpbGR5a2l0ZSBwcm9maWzErycpIT09ZmFsc2UsCiAgKTsKICAvLyBhciBmYWlsYXMgdHVyaSBmaWxlbXRpbWUtYmFzZWQgdmVyc2lqYXZpbWEKICAkYz1maWxlX2dldF9jb250ZW50cygkZGlyLidwZXRzaG9wLWNvcmUucGhwJyk7CiAgJG9bJ3VzZXNfZmlsZW10aW1lJ109c3RycG9zKCRjLCdmaWxlbXRpbWUnKSE9PWZhbHNlOwogICRvWyd2ZXJzaW9uX2RlZmluZSddPShwcmVnX21hdGNoKCcvZGVmaW5lXHMqXChccypbXCciXVBFVFNIT1BfQ09SRV9WRVJbXCciXVxzKixccypbXCciXShbXlwnIl0rKS8nLCRjLCRtbSk/JG1tWzFdOiduZXJhc3RhJyk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50*1024*1024}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50*1024*1024}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const mk=wj('POST','code-snippets/v1/snippets',{name:'P0 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_enq=Eq24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='EP0 '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('enq.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
