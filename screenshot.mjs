import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s412',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run414-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQxNCBGbGF0c29tZSBGb290ZXIgUmVjb24gdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3M0MTQnXSkgfHwgJF9HRVRbJ3BzX3M0MTQnXSAhPT0gJ0s0MTRmZicgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIEBzZXRfdGltZV9saW1pdCgxMjApOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczQxNC12MScpOwoKICAgIC8vIDEpIHJlZ2lzdHJ1b3RpIHdpZGdldCd1IHBsb3RhaQogICAgZ2xvYmFsICR3cF9yZWdpc3RlcmVkX3NpZGViYXJzOwogICAgZm9yZWFjaCgoYXJyYXkpJHdwX3JlZ2lzdGVyZWRfc2lkZWJhcnMgYXMgJGlkPT4kcykKICAgICAgICAkclsnc2lkZWJhcnMnXVskaWRdPWlzc2V0KCRzWyduYW1lJ10pPyRzWyduYW1lJ106Jz8nOwogICAgJHJbJ3NpZGViYXJzX3dpZGdldHMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpeyByZXR1cm4gaXNfYXJyYXkoJHgpPyR4OiR4OyB9LCAoYXJyYXkpZ2V0X29wdGlvbignc2lkZWJhcnNfd2lkZ2V0cycpKTsKCiAgICAvLyAyKSB0ZW1vcyBmb290ZXIucGhwCiAgICAkdGVtYT1nZXRfdGVtcGxhdGVfZGlyZWN0b3J5KCk7CiAgICAkdmFpa2FzPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpOwogICAgZm9yZWFjaChhcnJheSgkdmFpa2FzLicvZm9vdGVyLnBocCc9PidjaGlsZCcsICR0ZW1hLicvZm9vdGVyLnBocCc9PidwYXJlbnQnKSBhcyAkZj0+JGthcyl7CiAgICAgICAgaWYoIWlzX2ZpbGUoJGYpKSB7ICRyWydmb290ZXJfcGhwJ11bJGthc109J05FUkEnOyBjb250aW51ZTsgfQogICAgICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgICAgICAkclsnZm9vdGVyX3BocCddWyRrYXNdPWFycmF5KCdCJz0+c3RybGVuKCRjKSwndHVyaW55cyc9PnN1YnN0cigkYywwLDEyMDApKTsKICAgIH0KICAgIC8vIDMpIGtva2llIGFjdGlvbiBrYWJsaXVrYWkgbmF1ZG9qYW1pIHBvcmHFoXTEl2plCiAgICAkZz0kdGVtYS4nL2luYy9zdHJ1Y3R1cmUvc3RydWN0dXJlLWZvb3Rlci5waHAnOwogICAgaWYoaXNfZmlsZSgkZykpewogICAgICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRnKTsKICAgICAgICAkbD1leHBsb2RlKCJcbiIsJGMpOyAkb3V0PWFycmF5KCk7CiAgICAgICAgZm9yZWFjaCgkbCBhcyAkaT0+JGxuKQogICAgICAgICAgICBpZihwcmVnX21hdGNoKCcvKGRvX2FjdGlvbnxhZGRfYWN0aW9ufGZ1bmN0aW9uIHxkeW5hbWljX3NpZGViYXJ8Z2V0X3RoZW1lX21vZCkvJywkbG4pKQogICAgICAgICAgICAgICAgJG91dFtdPSgkaSsxKS4nOiAnLnRyaW0oc3Vic3RyKCRsbiwwLDE0MCkpOwogICAgICAgICRyWydzdHJ1Y3R1cmVfZm9vdGVyJ109YXJyYXkoJ0InPT5zdHJsZW4oJGMpLCdlaWwnPT5hcnJheV9zbGljZSgkb3V0LDAsNjApKTsKICAgIH0gZWxzZSB7CiAgICAgICAgJHJbJ3N0cnVjdHVyZV9mb290ZXInXT0nTkVSQSAnLiRnOwogICAgICAgIC8vIHBhaWVza29tIGt1ciB5cmEgZm9vdGVyIGZ1bmtjaWpvcwogICAgICAgICRyYWQ9YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKGdsb2IoJHRlbWEuJy9pbmMvc3RydWN0dXJlLyoucGhwJykgYXMgJGYpICRyYWRbXT1iYXNlbmFtZSgkZik7CiAgICAgICAgJHJbJ3N0cnVjdHVyZV9mYWlsYWknXT0kcmFkOwogICAgfQogICAgLy8gNCkgYXRzdGF0b20gc2F2byBrbGFpZGEg4oCUIHRyaW5hbSBwcmFzaW1hbnl0YSB0aGVtZV9tb2QKICAgIGlmKGlzc2V0KCRfR0VUWydjbGVhbiddKSAmJiAkX0dFVFsnY2xlYW4nXT09PScxJyl7CiAgICAgICAgcmVtb3ZlX3RoZW1lX21vZCgnZm9vdGVyXzFfY29udGVudCcpOwogICAgICAgICRyWydmb290ZXJfMV9jb250ZW50X2lzdHJpbnRhcyddPSBnZXRfdGhlbWVfbW9kKCdmb290ZXJfMV9jb250ZW50JywnX19ORVJBX18nKT09PSdfX05FUkFfXycgPyAnVEFJUCc6J05FJzsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S414 Flatsome Footer v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a,extra){const x=sh('curl -sSk --max-time 200 '+(extra||'')+' "'+SITE+'/?ps_s414=K414ff&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x.out);}catch(e){return {raw:x.out.slice(0,500)};}}
O.rez=q('x');
O.valymas=q('x&clean=1');
putResult('s414.json', JSON.stringify(O,null,1));
console.log('OK');
