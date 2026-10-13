process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgyZCDCtyAxIFRFTVAgc25pcHBldMWzIGtvcGlqYSt0cnluaW1hcyDCtyAyIG11LXBsdWdpbsWzIG5hdWRvamltbyBza2VuYXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzgyZCddKSkgcmV0dXJuOyAkRj0oc3RyaW5nKSRfR0VUWydwc19zMTc4MmQnXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzgyZCcsJ2YnPT4kRl07CiAgdHJ5ewogICAgaWYoJEY9PT0nMScpewogICAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0wIEFORCBuYW1lIExJS0UgJ1RFTVAgUFMgZGVwLSUnIixBUlJBWV9BKTsgJHJbJ3Jhc3RhJ109Y291bnQoJHJvd3MpOwogICAgICAkZGlyPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcyc7IGlmKCFpc19kaXIoJGRpcikpICRkaXI9QUJTUEFUSC4nLi4vcHMtYXJjaHl2YXMnOyAkZm49JGRpci4nL3NuaXBwZXRzX3RlbXBfYmFrX3MxNzgyXycuZGF0ZSgnWW1kX0hpJykuJy5qc29uLmd6JzsKICAgICAgJG9rPWZpbGVfcHV0X2NvbnRlbnRzKCRmbixnemVuY29kZShqc29uX2VuY29kZSgkcm93cykpKTsgJHJbJ2JhayddPVskZm4sJG9rXTsgaWYoISRvaykgdGhyb3cgbmV3IEV4Y2VwdGlvbignYmFrIG5lcGF2eWtvJyk7CiAgICAgICRyWydpc3RyaW50YSddPSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0wIEFORCBuYW1lIExJS0UgJ1RFTVAgUFMgZGVwLSUnIik7ICRyWydsaWtvJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1zbmlwcGV0cyIpOwogICAgfQogICAgaWYoJEY9PT0nMicpewogICAgICAkZmlsZXM9W107IGZvcmVhY2goW1dQTVVfUExVR0lOX0RJUixXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJyxXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwnLGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpXSBhcyAkZCl7IGlmKCFpc19kaXIoJGQpKSBjb250aW51ZTsgZm9yZWFjaChuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQpKSBhcyAkZikgaWYoISRmLT5pc0RpcigpJiZwcmVnX21hdGNoKCcvXC4ocGhwfGpzKSQvJywkZi0+Z2V0RmlsZW5hbWUoKSkpICRmaWxlc1skZi0+Z2V0UGF0aG5hbWUoKV09ZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOyB9CiAgICAgICRzbmlwcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGNvZGUgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEiKTsgJGFsbD1pbXBsb2RlKCJcbiIsJGZpbGVzKS4iXG4iLmltcGxvZGUoIlxuIiwkc25pcHMpOwogICAgICAkY3JvbnM9X2dldF9jcm9uX2FycmF5KCk7ICRzY2hlZD1bXTsgZm9yZWFjaCgkY3JvbnMgYXMgJHRzPT4kaHMpIGZvcmVhY2goJGhzIGFzICRoPT4keCkgJHNjaGVkWyRoXT1taW4oJHNjaGVkWyRoXT8/UEhQX0lOVF9NQVgsJHRzKTsKICAgICAgJHRhYnM9YXJyYXlfbWFwKGZuKCR4KT0+JHhbMF0sJHdwZGItPmdldF9yZXN1bHRzKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfJSciLEFSUkFZX04pKTsgJGNudD1bXTsgZm9yZWFjaCgkdGFicyBhcyAkdCl7ICRjbnRbc3Vic3RyKCR0LHN0cmxlbigkUCkpXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJHRgIik7IH0KICAgICAgJHJbJ3RibF9jbnQnXT0kY250OwogICAgICBmb3JlYWNoKG5ldyBEaXJlY3RvcnlJdGVyYXRvcihXUE1VX1BMVUdJTl9ESVIpIGFzICRmKXsgaWYoJGYtPmlzRGlyKCl8fHN1YnN0cigkZi0+Z2V0RmlsZW5hbWUoKSwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkcD0kZi0+Z2V0UGF0aG5hbWUoKTsgJGM9JGZpbGVzWyRwXT8/ZmlsZV9nZXRfY29udGVudHMoJHApOyAkb3RoZXJzPXN0cl9yZXBsYWNlKCRjLCcnLCRhbGwpOwogICAgICAgIHByZWdfbWF0Y2hfYWxsKCIvXlxzKmNsYXNzXHMrKFtBLVpdW0EtWmEtejAtOV9dKykvbSIsJGMsJGNsKTsgcHJlZ19tYXRjaF9hbGwoIi9eXHMqZnVuY3Rpb25ccysoW2Etel9dW2EtejAtOV9dKylccypcKC9tIiwkYywkZm4pOwogICAgICAgICRyZWZzPTA7ICRieT1bXTsgZm9yZWFjaChhcnJheV9tZXJnZSgkY2xbMV0sJGZuWzFdKSBhcyAkc3ltKXsgaWYoc3RybGVuKCRzeW0pPDYpIGNvbnRpbnVlOyAkbj1wcmVnX21hdGNoX2FsbCgnL1xiJy5wcmVnX3F1b3RlKCRzeW0sJy8nKS4nXGIvJywkb3RoZXJzKTsgaWYoJG4peyAkcmVmcys9JG47IH0gfQogICAgICAgIGlmKCRyZWZzKXsgZm9yZWFjaCgkZmlsZXMgYXMgJGZwPT4kZmMpeyBpZigkZnA9PT0kcCkgY29udGludWU7IGZvcmVhY2goJGNsWzFdIGFzICRzeW0pIGlmKHN0cmxlbigkc3ltKT41JiZzdHJwb3MoJGZjLCRzeW0pIT09ZmFsc2UpeyAkYnlbXT1iYXNlbmFtZSgkZnApOyBicmVhazsgfSB9IH0KICAgICAgICBwcmVnX21hdGNoX2FsbCgiL2FkZF9hY3Rpb25ccypcKFxzKicoW2EtejAtOV9dKyknLyIsJGMsJGFjKTsgJGhvb2tzPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGFjWzFdKSk7ICRjcm9uPVtdOyBmb3JlYWNoKCRob29rcyBhcyAkaCkgaWYoaXNzZXQoJHNjaGVkWyRoXSkpICRjcm9uWyRoXT1kYXRlKCdtLWQgSDppJywkc2NoZWRbJGhdKTsKICAgICAgICBwcmVnX21hdGNoX2FsbCgiLyhwc19bYS16MC05X10rKS8iLCRjLCR0Yik7ICR0PVtdOyBmb3JlYWNoKGFycmF5X3VuaXF1ZSgkdGJbMV0pIGFzICR4KSBpZihpc3NldCgkY250WyR4XSkpICR0WyR4XT0kY250WyR4XTsKICAgICAgICBwcmVnX21hdGNoX2FsbCgiLyg/OmdldHx1cGRhdGUpX29wdGlvblxzKlwoXHMqJyhwc19bYS16MC05X10rKScvIiwkYywkb3ApOyAkb3B0cz1bXTsgZm9yZWFjaChhcnJheV91bmlxdWUoJG9wWzFdKSBhcyAkbyl7ICR2PWdldF9vcHRpb24oJG8sbnVsbCk7IGlmKCR2IT09bnVsbCkgJG9wdHNbJG9dPWlzX3NjYWxhcigkdik/bWJfc3Vic3RyKChzdHJpbmcpJHYsMCwyNSk6J1snLmNvdW50KChhcnJheSkkdikuJ10nOyB9CiAgICAgICAgJHJbJ211J11bJGYtPmdldEZpbGVuYW1lKCldPVsncmVmcyc9PiRyZWZzLCdieSc9PmFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGJ5KSksJ2hvb2tzJz0+Y291bnQoJGhvb2tzKSwnY3Jvbic9PiRjcm9uLCd0YmwnPT4kdCwnb3B0Jz0+YXJyYXlfc2xpY2UoJG9wdHMsMCw2KSwna2InPT5yb3VuZChzdHJsZW4oJGMpLzEwMjQpLCdtJz0+ZGF0ZSgnbS1kJywkZi0+Z2V0TVRpbWUoKSksJ24nPT5wcmVnX21hdGNoKCcvUGx1Z2luIE5hbWU6XHMqKC4rKS8nLCRjLCRtKT9tYl9zdWJzdHIodHJpbSgkbVsxXSksMCw4MCk6JyddOwogICAgICB9CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-152151';
const GKEY='ps_s1782d';
const PHASES=["1", "2"];
const OUT='analize/s1782_d.json';
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
