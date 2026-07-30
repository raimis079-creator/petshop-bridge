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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgRm91ciBDaGVja3MgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzXzRjJ10pIHx8ICRfR0VUWydwc180YyddICE9PSAnRjRjaCcgKSByZXR1cm47CiAgICBnbG9iYWwgJHdwZGI7ICRyPWFycmF5KCk7CgogICAgLy8gPT09IDEpIEZBS1RJTkVTIHNlc2lqdSB0cnVrbWVzID09PQogICAgJHJbJ3Nlc3Npb24nXSA9IGFycmF5KAogICAgICAgICdleHBpcmluZ19kZWZhdWx0JyAgID0+IDYwKjYwKjQ3LCAgICAgIC8vIFdDIGRlZmF1bHQ6IDQ3aAogICAgICAgICdleHBpcmF0aW9uX2RlZmF1bHQnID0+IDYwKjYwKjQ4LCAgICAgIC8vIFdDIGRlZmF1bHQ6IDQ4aAogICAgICAgICdleHBpcmluZ19maWx0ZXJlZCcgICA9PiAoaW50KSBhcHBseV9maWx0ZXJzKCd3Y19zZXNzaW9uX2V4cGlyaW5nJywgICA2MCo2MCo0NyksCiAgICAgICAgJ2V4cGlyYXRpb25fZmlsdGVyZWQnID0+IChpbnQpIGFwcGx5X2ZpbHRlcnMoJ3djX3Nlc3Npb25fZXhwaXJhdGlvbicsIDYwKjYwKjQ4KSwKICAgICAgICAnaGFzX2ZpbHRlcl9leHBpcmluZycgICA9PiBoYXNfZmlsdGVyKCd3Y19zZXNzaW9uX2V4cGlyaW5nJykgPyAxIDogMCwKICAgICAgICAnaGFzX2ZpbHRlcl9leHBpcmF0aW9uJyA9PiBoYXNfZmlsdGVyKCd3Y19zZXNzaW9uX2V4cGlyYXRpb24nKSA/IDEgOiAwLAogICAgKTsKICAgICRyWydzZXNzaW9uJ11bJ2V4cGlyYXRpb25faCddID0gcm91bmQoJHJbJ3Nlc3Npb24nXVsnZXhwaXJhdGlvbl9maWx0ZXJlZCddLzM2MDAsMSk7CiAgICAvLyByZWFsdXMgcGFzaXNraXJzdHltYXM6IGtpZWsgc2tpcnRpbmd1IGV4cGlyeSAiYXRlaXRpZXMiIGxhbmd1CiAgICAkc3Q9JHdwZGItPnByZWZpeC4nd29vY29tbWVyY2Vfc2Vzc2lvbnMnOwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAogICAgICAiU0VMRUNUIHNlc3Npb25fZXhwaXJ5IEZST00gJHN0IFdIRVJFIHNlc3Npb25fZXhwaXJ5ID4gJWQgT1JERVIgQlkgc2Vzc2lvbl9leHBpcnkgREVTQyBMSU1JVCAyMDAiLCB0aW1lKCkpKTsKICAgICRidWNrZXRzPWFycmF5KCk7CiAgICBmb3JlYWNoICgoYXJyYXkpJHJvd3MgYXMgJHgpIHsgJGg9cm91bmQoKCgoaW50KSR4LT5zZXNzaW9uX2V4cGlyeSktdGltZSgpKS8zNjAwKTsgJGJ1Y2tldHNbJGhdPWlzc2V0KCRidWNrZXRzWyRoXSk/JGJ1Y2tldHNbJGhdKzE6MTsgfQogICAga3Jzb3J0KCRidWNrZXRzKTsKICAgICRyWydzZXNzaW9uJ11bJ2V4cGlyeV9ob3Vyc19kaXN0cmlidXRpb24nXT1hcnJheV9zbGljZSgkYnVja2V0cywwLDEyLHRydWUpOwoKICAgIC8vID09PSAyKSBhciBjYXJ0X2FiYW5kb25lZCBlbWl0dGVyaXMgZWd6aXN0dW9qYSA9PT0KICAgICRmPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtZXZlbnQtZW1pdHRlcnMucGhwJzsKICAgICRjPWZpbGVfZXhpc3RzKCRmKT9maWxlX2dldF9jb250ZW50cygkZik6Jyc7CiAgICAkbGluZXM9YXJyYXkoKTsKICAgIGZvcmVhY2ggKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsbikgaWYgKHN0cmlwb3MoJGxuLCdjYXJ0X2FiYW5kb25lZCcpIT09ZmFsc2UpICRsaW5lc1tdPSgkaSsxKS4nOiAnLnRyaW0oJGxuKTsKICAgICRyWydlbWl0dGVyJ109YXJyYXkoJ21lbnRpb25zJz0+JGxpbmVzLCdoYXNfZW1pdF9jYWxsJz0+KGJvb2wpcHJlZ19tYXRjaCgiI2VtaXRcKFxzKidjYXJ0X2FiYW5kb25lZCcjIiwkYykpOwogICAgLy8gdmlzYW1lIHBsdWdpbidlCiAgICAkaGl0cz1hcnJheSgpOwogICAgJHJpaT1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZScpKTsKICAgIGZvcmVhY2ggKCRyaWkgYXMgJHgpIHsgaWYoISR4LT5pc0ZpbGUoKXx8c3Vic3RyKCR4LT5nZXRGaWxlbmFtZSgpLC00KSE9PScucGhwJyljb250aW51ZTsKICAgICAgICAkY2M9QGZpbGVfZ2V0X2NvbnRlbnRzKCR4LT5nZXRQYXRobmFtZSgpKTsKICAgICAgICBpZiAoJGNjICYmIHByZWdfbWF0Y2goIiNlbWl0XChccyonY2FydF9hYmFuZG9uZWQnIyIsJGNjKSkgJGhpdHNbXT1iYXNlbmFtZSgkeC0+Z2V0UGF0aG5hbWUoKSk7IH0KICAgICRyWydlbWl0dGVyJ11bJ2VtaXRfZmlsZXMnXT0kaGl0czsKICAgICRlbD0kd3BkYi0+cHJlZml4Lidwc19ldmVudF9sb2cnOwogICAgJHJbJ2VtaXR0ZXInXVsnZXZlbnRzX2xvZ2dlZCddPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRlbCBXSEVSRSBldmVudF9uYW1lPSVzIiwnY2FydF9hYmFuZG9uZWQnKSk7CgogICAgLy8gPT09IDMpIEFDVElPTiBUT0tFTlMgcGF0aWtyYSA9PT0KICAgIGlmIChjbGFzc19leGlzdHMoJ1BldHNob3BfQWN0aW9uX1Rva2VucycpKSB7CiAgICAgICAgJHQ9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9BY3Rpb25fVG9rZW5zJyk7CiAgICAgICAgJHJbJ3Rva2VucyddPWFycmF5KCdtZXRob2RzJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gJG0tPmdldE5hbWUoKTt9LCR0LT5nZXRNZXRob2RzKCkpLAogICAgICAgICAgICAgICAgICAgICAgICAgICAnY29uc3RzJz0+JHQtPmdldENvbnN0YW50cygpKTsKICAgICAgICAvLyBwYXJhc2FpIChCRSBrdmlldGltbykKICAgICAgICBmb3JlYWNoIChhcnJheSgncHNfZ2VuZXJhdGVfdG9rZW4nLCdwc192ZXJpZnlfdG9rZW4nLCdwc19jb25zdW1lX3Rva2VuJykgYXMgJGZuKSB7CiAgICAgICAgICAgIGlmICghZnVuY3Rpb25fZXhpc3RzKCRmbikpIHsgJHJbJ3Rva2VucyddWydzaWcnXVskZm5dPSdORVJBJzsgY29udGludWU7IH0KICAgICAgICAgICAgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJGZuKTsKICAgICAgICAgICAgJHBzPWFycmF5KCk7CiAgICAgICAgICAgIGZvcmVhY2ggKCRyZi0+Z2V0UGFyYW1ldGVycygpIGFzICRwKSB7CiAgICAgICAgICAgICAgICAkcHNbXT0oJHAtPmhhc1R5cGUoKT8kcC0+Z2V0VHlwZSgpLicgJzonJykuJyQnLiRwLT5nZXROYW1lKCkuKCRwLT5pc09wdGlvbmFsKCk/Jz1vcHQnOicnKTsKICAgICAgICAgICAgfQogICAgICAgICAgICAkclsndG9rZW5zJ11bJ3NpZyddWyRmbl09aW1wbG9kZSgnLCAnLCRwcyk7CiAgICAgICAgICAgICRsaW5lcz1maWxlKCRyZi0+Z2V0RmlsZU5hbWUoKSk7CiAgICAgICAgICAgICRyWyd0b2tlbnMnXVsnYm9keSddWyRmbl09aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkbGluZXMsJHJmLT5nZXRTdGFydExpbmUoKS0xLG1pbigxNCwkcmYtPmdldEVuZExpbmUoKS0kcmYtPmdldFN0YXJ0TGluZSgpKzEpKSk7CiAgICAgICAgfQogICAgICAgICR0dD0kd3BkYi0+cHJlZml4Lidwc19hY3Rpb25fdG9rZW5zJzsKICAgICAgICAkclsndG9rZW5zJ11bJ3RhYmxlX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJHR0Iik7CiAgICAgICAgJHJbJ3Rva2VucyddWydyb3dzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHR0Iik7CiAgICB9IGVsc2UgJHJbJ3Rva2VucyddPSdrbGFzZSBuZXJhc3RhJzsKCiAgICAvLyA9PT0gNCkga3VyIGtyZXBzZWxpbyB2ZWlrc211IGthYmxpdWthaSA9PT0KICAgICRyWydjYXJ0X2hvb2tzJ109YXJyYXkoCiAgICAgICAgJ3dvb2NvbW1lcmNlX2FkZF90b19jYXJ0Jz0+MSwKICAgICAgICAnd29vY29tbWVyY2VfY2FydF9pdGVtX3JlbW92ZWQnPT4xLAogICAgICAgICd3b29jb21tZXJjZV9hZnRlcl9jYXJ0X2l0ZW1fcXVhbnRpdHlfdXBkYXRlJz0+MSwKICAgICAgICAnd29vY29tbWVyY2VfY2hlY2tvdXRfdXBkYXRlX29yZGVyX3Jldmlldyc9PjEsCiAgICApOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Four Checks Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_4c=F4ch"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_4c=F4ch"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('four.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
