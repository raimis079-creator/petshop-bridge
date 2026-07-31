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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzMyMyBBY2NlcHRhbmNlIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19mYSddKSApIHJldHVybjsKICAgICRrID0gJF9HRVRbJ3BzX2ZhJ107IGdsb2JhbCAkd3BkYjsKICAgICRSVCA9ICR3cGRiLT5wcmVmaXguJ3BzX3JlZmlsbF90cmFja2luZyc7CiAgICAkRUwgPSAkd3BkYi0+cHJlZml4Lidwc19ldmVudF9sb2cnOwogICAgJFBJRF9LRVkgPSAncHNfZmFfc3RhdGUnOwoKICAgIGlmICgkaz09PSdzZXR1cCcpIHsKICAgICAgICBQZXRzaG9wX1JlZmlsbF9GZWVkYmFjazo6bWF5YmVfdXBncmFkZSgpOwogICAgICAgICRpZHMgPSB3Y19nZXRfcHJvZHVjdHMoYXJyYXkoJ2xpbWl0Jz0+MzAsJ3N0YXR1cyc9PidwdWJsaXNoJywncmV0dXJuJz0+J2lkcycpKTsKICAgICAgICAkcHJvZHM9YXJyYXkoKTsgZm9yZWFjaCgoYXJyYXkpJGlkcyBhcyAkeCl7ICRwPXdjX2dldF9wcm9kdWN0KCR4KTsKICAgICAgICAgIGlmKCRwJiYkcC0+aXNfcHVyY2hhc2FibGUoKSl7ICRwcm9kc1tdPShpbnQpJHg7IGlmKGNvdW50KCRwcm9kcyk+PTMpIGJyZWFrOyB9IH0KICAgICAgICB3aGlsZShjb3VudCgkcHJvZHMpPDMpICRwcm9kc1tdPSRwcm9kc1swXTsKICAgICAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICRSVCBXSEVSRSB1c2VyX2lkPTEgQU5EIHBldF9pZD05OTkxIik7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkRUwgV0hFUkUgZXZlbnRfbmFtZT0ncmVmaWxsX2ZlZWRiYWNrX3N1Ym1pdHRlZCcgQU5EIGV2ZW50X2lkIExJS0UgJ3JlZmlsbF9mYl8lJyIpOwogICAgICAgICRub3c9Z21kYXRlKCdZLW0tZCBIOmk6cycpOwogICAgICAgICRscCA9Z21kYXRlKCdZLW0tZCBIOmk6cycsIHRpbWUoKS0zMCpEQVlfSU5fU0VDT05EUyk7CiAgICAgICAgJG91dD1hcnJheSgpOwogICAgICAgIGZvcmVhY2ggKCRwcm9kcyBhcyAkaT0+JHBpZCkgewogICAgICAgICAgICAkd3BkYi0+aW5zZXJ0KCRSVCwgYXJyYXkoJ3VzZXJfaWQnPT4xLCdwcm9kdWN0X2lkJz0+JHBpZCwncGV0X2lkJz0+OTk5MSwKICAgICAgICAgICAgICAnbGFzdF9vcmRlcl9pZCc9PjAsJ2xhc3RfcHVyY2hhc2VfZGF0ZSc9PiRscCwncHVyY2hhc2VfY291bnQnPT4zLAogICAgICAgICAgICAgICdhdmdfaW50ZXJ2YWxfZGF5cyc9PjMwLCdwcmVkaWN0ZWRfZW1wdHlfZGF0ZSc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnLHRpbWUoKSsyKkRBWV9JTl9TRUNPTkRTKSwKICAgICAgICAgICAgICAnY29uZmlkZW5jZSc9PjAuOCwnc3RhdHVzJz0+J2FjdGl2ZScsJ2NyZWF0ZWRfYXQnPT4kbm93LCd1cGRhdGVkX2F0Jz0+JG5vdykpOwogICAgICAgICAgICAkcmlkPShpbnQpJHdwZGItPmluc2VydF9pZDsKICAgICAgICAgICAgJGxpbms9UGV0c2hvcF9SZWZpbGxfRmVlZGJhY2s6OmxpbmsoJHJpZCk7CiAgICAgICAgICAgIHBhcnNlX3N0cihwYXJzZV91cmwoJGxpbmssUEhQX1VSTF9RVUVSWSksJHEpOwogICAgICAgICAgICAkb3V0W109YXJyYXkoJ3JpZCc9PiRyaWQsJ3Byb2R1Y3RfaWQnPT4kcGlkLCd0b2tlbic9PiRxWyd0J10/PycnKTsKICAgICAgICB9CiAgICAgICAgdXBkYXRlX29wdGlvbigkUElEX0tFWSwkb3V0LGZhbHNlKTsKICAgICAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdyZWNvcmRzJz0+JG91dCksSlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7CiAgICB9CgogICAgaWYgKCRrPT09J3N0YXRlJykgewogICAgICAgICRyaWQ9KGludCkoJF9HRVRbJ3JpZCddPz8wKTsKICAgICAgICAkcm93PSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsdXNlcl9pZCxwcm9kdWN0X2lkLHBldF9pZCxhdmdfaW50ZXJ2YWxfZGF5cyxwcmVkaWN0ZWRfZW1wdHlfZGF0ZSxsYXN0X2ZlZWRiYWNrLGxhc3RfZmVlZGJhY2tfYXQsZmVlZGJhY2tfY3ljbGUgRlJPTSAkUlQgV0hFUkUgaWQ9JWQiLCRyaWQpLCBBUlJBWV9BKTsKICAgICAgICAkZXY9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZXZlbnRfaWQscGF5bG9hZF9qc29uIEZST00gJEVMIFdIRVJFIGV2ZW50X25hbWU9J3JlZmlsbF9mZWVkYmFja19zdWJtaXR0ZWQnIEFORCBldmVudF9pZCBMSUtFICVzIiwgJ3JlZmlsbF9mYl8nLiRyaWQuJ18lJyksIEFSUkFZX0EpOwogICAgICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ3Jvdyc9PiRyb3csJ2V2ZW50cyc9PiRldiwnZXZfY291bnQnPT5jb3VudCgkZXYpKSxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OwogICAgfQoKICAgIGlmICgkaz09PSduZXd0b2tlbicpIHsKICAgICAgICAkcmlkPShpbnQpKCRfR0VUWydyaWQnXT8/MCk7CiAgICAgICAgJGxpbms9UGV0c2hvcF9SZWZpbGxfRmVlZGJhY2s6OmxpbmsoJHJpZCk7CiAgICAgICAgcGFyc2Vfc3RyKHBhcnNlX3VybCgkbGluayxQSFBfVVJMX1FVRVJZKSwkcSk7CiAgICAgICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgndG9rZW4nPT4kcVsndCddPz8nJykpOyBleGl0OwogICAgfQoKICAgIGlmICgkaz09PSduZXdjeWNsZScpIHsKICAgICAgICAkcmlkPShpbnQpKCRfR0VUWydyaWQnXT8/MCk7CiAgICAgICAgJHdwZGItPnVwZGF0ZSgkUlQsIGFycmF5KCdwcmVkaWN0ZWRfZW1wdHlfZGF0ZSc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnLCB0aW1lKCkrNDAqREFZX0lOX1NFQ09ORFMpKSwgYXJyYXkoJ2lkJz0+JHJpZCkpOwogICAgICAgICRsaW5rPVBldHNob3BfUmVmaWxsX0ZlZWRiYWNrOjpsaW5rKCRyaWQpOwogICAgICAgIHBhcnNlX3N0cihwYXJzZV91cmwoJGxpbmssUEhQX1VSTF9RVUVSWSksJHEpOwogICAgICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ3Rva2VuJz0+JHFbJ3QnXT8/JycsJ25hdWphc19jaWtsYXMnPT5nbWRhdGUoJ1ktbS1kIEg6aTpzJywgdGltZSgpKzQwKkRBWV9JTl9TRUNPTkRTKSkpOyBleGl0OwogICAgfQoKICAgIGlmICgkaz09PSdkaXJlY3QnKSB7CiAgICAgICAgLy8gdGllc2lvZ2luaXMgZG9tZW5vIG1ldG9kbyBrdmlldGltYXMg4oCUIHN2ZXRpbW8vYmxvZ28gYXR2ZWp1CiAgICAgICAgJHJpZD0oaW50KSgkX0dFVFsncmlkJ10/PzApOyAkZmI9c2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnZmInXT8/JycpOwogICAgICAgICRwZXQ9KGludCkoJF9HRVRbJ3BldCddPz8wKTsgJHByb2Q9KGludCkoJF9HRVRbJ3Byb2QnXT8/MCk7CiAgICAgICAgJHJlcz1QZXRzaG9wX1JlZmlsbF9GZWVkYmFjazo6c3VibWl0KCRyaWQsJHBldCwkcHJvZCwkZmIsJ2VtYWlsJyk7CiAgICAgICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkcmVzLEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OwogICAgfQoKICAgIGlmICgkaz09PSdyZW5kZXInKSB7CiAgICAgICAgJHN0PWdldF9vcHRpb24oJFBJRF9LRVkpOyAkcjA9JHN0WzBdOwogICAgICAgICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0VtYWlsX0Rpc3BhdGNoJywncmVuZGVyJyk7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgICAgICRwYXk9YXJyYXkoJ3BldF9uYW1lJz0+J1Jla3NhcycsJ3Byb2R1Y3RfbmFtZSc9PidUZXN0aW5pcyBtYWlzdGFzJywKICAgICAgICAgICdyZW9yZGVyX3VybCc9PmhvbWVfdXJsKCcvY2FydC8nKSwnZmVlZGJhY2tfdXJsJz0+UGV0c2hvcF9SZWZpbGxfRmVlZGJhY2s6OmxpbmsoJHIwWydyaWQnXSkpOwogICAgICAgICRyb3c9YXJyYXkoJ2Zsb3dfY2xhc3MnPT4nc2VydmljZScsJ3JlY2lwaWVudF9lbWFpbCc9PidmYUBleGFtcGxlLmNvbScpOwogICAgICAgICRvdXQ9JG0tPmludm9rZShudWxsLCdyZWZpbGxfZHVlJywkcGF5LCRyb3cpOwogICAgICAgIHByZWdfbWF0Y2hfYWxsKCcjaHJlZj0iKFteIl0rKSIjJywkb3V0WydodG1sJ10sJGxtKTsKICAgICAgICAkbGlua3M9YXJyYXlfbWFwKCdodG1sX2VudGl0eV9kZWNvZGUnLGFycmF5X3VuaXF1ZSgkbG1bMV0pKTsKICAgICAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdzdWJqZWN0Jz0+JG91dFsnc3ViamVjdCddLCdsZW4nPT5zdHJsZW4oJG91dFsnaHRtbCddKSwKICAgICAgICAgICdsaW5rcyc9PiRsaW5rcywKICAgICAgICAgICdzZW5vc180MDQnPT4oc3RycG9zKCRvdXRbJ2h0bWwnXSwncHNfcmVmaWxsX2ZiPScpIT09ZmFsc2UpPydZUkFfQkxPR0FJJzonTkVSQScsCiAgICAgICAgICAndW5zdWInPT4oc3RycG9zKCRvdXRbJ2h0bWwnXSwnYXRzaXNha3l0aScpIT09ZmFsc2UpPydZUkEnOidORVJBJywKICAgICAgICAgICd0ZWtzdGFzJz0+dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsd3Bfc3RyaXBfYWxsX3RhZ3MoJG91dFsnaHRtbCddKSkpKSwKICAgICAgICAgIEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7CiAgICB9CgogICAgaWYgKCRrPT09J2NsZWFudXAnKSB7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkUlQgV0hFUkUgdXNlcl9pZD0xIEFORCBwZXRfaWQ9OTk5MSIpOwogICAgICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJEVMIFdIRVJFIGV2ZW50X25hbWU9J3JlZmlsbF9mZWVkYmFja19zdWJtaXR0ZWQnIik7CiAgICAgICAgZGVsZXRlX29wdGlvbigkUElEX0tFWSk7CiAgICAgICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ29rJz0+MSkpOyBleGl0OwogICAgfQp9LDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S323 Acceptance v1',code:php,scope:'global',active:true}));
let sid=null;
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else sh('sleep 4');
}
const J=(u)=>{ const g=sh('curl -sSk "'+u+'"'); try{return JSON.parse(g.out);}catch(e){return {raw:g.out.slice(0,250)};} };
const st=(rid)=>J(SITE+'/?ps_fa=state&rid='+rid);
const txt=(f)=>fs.readFileSync(f,'utf8').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
// POST i feedback puslapi su nonce
function doPost(tok,fb,jar){
  sh('curl -sSk -c '+jar+' -b '+jar+' -o /tmp/fg.html "'+SITE+'/refill-feedback/?t='+encodeURIComponent(tok)+'"');
  const h=fs.readFileSync('/tmp/fg.html','utf8');
  const m=h.match(/name="_psnonce"\s+value="([^"]+)"/);
  if(!m) return {err:'no nonce', body:txt('/tmp/fg.html').slice(0,180)};
  const p=sh('curl -sSk -c '+jar+' -b '+jar+' -o /tmp/fp.html -w "%{http_code}" -X POST '
    +'--data-urlencode "t='+tok+'" --data-urlencode "_psnonce='+m[1]+'" --data-urlencode "fb='+fb+'" '
    +'"'+SITE+'/refill-feedback/"');
  return {code:p.out.trim(), body:txt('/tmp/fp.html').slice(0,200)};
}
if(sid){
 sh('sleep 3');
 O.setup=J(SITE+'/?ps_fa=setup');
 const R=(O.setup.records)||[];
 if(R.length>=3){
  const [r1,r2,r3]=R;
  // ---- 1) GET scanner-safe
  O.pries1=st(r1.rid);
  sh('rm -f /tmp/j1.txt');
  sh('curl -sSk -c /tmp/j1.txt -b /tmp/j1.txt -o /tmp/fg1.html "'+SITE+'/refill-feedback/?t='+encodeURIComponent(r1.token)+'"');
  const g1=fs.readFileSync('/tmp/fg1.html','utf8');
  O.T1_get={tekstas:txt('/tmp/fg1.html').slice(0,300),
    turi_sooner:/value="sooner"/.test(g1)?1:0, turi_later:/value="later"/.test(g1)?1:0,
    turi_similar:/value="similar"/.test(g1)?1:0, forma:/_psnonce/.test(g1)?1:0};
  O.po_GET1=st(r1.rid);
  // ---- 2) trys POST variantai, TRYS atskiri ciklai
  O.T2_sooner ={post:doPost(r1.token,'sooner','/tmp/j1.txt'),  po:st(r1.rid)};
  sh('rm -f /tmp/j2.txt');
  O.T2_later  ={post:doPost(r2.token,'later','/tmp/j2.txt'),   po:st(r2.rid)};
  sh('rm -f /tmp/j3.txt');
  O.T2_similar={post:doPost(r3.token,'similar','/tmp/j3.txt'), po:st(r3.rid)};
  // ---- 4) idempotencija
  O.T4_tas_pats_tokenas=doPost(r1.token,'later','/tmp/j1.txt');
  const nt=J(SITE+'/?ps_fa=newtoken&rid='+r1.rid);
  O.T4_naujas_tokenas_tas_ciklas=doPost(nt.token,'later','/tmp/j1.txt');
  O.T4_po=st(r1.rid);
  // ---- 5) naujas ciklas
  const nc=J(SITE+'/?ps_fa=newcycle&rid='+r1.rid);
  O.T5_naujas_ciklas={ciklas:nc.naujas_ciklas, post:doPost(nc.token,'later','/tmp/j1.txt'), po:st(r1.rid)};
  // ---- 6) blogi tokenai
  sh('curl -sSk -o /tmp/bad1.html "'+SITE+'/refill-feedback/?t=INVALIDxyz"');
  O.T6_sugadintas={tekstas:txt('/tmp/bad1.html').slice(0,180),
    atskleidzia:/example\.com|@/.test(fs.readFileSync('/tmp/bad1.html','utf8'))?'TAIP_BLOGAI':'NE'};
  O.T6_svetimas=J(SITE+'/?ps_fa=direct&rid='+r2.rid+'&fb=sooner&pet=8888&prod=0');
  O.T6_blogas_fb=J(SITE+'/?ps_fa=direct&rid='+r3.rid+'&fb=labas&pet=0&prod=0');
  // ---- 7) REST regresija
  fs.writeFileSync('/tmp/rest.json',JSON.stringify({pet_id:9991,product_id:r2.product_id,feedback:'sooner'}));
  const rr=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/rest.json -w "\n%{http_code}" "'+SITE+'/wp-json/petshop/v1/refill-feedback"');
  O.T7_rest=rr.out.trim().slice(-400);
  O.T7_po=st(r2.rid);
  // ---- 8) laiskas
  O.T8_render=J(SITE+'/?ps_fa=render');
 }
 J(SITE+'/?ps_fa=cleanup');
 fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
 sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('fa.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
