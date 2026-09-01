process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY4IG1vZF9yZXdyaXRlIGRpYWdub3N0aWthIHVwbG9hZHMga2F0YWxvZ2UgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCRmIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgJG89YXJyYXkoJ3YnPT4nUzE1NjgnKTsgQHNldF90aW1lX2xpbWl0KDIwMCk7CiAgdHJ5ewogICAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGQ9JHVwWydiYXNlZGlyJ107ICR1PSR1cFsnYmFzZXVybCddOyAkaHQ9JGQuJy8uaHRhY2Nlc3MnOyAkb3JpZz1maWxlX2dldF9jb250ZW50cygkaHQpOyAkb1snb3JpZ19tZDUnXT1tZDUoJG9yaWcpOwogICAgZmlsZV9wdXRfY29udGVudHMoJGQuJy9wcy1ydy1zcmMudHh0JywnU1JDJyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRkLicvcHMtcnctZHN0LnR4dCcsJ0RTVCcpOyBjb3B5KCRkLicvMjAyNi8wOC9yaW5rLWtvbXBvemljaWphLTM1MjkxLTE3ODgxNzMzNTcuanBnJywkZC4nL3BzLXJ3LXRlc3QuanBnJyk7IGNvcHkoJGQuJy8yMDI2LzA4L3Jpbmsta29tcG96aWNpamEtMzUyOTEtMTc4ODE3MzM1Ny53ZWJwJywkZC4nL3BzLXJ3LXRlc3Qud2VicCcpOwogICAgJGdldD1mdW5jdGlvbigkcGF0aCwkYWNjPSdpbWFnZS93ZWJwLGltYWdlLyonKSB1c2UoJHUpeyAkZz13cF9yZW1vdGVfZ2V0KCR1LiRwYXRoLGFycmF5KCd0aW1lb3V0Jz0+MTUsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0FjY2VwdCc9PiRhY2MpKSk7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRnKTsgcmV0dXJuIGFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRnKSx3cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVycygkZyktPmdldEFsbCgpWydjb250ZW50LXR5cGUnXT8/bnVsbCxzdWJzdHIoJGIsMCw0KT09PSdSSUZGJz8nV0VCUCc6KHN1YnN0cigkYiwwLDMpPT09Y2hyKDB4ZmYpLmNocigweGQ4KS5jaHIoMHhmZik/J0pQRyc6c3Vic3RyKCRiLDAsNikpKTsgfTsKICAgICR0ZXN0cz1hcnJheSgKICAgICAgJ0FfcGxhaW4nPT4iUmV3cml0ZUVuZ2luZSBPblxuUmV3cml0ZVJ1bGUgXnBzLXJ3LXNyY1xcLnR4dCQgcHMtcnctZHN0LnR4dCBbTF1cbiIsCiAgICAgICdCX25vY29uZCc9PiJSZXdyaXRlRW5naW5lIE9uXG5SZXdyaXRlUnVsZSBecHMtcnctdGVzdFxcLmpwZyQgcHMtcnctdGVzdC53ZWJwIFtUPWltYWdlL3dlYnAsTF1cbiIsCiAgICAgICdDX2FjY2VwdCc9PiJSZXdyaXRlRW5naW5lIE9uXG5SZXdyaXRlQ29uZCAle0hUVFBfQUNDRVBUfSBpbWFnZS93ZWJwXG5SZXdyaXRlUnVsZSBecHMtcnctdGVzdFxcLmpwZyQgcHMtcnctdGVzdC53ZWJwIFtUPWltYWdlL3dlYnAsTF1cbiIsCiAgICAgICdEX3JlcWZuJz0+IlJld3JpdGVFbmdpbmUgT25cblJld3JpdGVDb25kICV7UkVRVUVTVF9GSUxFTkFNRX0gXiguKylcXC5qcGckIFtOQ11cblJld3JpdGVDb25kICUxLndlYnAgLWZcblJld3JpdGVSdWxlIF4oLispXFwuanBnJCAkMS53ZWJwIFtUPWltYWdlL3dlYnAsTF1cbiIsCiAgICAgICdFX2RvY3Jvb3QnPT4iUmV3cml0ZUVuZ2luZSBPblxuUmV3cml0ZUNvbmQgJXtSRVFVRVNUX1VSSX0gXiguKylcXC5qcGckIFtOQ11cblJld3JpdGVDb25kICV7RE9DVU1FTlRfUk9PVH0lMS53ZWJwIC1mXG5SZXdyaXRlUnVsZSBeKC4rKVxcLmpwZyQgJDEud2VicCBbVD1pbWFnZS93ZWJwLExdXG4iLAogICAgICAnRl9yZWxwYXRoJz0+IlJld3JpdGVFbmdpbmUgT25cblJld3JpdGVDb25kICV7UkVRVUVTVF9GSUxFTkFNRX0gXFwuanBnJCBbTkNdXG5SZXdyaXRlQ29uZCAle1JFUVVFU1RfRklMRU5BTUV9ICEtZFxuUmV3cml0ZUNvbmQgJXtET0NVTUVOVF9ST09UfS93cC1jb250ZW50L3VwbG9hZHMvJDEud2VicCAtZiBbT1JdXG5SZXdyaXRlQ29uZCAle1JFUVVFU1RfRklMRU5BTUV9LndlYnAgLWZcblJld3JpdGVSdWxlIF4oLispXFwuanBnJCAkMS53ZWJwIFtUPWltYWdlL3dlYnAsTF1cbiIsCiAgICApOwogICAgZm9yZWFjaCgkdGVzdHMgYXMgJGs9PiRydWxlcyl7IGZpbGVfcHV0X2NvbnRlbnRzKCRodCwkcnVsZXMpOyB1c2xlZXAoMzAwMDAwKTsgJG9bJGtdPSRrPT09J0FfcGxhaW4nPyRnZXQoJy9wcy1ydy1zcmMudHh0JywnKi8qJyk6JGdldCgnL3BzLXJ3LXRlc3QuanBnJyk7IH0KICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRodCwkb3JpZyk7ICRvWydyZXN0b3JlZCddPW1kNV9maWxlKCRodCk9PT0kb1snb3JpZ19tZDUnXTsKICAgIGZvcmVhY2goYXJyYXkoJ3BzLXJ3LXNyYy50eHQnLCdwcy1ydy1kc3QudHh0JywncHMtcnctdGVzdC5qcGcnLCdwcy1ydy10ZXN0LndlYnAnKSBhcyAkeCkgQHVubGluaygkZC4nLycuJHgpOwogICAgJG9bJ2RvY3Jvb3QnXT0kX1NFUlZFUlsnRE9DVU1FTlRfUk9PVCddOyAkb1snYmFzZWRpciddPSRkOyAkb1sncmVhbHBhdGhfZG9jcm9vdCddPXJlYWxwYXRoKCRfU0VSVkVSWydET0NVTUVOVF9ST09UJ10pOyAkb1snaXNfbGluayddPWlzX2xpbmsoJF9TRVJWRVJbJ0RPQ1VNRU5UX1JPT1QnXSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyBpZihpc3NldCgkb3JpZykpIGZpbGVfcHV0X2NvbnRlbnRzKCRodCwkb3JpZyk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-131156';
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
