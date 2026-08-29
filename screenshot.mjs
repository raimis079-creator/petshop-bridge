process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFNOMCBTZW5kZXIga2VsaW8genZhbGd5YmEgdjEuMCAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoKGlzc2V0KCRfR0VUWydwc19iaXMnXSk/JF9HRVRbJ3BzX2JpcyddOicnKSAhPT0gJ1NOMCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1NOMC12MS4wJyk7CiAgdHJ5ewogICAgLyogcHJvY2Vzc19vbmUg4oCUIGthcyByZWFsaWFpIHNpdW5jaWEgKi8KICAgICRybT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9FbWFpbF9EaXNwYXRjaCcsJ3Byb2Nlc3Nfb25lJyk7CiAgICAkTD1maWxlKCRybS0+Z2V0RmlsZU5hbWUoKSk7CiAgICAkb1sncHJvY2Vzc19vbmUnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRMLCRybS0+Z2V0U3RhcnRMaW5lKCktMSxtaW4oJHJtLT5nZXRFbmRMaW5lKCktJHJtLT5nZXRTdGFydExpbmUoKSsxLDE0MCkpKTsKCiAgICAvKiBrb2tpb3MgRVNQIGtsYXNlcyB1enNpa3JvdmUgKi8KICAgICRvWydrbGFzZXMnXT1hcnJheSgpOwogICAgZm9yZWFjaChnZXRfZGVjbGFyZWRfY2xhc3NlcygpIGFzICRjKXsKICAgICAgaWYoc3RyaXBvcygkYywnc2VuZGVyJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRjLCdlc3AnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGMsJ3N1cHByZXNzaW9uJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRjLCd3ZWJob29rJykhPT1mYWxzZSl7CiAgICAgICAgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJGMpOwogICAgICAgICRvWydrbGFzZXMnXVskY109c3RyX3JlcGxhY2UoV1BfQ09OVEVOVF9ESVIsJycsKHN0cmluZykkcmMtPmdldEZpbGVOYW1lKCkpOwogICAgICB9CiAgICB9CiAgICAvKiBhZGFwdGVyaW8gc2l1bnRpbW8gbWV0b2RhcyAqLwogICAgZm9yZWFjaChhcnJheSgnUGV0c2hvcF9TZW5kZXJfQWRhcHRlcicsJ1BldHNob3BfRVNQX1NlbmRlcicsJ1BldHNob3BfRVNQX1NlbmRlcl9BZGFwdGVyJywnUGV0c2hvcF9TZW5kZXInKSBhcyAkYyl7CiAgICAgIGlmKCFjbGFzc19leGlzdHMoJGMpKSBjb250aW51ZTsKICAgICAgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJGMpOyAkb1snYWRhcHRlcmlzJ109JGM7ICRvWydhZGFwdGVyaW9fZmFpbGFzJ109c3RyX3JlcGxhY2UoV1BfQ09OVEVOVF9ESVIsJycsJHJjLT5nZXRGaWxlTmFtZSgpKTsKICAgICAgJG1tPWFycmF5KCk7IGZvcmVhY2goJHJjLT5nZXRNZXRob2RzKCkgYXMgJG1lKXsgaWYoJG1lLT5jbGFzcz09PSRjKSAkbW1bXT0oJG1lLT5pc1N0YXRpYygpPydzdGF0aWMgJzonJykuJG1lLT5nZXROYW1lKCk7IH0KICAgICAgJG9bJ2FkYXB0ZXJpb19tZXRvZGFpJ109JG1tOwogICAgICAkRj1maWxlKCRyYy0+Z2V0RmlsZU5hbWUoKSk7CiAgICAgIGZvcmVhY2goYXJyYXkoJ3NlbmQnLCdzZW5kX2VtYWlsJywnZGVsaXZlcicsJ3JlcXVlc3QnKSBhcyAkbSl7CiAgICAgICAgaWYoIW1ldGhvZF9leGlzdHMoJGMsJG0pKSBjb250aW51ZTsKICAgICAgICAkcjI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJGMsJG0pOwogICAgICAgICRvWydzcmNfJy4kbV09aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkRiwkcjItPmdldFN0YXJ0TGluZSgpLTEsbWluKCRyMi0+Z2V0RW5kTGluZSgpLSRyMi0+Z2V0U3RhcnRMaW5lKCkrMSw5MCkpKTsKICAgICAgfQogICAgICBicmVhazsKICAgIH0KICAgIC8qIFNlbmRlciBBUEkgZW5kcG9pbnRhaSwgbWluaW1pIGtvZGUgKi8KICAgICRvWydlbmRwb2ludGFpJ109YXJyYXkoKTsKICAgIGZvcmVhY2goYXJyYXkoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtZXNwJyxXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzJykgYXMgJGQpewogICAgICBpZighaXNfZGlyKCRkKSkgY29udGludWU7CiAgICAgICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQpKTsKICAgICAgZm9yZWFjaCgkaXQgYXMgJGYpewogICAgICAgIGlmKHN1YnN0cigkZiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOwogICAgICAgICR0PWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgICAgICBpZihwcmVnX21hdGNoX2FsbCgnI2h0dHBzOi8vW2EtejAtOVwuXC1dKnNlbmRlclthLXowLTlcLlwtL197fVwkXSojaScsJHQsJG0pKXsKICAgICAgICAgICRvWydlbmRwb2ludGFpJ11bc3RyX3JlcGxhY2UoV1BfQ09OVEVOVF9ESVIsJycsKHN0cmluZykkZildPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMF0pKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIC8qIGFyIG5hdWRvamFtYXMgd3BfbWFpbCBhciBBUEkgKi8KICAgICRvWyd3cF9tYWlsX2ZpbHRyYWknXT1hcnJheSgpOwogICAgZ2xvYmFsICR3cF9maWx0ZXI7CiAgICBmb3JlYWNoKGFycmF5KCdwaHBtYWlsZXJfaW5pdCcsJ3dwX21haWwnLCdwcmVfd3BfbWFpbCcsJ3dwX21haWxfZnJvbScpIGFzICRmKXsKICAgICAgJG9bJ3dwX21haWxfZmlsdHJhaSddWyRmXT0gaXNzZXQoJHdwX2ZpbHRlclskZl0pP2NvdW50KCR3cF9maWx0ZXJbJGZdLT5jYWxsYmFja3MpOjA7CiAgICB9CiAgICAkb1snc210cF9wbHVnaW5haSddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnLGFycmF5KCkpLGZ1bmN0aW9uKCRwKXtyZXR1cm4gcHJlZ19tYXRjaCgnL3NtdHB8bWFpbHxzZW5kZXIvaScsJHApO30pKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='SN0-140522';
const GKEY='ps_bis';
const PHASES=["SN0"];
const OUT='analize/sn0.json';
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
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
