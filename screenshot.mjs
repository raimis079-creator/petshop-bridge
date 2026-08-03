import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s366',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run379-v1'}; let sid=null;
try{const ls=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'?per_page=100"');const arr=JSON.parse(ls.out);const off=[];
 for(const s0 of arr){ if(s0.name&&s0.name.indexOf('TEMP')===0&&s0.active){
   fs.writeFileSync('/tmp/o.json',JSON.stringify({active:false}));
   sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/o.json "'+API+'/'+s0.id+'"'); off.push(s0.id);} }
 O.deakt=off;}catch(e){}
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM3OSBPdXRib3VuZCBIVFRQUyB2MSDigJQgQVRTQVJHVVMgdGVzdGFzCiAqIFZpZW5hIGtyeXB0aXMgcGVyIHV6a2xhdXNhLCA1IHMgcmliYSwgam9raW8gY2lrbG8uCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zMzc5J10pIHx8ICRfR0VUWydwc19zMzc5J10gIT09ICdLMzc5b2InICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBAc2V0X3RpbWVfbGltaXQoMzApOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczM3OS12MScpOwogICAgJHQ9aXNzZXQoJF9HRVRbJ3QnXSk/JF9HRVRbJ3QnXTonJzsKCiAgICAkdGFpa2luaWFpPWFycmF5KAogICAgICAnYXBsaW5rYScgICA9PiBudWxsLAogICAgICAnZ2l0aHViJyAgICA9PiAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS8nLAogICAgICAnYjJhcGknICAgICA9PiAnaHR0cHM6Ly9hcGkuYmFja2JsYXplYjIuY29tLycsCiAgICAgICd3YXNhYmknICAgID0+ICdodHRwczovL3MzLmV1LWNlbnRyYWwtMS53YXNhYmlzeXMuY29tLycsCiAgICAgICdnb29nbGUnICAgID0+ICdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS8nLAogICAgICAnc2VuZGVyJyAgICA9PiAnaHR0cHM6Ly9hcGkuc2VuZGVyLm5ldC8nLAogICAgICAnd3BvcmcnICAgICA9PiAnaHR0cHM6Ly9hcGkud29yZHByZXNzLm9yZy8nLAogICAgKTsKICAgIGlmKCFhcnJheV9rZXlfZXhpc3RzKCR0LCR0YWlraW5pYWkpKXsgJHJbJ0tMQUlEQSddPSduZXppbm9tYXMgdGFpa2lueXMnOyAkclsnZ2FsaW1pJ109YXJyYXlfa2V5cygkdGFpa2luaWFpKTsgZWNobyB3cF9qc29uX2VuY29kZSgkcik7IGV4aXQ7IH0KCiAgICBpZigkdD09PSdhcGxpbmthJyl7CiAgICAgICAgJHJbJ2N1cmwnXT1mdW5jdGlvbl9leGlzdHMoJ2N1cmxfaW5pdCcpP2N1cmxfdmVyc2lvbigpWyd2ZXJzaW9uJ106J05FUkEnOwogICAgICAgICRyWydzc2wnXT1mdW5jdGlvbl9leGlzdHMoJ2N1cmxfaW5pdCcpP2N1cmxfdmVyc2lvbigpWydzc2xfdmVyc2lvbiddOm51bGw7CiAgICAgICAgJHJbJ2FsbG93X3VybF9mb3BlbiddPWluaV9nZXQoJ2FsbG93X3VybF9mb3BlbicpOwogICAgICAgICRyWydvcGVuX2Jhc2VkaXInXT1pbmlfZ2V0KCdvcGVuX2Jhc2VkaXInKTsKICAgICAgICAkclsnZGlzYWJsZV9mdW5jdGlvbnMnXT1pbmlfZ2V0KCdkaXNhYmxlX2Z1bmN0aW9ucycpOwogICAgICAgICRyWydkZWZhdWx0X3NvY2tldF90aW1lb3V0J109aW5pX2dldCgnZGVmYXVsdF9zb2NrZXRfdGltZW91dCcpOwogICAgICAgIGZvcmVhY2goYXJyYXkoJ2d6b3BlbicsJ2d6ZW5jb2RlJywnY3VybF9pbml0JywnY3VybF9tdWx0aV9pbml0JywnbXlzcWxpX2Nvbm5lY3QnLCdmc29ja29wZW4nLCdzdHJlYW1fc29ja2V0X2NsaWVudCcpIGFzICRmKQogICAgICAgICAgICAkclsnZnVua2Npam9zJ11bJGZdPWZ1bmN0aW9uX2V4aXN0cygkZik/J3lyYSc6J05FUkEnOwogICAgICAgIC8vIFdQIHNhdm8gSFRUUCBzbHVva3NuaXMg4oCUIGFyIGppcyBrYSBub3JzIGJsb2t1b2phCiAgICAgICAgJHJbJ1dQX0hUVFBfQkxPQ0tfRVhURVJOQUwnXT1kZWZpbmVkKCdXUF9IVFRQX0JMT0NLX0VYVEVSTkFMJyk/KFdQX0hUVFBfQkxPQ0tfRVhURVJOQUw/J1RBSVAnOiduZScpOiduZWFwaWJyxJfFvnRhJzsKICAgICAgICAkclsnV1BfQUNDRVNTSUJMRV9IT1NUUyddPWRlZmluZWQoJ1dQX0FDQ0VTU0lCTEVfSE9TVFMnKT9XUF9BQ0NFU1NJQkxFX0hPU1RTOm51bGw7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CgogICAgLy8gRE5TIGF0c2tpcmFpIG51byBqdW5naW1vc2kg4oCUIGthZCBtYXR5dHVtZSwga3VyaXMgc2x1b2tzbmlzIGzFq8W+dGEKICAgICRob3N0PXBhcnNlX3VybCgkdGFpa2luaWFpWyR0XSwgUEhQX1VSTF9IT1NUKTsKICAgICR0MD1taWNyb3RpbWUodHJ1ZSk7CiAgICAkaXA9QGdldGhvc3RieW5hbWUoJGhvc3QpOwogICAgJHJbJ2RucyddPWFycmF5KCdob3N0Jz0+JGhvc3QsJ2lwJz0+KCRpcD09PSRob3N0PydORUlTU1BSRVNUQSc6JGlwKSwnbXMnPT5yb3VuZCgobWljcm90aW1lKHRydWUpLSR0MCkqMTAwMCkpOwoKICAgIC8vIFRDUCA0NDMgc3UgNSBzIHJpYmEKICAgICR0MT1taWNyb3RpbWUodHJ1ZSk7CiAgICAkZXJybm89MDskZXJyc3RyPScnOwogICAgJGZwPUBmc29ja29wZW4oJ3NzbDovLycuJGhvc3QsIDQ0MywgJGVycm5vLCAkZXJyc3RyLCA1KTsKICAgICRyWyd0Y3A0NDMnXT1hcnJheSgncGF2eWtvJz0+KGJvb2wpJGZwLCdlcnJubyc9PiRlcnJubywna2xhaWRhJz0+JGVycnN0cj9zdWJzdHIoJGVycnN0ciwwLDEyMCk6bnVsbCwKICAgICAgICAgICAgICAgICAgICAgICAnbXMnPT5yb3VuZCgobWljcm90aW1lKHRydWUpLSR0MSkqMTAwMCkpOwogICAgaWYoJGZwKSBmY2xvc2UoJGZwKTsKCiAgICAvLyBjVVJMIEhFQUQgc3UgZ3JpZXp0YSByaWJhCiAgICAkdDI9bWljcm90aW1lKHRydWUpOwogICAgJGNoPWN1cmxfaW5pdCgkdGFpa2luaWFpWyR0XSk7CiAgICBjdXJsX3NldG9wdF9hcnJheSgkY2gsIGFycmF5KAogICAgICBDVVJMT1BUX1JFVFVSTlRSQU5TRkVSPT4xLCBDVVJMT1BUX05PQk9EWT0+MSwgQ1VSTE9QVF9GT0xMT1dMT0NBVElPTj0+MCwKICAgICAgQ1VSTE9QVF9USU1FT1VUPT42LCBDVVJMT1BUX0NPTk5FQ1RUSU1FT1VUPT40LCBDVVJMT1BUX1NTTF9WRVJJRllQRUVSPT4xKSk7CiAgICBjdXJsX2V4ZWMoJGNoKTsKICAgICRyWydjdXJsJ109YXJyYXkoJ2h0dHAnPT5jdXJsX2dldGluZm8oJGNoLENVUkxJTkZPX0hUVFBfQ09ERSksCiAgICAgICAgICAgICAgICAgICAgICdrbGFpZGEnPT5jdXJsX2Vycm9yKCRjaCk/c3Vic3RyKGN1cmxfZXJyb3IoJGNoKSwwLDEyMCk6bnVsbCwKICAgICAgICAgICAgICAgICAgICAgJ2Nvbm5lY3RfbXMnPT5yb3VuZChjdXJsX2dldGluZm8oJGNoLENVUkxJTkZPX0NPTk5FQ1RfVElNRSkqMTAwMCksCiAgICAgICAgICAgICAgICAgICAgICdtcyc9PnJvdW5kKChtaWNyb3RpbWUodHJ1ZSktJHQyKSoxMDAwKSk7CiAgICBjdXJsX2Nsb3NlKCRjaCk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S379 Outbound HTTPS v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a,extra){const x=sh('curl -sSk --max-time 45 '+(extra||'')+' "'+SITE+'/?ps_s379=K379ob&t='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x.out);}catch(e){return {raw:x.out.slice(0,700)};}}
O.aplinka=q('aplinka');
O.svetaine_pries=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 20 "'+SITE+'/"').out.trim();
for(const t of ['github','b2api','wasabi','google','sender','wporg']){
  const t0=Date.now();
  O['test_'+t]=q(t);
  O['test_'+t+'_run_ms']=Date.now()-t0;
  const hp=sh('curl -sSk -o /dev/null -w "%{http_code}|%{time_total}" --max-time 20 "'+SITE+'/"').out.trim();
  O['svetaine_po_'+t]=hp;
  if(hp.split('|')[0]!=='200'){ O.STOP='svetaine nebeatsako po '+t; break; }
  sh('sleep 2');
}

O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').out.trim();
O.parduotuve=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/parduotuve/"').out.trim();
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s379.json', JSON.stringify(O,null,1));
console.log('OK');
