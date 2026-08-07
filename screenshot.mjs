const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19hNjU3J10/PycnKSE9PSdBNjU3eCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgQHNldF90aW1lX2xpbWl0KDI4MCk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidBNjU3Jyk7CiAgJHJlemltYXMgPSAoJF9HRVRbJ3JlemltYXMnXT8/J2RyeScpOwogICRvWydyZXppbWFzJ109JHJlemltYXM7CgogIC8qIC0tLS0tLS0tLS0gMSBaSU5HU05JUzogV1AgQUxMIElNUE9SVCBQUk9GSUxJQUkgLS0tLS0tLS0tLSAqLwogICRwbXhpPSR3cGRiLT5wcmVmaXguJ3BteGlfaW1wb3J0cyc7CiAgJGJhayA9JHBteGkuJ19iYWtfczY1NSc7CiAgJG9bJ2JhY2t1cF95cmEnXT0oYm9vbCkkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRiYWt9JyIpOwogIGlmKCEkb1snYmFja3VwX3lyYSddKXsgJG9bJ0tMQUlEQSddPSdORVJBIEJBQ0tVUCDigJQgc3VzdG9qdSc7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KCiAgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLG9wdGlvbnMgRlJPTSB7JHBteGl9IiwgQVJSQVlfQSkgYXMgJHIpewogICAgJG9wdD1AdW5zZXJpYWxpemUoJHJbJ29wdGlvbnMnXSk7CiAgICAkej1hcnJheSgnaWQnPT4kclsnaWQnXSwnbmFtZSc9PiRyWyduYW1lJ10pOwogICAgaWYoIWlzX2FycmF5KCRvcHQpKXsgJHpbJ0tMQUlEQSddPSduZWlzc2lzZXJpYWxpemF2byc7ICRvWydwcm9maWxpYWknXVtdPSR6OyBjb250aW51ZTsgfQogICAgJHpbJ3Jha3R1X3ByaWVzJ109Y291bnQoJG9wdCk7CiAgICAkelsnYnV2byddPSRvcHRbJ211bHRpcGxlX3Byb2R1Y3RfdGF4X3N0YXR1cyddID8/ICcobmVyYSknOwogICAgaWYoJHpbJ2J1dm8nXT09PSd0YXhhYmxlJyl7ICR6Wyd2ZWlrc21hcyddPSdqYXUgdGF4YWJsZSDigJQgcHJhbGVpc3RhJzsgJG9bJ3Byb2ZpbGlhaSddW109JHo7IGNvbnRpbnVlOyB9CgogICAgJG9wdFsnbXVsdGlwbGVfcHJvZHVjdF90YXhfc3RhdHVzJ109J3RheGFibGUnOwogICAgJG5hdWphPXNlcmlhbGl6ZSgkb3B0KTsKICAgIC8vIFNBVUdJS0xJUzogcGF0aWtyaW5hbSwga2FkIG5hdWphcyBtYXN5dmFzIGlzc2lzZXJpYWxpenVvamEgYXRnYWwgaWRlbnRpc2thaQogICAgJGF0Z2FsPUB1bnNlcmlhbGl6ZSgkbmF1amEpOwogICAgJHpbJ3BhdGlrcmFfcmFrdHUnXT1pc19hcnJheSgkYXRnYWwpP2NvdW50KCRhdGdhbCk6MDsKICAgICR6WydwYXRpa3JhX29rJ109KGlzX2FycmF5KCRhdGdhbCkgJiYgY291bnQoJGF0Z2FsKT09PWNvdW50KCRvcHQpCiAgICAgICAgICAgICAgICAgICAgICAmJiAoJGF0Z2FsWydtdWx0aXBsZV9wcm9kdWN0X3RheF9zdGF0dXMnXT8/JycpPT09J3RheGFibGUnKTsKICAgIGlmKCEkelsncGF0aWtyYV9vayddKXsgJHpbJ3ZlaWtzbWFzJ109J1NBVUdJS0xJUyBTVVZFSUtFIOKAlCBuZWtlaXN0YSc7ICRvWydwcm9maWxpYWknXVtdPSR6OyBjb250aW51ZTsgfQoKICAgIGlmKCRyZXppbWFzPT09J2FwcGx5Jyl7CiAgICAgICR1PSR3cGRiLT51cGRhdGUoJHBteGksIGFycmF5KCdvcHRpb25zJz0+JG5hdWphKSwgYXJyYXkoJ2lkJz0+JHJbJ2lkJ10pKTsKICAgICAgJHpbJ2lyYXN5dGEnXT0kdTsKICAgICAgJHBvPUB1bnNlcmlhbGl6ZSgkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG9wdGlvbnMgRlJPTSB7JHBteGl9IFdIRVJFIGlkPSVkIiwkclsnaWQnXSkpKTsKICAgICAgJHpbJ3BvX2lyYXN5bW8nXT1pc19hcnJheSgkcG8pPygkcG9bJ211bHRpcGxlX3Byb2R1Y3RfdGF4X3N0YXR1cyddPz8nKG5lcmEpJyk6J05FSVNTSVNFUklBTElaQVZPJzsKICAgICAgJHpbJ3Jha3R1X3BvJ109aXNfYXJyYXkoJHBvKT9jb3VudCgkcG8pOjA7CiAgICB9IGVsc2UgeyAkelsndmVpa3NtYXMnXT0nRFJZIOKAlCBidXR1IGtlaXN0YSBpIHRheGFibGUnOyB9CiAgICAkb1sncHJvZmlsaWFpJ11bXT0kejsKICB9CgogIC8qIC0tLS0tLS0tLS0gMiBaSU5HU05JUzogRVNBTU9TIFBSRUtFUyAtLS0tLS0tLS0tICovCiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JHB9cG9zdHMgcAogICAgIElOTkVSIEpPSU4geyRwfXBvc3RtZXRhIHQgT04gdC5wb3N0X2lkPXAuSUQgQU5EIHQubWV0YV9rZXk9J190YXhfc3RhdHVzJyBBTkQgdC5tZXRhX3ZhbHVlPSdub25lJwogICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnLCdwZW5kaW5nJykiKTsKICAkb1sncHJla2l1X25vbmUnXT1jb3VudCgkaWRzKTsKCiAgaWYoJHJlemltYXM9PT0nYXBwbHknKXsKICAgICRuPTA7CiAgICBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CiAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3RheF9zdGF0dXMnLCd0YXhhYmxlJyk7CiAgICAgICRuKys7CiAgICB9CiAgICAkb1sncGF0YWlzeXRhJ109JG47CiAgICAvLyB3Y19wcm9kdWN0X21ldGFfbG9va3VwIFRVUkkgYnV0aSBhdG5hdWppbnRhIOKAlCBraXRhaXAgZmlsdHJhaS9wYWllc2thIG1hdHlzIHNlbmEgcmVpa3NtZQogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3Y191cGRhdGVfcHJvZHVjdF9sb29rdXBfdGFibGVzX2NvbHVtbicpKXsKICAgICAgd2NfdXBkYXRlX3Byb2R1Y3RfbG9va3VwX3RhYmxlc19jb2x1bW4oJ3RheF9zdGF0dXMnKTsKICAgICAgJG9bJ2xvb2t1cCddPSd3Y191cGRhdGVfcHJvZHVjdF9sb29rdXBfdGFibGVzX2NvbHVtbih0YXhfc3RhdHVzKSc7CiAgICB9IGVsc2VpZihmdW5jdGlvbl9leGlzdHMoJ3djX3VwZGF0ZV9wcm9kdWN0X2xvb2t1cF90YWJsZXMnKSl7CiAgICAgIHdjX3VwZGF0ZV9wcm9kdWN0X2xvb2t1cF90YWJsZXMoKTsKICAgICAgJG9bJ2xvb2t1cCddPSd3Y191cGRhdGVfcHJvZHVjdF9sb29rdXBfdGFibGVzKCknOwogICAgfSBlbHNlIHsgJG9bJ2xvb2t1cCddPSdORVJBIEZVTktDSUpPUyc7IH0KICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCk7CiAgfQoKICAvKiAtLS0tLS0tLS0tIFBBVElLUkEgLS0tLS0tLS0tLSAqLwogICRvWydwb190YWlzeW1vJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBDT0FMRVNDRShzLm1ldGFfdmFsdWUsJz8nKSBzYW5kZWxpcywgdC5tZXRhX3ZhbHVlIHRheCwgQ09VTlQoKikgYwogICAgIEZST00geyRwfXBvc3RzIHAKICAgICBMRUZUIEpPSU4geyRwfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19wc19zYW5kZWxpcycKICAgICBJTk5FUiBKT0lOIHskcH1wb3N0bWV0YSB0IE9OIHQucG9zdF9pZD1wLklEIEFORCB0Lm1ldGFfa2V5PSdfdGF4X3N0YXR1cycKICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgR1JPVVAgQlkgc2FuZGVsaXMsdGF4IE9SREVSIEJZIHNhbmRlbGlzIiwgQVJSQVlfQSk7CiAgJGxrPSR3cGRiLT5wcmVmaXguJ3djX3Byb2R1Y3RfbWV0YV9sb29rdXAnOwogICRvWydsb29rdXBfYnVzZW5hJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGF4X3N0YXR1cyxDT1VOVCgqKSBjIEZST00geyRsa30gR1JPVVAgQlkgdGF4X3N0YXR1cyIsIEFSUkFZX0EpOwoKICAvLyBrb250cm9saW5lIHByZWtlCiAgJHByPXdjX2dldF9wcm9kdWN0KDEyNDUyKTsKICBpZigkcHIpICRvWydrb250cm9saW5lJ109YXJyYXkoJ2lkJz0+MTI0NTIsJ3RheCc9PiRwci0+Z2V0X3RheF9zdGF0dXMoKSwKICAgICdrYWluYV9rbGllbnR1aSc9PndjX2dldF9wcmljZV90b19kaXNwbGF5KCRwciksJ2JlX3B2bSc9PnJvdW5kKHdjX2dldF9wcmljZV9leGNsdWRpbmdfdGF4KCRwciksNCkpOwoKICBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgNik7Cg==';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S657-V1',errors:[]};
async function sveikata(){
  const o={};
  for(const [n,u] of [['shop','https://dev.avesa.lt/parduotuve/'],['home','https://dev.avesa.lt/']]){
    try{const r=await fetch(u+'?cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
      const t=await r.text(); o[n]={http:r.status,len:t.length,fatal:/Fatal error/i.test(t)};}catch(e){o[n]={err:String(e)};}
  }
  return o;
}
out.sveikata_pries=await sveikata();
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP PVM Taisymas (S657)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id; out.snip=id;
  await new Promise(x=>setTimeout(x,3000));
  // DRY
  let rr=await fetch('https://dev.avesa.lt/?ps_a657=A657x&k=ps2026&rezimas=dry&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  let t=await rr.text();
  try{out.dry=JSON.parse(t);}catch(e){out.dry_raw=t.slice(0,2000);}
  // APPLY tik jei DRY svarus
  if(out.dry && !out.dry.KLAIDA && out.dry.profiliai && out.dry.profiliai.every(x=>!x.KLAIDA && (x.patikra_ok||x.veiksmas==='jau taxable — praleista'))){
    await new Promise(x=>setTimeout(x,2000));
    rr=await fetch('https://dev.avesa.lt/?ps_a657=A657x&k=ps2026&rezimas=apply&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
    t=await rr.text();
    try{out.apply=JSON.parse(t);}catch(e){out.apply_raw=t.slice(0,2500);}
  } else { out.APPLY_PRALEISTA='DRY nesvarus'; }
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await new Promise(x=>setTimeout(x,3000));
out.sveikata_po=await sveikata();
// admin importu puslapis — ar profiliai nesugadinti
try{
  const r=await fetch('https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?per_page=1',{headers:{Authorization:AUTH}});
  out.rest_gyvas=r.status;
}catch(e){out.errors.push({s:'rest',e:String(e)});}
await putResult('s657_v1.json',out);
console.log('DONE');
