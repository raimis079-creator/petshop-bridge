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
// pirma deaktyvuoti visus senus TEMP PP Audit snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP PP Audit/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUG9zdC1QdXJjaGFzZSBPd25lcnNoaXAgQXVkaXQgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3BwJ10pIHx8ICRfR0VUWydwc19wcCddICE9PSAnUHA5YScgKSByZXR1cm47CiAgICBnbG9iYWwgJHdwZGIsICRQU19DQVA7ICRQU19DQVA9YXJyYXkoKTsgJHI9YXJyYXkoKTsKCiAgICAvLyA9PT09PSAxKSBLQVMgU0lVTkNJQSA9PT09PQogICAgLy8gV0MgbGFpc2t1IGtsYXNlcwogICAgJG1haWxlcj1XQygpLT5tYWlsZXIoKTsgJGVtYWlscz0kbWFpbGVyLT5nZXRfZW1haWxzKCk7CiAgICAkZW49YXJyYXkoKTsKICAgIGZvcmVhY2goJGVtYWlscyBhcyAkaWQ9PiRlKXsgJGVuW109YXJyYXkoJ2lkJz0+JGUtPmlkLCd0aXRsZSc9PiRlLT5nZXRfdGl0bGUoKSwnZW5hYmxlZCc9PiRlLT5pc19lbmFibGVkKCk/MTowLCdyZWNpcGllbnQnPT5tZXRob2RfZXhpc3RzKCRlLCdnZXRfcmVjaXBpZW50Jyk/QCRlLT5nZXRfcmVjaXBpZW50KCk6JycpOyB9CiAgICAkclsnd2NfZW1haWxzJ109JGVuOwoKICAgIC8vIHBsdWdpbidhaQogICAgaWYgKCAhIGZ1bmN0aW9uX2V4aXN0cygnZ2V0X3BsdWdpbnMnKSApIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4ucGhwJzsKICAgICRhbGw9Z2V0X3BsdWdpbnMoKTsgJGFjdD0oYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKTsgJGhpdHM9YXJyYXkoKTsKICAgIGZvcmVhY2goJGFjdCBhcyAkcCl7ICRuPWlzc2V0KCRhbGxbJHBdWydOYW1lJ10pPyRhbGxbJHBdWydOYW1lJ106JHA7CiAgICAgIGlmIChwcmVnX21hdGNoKCcjcmV2aWV3fGF0c2lsaWVwfGZvbGxvdy4/dXB8ZmVlZGJhY2t8c3VydmV5fHRydXN0cGlsb3R8anVkZ2V8eW90cG8jaScsJHAuJyAnLiRuKSkgJGhpdHNbXT0kbjsgfQogICAgJHJbJ3Jldmlld19wbHVnaW5zJ109JGhpdHM7CgogICAgLy8gY3JvbgogICAgJGNyPWFycmF5KCk7CiAgICBmb3JlYWNoKChhcnJheSlfZ2V0X2Nyb25fYXJyYXkoKSBhcyAkdHM9PiRob29rcyl7IGZvcmVhY2goJGhvb2tzIGFzICRoPT4keCl7CiAgICAgIGlmIChwcmVnX21hdGNoKCcjcmV2aWV3fGZvbGxvd3xwb3N0Lj9wdXJjaGFzZXxhdHNpbGllcCNpJywkaCkpICRjcltdPSRoOyB9IH0KICAgICRyWydjcm9ucyddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGNyKSk7CgogICAgLy8gZnVuY3Rpb25zLnBocCBpciBwbHVnaW4ndSB3cF9tYWlsIC8gbGFpc2t1IGhvb2thaQogICAgJGNvZGVoaXRzPWFycmF5KCk7CiAgICBmb3JlYWNoKGFycmF5KGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnLFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWVzcCcpIGFzICRkKXsKICAgICAgaWYoIWlzX2RpcigkZCkpY29udGludWU7CiAgICAgICRyaWk9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkLCBGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICBmb3JlYWNoKCRyaWkgYXMgJGYpeyBpZighJGYtPmlzRmlsZSgpfHxzdWJzdHIoJGYtPmdldEZpbGVuYW1lKCksLTQpIT09Jy5waHAnKWNvbnRpbnVlOwogICAgICAgICRjPUBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7IGlmKCEkYyljb250aW51ZTsKICAgICAgICBpZiAocHJlZ19tYXRjaCgnI3dwX21haWxccypcKCMnLCRjKSkgJGNvZGVoaXRzW109c3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZi0+Z2V0UGF0aG5hbWUoKSk7IH0gfQogICAgJHJbJ3dwX21haWxfZmlsZXMnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRjb2RlaGl0cykpOwoKICAgIC8vID09PT09IDIpIEFUU0lMSUVQSU1VIEdBTElNWUJFID09PT09CiAgICAkclsncmV2aWV3cyddPWFycmF5KAogICAgICAnZW5hYmxlX3Jldmlld3MnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9lbmFibGVfcmV2aWV3cycpLAogICAgICAncmF0aW5nX3ZlcmlmaWNhdGlvbic9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3Jldmlld19yYXRpbmdfdmVyaWZpY2F0aW9uX3JlcXVpcmVkJyksCiAgICAgICdyYXRpbmdzX2VuYWJsZWQnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9lbmFibGVfcmV2aWV3X3JhdGluZycpLAogICAgICAnY29tbWVudF9yZWdpc3RyYXRpb24nPT5nZXRfb3B0aW9uKCdjb21tZW50X3JlZ2lzdHJhdGlvbicpLAogICAgICAnZGVmYXVsdF9jb21tZW50X3N0YXR1cyc9PmdldF9vcHRpb24oJ2RlZmF1bHRfY29tbWVudF9zdGF0dXMnKSwKICAgICk7CiAgICAvLyBrb25rcmV0dXMgcHJvZHVrdGFzCiAgICAkaWRzPXdjX2dldF9wcm9kdWN0cyhhcnJheSgnbGltaXQnPT41LCdzdGF0dXMnPT4ncHVibGlzaCcsJ3JldHVybic9PidpZHMnKSk7CiAgICAkc2FtcGxlPWFycmF5KCk7CiAgICBmb3JlYWNoKChhcnJheSkkaWRzIGFzICRwaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgICAgJHNhbXBsZVtdPWFycmF5KCdpZCc9PiRwaWQsJ3Jldmlld3NfYWxsb3dlZCc9PiRwLT5nZXRfcmV2aWV3c19hbGxvd2VkKCk/MTowLAogICAgICAgICdjb21tZW50X3N0YXR1cyc9PmdldF9wb3N0X2ZpZWxkKCdjb21tZW50X3N0YXR1cycsJHBpZCksCiAgICAgICAgJ3VybCc9PiRwLT5nZXRfcGVybWFsaW5rKCkuJyNyZXZpZXdzJywncmV2aWV3X2NvdW50Jz0+JHAtPmdldF9yZXZpZXdfY291bnQoKSk7IH0KICAgICRyWydyZXZpZXdzJ11bJ3NhbXBsZSddPSRzYW1wbGU7CgogICAgLy8gPT09PT0gMykgUkVBTFVTIFRFU1RBUzogcGVyaW1hbSB3cF9tYWlsID09PT09CiAgICBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsIGZ1bmN0aW9uKCRuLCRhKXsgZ2xvYmFsICRQU19DQVA7CiAgICAgICRQU19DQVBbXT1hcnJheSgndG8nPT5pc19hcnJheSgkYVsndG8nXSk/aW1wbG9kZSgnLCcsJGFbJ3RvJ10pOiRhWyd0byddLCdzJz0+JGFbJ3N1YmplY3QnXSk7IHJldHVybiB0cnVlOyB9LDEsMik7CgogICAgJHByb2Q9d2NfZ2V0X3Byb2R1Y3RzKGFycmF5KCdsaW1pdCc9PjEsJ3N0YXR1cyc9PidwdWJsaXNoJywncmV0dXJuJz0+J2lkcycpKTsKICAgICRwaWQ9JHByb2Q/JHByb2RbMF06MDsKICAgICRvPXdjX2NyZWF0ZV9vcmRlcigpOyBpZigkcGlkKSAkby0+YWRkX3Byb2R1Y3Qod2NfZ2V0X3Byb2R1Y3QoJHBpZCksMSk7CiAgICAkby0+c2V0X2JpbGxpbmdfZW1haWwoJ3BwLWF1ZGl0QGV4YW1wbGUuY29tJyk7ICRvLT5zZXRfYmlsbGluZ19maXJzdF9uYW1lKCdUZXN0YXMnKTsKICAgICRvLT5zZXRfcGF5bWVudF9tZXRob2QoJ2JhY3MnKTsgJG8tPmNhbGN1bGF0ZV90b3RhbHMoKTsgJG8tPnNhdmUoKTsKICAgICRvaWQ9JG8tPmdldF9pZCgpOwogICAgJFBTX0NBUD1hcnJheSgpOyAkby0+cGF5bWVudF9jb21wbGV0ZSgnUFAtJy4kb2lkKTsKICAgICRyWyd0ZXN0J11bJ3BvX2FwbW9rZWppbW8nXT0kUFNfQ0FQOwogICAgJFBTX0NBUD1hcnJheSgpOyB3Y19nZXRfb3JkZXIoJG9pZCktPnVwZGF0ZV9zdGF0dXMoJ2NvbXBsZXRlZCcsJ3BwYXVkaXQnKTsKICAgICRyWyd0ZXN0J11bJ3BvX2NvbXBsZXRlZCddPSRQU19DQVA7CiAgICAvLyBhciBrYXMgbm9ycyBzdXBsYW5hdm8gY3JvbiBwbyB1enNha3ltbwogICAgJHNjaGVkPWFycmF5KCk7CiAgICBmb3JlYWNoKChhcnJheSlfZ2V0X2Nyb25fYXJyYXkoKSBhcyAkdHM9PiRob29rcyl7IGZvcmVhY2goJGhvb2tzIGFzICRoPT4keCl7CiAgICAgIGZvcmVhY2goKGFycmF5KSR4IGFzICRrPT4kZXYpeyAkYXJncz1pc3NldCgkZXZbJ2FyZ3MnXSk/JGV2WydhcmdzJ106YXJyYXkoKTsKICAgICAgICBpZiAoaW5fYXJyYXkoJG9pZCwoYXJyYXkpJGFyZ3MpIHx8IChpc19hcnJheSgkYXJncykmJmluX2FycmF5KChzdHJpbmcpJG9pZCxhcnJheV9tYXAoJ3N0cnZhbCcsJGFyZ3MpLHRydWUpKSkKICAgICAgICAgICRzY2hlZFtdPWFycmF5KCdob29rJz0+JGgsJ2thZGEnPT5nbWRhdGUoJ1ktbS1kIEg6aScsJHRzKSk7IH0gfSB9CiAgICAkclsndGVzdCddWydzdXBsYW51b3RpX2Nyb24nXT0kc2NoZWQ7CiAgICB3Y19nZXRfb3JkZXIoJG9pZCktPmRlbGV0ZSh0cnVlKTsKCiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP PP Audit Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_pp=Pp9a"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_pp=Pp9a"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('ppa.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
