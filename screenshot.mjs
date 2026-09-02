process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgSyByZWNvbiAyIOKAlCBWZW5pcGFrIHBsdWdpbiBwaWNrdXAgWE1MICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2s1J10pKSByZXR1cm47ICRvPWFycmF5KCk7CiAgZm9yZWFjaChnbG9iKFdQX1BMVUdJTl9ESVIuJy8qdmVuaXBhayovKi5waHAnKSBhcyAkZil7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgZm9yZWFjaChhcnJheSgnY29tcGFueV9jb2RlJywncGlja3VwX3BvaW50JywnZG9vcl9jb2RlJywndGVybWluYWwnLCdsb2NrZXInLCdzbmFwc2hvdCcpIGFzICRrdyl7IGlmKHByZWdfbWF0Y2hfYWxsKCcvLnswLDI2MH0nLiRrdy4nLnswLDI2MH0vcycsJGMsJG0pKXsgZm9yZWFjaChhcnJheV9zbGljZSgkbVswXSwwLDQpIGFzICR4KXsgJG9bYmFzZW5hbWUoJGYpXVska3ddW109cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCR4KTsgfSB9IH0gfQogIGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvKnZlbmlwYWsqL2luY2x1ZGVzLyoucGhwJykgYXMgJGYpeyAkYz1maWxlX2dldF9jb250ZW50cygkZik7IGZvcmVhY2goYXJyYXkoJ2NvbXBhbnlfY29kZScsJ2Rvb3JfY29kZScsJ3BpY2t1cF9zbmFwc2hvdCcsJ2lzX3BpY2t1cCcsJ3BpY2t1cF9wb2ludF9jb2RlJywiICdjb2RlJyIpIGFzICRrdyl7IGlmKHByZWdfbWF0Y2hfYWxsKCcvLnswLDI2MH0nLnByZWdfcXVvdGUoJGt3LCcvJykuJy57MCwyNjB9L3MnLCRjLCRtKSl7IGZvcmVhY2goYXJyYXlfc2xpY2UoJG1bMF0sMCw0KSBhcyAkeCl7ICRvWydpbmMvJy5iYXNlbmFtZSgkZildWyRrd11bXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJHgpOyB9IH0gfSB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-171227';
const GKEY='ps_k5';
const PHASES=["R"];
const OUT='analize/k_r2.json';
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
