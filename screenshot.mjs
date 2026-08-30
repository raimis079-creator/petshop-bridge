process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTI4YiB0b2tlbiBtZWNoYW5pa2EgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19tbDInXSl8fCRfR0VUWydwc19tbDInXSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNTI4YicpOwogIHRyeXsKICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtbWFnaWMtbG9naW4ucGhwJyk7CiAgICAvLyBUb2tlbiBrdXJpbW8vdGlrcmluaW1vIGZyYWdtZW50YWkKICAgIGZvcmVhY2goYXJyYXkoJ2NyZWF0ZV90b2tlbicsJ2lzc3VlJywnZ2VuZXJhdGUnLCdzZXRfdHJhbnNpZW50JywnZ2V0X3RyYW5zaWVudCcsJ2hhc2gnLCd3cF9zZXRfYXV0aF9jb29raWUnLCdQZXRzaG9wX1Rva2VucycsJ3Rva2VuXycpIGFzICRrKXsKICAgICAgJHBvcz0wOyAkcmFzdGE9YXJyYXkoKTsKICAgICAgd2hpbGUoKCRwb3M9c3RycG9zKCRjLCRrLCRwb3MpKSE9PWZhbHNlICYmIGNvdW50KCRyYXN0YSk8Myl7CiAgICAgICAgJHJhc3RhW109cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN1YnN0cigkYyxtYXgoMCwkcG9zLTYwKSwxNjApKTsKICAgICAgICAkcG9zKz1zdHJsZW4oJGspOwogICAgICB9CiAgICAgIGlmKCRyYXN0YSkgJG9bJ2ZyYWcnXVska109JHJhc3RhOwogICAgfQogICAgLy8gQXIgeXJhIGF0c2tpcmEgdG9rZW51IGtsYXNlCiAgICBmb3JlYWNoKGFycmF5KCdQZXRzaG9wX1Rva2VucycsJ1BldHNob3BfVG9rZW4nKSBhcyAkaykgaWYoY2xhc3NfZXhpc3RzKCRrKSl7CiAgICAgICRyPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJGspOwogICAgICAkb1sndG9rZW5fa2xhc2UnXT0kazsKICAgICAgJG9bJ3Rva2VuX21ldG9kYWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJG0pewogICAgICAgICRwcz1hcnJheV9tYXAoZnVuY3Rpb24oJHApe3JldHVybiAoJHAtPmlzT3B0aW9uYWwoKT8nPyc6JycpLiRwLT5nZXROYW1lKCk7fSwkbS0+Z2V0UGFyYW1ldGVycygpKTsKICAgICAgICByZXR1cm4gKCRtLT5pc1N0YXRpYygpPydzICc6JycpLiRtLT5nZXROYW1lKCkuJygnLmltcGxvZGUoJywnLCRwcykuJyknOwogICAgICB9LCRyLT5nZXRNZXRob2RzKCkpOwogICAgfQogICAgLy8gcHJvY2Vzc19sb2dpbiB2aWR1cyDigJQga2FpcCBwcmlqdW5naWEKICAgIGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvbiBwcm9jZXNzX2xvZ2luLio/XG4gIFx9L3MnLCRjLCRtKSkgJG9bJ3Byb2Nlc3NfbG9naW4nXT1zdWJzdHIoJG1bMF0sMCwxNjAwKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-193756';
const GKEY='ps_ml2';
const PHASES=["GO"];
const OUT='analize/s1528b_recon.json';
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
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
