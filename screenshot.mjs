process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEJyZXZv4oaSU2VuZGVyIHZlciAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX2JydiddKT8kX0dFVFsncHNfYnJ2J106JycpOyBpZigkZiE9PSdWRVIzJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nQlJWNCcpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAgICRvWydkYl9icmV2b19wYWdlcyddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgQ09OQ0FUKElELCc6Jyxwb3N0X3N0YXR1cykgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlIElOICgncGFnZScsJ3Bvc3QnKSBBTkQgKHBvc3RfY29udGVudCBMSUtFICclQnJldm8lJyBPUiBwb3N0X2NvbnRlbnQgTElLRSAnJWVuZGluYmx1ZSUnKSIpOwogICAgJHBnPWdldF9wb3N0KDM0NTI1KTsgJGh0bWw9YXBwbHlfZmlsdGVycygndGhlX2NvbnRlbnQnLCRwZy0+cG9zdF9jb250ZW50KTsKICAgICRvWydyZW5kZXJfYnJldm8nXT1zdWJzdHJfY291bnQoc3RydG9sb3dlcigkaHRtbCksJ2JyZXZvJyk7ICRvWydyZW5kZXJfc2VuZGVyJ109c3Vic3RyX2NvdW50KCRodG1sLCdTZW5kZXInKTsKICAgICRpPXN0cnBvcygkaHRtbCwnU2VuZGVyJyk7ICRvWydjdHgnXT10cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyx3cF9zdHJpcF9hbGxfdGFncyhzdWJzdHIoJGh0bWwsbWF4KDAsJGktMTYwKSwzMjApKSkpOwogICAgJG9bJ21vZGlmaWVkJ109JHBnLT5wb3N0X21vZGlmaWVkX2dtdDsKICAgICRvWydjYWNoZV9wbHVnaW5zJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpLGZ1bmN0aW9uKCR4KXtyZXR1cm4gcHJlZ19tYXRjaCgnL2NhY2hlfGxpdGVzcGVlZHxyb2NrZXR8dzN8YXV0b3B0aW0vaScsJHgpO30pKTsKICAgICRvWydzaWRfYWN0aXZlX3RlbXAnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVChpZCwnOicsbmFtZSkgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIG5hbWUgTElLRSAnVEVNUCUnIik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-071742';
const GKEY='ps_brv';
const PHASES=["VER3"];
const OUT='analize/brevo_ver.json';
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
