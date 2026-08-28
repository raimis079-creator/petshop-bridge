process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEZCVCBSZWNvbgogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZmJ0cmVjJ10pIHx8ICRfR0VUWydwc19mYnRyZWMnXSE9PSdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nRkJUUkVDMScpOwogJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBuYW1lIE5PVCBMSUtFICdURU1QJScgQU5EIChjb2RlIExJS0UgJyVmYnQlJyBPUiBuYW1lIExJS0UgJyVrYXJ0dSUnIE9SIGNvZGUgTElLRSAnJXBlcmthbWUlJyBPUiBjb2RlIExJS0UgJyVyb3Nzc2VsbCUnIE9SIGNvZGUgTElLRSAnJXJvc3Mtc2VsbCUnKSIsQVJSQVlfQSk7CiAkb1snc25pcHBldHMnXT0kcm93czsKIGZvcmVhY2goJHJvd3MgYXMgJHIpeyAkYz0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvZGUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBpZD0lZCIsJHJbJ2lkJ10pKTsgJG9bJ3NuaXBfbGVuJ11bJHJbJ2lkJ11dPXN0cmxlbigkYyk7ICRvWydzbmlwX2NvZGUnXVskclsnaWQnXV09c3Vic3RyKCRjLDAsNjAwMCk7IH0KICRtdT1nbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJyk7ICRoaXRzPWFycmF5KCk7CiBmb3JlYWNoKCRtdSBhcyAkZil7ICRjPUBmaWxlX2dldF9jb250ZW50cygkZik7IGlmKHN0cmlwb3MoJGMsJ2ZidCcpIT09ZmFsc2V8fHN0cmlwb3MoJGMsJ3BlcmthbWUnKSE9PWZhbHNlKXsgJGhpdHNbYmFzZW5hbWUoJGYpXT1zdHJsZW4oJGMpOyB9IH0KICRvWydtdV9oaXRzJ109JGhpdHM7CiBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLXhtbCcsJ3BldHNob3AtY29yZScpIGFzICRwbCl7CiAgZm9yZWFjaCgoYXJyYXkpZ2xvYihXUF9QTFVHSU5fRElSLicvJy4kcGwuJy9pbmNsdWRlcy8qLnBocCcpIGFzICRmKXsgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYoc3RyaXBvcygkYywnZmJ0JykhPT1mYWxzZSl7ICRvWydwbHVnaW5faGl0cyddWyRwbC4nLycuYmFzZW5hbWUoJGYpXT1zdHJsZW4oJGMpOyB9IH0KIH0KIGZvcmVhY2goYXJyYXkoJ19wZXRzaG9wX2ZidF9pZHMnLCdfY3Jvc3NzZWxsX2lkcycsJ191cHNlbGxfaWRzJykgYXMgJGspewogICRvWydtZXRhJ11bJGtdPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSVzIEFORCBtZXRhX3ZhbHVlIE5PVCBJTiAoJycsJ2E6MDp7fScpIiwkaykpOwogfQogJG9bJ2ZidF9zYW1wbGUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X2lkLG1ldGFfdmFsdWUgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3BldHNob3BfZmJ0X2lkcycgQU5EIG1ldGFfdmFsdWUgTk9UIElOICgnJywnYTowOnt9JykgTElNSVQgNSIsQVJSQVlfQSk7CiAkb1snYWN0aXZlX3BsdWdpbnMnXT1nZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sNSk7Cg=='; const VER='FBTREC1';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  out.zingsniai.push('isjungta_TEMP:'+temp.length);
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP FBT Recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  const r=await fx(WP+'/?ps_fbtrec=GO',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/fbtrec.json', Buffer.from(JSON.stringify(out,null,1)), VER);
