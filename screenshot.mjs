process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY4IG1vZF9yZXdyaXRlIGRpYWdub3N0aWthIHVwbG9hZHMga2F0YWxvZ2UgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCRmIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgJG89YXJyYXkoJ3YnPT4nUzE1NjgnKTsgQHNldF90aW1lX2xpbWl0KDEyMCk7CiAgdHJ5ewogICAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGQ9JHVwWydiYXNlZGlyJ10uJy9wcy1ydy10ZXN0JzsgQG1rZGlyKCRkLDA3NTUpOyBmaWxlX3B1dF9jb250ZW50cygkZC4nL2EudHh0JywnQScpOyBmaWxlX3B1dF9jb250ZW50cygkZC4nL2IudHh0JywnQicpOyBmaWxlX3B1dF9jb250ZW50cygkZC4nL2MudHh0JywnQycpOyBmaWxlX3B1dF9jb250ZW50cygkZC4nL2MuYWx0JywnQUxUJyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRkLicvZS50eHQnLCdFJyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRkLicvZS5hbHQnLCdFQUxUJyk7CiAgICBmaWxlX3B1dF9jb250ZW50cygkZC4nLy5odGFjY2VzcycsIlJld3JpdGVFbmdpbmUgT25cblJld3JpdGVSdWxlIF5hXFwudHh0JCBiLnR4dCBbTF1cblJld3JpdGVDb25kICV7UkVRVUVTVF9GSUxFTkFNRX0gXiguKylcXC50eHQkXG5SZXdyaXRlQ29uZCAlMS5hbHQgLWZcblJld3JpdGVSdWxlIF5jXFwudHh0JCBjLmFsdCBbTF1cblJld3JpdGVDb25kICV7RE9DVU1FTlRfUk9PVH0le1JFUVVFU1RfVVJJfSBeKC4rKVxcLnR4dCRcblJld3JpdGVDb25kICUxLmFsdCAtZlxuUmV3cml0ZVJ1bGUgXmVcXC50eHQkIGUuYWx0IFtMXVxuIik7CiAgICAkYmFzZT0kdXBbJ2Jhc2V1cmwnXS4nL3BzLXJ3LXRlc3QvJzsgZm9yZWFjaChhcnJheSgnYS50eHQnLCdjLnR4dCcsJ2UudHh0JykgYXMgJHQpeyAkZz13cF9yZW1vdGVfZ2V0KCRiYXNlLiR0LGFycmF5KCd0aW1lb3V0Jz0+MTUsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRvWyd0ZXN0J11bJHRdPWFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRnKSx3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZykpOyB9CiAgICAvLyB0YXMgcGF0cyBwZXIgcGV0c2hvcC5sdCBob3N0J8SFIChzZW5hcyBlU2hvcHJlbnQg4oCUIG5ldGlrcmluYW0pLiBWaWV0b2ogdG86IFJFUVVFU1RfRklMRU5BTUUgcmVpa8WhbcSXIHBlciBQSFA/IHVwbG9hZHMgcGhwIGJsb2t1b3RhcyDigJQgdGlrcmluYW0gcm9vdCdlCiAgICAkb1snYWJzcGF0aCddPUFCU1BBVEg7ICRvWydkb2Nyb290J109JF9TRVJWRVJbJ0RPQ1VNRU5UX1JPT1QnXTsgJG9bJ3JlYWxwYXRoX2RvY3Jvb3QnXT1yZWFscGF0aCgkX1NFUlZFUlsnRE9DVU1FTlRfUk9PVCddKTsgJG9bJ2lzX2xpbmsnXT1pc19saW5rKHJ0cmltKCRfU0VSVkVSWydET0NVTUVOVF9ST09UJ10sJy8nKSk7CiAgICAvLyBhciB1cGxvYWRzLy5odGFjY2VzcyBkYWJhciBtxatzxbMKICAgICRvWyd1cGxvYWRzX2h0J109c3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCR1cFsnYmFzZWRpciddLicvLmh0YWNjZXNzJyksMCwxMjApOwogICAgLy8gdGVzdGluaXMgd2VicCBwZXIgdGlrcsSFIHRhaXN5a2zEmSBzdSBBY2NlcHQKICAgICRnPXdwX3JlbW90ZV9nZXQoJHVwWydiYXNldXJsJ10uJy8yMDI2LzA4L3Jpbmsta29tcG96aWNpamEtMzUyOTEtMTc4ODE3MzM1Ny5qcGcnLGFycmF5KCd0aW1lb3V0Jz0+MTUsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0FjY2VwdCc9PidpbWFnZS93ZWJwJykpKTsgJG9bJ3JlYWwnXT1hcnJheSh3cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVycygkZyktPmdldEFsbCgpWydjb250ZW50LXR5cGUnXT8/bnVsbCxzdHJsZW4od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcpKSk7CiAgICAvLyB2YWx5bWFzCiAgICBmb3JlYWNoKGdsb2IoJGQuJy8qJylhcyAkeCkgdW5saW5rKCR4KTsgdW5saW5rKCRkLicvLmh0YWNjZXNzJyk7IHJtZGlyKCRkKTsgJG9bJ2NsZWFuZWQnXT0haXNfZGlyKCRkKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-144454';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1568.json';
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
