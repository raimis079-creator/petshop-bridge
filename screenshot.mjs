process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSBmcm9udG8gZGlhZ25vc3Rpa2EgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnKSE9PSdURScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0YxOUZSLTEuMCcpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgICRzZW5hPWdldF9vcHRpb24oJ3BzX3ByZW51bWVyYXRhX3NrdScsbnVsbCk7CiAgICAkcj0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHAuSUQscG0ubWV0YV92YWx1ZSBza3UgRlJPTSB7JHdwZGItPnBvc3RzfSBwIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gcG0gT04gcG0ucG9zdF9pZD1wLklEIEFORCBwbS5tZXRhX2tleT0nX3NrdScgQU5EIHBtLm1ldGFfdmFsdWU8PicnIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gcHIgT04gcHIucG9zdF9pZD1wLklEIEFORCBwci5tZXRhX2tleT0nX3ByaWNlJyBBTkQgcHIubWV0YV92YWx1ZT4wIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgT1JERVIgQlkgcC5JRCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwogICAgJHBpZD0oaW50KSRyWydJRCddOwogICAgdXBkYXRlX29wdGlvbigncHNfcHJlbnVtZXJhdGFfc2t1JyxhcnJheSgkcGlkKSxmYWxzZSk7CiAgICAkb1snZ2FsaW1hJ109UGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXM6OmdhbGltYSgkcGlkKT8nVCc6J04nOwogICAgJG9bJ2hvb2snXT1oYXNfYWN0aW9uKCd3b29jb21tZXJjZV9iZWZvcmVfYWRkX3RvX2NhcnRfYnV0dG9uJyxhcnJheSgnUGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXMnLCdwYXNpcmlua2ltYXMnKSk7CiAgICAkdT1nZXRfcGVybWFsaW5rKCRwaWQpOwogICAgLy8gMSkgc3UgY2FjaGUtYnVzdGVyaXUKICAgICRnPXdwX3JlbW90ZV9nZXQoYWRkX3F1ZXJ5X2FyZygncHNuYycsdGltZSgpLCR1KSxhcnJheSgndGltZW91dCc9PjI1LCdzc2x2ZXJpZnknPT5mYWxzZSwKICAgICAgJ2hlYWRlcnMnPT5hcnJheSgnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScpKSk7CiAgICAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZyk7CiAgICAkb1snYnVzdGVyaXMnXT1hcnJheSgna29kYXMnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkZyksCiAgICAgICdwYXNpcmlua2ltYXMnPT5zdHJwb3MoJGgsJ3BzX3ByZW5faW50ZXJ2YWxhcycpIT09ZmFsc2U/J1QnOidOJywKICAgICAgJ2NhcnRfZm9ybWEnPT5zdHJwb3MoJGgsJ2FkZF90b19jYXJ0X2J1dHRvbicpIT09ZmFsc2V8fHN0cnBvcygkaCwnc2luZ2xlX2FkZF90b19jYXJ0X2J1dHRvbicpIT09ZmFsc2U/J1QnOidOJywKICAgICAgJ2NhY2hlX2FudHJhc3RlJz0+d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkZywneC1saXRlc3BlZWQtY2FjaGUnKSk7CiAgICAvLyAyKSBiZSBidXN0ZXJpbwogICAgJGcyPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAgICRvWydiZV9idXN0ZXJpbyddPWFycmF5KCdwYXNpcmlua2ltYXMnPT5zdHJwb3Mod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcyKSwncHNfcHJlbl9pbnRlcnZhbGFzJykhPT1mYWxzZT8nVCc6J04nLAogICAgICAnY2FjaGVfYW50cmFzdGUnPT53cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCRnMiwneC1saXRlc3BlZWQtY2FjaGUnKSk7CiAgICBpZigkc2VuYT09PW51bGwpIGRlbGV0ZV9vcHRpb24oJ3BzX3ByZW51bWVyYXRhX3NrdScpOyBlbHNlIHVwZGF0ZV9vcHRpb24oJ3BzX3ByZW51bWVyYXRhX3NrdScsJHNlbmEsZmFsc2UpOwogICAgJG9bJ3ZhbHl0YSddPSdUJzsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='f19_front-091703';
const GKEY='ps_f19';
const PHASES=["TE"];
const OUT='analize/f19_front.json';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
