process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGJhbmVyaXUgcGFpZXNrYSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2YxOSddKT8kX0dFVFsncHNfZjE5J106JycpIT09J1VHJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nQkFOLTEuMCcpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgICRlaWw9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwLnBvc3RfdGl0bGUsbS5tZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J193cF9hdHRhY2htZW50X21ldGFkYXRhJwogICAgICBXSEVSRSBwLnBvc3RfdHlwZT0nYXR0YWNobWVudCcgQU5EIHAucG9zdF9taW1lX3R5cGUgTElLRSAnaW1hZ2UvJScKICAgICAgQU5EIChwLnBvc3RfdGl0bGUgTElLRSAnJWJhbmVyJScgT1IgcC5wb3N0X3RpdGxlIExJS0UgJyViYW5uZXIlJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJXNsaWRlciUnIE9SIHAucG9zdF90aXRsZSBMSUtFICclaGVybyUnIE9SIHAuZ3VpZCBMSUtFICclYmFuZXIlJyBPUiBwLmd1aWQgTElLRSAnJXNsaWRlJScpCiAgICAgIE9SREVSIEJZIHAuSUQgREVTQyBMSU1JVCAxMiIsQVJSQVlfQSk7CiAgICAkb1snYmFuZXJpYWknXT1hcnJheSgpOwogICAgZm9yZWFjaCgkZWlsIGFzICRyKXsKICAgICAgJG1kPW1heWJlX3Vuc2VyaWFsaXplKCRyWydtZXRhX3ZhbHVlJ10pOwogICAgICAkb1snYmFuZXJpYWknXVtdPWFycmF5KCdpZCc9PihpbnQpJHJbJ0lEJ10sJ3QnPT4kclsncG9zdF90aXRsZSddLAogICAgICAgICd3Jz0+aXNzZXQoJG1kWyd3aWR0aCddKT8kbWRbJ3dpZHRoJ106MCwnaCc9Pmlzc2V0KCRtZFsnaGVpZ2h0J10pPyRtZFsnaGVpZ2h0J106MCwKICAgICAgICAndXJsJz0+d3BfZ2V0X2F0dGFjaG1lbnRfdXJsKCRyWydJRCddKSk7CiAgICB9CiAgICAvLyBhdHNhcmdhaTogZGlkemlhdXNpb3MgPj0xMjAwcHggbnVvdHJhdWtvcwogICAgJHZpcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELG0ubWV0YV92YWx1ZSBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfd3BfYXR0YWNobWVudF9tZXRhZGF0YScKICAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J2F0dGFjaG1lbnQnIEFORCBwLnBvc3RfbWltZV90eXBlIExJS0UgJ2ltYWdlLyUnIE9SREVSIEJZIHAuSUQgREVTQyBMSU1JVCA0MDAiLEFSUkFZX0EpOwogICAgJGRpZD1hcnJheSgpOwogICAgZm9yZWFjaCgkdmlzIGFzICRyKXsKICAgICAgJG1kPW1heWJlX3Vuc2VyaWFsaXplKCRyWydtZXRhX3ZhbHVlJ10pOwogICAgICBpZihpc3NldCgkbWRbJ3dpZHRoJ10pJiYkbWRbJ3dpZHRoJ10+PTEyMDAmJmlzc2V0KCRtZFsnaGVpZ2h0J10pJiYkbWRbJ2hlaWdodCddPj00MDAmJiRtZFsnaGVpZ2h0J108JG1kWyd3aWR0aCddKXsKICAgICAgICAkZGlkW109YXJyYXkoJ2lkJz0+KGludCkkclsnSUQnXSwndyc9PiRtZFsnd2lkdGgnXSwnaCc9PiRtZFsnaGVpZ2h0J10sJ3VybCc9PndwX2dldF9hdHRhY2htZW50X3VybCgkclsnSUQnXSkpOwogICAgICAgIGlmKGNvdW50KCRkaWQpPj04KSBicmVhazsKICAgICAgfQogICAgfQogICAgJG9bJ2RpZHppb3MnXT0kZGlkOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='f19_ban-132704';
const GKEY='ps_f19';
const PHASES=["UG"];
const OUT='analize/f19_ban_1788096423.json';
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
