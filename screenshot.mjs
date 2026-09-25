process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3aCByZWNvbiByZWFkLW9ubHk6IGRhcmJhbGF1a2lvIGVpbGVzIGxvZ2lrYSArIGt1ciBkYWJhciAjMTE3NyAoMzYyOTYpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxN2gnXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE3MTdoJ107IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTcxN2gnLCdmYXplJz0+JGZdOyAkSUQ9MzYyOTY7CiAgJHR6PW5ldyBEYXRlVGltZVpvbmUoJ0V1cm9wZS9WaWxuaXVzJyk7CiAgJGRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGFyYmFsYXVraXMucGhwJzsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGRmKTsKICAkYm9keT1mdW5jdGlvbigkbmFtZSwkbWF4PTMwMDApIHVzZSgkcyl7IGlmKCFwcmVnX21hdGNoKCcjKHB1YmxpY3xwcml2YXRlfHByb3RlY3RlZCk/XHMqc3RhdGljXHMrZnVuY3Rpb25ccysnLiRuYW1lLidccypcKFteKV0qXClccypceyMnLCRzLCRtLFBSRUdfT0ZGU0VUX0NBUFRVUkUpKSByZXR1cm4gbnVsbDsgJHN0PSRtWzBdWzFdOyAkaT0kc3Qrc3RybGVuKCRtWzBdWzBdKTsgJGQ9MTsgJG49c3RybGVuKCRzKTsgd2hpbGUoJGk8JG4gJiYgJGQ+MCl7ICRjPSRzWyRpXTsgaWYoJGM9PT0neycpICRkKys7IGVsc2VpZigkYz09PSd9JykgJGQtLTsgJGkrKzsgfSAkYj1zdWJzdHIoJHMsJHN0LCRpLSRzdCk7IHJldHVybiBzdHJsZW4oJGIpPiRtYXg/c3Vic3RyKCRiLDAsJG1heCkuJ+KAplsrJy4oc3RybGVuKCRiKS0kbWF4KS4nXSc6JGI7IH07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgIGZvcmVhY2goWydhdHZpcmknLCdrdXJfZGFiYXInLCdidXNlbmEnLCdmaWx0cnVvdGknLCdlaWxlcycsJ215Z3R1a2FzX2VpbGVpJywnc2l1bnRvcycsJ2RhbHlzX2JhaWd0b3MnXSBhcyAkZm4pICRyWydrb2RhcyddWyRmbl09JGJvZHkoJGZuLCAkZm49PT0nZmFrdGFpJz82MDAwOjMyMDApOwogIH0KICBpZigkZj09PScyJyl7CiAgICAkclsna29kYXMnXVsnZmFrdGFpJ109JGJvZHkoJ2Zha3RhaScsOTAwMCk7CiAgICAkclsna29kYXMnXVsnZmlsdHJhc19ha3R5dnVzJ109JGJvZHkoJ2ZpbHRyYXNfYWt0eXZ1cycsMTUwMCk7CiAgICAkclsna29kYXMnXVsndmlzaSddPSRib2R5KCd2aXNpJywyNTAwKTsKICB9CiAgaWYoJGY9PT0nMycpewogICAgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfRGFyYmFsYXVraXMnKTsKICAgICRjYWxsPWZ1bmN0aW9uKCRmbiwkYXJncykgdXNlKCRyYyl7ICRtPSRyYy0+Z2V0TWV0aG9kKCRmbik7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyByZXR1cm4gJG0tPmludm9rZUFyZ3MobnVsbCwkYXJncyk7IH07CiAgICAkbz13Y19nZXRfb3JkZXIoJElEKTsKICAgICRmaz0kY2FsbCgnZmFrdGFpJyxbJG9dKTsgJGZrMj0kZms7IGZvcmVhY2goJGZrMiBhcyAkaz0+JHYpeyBpZihpc19zdHJpbmcoJHYpJiZtYl9zdHJsZW4oJHYpPjIwMCkgJGZrMlska109bWJfc3Vic3RyKCR2LDAsMjAwKS4n4oCmJzsgaWYoaXNfYXJyYXkoJHYpKSAkZmsyWyRrXT1tYl9zdWJzdHIoanNvbl9lbmNvZGUoJHYsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSksMCw0MDApOyB9ICRyWydmYWt0YWknXT0kZmsyOwogICAgdHJ5eyAkclsna3VyX2RhYmFyJ109JGNhbGwoJ2t1cl9kYWJhcicsWyRma10pOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2t1cl9kYWJhcl9lcnInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICB0cnl7ICRyWydidXNlbmEnXT13cF9zdHJpcF9hbGxfdGFncygkY2FsbCgnYnVzZW5hJyxbJGZrXSkpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2J1c2VuYV9lcnInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICB0cnl7ICRhdHY9JGNhbGwoJ2F0dmlyaScsW10pOyAkclsnYXR2aXJpX24nXT1pc19hcnJheSgkYXR2KT9jb3VudCgkYXR2KTpudWxsOyAkaWRzPVtdOyBpZihpc19hcnJheSgkYXR2KSl7IGZvcmVhY2goJGF0diBhcyAkaz0+JHgpeyAkaWRzW109aXNfb2JqZWN0KCR4KT8keC0+Z2V0X2lkKCk6KGlzX2FycmF5KCR4KT8oJHhbJ2lkJ10/PyRrKTokeCk7IH0gfSAkclsnYXR2aXJpX3lyYSddPWluX2FycmF5KCRJRCwkaWRzKXx8aW5fYXJyYXkoKHN0cmluZykkSUQsJGlkcyk7ICRyWydhdHZpcmlfcHZ6J109YXJyYXlfc2xpY2UoJGlkcywwLDEyKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydhdHZpcmlfZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogICAgZm9yZWFjaChbJ2xhaXNrYWknLCdsYXVraWFtJywndXpzYWt5dGEnLCdrbGF1c2ltYWknLCd2aXNpJywnYXBtb2tldGEnLCdydXNpdW90aScsJ3NwcmVzdGknLCdrb25zJywndGlla2ltYXMnLCdsYXBhaScsJ2xpcGR1a2FzJywnbGFpc2thcycsJ2F0c19wYXJ1b3N0YScsJ2F0c2llbWUnLCdpc3NpdXN0YSddIGFzICRlKXsgdHJ5eyAkcm93cz0kY2FsbCgnZmlsdHJ1b3RpJyxbWyRma10sJGVdKTsgJHJbJ2VpbGVzZSddWyRlXT1pc19hcnJheSgkcm93cyk/Y291bnQoJHJvd3MpOmdldHR5cGUoJHJvd3MpOyB9Y2F0Y2goVGhyb3dhYmxlICR4KXsgJHJbJ2VpbGVzZSddWyRlXT0nRVJSICcuJHgtPmdldE1lc3NhZ2UoKTsgfSB9CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogICRyWydsYWlrYXMnXT0obmV3IERhdGVUaW1lKCdub3cnLCR0eikpLT5mb3JtYXQoJ0g6aTpzJyk7CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-071321';
const GKEY='ps_s1717h';
const PHASES=["1"];
const OUT='analize/s1717_h1.json';
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
