process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY2IFdlYlAgcmVjb24gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCRmIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTU2NicpOyBAc2V0X3RpbWVfbGltaXQoMjUwKTsKICB0cnl7CiAgICAkb1snZ2Rfd2VicCddPWZ1bmN0aW9uX2V4aXN0cygnaW1hZ2V3ZWJwJyk7ICRvWydpbWFnaWNrJ109Y2xhc3NfZXhpc3RzKCdJbWFnaWNrJyk/YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihJbWFnaWNrOjpxdWVyeUZvcm1hdHMoJ1dFQlAqJykpKTpudWxsOyAkb1snY3dlYnBfYmluJ109dHJpbSgoc3RyaW5nKUBzaGVsbF9leGVjKCd3aGljaCBjd2VicCAyPi9kZXYvbnVsbCcpKTsgJG9bJ2V4ZWMnXT1mdW5jdGlvbl9leGlzdHMoJ3NoZWxsX2V4ZWMnKTsKICAgICR1cD13cF91cGxvYWRfZGlyKCk7ICRiYXNlPSR1cFsnYmFzZWRpciddOyAkb1snYmFzZWRpciddPSRiYXNlOyAkb1snZGlza19mcmVlX2diJ109cm91bmQoZGlza19mcmVlX3NwYWNlKCRiYXNlKS8xMDczNzQxODI0LDEpOwogICAgJG49YXJyYXkoJ2pwZyc9PjAsJ3BuZyc9PjAsJ3dlYnAnPT4wLCdqcGdfbWInPT4wLCdwbmdfbWInPT4wLCd3ZWJwX2hhc19qcGcnPT4wKTsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkYmFzZSxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyAkdDA9bWljcm90aW1lKHRydWUpOyAkc2FtcGxlPWFycmF5KCk7CiAgICBmb3JlYWNoKCRpdCBhcyAkZmwpeyBpZihtaWNyb3RpbWUodHJ1ZSktJHQwPjYwKXsgJG9bJ3NjYW5fcGFydGlhbCddPXRydWU7IGJyZWFrOyB9ICRlPXN0cnRvbG93ZXIoJGZsLT5nZXRFeHRlbnNpb24oKSk7ICRwPSRmbC0+Z2V0UGF0aG5hbWUoKTsgaWYoc3RycG9zKCRwLCcvY2FjaGUvJykhPT1mYWxzZXx8c3RycG9zKCRwLCcvcHMtYmFja3Vwcy8nKSE9PWZhbHNlKSBjb250aW51ZTsKICAgICAgaWYoJGU9PT0nanBnJ3x8JGU9PT0nanBlZycpeyAkblsnanBnJ10rKzsgJG5bJ2pwZ19tYiddKz0kZmwtPmdldFNpemUoKTsgaWYoY291bnQoJHNhbXBsZSk8MyYmIXByZWdfbWF0Y2goJ34tXGQreFxkK1wuficsJHApKSAkc2FtcGxlW109c3RyX3JlcGxhY2UoJGJhc2UsJycsJHApOyB9IGVsc2VpZigkZT09PSdwbmcnKXsgJG5bJ3BuZyddKys7ICRuWydwbmdfbWInXSs9JGZsLT5nZXRTaXplKCk7IH0gZWxzZWlmKCRlPT09J3dlYnAnKXsgJG5bJ3dlYnAnXSsrOyBpZihmaWxlX2V4aXN0cyhwcmVnX3JlcGxhY2UoJ35cLndlYnAkficsJy5qcGcnLCRwKSkpICRuWyd3ZWJwX2hhc19qcGcnXSsrOyB9IH0KICAgICRuWydqcGdfbWInXT1yb3VuZCgkblsnanBnX21iJ10vMTA0ODU3Nik7ICRuWydwbmdfbWInXT1yb3VuZCgkblsncG5nX21iJ10vMTA0ODU3Nik7ICRvWydmYWlsYWknXT0kbjsgJG9bJ3NhbXBsZSddPSRzYW1wbGU7ICRvWydzY2FuX3MnXT1yb3VuZChtaWNyb3RpbWUodHJ1ZSktJHQwLDEpOwogICAgLy8ga29udmVyc2lqb3MgdGVzdGFzIHN1IDEgZmFpbHUgKEdEKSwga29reWLElyA4MgogICAgaWYoJHNhbXBsZSYmJG9bJ2dkX3dlYnAnXSl7ICRzcmM9JGJhc2UuJHNhbXBsZVswXTsgJGltPUBpbWFnZWNyZWF0ZWZyb21qcGVnKCRzcmMpOyBpZigkaW0peyAkdG1wPXN5c19nZXRfdGVtcF9kaXIoKS4nL3BzX3dlYnBfdGVzdC53ZWJwJzsgJHQxPW1pY3JvdGltZSh0cnVlKTsgaW1hZ2V3ZWJwKCRpbSwkdG1wLDgyKTsgaW1hZ2VkZXN0cm95KCRpbSk7ICRvWyd0ZXN0J109YXJyYXkoJ3NyY19rYic9PnJvdW5kKGZpbGVzaXplKCRzcmMpLzEwMjQpLCd3ZWJwX2tiJz0+cm91bmQoZmlsZXNpemUoJHRtcCkvMTAyNCksJ21zJz0+cm91bmQoKG1pY3JvdGltZSh0cnVlKS0kdDEpKjEwMDApKTsgQHVubGluaygkdG1wKTsgfSB9CiAgICAvLyAuaHRhY2Nlc3M6IGFyIGphdSB5cmEgd2VicCB0YWlzeWtsacWzOyBBcGFjaGUgbW9kdWxpYWkKICAgICRodD1maWxlX2dldF9jb250ZW50cyhBQlNQQVRILicuaHRhY2Nlc3MnKTsgJG9bJ2h0X3dlYnAnXT1zdHJpcG9zKCRodCwnd2VicCcpIT09ZmFsc2U/c3Vic3RyX2NvdW50KCRodCwnd2VicCcpOjA7ICRvWydodF9tYXJrZXJzJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9tYXAoJ3RyaW0nLGV4cGxvZGUoIlxuIiwkaHQpKSxmbigkbCk9PnN0cl9zdGFydHNfd2l0aCgkbCwnIyBCRUdJTicpfHxzdHJfc3RhcnRzX3dpdGgoJGwsJyMgRU5EJykpKTsKICAgICRvWydhcGFjaGVfbW9kdWxlcyddPWZ1bmN0aW9uX2V4aXN0cygnYXBhY2hlX2dldF9tb2R1bGVzJyk/YXJyYXlfdmFsdWVzKGFycmF5X2ludGVyc2VjdChhcGFjaGVfZ2V0X21vZHVsZXMoKSxhcnJheSgnbW9kX3Jld3JpdGUnLCdtb2RfaGVhZGVycycsJ21vZF9taW1lJywnbW9kX2V4cGlyZXMnKSkpOiduL2EgKHBocC1mcG0pJzsKICAgICRvWydzZXJ2ZXJfc3cnXT0kX1NFUlZFUlsnU0VSVkVSX1NPRlRXQVJFJ10/P251bGw7ICRvWydwaHBfbWVtJ109aW5pX2dldCgnbWVtb3J5X2xpbWl0Jyk7ICRvWydtYXhfZXhlYyddPWluaV9nZXQoJ21heF9leGVjdXRpb25fdGltZScpOwogICAgLy8gaGVybyBtb2JpbGU6IGtva2llIGR5ZMW+aWFpIHJlZ2lzdHJ1b3RpCiAgICAkb1snaW1hZ2Vfc2l6ZXMnXT13cF9nZXRfcmVnaXN0ZXJlZF9pbWFnZV9zdWJzaXplcygpID8gYXJyYXlfbWFwKGZuKCRzKT0+JHNbJ3dpZHRoJ10uJ3gnLiRzWydoZWlnaHQnXSx3cF9nZXRfcmVnaXN0ZXJlZF9pbWFnZV9zdWJzaXplcygpKSA6IG51bGw7CiAgICAkb1snYXR0YWNobWVudHNfanBncG5nJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdhdHRhY2htZW50JyBBTkQgcG9zdF9taW1lX3R5cGUgSU4gKCdpbWFnZS9qcGVnJywnaW1hZ2UvcG5nJykiKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-123653';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1566.json';
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
