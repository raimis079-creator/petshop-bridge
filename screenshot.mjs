process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTkwIHNoaXBwaW5nIHJlY29uICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfc2gnXSkgfHwgJF9HRVRbJ3BzX3NoJ10hPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTU5MHInKTsKICB0cnl7CiAgICAvLyBXQyB6b25vcyBpciBtZXRvZGFpIOKAlCB0YWksIGvEhSBwaXJrxJdqYXMgbWF0byBrYXNvamUKICAgICR6b25lcz1XQ19TaGlwcGluZ19ab25lczo6Z2V0X3pvbmVzKCk7ICRvdXQ9YXJyYXkoKTsKICAgIGZvcmVhY2goJHpvbmVzIGFzICR6KXsgJHJvdz1hcnJheSgnem9uYSc9PiR6Wyd6b25lX25hbWUnXSwndmlldG9zJz0+YXJyYXlfbWFwKGZuKCRsKT0+JGwtPmNvZGUsJHpbJ3pvbmVfbG9jYXRpb25zJ10pLCdtZXRvZGFpJz0+YXJyYXkoKSk7CiAgICAgIGZvcmVhY2goJHpbJ3NoaXBwaW5nX21ldGhvZHMnXSBhcyAkbSl7ICRyb3dbJ21ldG9kYWknXVtdPWFycmF5KCdpZCc9PiRtLT5pZCwncGF2Jz0+JG0tPmdldF90aXRsZSgpLCdlbmFibGVkJz0+JG0tPmlzX2VuYWJsZWQoKSwnbnVzdGF0eW1haSc9PmFycmF5X2ludGVyc2VjdF9rZXkoJG0tPmluc3RhbmNlX3NldHRpbmdzPz9hcnJheSgpLGFycmF5X2ZsaXAoYXJyYXkoJ2Nvc3QnLCdtaW5fYW1vdW50JywncmVxdWlyZXMnLCdpZ25vcmVfZGlzY291bnRzJywnZnJlZV9zaGlwcGluZ19jb3N0JywndGllcicsJ2NsYXNzX2Nvc3RfY2FsY3VsYXRpb24nKSkpKTsgfQogICAgICAkb3V0W109JHJvdzsgfQogICAgJG9bJ3pvbm9zJ109JG91dDsKICAgICR6MD1uZXcgV0NfU2hpcHBpbmdfWm9uZSgwKTsgJG9bJ2xpa3VzaV96b25hJ109YXJyYXlfbWFwKGZuKCRtKT0+YXJyYXkoJG0tPmlkLCRtLT5nZXRfdGl0bGUoKSwkbS0+aXNfZW5hYmxlZCgpKSwkejAtPmdldF9zaGlwcGluZ19tZXRob2RzKCkpOwogICAgJG9bJ3RhcmlmYWlfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfdGFyaWZhaSIpOwogICAgJG9bJ3RhcmlmYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBzX3RhcmlmYWkgTElNSVQgNTAiLEFSUkFZX0EpOwogICAgLy8gc21hbGwgY2FydCBmZWUgbG9naWthCiAgICBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZil7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYoc3RyaXBvcygkYywnc21hbGxfY2FydCcpIT09ZmFsc2UpeyAkb1snc21hbGxfY2FydF9mYWlsYXMnXT1iYXNlbmFtZSgkZik7IHByZWdfbWF0Y2goJy9zbWFsbF9jYXJ0LnswLDcwMH0vc2knLCRjLCRtKTsgJG9bJ3NtYWxsX2NhcnQnXT0kbVswXT8/bnVsbDsgYnJlYWs7IH0gfQogICAgLy8gbmVtb2thbW8gcHJpc3RhdHltbyByaWJhIGnFoSBudXN0YXR5bcWzPwogICAgJG9bJ3NoaXBfb3B0cyddPWFycmF5KCd3b29jb21tZXJjZV9zaGlwX3RvX2NvdW50cmllcyc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3NoaXBfdG9fY291bnRyaWVzJyksJ2ZyZWVfbnVvJz0+Z2V0X29wdGlvbigncHNfbmVtb2thbWFzX251bycpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-204646';
const GKEY='ps_sh';
const PHASES=["GO"];
const OUT='analize/s1590_ship.json';
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
