process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgyZSAxNCBsYWlraW7FsyBtdS1wbHVnaW7FsyDCtyAxIGFudHJhxaF0xJdzIMK3IDIgcGVya8SXbGltYXMgxK8gcHMtYXJjaHl2YXMgwrcgOSBncsSFxb5pbmltYXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzgyZSddKSkgcmV0dXJuOyAkRj0oc3RyaW5nKSRfR0VUWydwc19zMTc4MmUnXTsgJHI9Wyd2Jz0+J1MxNzgyZScsJ2YnPT4kRl07CiAgJEw9WydhdXRvbWF0aW9uLWJ5LWluc3RhbGxhdHJvbi5waHAnLCdwZXRzaG9wLWNvZGUtc2VhcmNoLnBocCcsJ3BldHNob3AtaW1wb3J0LWxvZy5waHAnLCdwZXRzaG9wLWltcG9ydC10ZW1wYXMucGhwJywncGV0c2hvcC1pbm5vZGIucGhwJywncGV0c2hvcC1sYWlza2FpLWltcG9ydGFzLnBocCcsJ3BldHNob3AtbGVnYWN5LWltcG9ydGFzLnBocCcsJ3BldHNob3AtbGVudGVsaXUtdmFseW1hcy5waHAnLCdwZXRzaG9wLXBhcnNlcmlzLnBocCcsJ3BzLXBldHMtbWlncmF0aW9uLWZyZWV6ZS5waHAnLCdwZXRzaG9wLXNlby1hcHJhc3ltYXMucGhwJywncGV0c2hvcC1zaXVudHUtdmFseW1hcy5waHAnLCdwZXRzaG9wLXdjLXN5bmMucGhwJywncGV0c2hvcC1jZi1pcC5waHAnXTsKICAkQT1kaXJuYW1lKEFCU1BBVEgpLicvcHMtYXJjaHl2YXMvbXUtYXJjaHl2YXMtczE3ODInOyAKICB0cnl7CiAgICBmb3JlYWNoKCRMIGFzICRmKXsgJHA9V1BNVV9QTFVHSU5fRElSLicvJy4kZjsKICAgICAgaWYoJEY9PT0nMScpeyBpZighZmlsZV9leGlzdHMoJHApKXsgJHJbJ3gnXVskZl09J07EllJBJzsgY29udGludWU7IH0gJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOyBwcmVnX21hdGNoKCcvUGx1Z2luIE5hbWU6XHMqKC4rKS8nLCRjLCRtKTsgcHJlZ19tYXRjaCgnL0Rlc2NyaXB0aW9uOlxzKiguKykvJywkYywkZCk7IHByZWdfbWF0Y2hfYWxsKCIvYWRkXyg/OmFjdGlvbnxmaWx0ZXIpXHMqXChccyonKFthLXowLTlfXC8tXSspJy8iLCRjLCRoKTsgJHJbJ3gnXVskZl09WyduJz0+dHJpbSgkbVsxXT8/JycpLCdkJz0+bWJfc3Vic3RyKHRyaW0oJGRbMV0/PycnKSwwLDE0MCksJ2hvb2tzJz0+YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCRoWzFdKSwwLDYpLCdhZG1pbl9tZW51Jz0+c3Vic3RyX2NvdW50KCRjLCdhZGRfbWVudV9wYWdlJykrc3Vic3RyX2NvdW50KCRjLCdhZGRfc3VibWVudV9wYWdlJyksJ2Nyb24nPT5zdWJzdHJfY291bnQoJGMsJ3dwX3NjaGVkdWxlX2V2ZW50JyldOyB9CiAgICAgIGlmKCRGPT09JzInKXsgaWYoIWlzX2RpcigkQSkpIG1rZGlyKCRBLDA3NTAsdHJ1ZSk7ICRyWyd4J11bJGZdPWZpbGVfZXhpc3RzKCRwKT8ocmVuYW1lKCRwLCRBLicvJy4kZik/J+KGkmFyY2h5dmFzJzonS0xBSURBJyk6J07EllJBJzsgfQogICAgICBpZigkRj09PSc5Jyl7ICRyWyd4J11bJGZdPWZpbGVfZXhpc3RzKCRBLicvJy4kZik/KHJlbmFtZSgkQS4nLycuJGYsJHApPydncsSFxb5pbnRhJzonS0xBSURBJyk6J07EllJBJzsgfQogICAgfQogICAgaWYoJEYhPT0nMScpeyAkaD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvP3BzX3Y9czE3ODJlJyksWyd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRyWydob21lJ109aXNfd3BfZXJyb3IoJGgpPyRoLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKTsgJGg9d3BfcmVtb3RlX2dldChhZG1pbl91cmwoJ2FkbWluLnBocD9wYWdlPXBzLWFuYWxpdGlrYScpLFsndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkclsnYWRtaW4nXT1pc193cF9lcnJvcigkaCk/JGgtPmdldF9lcnJvcl9tZXNzYWdlKCk6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGgpOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-154153';
const GKEY='ps_s1782e';
const PHASES=["1"];
const OUT='analize/s1782_e1.json';
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
