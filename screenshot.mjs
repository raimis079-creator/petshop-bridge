process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI0byBzbmlwcGV0IDU2NSBwYXRjaCAyOiBwcmFsZWlzdGkga2FpIG5ld19xdHk9PT1vbGRfcXR5IChpciBEUk9QUEVEIHN1IDApLiBGYXplczogMSBwYXRjaCtsaW50LCAzIGFwcGx5IHRlc3RhcyB2aXNvbXMgKG9mZnNldCBjaWtsYXMga2FpcCBjcm9uKSwgOSBhdHN0YXR5dGkgaXMgcHNfczE3MjRfc25pcDU2NV9iYWsgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzI0byddKSkgcmV0dXJuOyAkZj0oc3RyaW5nKSRfR0VUWydwc19zMTcyNG8nXTsgJHI9Wyd2Jz0+J1MxNzI0bycsJ2ZhemUnPT4kZl07IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgQHNldF90aW1lX2xpbWl0KDE3MCk7CiAgJHRvaz1mdW5jdGlvbigkY29kZSl7IHRyeXsgdG9rZW5fZ2V0X2FsbCgiPD9waHBcbiIuJGNvZGUsVE9LRU5fUEFSU0UpOyByZXR1cm4gJ29rJzsgfWNhdGNoKFRocm93YWJsZSAkZSl7IHJldHVybiAnS0xBSURBICcuJGUtPmdldE1lc3NhZ2UoKTsgfSB9OwogICRzZW49ImlmICggXCRyZWFzb24gPT09ICdSRUZSRVNIX1NUQU1QX09OTFknICYmIChpbnQpIGdldF9wb3N0X21ldGEoIFwkcGlkLCAnX3N0b2NrJywgdHJ1ZSApID09PSBcJGV4cF9xdHlfIjsKICAkbmF1PSJpZiAoIFwkbmV3X3F0eSA9PT0gXCRvbGRfcXR5ICYmIChpbnQpIGdldF9wb3N0X21ldGEoIFwkcGlkLCAnX3N0b2NrJywgdHJ1ZSApID09PSBcJGV4cF9xdHlfIjsKICB0cnl7CiAgICAkY29kZT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgaWQ9NTY1Iik7ICRyWydtZDVfZGFiYXInXT1tZDUoJGNvZGUpOwogICAgaWYoJGY9PT0nMScpeyAkbj1zdWJzdHJfY291bnQoJGNvZGUsJHNlbik7ICRyWydzZW5fa2llayddPSRuOyBpZigkbiE9PTEpIHRocm93IG5ldyBFeGNlcHRpb24oJ2Jsb2thcyBuZSAxeCcpOyAkcD1zdHJfcmVwbGFjZSgkc2VuLCRuYXUsJGNvZGUpOyBpZigkdG9rKCRwKSE9PSdvaycpIHRocm93IG5ldyBFeGNlcHRpb24oJ2xpbnQnKTsgJHdwZGItPnVwZGF0ZSgieyRQfXNuaXBwZXRzIixbJ2NvZGUnPT4kcCwnbW9kaWZpZWQnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldLFsnaWQnPT41NjVdKTsgd3BfY2FjaGVfZmx1c2goKTsgJHJbJ21kNV9wbyddPW1kNSgkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgaWQ9NTY1IikpOyAkeD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvP3BzX2hiPScudGltZSgpKSxbJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJHJbJ2hlYXJ0YmVhdCddPWlzX3dwX2Vycm9yKCR4KT8keC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCk7IH0KICAgIGlmKCRmPT09JzMnKXsgJGN2MD1jb3VudCgoYXJyYXkpZ2V0X29wdGlvbigncHNfY2FjaGVfdmFseW1haScpKTsgJG9mZnNldD0wOyAkdG90PVsnc2Nhbm5lZCc9PjAsJ2FwcGxpZWQnPT4wLCdza2lwcGVkX3NhbWUnPT4wLCdjaGFuZ2UnPT4wLCd6ZXJvJz0+MF07ICRzYWZlPTIwOyB3aGlsZSgkc2FmZS0tPjApeyAkYT1wZXRzaG9wX3ZmX3N5bmNfc3RvY2soJ2FwcGx5JywyMDAsJG9mZnNldCxbXSk7IGlmKGlzc2V0KCRhWydlcnJvciddKSl7ICRyWydlcnJvciddPSRhWydlcnJvciddOyBicmVhazsgfSAkcz0kYVsnc3RhdHMnXTsgJHRvdFsnc2Nhbm5lZCddKz0kc1sncHJvZHVjdHNfc2Nhbm5lZCddOyAkdG90WydhcHBsaWVkJ10rPSRzWydhcHBsaWVkJ107ICR0b3RbJ3NraXBwZWRfc2FtZSddKz0oJHNbJ3NraXBwZWRfc2FtZSddPz8wKTsgJHRvdFsnY2hhbmdlJ10rPSRzWyd3b3VsZF9jaGFuZ2VfcXR5J107ICR0b3RbJ3plcm8nXSs9JHNbJ3dvdWxkX3plcm9fb3V0J107IGlmKCRzWydwcm9kdWN0c19zY2FubmVkJ108MjAwKSBicmVhazsgJG9mZnNldCs9MjAwOyB9ICRyWyd2aXNvJ109JHRvdDsgJHJbJ2NhY2hlX3ZhbHltYWlfbmF1amknXT1jb3VudCgoYXJyYXkpZ2V0X29wdGlvbigncHNfY2FjaGVfdmFseW1haScpKS0kY3YwOyAkY3Y9KGFycmF5KWdldF9vcHRpb24oJ3BzX2NhY2hlX3ZhbHltYWknKTsgJHJbJ2NhY2hlX3Bhc2snXT1hcnJheV9zbGljZSgkY3YsLTEpOyAkclsnbW9kXzVtaW4nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X21vZGlmaWVkPj1OT1coKS1JTlRFUlZBTCA1IE1JTlVURSIpOyAkclsnbGFpa2FzJ109Y3VycmVudF90aW1lKCdteXNxbCcpOyB9CiAgICBpZigkZj09PSc5Jyl7ICRiPWdldF9vcHRpb24oJ3BzX3MxNzI0X3NuaXA1NjVfYmFrJyk7IGlmKCRiKXsgJHdwZGItPnVwZGF0ZSgieyRQfXNuaXBwZXRzIixbJ2NvZGUnPT5nenVuY29tcHJlc3MoYmFzZTY0X2RlY29kZSgkYlsnY29kZSddKSksJ25hbWUnPT4kYlsnbmFtZSddXSxbJ2lkJz0+NTY1XSk7IHdwX2NhY2hlX2ZsdXNoKCk7ICRyWydhdHN0YXR5dGEnXT1tZDUoJHdwZGItPmdldF92YXIoIlNFTEVDVCBjb2RlIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGlkPTU2NSIpKT09PSRiWydtZDUnXTsgfSB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-104127';
const GKEY='ps_s1724o';
const PHASES=["1", "3"];
const OUT='analize/s1724_o.json';
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
