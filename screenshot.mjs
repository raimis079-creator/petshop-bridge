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
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:''};}}
const O={}; const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzMyMiBTdGFsZS1TdGF0ZSBUZXN0cyB2MQogKiBQcmVrZXMgYnVrbGUgcGFzaWtlaWNpYSBQTyBsYWlza28gaXNzaXVudGltby4KICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3NsJ10pICkgcmV0dXJuOwogICAgJGs9JF9HRVRbJ3BzX3NsJ107IGdsb2JhbCAkd3BkYjsKICAgICRUPVBldHNob3BfQ2FydF9UcmFja2VyOjp0YWJsZSgpOwogICAgJENJRD0nY19zdGFsZV90ZXN0JzsKCiAgICBpZiAoJGs9PT0nc2V0dXAnKSB7CiAgICAgICAgJGlkcz13Y19nZXRfcHJvZHVjdHMoYXJyYXkoJ2xpbWl0Jz0+MzAsJ3N0YXR1cyc9PidwdWJsaXNoJywncmV0dXJuJz0+J2lkcycpKTsKICAgICAgICAkYT0wOyRiPTA7IGZvcmVhY2goKGFycmF5KSRpZHMgYXMgJHgpeyAkcD13Y19nZXRfcHJvZHVjdCgkeCk7CiAgICAgICAgICBpZigkcCYmJHAtPmlzX3B1cmNoYXNhYmxlKCkmJiRwLT5pc19pbl9zdG9jaygpJiYhJHAtPmlzX3R5cGUoJ3ZhcmlhYmxlJykpeyBpZighJGEpeyRhPShpbnQpJHg7fSBlbHNlaWYoISRiKXskYj0oaW50KSR4O2JyZWFrO30gfSB9CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSAkVCBXSEVSRSBjYXJ0X2lkPSVzIiwkQ0lEKSk7CiAgICAgICAgJG5vdz1jdXJyZW50X3RpbWUoJ215c3FsJyx0cnVlKTsKICAgICAgICAkaXRlbXM9YXJyYXkoCiAgICAgICAgICBhcnJheSgncHJvZHVjdF9pZCc9PiRhLCd2YXJpYXRpb25faWQnPT4wLCdxdWFudGl0eSc9PjIsJ3ZhcmlhdGlvbic9PmFycmF5KCksJ2l0ZW1fZGF0YSc9PmFycmF5KCkpLAogICAgICAgICAgYXJyYXkoJ3Byb2R1Y3RfaWQnPT4kYiwndmFyaWF0aW9uX2lkJz0+MCwncXVhbnRpdHknPT4xLCd2YXJpYXRpb24nPT5hcnJheSgpLCdpdGVtX2RhdGEnPT5hcnJheSgpKSk7CiAgICAgICAgJHdwZGItPmluc2VydCgkVCxhcnJheSgnY2FydF9pZCc9PiRDSUQsJ2VtYWlsJz0+J3N0YWxlQGV4YW1wbGUuY29tJywnZW1haWxfc291cmNlJz0+J2NoZWNrb3V0JywKICAgICAgICAgICdsYXN0X2NhcnRfYWN0aXZpdHlfYXQnPT4kbm93LCdjYXJ0X2hhc2gnPT4naHN0Jywnc25hcHNob3RfanNvbic9PndwX2pzb25fZW5jb2RlKCRpdGVtcyksCiAgICAgICAgICAnc25hcHNob3RfdmVyc2lvbic9PjEsJ3N0YXR1cyc9PidhYmFuZG9uZWQnLCdzdGF0dXNfY2hhbmdlZF9hdCc9PiRub3csJ2NyZWF0ZWRfYXQnPT4kbm93LCd1cGRhdGVkX2F0Jz0+JG5vdykpOwogICAgICAgIC8vIFRPS0VOQVMg4oCUIGthaXAgbGFpc2tlLCBzdWt1cmlhbWFzIFZJRU5BIGthcnRhCiAgICAgICAgJGxpbms9UGV0c2hvcF9DYXJ0X1JlY292ZXJ5OjpsaW5rKCRDSUQpOwogICAgICAgIHBhcnNlX3N0cihwYXJzZV91cmwoJGxpbmssUEhQX1VSTF9RVUVSWSksJHEpOwogICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX3N0YWxlX3N0YXRlJyxhcnJheSgnYSc9PiRhLCdiJz0+JGIsCiAgICAgICAgICAnYV9zdCc9PmdldF9wb3N0X3N0YXR1cygkYSksJ2Jfc3QnPT5nZXRfcG9zdF9zdGF0dXMoJGIpLCd0b2tlbic9PiRxWyd0J10/PycnKSxmYWxzZSk7CiAgICAgICAgJHBhPXdjX2dldF9wcm9kdWN0KCRhKTsgJHBiPXdjX2dldF9wcm9kdWN0KCRiKTsKICAgICAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdhJz0+JGEsJ2InPT4kYiwnYV9uYW1lJz0+bWJfc3Vic3RyKCRwYS0+Z2V0X25hbWUoKSwwLDMyKSwKICAgICAgICAgICdiX25hbWUnPT5tYl9zdWJzdHIoJHBiLT5nZXRfbmFtZSgpLDAsMzIpLCd0b2tlbic9PiRxWyd0J10/PycnKSxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OwogICAgfQoKICAgIGlmICgkaz09PSdraWxsX29uZScgfHwgJGs9PT0na2lsbF9ib3RoJykgewogICAgICAgICRzPWdldF9vcHRpb24oJ3BzX3N0YWxlX3N0YXRlJyk7CiAgICAgICAgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JHNbJ2InXSwncG9zdF9zdGF0dXMnPT4nZHJhZnQnKSk7CiAgICAgICAgaWYgKCRrPT09J2tpbGxfYm90aCcpIHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRzWydhJ10sJ3Bvc3Rfc3RhdHVzJz0+J2RyYWZ0JykpOwogICAgICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2EnPT5nZXRfcG9zdF9zdGF0dXMoJHNbJ2EnXSksJ2InPT5nZXRfcG9zdF9zdGF0dXMoJHNbJ2InXSkpKTsgZXhpdDsKICAgIH0KCiAgICBpZiAoJGs9PT0ncmV2aXZlJykgewogICAgICAgICRzPWdldF9vcHRpb24oJ3BzX3N0YWxlX3N0YXRlJyk7CiAgICAgICAgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JHNbJ2EnXSwncG9zdF9zdGF0dXMnPT4kc1snYV9zdCddKSk7CiAgICAgICAgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JHNbJ2InXSwncG9zdF9zdGF0dXMnPT4kc1snYl9zdCddKSk7CiAgICAgICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnYSc9PmdldF9wb3N0X3N0YXR1cygkc1snYSddKSwnYic9PmdldF9wb3N0X3N0YXR1cygkc1snYiddKSkpOyBleGl0OwogICAgfQoKICAgIGlmICgkaz09PSdwbGFuJykgewogICAgICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoUGV0c2hvcF9DYXJ0X1JlY292ZXJ5OjpldmFsdWF0ZSgkQ0lEKSxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OwogICAgfQoKICAgIGlmICgkaz09PSdjYXJ0JykgewogICAgICAgIGlmKCFXQygpLT5jYXJ0ICYmIGZ1bmN0aW9uX2V4aXN0cygnd2NfbG9hZF9jYXJ0JykpIHdjX2xvYWRfY2FydCgpOwogICAgICAgICRvdXQ9YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKChhcnJheSlXQygpLT5jYXJ0LT5nZXRfY2FydCgpIGFzICRpdCl7CiAgICAgICAgICAkb3V0W109YXJyYXkoJ3AnPT4oaW50KSRpdFsncHJvZHVjdF9pZCddLCd2Jz0+KGludCkkaXRbJ3ZhcmlhdGlvbl9pZCddLCdxJz0+KGZsb2F0KSRpdFsncXVhbnRpdHknXSk7IH0KICAgICAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdpdGVtcyc9PiRvdXQsJ2NvdW50Jz0+Y291bnQoJG91dCkpKTsgZXhpdDsKICAgIH0KCiAgICBpZiAoJGs9PT0nbmV3dG9rZW4nKSB7CiAgICAgICAgJGxpbms9UGV0c2hvcF9DYXJ0X1JlY292ZXJ5OjpsaW5rKCRDSUQpOwogICAgICAgIHBhcnNlX3N0cihwYXJzZV91cmwoJGxpbmssUEhQX1VSTF9RVUVSWSksJHEpOwogICAgICAgICRzPWdldF9vcHRpb24oJ3BzX3N0YWxlX3N0YXRlJyk7ICRzWyd0b2tlbiddPSRxWyd0J10/PycnOyB1cGRhdGVfb3B0aW9uKCdwc19zdGFsZV9zdGF0ZScsJHMsZmFsc2UpOwogICAgICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCd0b2tlbic9PiRxWyd0J10/PycnKSk7IGV4aXQ7CiAgICB9CgogICAgaWYgKCRrPT09J2NsZWFudXAnKSB7CiAgICAgICAgJHM9Z2V0X29wdGlvbigncHNfc3RhbGVfc3RhdGUnKTsKICAgICAgICBpZihpc19hcnJheSgkcykpeyB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kc1snYSddLCdwb3N0X3N0YXR1cyc9PiRzWydhX3N0J10pKTsKICAgICAgICAgICAgICAgICAgICAgICAgICB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kc1snYiddLCdwb3N0X3N0YXR1cyc9PiRzWydiX3N0J10pKTsgfQogICAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJFQgV0hFUkUgY2FydF9pZD0lcyIsJENJRCkpOwogICAgICAgIGRlbGV0ZV9vcHRpb24oJ3BzX3N0YWxlX3N0YXRlJyk7CiAgICAgICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ29rJz0+MSkpOyBleGl0OwogICAgfQp9LDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S322 Stale v1',code:php,scope:'global',active:true}));
let sid=null;
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else sh('sleep 4');
}
const call=(k)=>{ const g=sh('curl -sSk "'+SITE+'/?ps_sl='+k+'"'); try{return JSON.parse(g.out);}catch(e){return {raw:g.out.slice(0,300)};} };
const txt=(f)=>fs.readFileSync(f,'utf8').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
if(sid){
 sh('sleep 3');
 // ================= TESTAS 1: VIENA preke neaktyvi =================
 O.setup1=call('setup');
 const T1=O.setup1.token;
 O.kill1=call('kill_one');
 O.plan1=call('plan');
 sh('rm -f /tmp/s1.txt');
 sh('curl -sSk -c /tmp/s1.txt -b /tmp/s1.txt -o /dev/null "'+SITE+'/cart/"');
 sh('curl -sSk -c /tmp/s1.txt -b /tmp/s1.txt -o /tmp/g_1.html "'+SITE+'/atkurti-krepseli/?t='+encodeURIComponent(T1)+'"');
 const g1=fs.readFileSync('/tmp/g_1.html','utf8');
 const m1=g1.match(/name="_psnonce"\s+value="([^"]+)"/);
 O.T1_get={tekstas:txt('/tmp/g_1.html').slice(0,420),
   turi_A:g1.includes(O.setup1.a_name)?1:0, turi_B:g1.includes(O.setup1.b_name)?1:0,
   turi_forma:!!m1};
 if(m1){
   const p1=sh('curl -sSk -c /tmp/s1.txt -b /tmp/s1.txt -o /dev/null -w "%{http_code}|%{redirect_url}" -X POST '
     +'--data-urlencode "t='+T1+'" --data-urlencode "_psnonce='+m1[1]+'" "'+SITE+'/atkurti-krepseli/"');
   O.T1_post=p1.out.trim();
   const c1=sh('curl -sSk -c /tmp/s1.txt -b /tmp/s1.txt "'+SITE+'/?ps_sl=cart"');
   try{O.T1_cart=JSON.parse(c1.out);}catch(e){O.T1_cart_raw=c1.out.slice(0,200);}
 }
 // ================= TESTAS 2: ABI prekes neaktyvios =================
 call('revive');
 O.setup2=call('setup');
 const T2=O.setup2.token;
 O.kill2=call('kill_both');
 O.plan2=call('plan');
 sh('rm -f /tmp/s2.txt');
 sh('curl -sSk -c /tmp/s2.txt -b /tmp/s2.txt -o /dev/null "'+SITE+'/cart/"');
 sh('curl -sSk -c /tmp/s2.txt -b /tmp/s2.txt -o /tmp/g_2.html "'+SITE+'/atkurti-krepseli/?t='+encodeURIComponent(T2)+'"');
 const g2=fs.readFileSync('/tmp/g_2.html','utf8');
 const m2=g2.match(/name="_psnonce"\s+value="([^"]+)"/);
 O.T2_get={tekstas:txt('/tmp/g_2.html').slice(0,420), turi_forma:!!m2,
   zada_atkurti:/Nor[ie]te j[iį] atkurti/i.test(g2)?'TAIP_BLOGAI':'NE_GERAI'};
 // POST bandom net jei formos nera (tiesiogiai)
 const p2=sh('curl -sSk -c /tmp/s2.txt -b /tmp/s2.txt -o /tmp/p_2.html -w "%{http_code}|%{redirect_url}" -X POST '
   +'--data-urlencode "t='+T2+'" '+(m2?'--data-urlencode "_psnonce='+m2[1]+'" ':'')+'"'+SITE+'/atkurti-krepseli/"');
 O.T2_post={res:p2.out.trim(),tekstas:txt('/tmp/p_2.html').slice(0,300)};
 const c2=sh('curl -sSk -c /tmp/s2.txt -b /tmp/s2.txt "'+SITE+'/?ps_sl=cart"');
 try{O.T2_cart=JSON.parse(c2.out);}catch(e){}
 // pakartotinis
 const p2b=sh('curl -sSk -c /tmp/s2.txt -b /tmp/s2.txt -o /tmp/p_2b.html -w "%{http_code}" -X POST '
   +'--data-urlencode "t='+T2+'" '+(m2?'--data-urlencode "_psnonce='+m2[1]+'" ':'')+'"'+SITE+'/atkurti-krepseli/"');
 O.T2_pakartotinis={code:p2b.out.trim(),tekstas:txt('/tmp/p_2b.html').slice(0,200)};
 const c2b=sh('curl -sSk -c /tmp/s2.txt -b /tmp/s2.txt "'+SITE+'/?ps_sl=cart"');
 try{O.T2_cart_po=JSON.parse(c2b.out);}catch(e){}

 O.cleanup=call('cleanup');
 fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
 sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('stale.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
