process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NDEnXSkpIHJldHVybjsKICAgICRvPVsnVkVSU0lKQSc9PidTMTU5NS1EMSddOyAkZj0kX0dFVFsncHNfZXg0MSddOyAkdGd0PVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGF1a2FpLnBocCc7CiAgICBpZiAoJGY9PT0nRCcpIHsKICAgICAgICAkcj13cF9yZW1vdGVfZ2V0KCdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvODk2NmMwYjI4ZGJlYjA3ZWQ4NmYyM2JlMjRkNmM0ODhlMjhhM2QzMy9kZXBsb3kvcGV0c2hvcC1sYXVrYWkucGhwLmI2NCcsWyd0aW1lb3V0Jz0+NjBdKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOyAkb1snYjY0X2xlbiddPXN0cmxlbigkYik7CiAgICAgICAgJG5ldz1iYXNlNjRfZGVjb2RlKHRyaW0oJGIpKTsgJG9bJ21kNSddPW1kNSgkbmV3KTsgaWYgKG1kNSgkbmV3KSE9PSc4OGIxZmMzYzY5YTQ3NGQ1MGFkNTlmNWUwNjhjOGRkOCcpIHsgJG9bJ2tsYWlkYSddPSdtZDUnOyBnb3RvIG91dDsgfQogICAgICAgICRvWyd0b2tlbnMnXT1jb3VudCh0b2tlbl9nZXRfYWxsKCRuZXcpKTsgJGJrPVdQX0NPTlRFTlRfRElSLicvcHMtYmFja3Vwcy9wZXRzaG9wLWxhdWthaS12MTQzLUJBQ0tVUC0yMDI2LTA5LTAyLnBocCc7ICRvWydiYWNrdXAnXT1jb3B5KCR0Z3QsJGJrKT8nb2snOidGQUlMJzsgJG9bJ29sZF9tZDUnXT1tZDVfZmlsZSgkdGd0KTsKICAgICAgICAkb1snd3JpdGUnXT1maWxlX3B1dF9jb250ZW50cygkdGd0LCRuZXcpOyAkb1snZGlza19tZDUnXT1tZDVfZmlsZSgkdGd0KTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCR0Z3QsdHJ1ZSk7IGRlbGV0ZV90cmFuc2llbnQoJ3BzX2xhdWthaV9maWx0cmFpJyk7CiAgICB9CiAgICBpZiAoJGY9PT0nVicpIHsKICAgICAgICAkb1sndmVyc2lqYSddPVBldHNob3BfTGF1a2FpOjpWRVJTSUpBOyAkZnI9UGV0c2hvcF9MYXVrYWk6OmZpbHRydV9yZWlrc21lcygpOyAkb1sna2F0ZWdvcmlqb3MnXT0kZnJbJ2thdGVnb3Jpam9zJ107ICRvWydiYWx0eW1haV9uJ109Y291bnQoJGZyWydiYWx0eW1haSddKTsKICAgICAgICBnbG9iYWwgJHdwZGI7ICRsaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfcHNfbGF1a2FzX2dydXBlJyBMSU1JVCAyMCIpOyAkb1snbGlkcyddPSRsaWRzOwogICAgICAgIGZvcmVhY2ggKCRsaWRzIGFzICRsaWQpIHsgJGc9UGV0c2hvcF9MYXVrYWk6OmdydXBlKCRsaWQpOyAkbT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9MYXVrYWknLCdyaW5raWtsaXMnKTsgJG0tPnNldEFjY2Vzc2libGUodHJ1ZSk7IG9iX3N0YXJ0KCk7ICRtLT5pbnZva2UobnVsbCwoaW50KSRsaWQpOyAkaD1vYl9nZXRfY2xlYW4oKTsgcHJlZ19tYXRjaCgnLzxzZWxlY3QgaWQ9InIta2F0Ij4oLio/KTxcL3NlbGVjdD4vcycsJGgsJG1tKTsgcHJlZ19tYXRjaCgnLzxvcHRpb24gdmFsdWU9IihcZCspIiBzZWxlY3RlZC8nLCRtbVsxXT8/JycsJHNlbCk7ICRvWydyaW5rJ11bJGxpZF09WydncnVwZSc9PiRnLCdwYXYnPT5nZXRfdGhlX3RpdGxlKCRsaWQpLCdvcGNpam9zJz0+cHJlZ19tYXRjaF9hbGwoJy88b3B0aW9uLycsJG1tWzFdPz8nJyksJ3NlbGVjdGVkJz0+JHNlbFsxXT8/bnVsbCwndHVyaV9rb25zJz0+c3RycG9zKCRtbVsxXT8/JycsJ0tvbnNlcnZhaScpIT09ZmFsc2VdOyB9CiAgICB9CiAgICBvdXQ6CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-114442';
const GKEY='ps_ex41';
const PHASES=["D", "V"];
const OUT='analize/s1595_deploy.json';
const DATA=[];
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
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
