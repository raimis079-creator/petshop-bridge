process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQxZSBSYW5rIE1hdGggY2xlYXJfY2FjaGUgcmVjb24gKyBsb2dpbiBzYXJnYXMgKyBkYXJiYWxhdWtpcyA0MDE5IChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0MWUnXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzQxZSddOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3NDFlJywnZmF6ZSc9PiRmXTsKICAkcm5nPWZ1bmN0aW9uKCRmcCwkYSwkYil7IGlmKCFpc19maWxlKCRmcCkpIHJldHVybiAnTkVSQSAnLiRmcDsgJGxzPWZpbGUoJGZwKTsgJG89W107IGZvcigkaT1tYXgoMCwkYS0xKTskaTxtaW4oY291bnQoJGxzKSwkYik7JGkrKykgJG9bXT0oJGkrMSkuJzogJy5ydHJpbShtYl9zdWJzdHIoJGxzWyRpXSwwLDIxMCkpOyByZXR1cm4gJG87IH07CiAgJGZuZD1mdW5jdGlvbigkZnAsJHJlKXsgaWYoIWlzX2ZpbGUoJGZwKSkgcmV0dXJuIFtdOyAkbz1bXTsgZm9yZWFjaChmaWxlKCRmcCkgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgkcmUsJGwpKSAkb1tdPSRpKzE7IH0gcmV0dXJuICRvOyB9OwogIHRyeXsKICBpZigkZj09PScxJyl7CiAgICAkcm09V1BfUExVR0lOX0RJUi4nL3Nlby1ieS1yYW5rLW1hdGgnOyAkclsncm1fdmVyJ109ZGVmaW5lZCgnUkFOS19NQVRIX1ZFUlNJT04nKT9SQU5LX01BVEhfVkVSU0lPTjpudWxsOwogICAgJGg9JHJtLicvaW5jbHVkZXMvY2xhc3MtaGVscGVyLnBocCc7ICRsPSRmbmQoJGgsJy9mdW5jdGlvbiBjbGVhcl9jYWNoZS8nKTsgJHJbJ2hlbHBlcl9mbiddPSRsOyBpZigkbCkgJHJbJ2hlbHBlciddPSRybmcoJGgsJGxbMF0tMTIsJGxbMF0rNDApOwogICAgJGM9JHJtLicvaW5jbHVkZXMvbW9kdWxlcy9zaXRlbWFwL2NsYXNzLWNhY2hlLnBocCc7ICRsPSRmbmQoJGMsJy9mdW5jdGlvbiBpbnZhbGlkYXRlX3N0b3JhZ2UvJyk7ICRyWydjYWNoZV9mbiddPSRsOyBpZigkbCkgJHJbJ2NhY2hlJ109JHJuZygkYywkbFswXS02LCRsWzBdKzQ1KTsKICAgICR3PSRybS4nL2luY2x1ZGVzL21vZHVsZXMvc2l0ZW1hcC9jbGFzcy1jYWNoZS13YXRjaGVyLnBocCc7ICRsPSRmbmQoJHcsJy9mdW5jdGlvbiBjbGVhcl9xdWV1ZWQvJyk7ICRyWyd3YXRjaGVyX2ZuJ109JGw7IGlmKCRsKSAkclsnd2F0Y2hlciddPSRybmcoJHcsJGxbMF0tNCwkbFswXSszMCk7CiAgICAkclsnd2F0Y2hlcl9ob29rcyddPVtdOyBmb3JlYWNoKGZpbGUoJHcpIGFzICRpPT4kbG4peyBpZihwcmVnX21hdGNoKCcvYWRkX2FjdGlvbnwtPmFjdGlvblwofC0+ZmlsdGVyXCgvJywkbG4pKSAkclsnd2F0Y2hlcl9ob29rcyddW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGxuLDAsMTYwKSk7IH0KICAgIC8vIGthcyBqYXUga2FiaW5hIHByZV9jbGVhcl9jYWNoZQogICAgJGhpdD1bXTsgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGZwKXsgZm9yZWFjaChmaWxlKCRmcCkgYXMgJGk9PiRsbil7IGlmKHN0cmlwb3MoJGxuLCdwcmVfY2xlYXJfY2FjaGUnKSE9PWZhbHNlfHxzdHJpcG9zKCRsbiwncmFua19tYXRoL3NpdGVtYXAnKSE9PWZhbHNlKSAkaGl0W109YmFzZW5hbWUoJGZwKS4nOicuKCRpKzEpLicgJy50cmltKG1iX3N1YnN0cigkbG4sMCwxNTApKTsgfSB9ICRyWydtdV9ob29rcyddPSRoaXQ7CiAgICAkclsnc25pcF9ob29rcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGNvZGUgTElLRSAnJXByZV9jbGVhcl9jYWNoZSUnIixBUlJBWV9BKTsKICAgIGdsb2JhbCAkd3BfZmlsdGVyOyAkclsncHJlX2NsZWFyX2NhY2hlX2thYmxpYWknXT1pc3NldCgkd3BfZmlsdGVyWydyYW5rX21hdGgvcHJlX2NsZWFyX2NhY2hlJ10pP2NvdW50KCR3cF9maWx0ZXJbJ3JhbmtfbWF0aC9wcmVfY2xlYXJfY2FjaGUnXS0+Y2FsbGJhY2tzKTowOwogICAgJGN2PWdldF9vcHRpb24oJ3BzX2NhY2hlX3ZhbHltYWknKTsgaWYoaXNfYXJyYXkoJGN2KSl7ICRyWydjdl9uJ109Y291bnQoJGN2KTsgJGQ9W107IGZvcmVhY2goJGN2IGFzICR4KXsgJGs9c3Vic3RyKCR4WzBdLDAsOCkuJyAnLiR4WzFdLicgJy4oc3RycG9zKCR4WzRdPz8nJywnY2FjaGUtd2F0Y2hlcicpIT09ZmFsc2U/J1JNJzooc3RycG9zKCR4WzJdPz8nJywncG14aScpIT09ZmFsc2U/J1dQQUknOidrdCcpKTsgJGRbJGtdPSgkZFska10/PzApKzE7IH0gJHJbJ2N2X3N1diddPSRkOyAkclsnY3ZfcGlybWFzJ109JGN2WzBdWzBdPz9udWxsOyB9CiAgICAkcGM9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1jYWNoZS5waHAnOyAkclsncGV0c2hvcF9jYWNoZV9oZWFkJ109JHJuZygkcGMsMSw0NSk7ICRyWydwY19mbiddPVtdOyBmb3JlYWNoKGZpbGUoJHBjKSBhcyAkaT0+JGxuKXsgaWYocHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMrXHcrfGFkZF9hY3Rpb258YWRkX2ZpbHRlci8nLCRsbikpICRyWydwY19mbiddW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGxuLDAsMTUwKSk7IH0KICAgICRyWydtdV9saXN0J109YXJyYXlfbWFwKCdiYXNlbmFtZScsZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXIqLnBocCcpKTsKICB9CiAgaWYoJGY9PT0nMicpewogICAgJGZwPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbG9naW4tc2FyZ2FzLnBocCc7ICRyWydtZDUnXT1tZDVfZmlsZSgkZnApOyAkclsnZHlkaXMnXT1maWxlc2l6ZSgkZnApOyAkbHM9ZmlsZSgkZnApOyAkclsnZWlsX24nXT1jb3VudCgkbHMpOyAkclsnaGVhZCddPSRybmcoJGZwLDEsMzApOyAkclsnYXBsaW5rJ109JHJuZygkZnAsMTIwLDE3NSk7CiAgICAkclsna2l0dXJfaXZ5a28nXT0kZm5kKCRmcCwnL2l2eWtvfHRpcGFzfHBzX3Nhcmdhc19rbGFpZG9zLycpOwogICAgJHJbJ3Nhcmdhc19rbGFpZG9zX2NyZWF0ZSddPSR3cGRiLT5nZXRfcm93KCJTSE9XIENSRUFURSBUQUJMRSB7JFB9cHNfc2FyZ2FzX2tsYWlkb3MiLEFSUkFZX04pWzFdPz9udWxsOwogICAgJHJbJ2x5Z2lhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGx5Z2lzLCBDT1VOVCgqKSBuLCBNQVgobGFpa2FzKSBwYXNrIEZST00geyRQfXBzX3Nhcmdhc19rbGFpZG9zIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICAgJHJbJ3J5dGFzX3Nhcmdhc19rbGFpZG9zJ109W107ICRycD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXJ5dGFzLnBocCc7IGZvcmVhY2goZmlsZSgkcnApIGFzICRpPT4kbG4peyBpZihzdHJpcG9zKCRsbiwnc2FyZ2FzX2tsYWlkb3MnKSE9PWZhbHNlfHxzdHJpcG9zKCRsbiwnbG9naW4nKSE9PWZhbHNlKSAkclsncnl0YXNfc2FyZ2FzX2tsYWlkb3MnXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsbiwwLDE3MCkpOyB9CiAgICAkclsnc2FyZ19waHAnXT1bXTsgJHNwPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atc2FyZ2FzLnBocCc7IGlmKGlzX2ZpbGUoJHNwKSl7IGZvcmVhY2goZmlsZSgkc3ApIGFzICRpPT4kbG4peyBpZihzdHJpcG9zKCRsbiwnSU5TRVJUJykhPT1mYWxzZXx8c3RyaXBvcygkbG4sJy0+aW5zZXJ0KCcpIT09ZmFsc2V8fHN0cmlwb3MoJGxuLCdwc19zYXJnYXNfa2xhaWRvcycpIT09ZmFsc2UpICRyWydzYXJnX3BocCddW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGxuLDAsMTcwKSk7IH0gfQogIH0KICBpZigkZj09PSczJyl7CiAgICAkZnA9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kYXJiYWxhdWtpcy5waHAnOyAkclsnbWQ1J109bWQ1X2ZpbGUoJGZwKTsgJHJbJ3ZlciddPW51bGw7IGZvcmVhY2goYXJyYXlfc2xpY2UoZmlsZSgkZnApLDAsNikgYXMgJGxuKXsgaWYocHJlZ19tYXRjaCgnL3ZcZCtcLlxkKyhcLlxkKyk/LycsJGxuLCRtKSl7ICRyWyd2ZXInXT0kbVswXTsgYnJlYWs7IH0gfQogICAgJHJbJ2FwbGluayddPSRybmcoJGZwLDM5NjAsNDAyMik7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-070120';
const GKEY='ps_s1741e';
const PHASES=["1", "2", "3"];
const OUT='analize/s1741_e.json';
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
