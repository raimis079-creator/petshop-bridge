process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI0cyByZWNvbjogcm9ib3RzLnR4dCwgWUlUSCBmaWx0cnUgbnVvcm9kdSBIVE1MLCBib3R1IHNhcmdhcyB2MS4wIHN0cnVrdHVyYSwgcnl0YXMgbGVtcHVjaXUgc2FibG9uYXMgcmVhZC1vbmx5ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyNHMnXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxNzI0cyddOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgJHR6PW5ldyBEYXRlVGltZVpvbmUoJ0V1cm9wZS9WaWxuaXVzJyk7CiAgdHJ5ewogICAgJHg9d3BfcmVtb3RlX2dldChob21lX3VybCgnL3JvYm90cy50eHQnKSxbJ3RpbWVvdXQnPT4yMCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJHJbJ3JvYm90cyddPWlzX3dwX2Vycm9yKCR4KT8keC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTp3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7CiAgICAkclsncm9ib3RzX2ZhaWxhcyddPWlzX2ZpbGUoQUJTUEFUSC4ncm9ib3RzLnR4dCcpPydmaXppbmlzJzondmlydHVhbHVzJzsgJHJbJ3JhbmtfbWF0aF9yb2JvdHMnXT1nZXRfb3B0aW9uKCdyYW5rLW1hdGgtb3B0aW9ucy1nZW5lcmFsJylbJ3JvYm90c190eHRfY29udGVudCddPz9udWxsOwogICAgLy8gWUlUSDoga2F0ZWdvcmlqb3MgSFRNTCDigJQgZmlsdHJ1IG51b3JvZG9zIChiZSBrZXNvOiBwc18gcmFrdGFzKQogICAgJHg9d3BfcmVtb3RlX2dldChob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zLz9wc19zPTEnKSxbJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3VzZXItYWdlbnQnPT4nTW96aWxsYS81LjAgcHMtczE3MjRzJ10pOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7ICRyWydrYXRfbGVuJ109c3RybGVuKCRoKTsKICAgIHByZWdfbWF0Y2hfYWxsKCcjPGFbXj5dK2hyZWY9IlteIl0qKGZpbHRlcl98eWl0aF93Y2FuKVteIl0qIltePl0qPiMnLCRoLCRtKTsgJHJbJ2ZpbHRydV9hX24nXT1jb3VudCgkbVswXSk7ICRyWydmaWx0cnVfYV9wdnonXT1hcnJheV9zbGljZSgkbVswXSwwLDQpOyAkclsnZmlsdHJ1X2FfcmVsJ109Y291bnQoYXJyYXlfZmlsdGVyKCRtWzBdLGZ1bmN0aW9uKCRhKXtyZXR1cm4gc3RyaXBvcygkYSwnbm9mb2xsb3cnKSE9PWZhbHNlO30pKTsKICAgIHByZWdfbWF0Y2hfYWxsKCcjPGFbXj5dK2hyZWY9IlteIl0qKG9yZGVyYnk9fC9wYWdlL1xkKylbXiJdKiJbXj5dKj4jJywkaCwkbTIpOyAkclsnb3JkZXJieV9wYWdlX2FfbiddPWNvdW50KCRtMlswXSk7ICRyWydvcmRlcmJ5X3BhZ2VfcHZ6J109YXJyYXlfc2xpY2UoJG0yWzBdLDAsMyk7CiAgICBwcmVnX21hdGNoX2FsbCgnIzxsaW5rW14+XStyZWw9IihjYW5vbmljYWx8bmV4dHxwcmV2KSJbXj5dKj4jJywkaCwkbTMpOyAkclsnbGlua19yZWwnXT0kbTNbMF07CiAgICAkclsneWl0aF92ZXInXT1kZWZpbmVkKCdZSVRIX1dDQU5fVkVSU0lPTicpP1lJVEhfV0NBTl9WRVJTSU9OOm51bGw7ICRyWyd5aXRoX29wdHMnXT1hcnJheV9pbnRlcnNlY3Rfa2V5KChhcnJheSlnZXRfb3B0aW9uKCd5aXRoX3djYW5fb3B0aW9ucycsW10pLGFycmF5X2ZsaXAoWydmaWx0ZXJzX3NlbycsJ2FqYXhfZmlsdGVycycsJ3VybF90eXBlJywnc2VvX25vaW5kZXgnLCdpbnN0YW50X2ZpbHRlcnMnXSkpOyAkclsneWl0aF9vcHRfa2V5cyddPWFycmF5X3NsaWNlKGFycmF5X2tleXMoKGFycmF5KWdldF9vcHRpb24oJ3lpdGhfd2Nhbl9vcHRpb25zJyxbXSkpLDAsNDApOwogICAgLy8gYm90dSBzYXJnYXMgdjEuMCDigJQga2FibGnFsyBzYXJhc2FzIGlyIHp1cm5hbG8gZm9ybWF0YXMKICAgICRicz1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWJvdHUtc2FyZ2FzLnBocCcpOyAkTD1leHBsb2RlKCJcbiIsJGJzKTsgJHJbJ2JzX3ZlciddPXByZWdfbWF0Y2goJyNWZXJzaW9uOlxzKihbXGQuXSspIycsJGJzLCRtbSk/JG1tWzFdOm51bGw7ICRyWydic19laWwnXT1jb3VudCgkTCk7IGZvcmVhY2goJEwgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL2FkZF9hY3Rpb258YWRkX2ZpbHRlcnxmdW5jdGlvbiB8c3V2ZXN0aW5lfHdwX2hlYWR8c2NyaXB0fHBzX2pzLycsJGwpKSAkclsnYnNfa29kYXMnXVtdPSgkaSsxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDE2MCk7IH0gJHJbJ2JzX2tvZGFzJ109YXJyYXlfc2xpY2UoJHJbJ2JzX2tvZGFzJ10sMCw2MCk7CiAgICAvLyByeXRhczoga2FpcCBwcmlkZWRhbWEgbGVtcHV0ZSAoZHBfa2Fpbm9zIHBhdnl6ZHlzKSArIHBhdGlrcm9zKCkgcHJhZHppYQogICAgJHJ5PWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcnl0YXMucGhwJyk7ICRSPWV4cGxvZGUoIlxuIiwkcnkpOyBmb3JlYWNoKCRSIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9kcF9rYWlub3N8XCRhZGRccyo9fGZ1bmN0aW9uIHBhdGlrcm9zfFZlcnNpb246LycsJGwpKSAkclsncnl0YXNfZWlsJ11bXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbCksMCwyMDApOyB9CiAgICAkclsncnl0YXNfbWQ1J109bWQ1KCRyeSk7CiAgICAvLyBsb2cgYXJjaHl2YWkKICAgICRkb209ZGlybmFtZShBQlNQQVRIKTsgZm9yZWFjaChnbG9iKCRkb20uJy9sb2dzLyoudGFyLmd6KicpIGFzICRmeCl7ICRyWydsb2dzJ11bXT1bYmFzZW5hbWUoJGZ4KSxyb3VuZChmaWxlc2l6ZSgkZngpLzEwNDg1NzYsMSksKG5ldyBEYXRlVGltZSgnQCcuZmlsZW10aW1lKCRmeCkpKS0+c2V0VGltZXpvbmUoJHR6KS0+Zm9ybWF0KCdtLWQgSDppJyldOyB9CiAgICAkclsnZ3pvcGVuJ109ZnVuY3Rpb25fZXhpc3RzKCdnem9wZW4nKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-105706';
const GKEY='ps_s1724s';
const PHASES=["1"];
const OUT='analize/s1724_s.json';
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
  // EKRANO NUOTRAUKOS (browser=1): fazė grąžina shots:[{n,u,w}], cookies:[{name,value}]
  const SH=(()=>{ for(const f of PHASES){ if(out[f]&&out[f].shots) return out[f]; } return null; })();
  if(SH){ try{ const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:new URL(WP).hostname,path:'/',secure:true}))); }
      out.shots={};
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,300))); pg.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,300)); }); pg.on('response',r=>{ if(r.status()>=400) errs.push('http '+r.status()+' '+r.url().slice(0,120)); });
          if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const res={}; if(s.click){ try{ await pg.click(s.click,{timeout:5000}); await pg.waitForTimeout(600); res.clicked=s.click; }catch(e){ res.click_err=String(e).slice(0,200); } }
          if(s.eval){ try{ res.eval=await pg.evaluate(s.eval); }catch(e){ res.eval_err=String(e).slice(0,200); } }
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]=Object.assign({status:st,url:pg.url(),title:await pg.title(),errors:errs.slice(0,12)},res); await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
