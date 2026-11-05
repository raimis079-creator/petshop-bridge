process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODMxemwgWkIgaW1wb3J0IGxvZzogcHJhbGVpc3RvcyBwaWdpb3MgcHJla2VzICsgWkIgc2FsdGluaXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODMxemwnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDIwMCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCcxMDI0TScpOyAkcj1bJ3YnPT4nUzE4MzF6bCddOwogIHRyeXsKICAkbGY9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BldHNob3AtcHJpdmF0ZS1sb2dzL3piLWltcG9ydC5sb2cnOyAkc3o9ZmlsZXNpemUoJGxmKTsgJGg9Zm9wZW4oJGxmLCdyJyk7IGZzZWVrKCRoLG1heCgwLCRzei0zMDAwMDAwKSk7ICR0eD1zdHJlYW1fZ2V0X2NvbnRlbnRzKCRoKTsgZmNsb3NlKCRoKTsKICAkbGluZXM9ZXhwbG9kZSgiXG4iLCR0eCk7ICRyWydlaWwnXT1jb3VudCgkbGluZXMpOyAkclsncHZ6J109YXJyYXlfc2xpY2UoJGxpbmVzLC04KTsKICAkcmVhc29ucz1bXTsgJGxvdz1bXTsgJHNlZW49W107ICRibGs9W107CiAgZm9yZWFjaCgkbGluZXMgYXMgJGxuKXsgaWYocHJlZ19tYXRjaCgnL3JlYXNvbj0oW2Etel9dKykvJywkbG4sJG0pKSAkcmVhc29uc1skbVsxXV09KCRyZWFzb25zWyRtWzFdXT8/MCkrMTsKICAgIGlmKHN0cnBvcygkbG4sJ1syMDI2LTExLTA1Jyk9PT0wICYmIHN0cnBvcygkbG4sJ1pCLUJMT0NLLUNSRUFURScpIT09ZmFsc2UgJiYgcHJlZ19tYXRjaCgnL25hbWU9KC4qPykgXHwgY2F0ZWdvcnk9KC4qPykgXHwgcHJpY2U9KFtcZC5dKykgXHwgcXR5PShcZCspIFx8IHJlYXNvbj0oXHcqKS8nLCRsbiwkbSkpeyAkazI9bWQ1KCRtWzFdKTsgaWYoIWlzc2V0KCRzZWVuWydiJy4kazJdKSl7ICRzZWVuWydiJy4kazJdPTE7ICRibGtbXT1bbWJfc3Vic3RyKCRtWzFdLDAsNzApLG1iX3N1YnN0cigkbVsyXSwwLDQ1KSwoZmxvYXQpJG1bM10sKGludCkkbVs0XSwkbVs1XV07IH0gfQogICAgaWYoc3RyaXBvcygkbG4sJ2Nvc3RfYmVsb3dfbWluaW11bScpIT09ZmFsc2UgfHwgc3RyaXBvcygkbG4sJ2JlbG93X21pbicpIT09ZmFsc2UpeyAkaz1tZDUocHJlZ19yZXBsYWNlKCcvXlxbW15cXV0rXF1ccyovJywnJywkbG4pKTsgaWYoaXNzZXQoJHNlZW5bJGtdKSkgY29udGludWU7ICRzZWVuWyRrXT0xOyAkbG93W109bWJfc3Vic3RyKCRsbiwwLDIyMCk7IH0gfQogIGFyc29ydCgkcmVhc29ucyk7ICRyWydyZWFzb25zJ109JHJlYXNvbnM7ICRyWydsb3dfbiddPWNvdW50KCRsb3cpOyAkclsnbG93J109YXJyYXlfc2xpY2UoJGxvdywtNSk7IHVzb3J0KCRibGssZm4oJGEsJGIpPT4kYVsyXTw9PiRiWzJdKTsgJHJbJ2Jsa19uJ109Y291bnQoJGJsayk7ICRyWydibGsnXT0kYmxrOwogIC8vIFpCIHRhaXN5a2xpxbMgZmFpbGFzCiAgZm9yZWFjaChnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9pbmNsdWRlcy8qemIqJyk/OltdIGFzICRmKXsgJHNyYz1maWxlX2dldF9jb250ZW50cygkZik7ICRMPVtdOyBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkc3JjKSBhcyAkbj0+JGwpeyBpZihwcmVnX21hdGNoKCcvbWlufGNvc3R8dXJsfGFwaXxlbmRwb2ludHxmZXRjaHxjYWNoZXxibG9ja2VkfGJyYW5kL2knLCRsKSAmJiAhcHJlZ19tYXRjaCgnL15ccypcL1wvLycsJGwpKSAkTFtdPSgkbisxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDE2MCk7IH0gJHJbJ3J1bGVzJ11bYmFzZW5hbWUoJGYpXT1hcnJheV9zbGljZSgkTCwwLDYwKTsgfQogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qemIqJyk/OltdIGFzICRmKXsgJHJbJ211X3piJ11bXT1iYXNlbmFtZSgkZik7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0VSUiddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsK';
const VER='dep-120818';
const GKEY='ps_s1831zl';
const PHASES=["1"];
const OUT='analize/s1831_zl2.json';
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
