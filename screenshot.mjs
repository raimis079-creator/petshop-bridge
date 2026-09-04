process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTcgcnVuIHI0IChyZWNvbiwgdGlrIHNrYWl0eW1hcyk6IGZha3TFsyB2YXJpa2xpbyBgc2FuZGVsaXNgIGxvZ2lrYSAoa3VyICdsZWdhY3knKSwgcGFydGlqb3MgYGF2X3ByZWtlYC9gdXpzYWt5bW9fbnVyYXN5bWFzYCBiZSBwYXJ0aWrFsywgYmFjcyBudXN0YXR5bWFpL3PEhXNrYWl0b3MsIHRlbW9zIGBwZXRzaG9wX2dldF9pbnZvaWNlX2RvY3VtZW50X3R5cGVgICsgc3RhdHVzX2NoYW5nZWQsIGJhY3MgcHJvY2Vzc19wYXltZW50IHN0YXR1c2FzLCBwc19mYWt0X3V6c2FreW1haSBzdHVscGVsaWFpLCBBVl9Tb3VyY2U6OnJlc29sdmUgcGFzbGF1Z2FpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3I0J10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MTcgcjQnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgxMjApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkZ3JlcD1mdW5jdGlvbigkZmlsZSwkcGF0cywkY3R4PTIsJG1heD00MCl7ICRyPWFycmF5KCk7IGlmKCFmaWxlX2V4aXN0cygkZmlsZSkpIHJldHVybiAnTsSWUkEgJy4kZmlsZTsgJGw9ZmlsZSgkZmlsZSk7IGZvcmVhY2goJGwgYXMgJGk9PiRsbil7IGZvcmVhY2goKGFycmF5KSRwYXRzIGFzICRwdCl7IGlmKHByZWdfbWF0Y2goJHB0LCRsbikpeyAkcltdPSgkaSsxKS4nOiAnLnRyaW0oaW1wbG9kZSgnIOKPjiAnLGFycmF5X21hcCgndHJpbScsYXJyYXlfc2xpY2UoJGwsbWF4KDAsJGktJGN0eCksJGN0eCoyKzEpKSkpOyBicmVhazsgfSB9IGlmKGNvdW50KCRyKT49JG1heCkgYnJlYWs7IH0gcmV0dXJuICRyOyB9OwogICRtdT1XUE1VX1BMVUdJTl9ESVI7ICRmaz1nbG9iKCRtdS4nL3BldHNob3AtZmFrdCoucGhwJyk7ICRvWydmYWt0X2ZhaWxhaSddPWFycmF5X21hcCgnYmFzZW5hbWUnLCRmayk7CiAgZm9yZWFjaCgkZmsgYXMgJGYpeyAkb1snZmFrdF9zYW5kZWxpcyddW2Jhc2VuYW1lKCRmKV09JGdyZXAoJGYsYXJyYXkoJy9sZWdhY3kvaScsJy9zYW5kZWxpcy9pJyksMSw2MCk7IH0KICAkb1sncGFydGlqb3MnXT0kZ3JlcCgkbXUuJy9wZXRzaG9wLXBhcnRpam9zLnBocCcsYXJyYXkoJy9mdW5jdGlvbiBhdl9wcmVrZS8nLCcvZnVuY3Rpb24gdXpzYWt5bW9fbnVyYXN5bWFzLycsJy9wYXJ0aWooxbN8dSkgbijEl3xlKXJhL2knLCcvX3BzX3BhcnRpam9zX251cmFzeXRhLycpLDMsMjApOwogICRvWydzcmNfcmVzb2x2ZSddPSRncmVwKCRtdS4nL3BldHNob3AtYXYtc291cmNlLnBocCcsYXJyYXkoJy9mdW5jdGlvbiByZXNvbHZlLycsJy9sZWdhY3kvJyksMiwyMCk7CiAgZm9yZWFjaChnbG9iKCRtdS4nLyoucGhwJykgYXMgJGYpeyAkYz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHN0cnBvcygkYywnY2xhc3MgUGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2UnKSE9PWZhbHNlKXsgJG9bJ2ZzX2ZpbGUnXT1iYXNlbmFtZSgkZik7ICRvWydmcyddPSRncmVwKCRmLGFycmF5KCcvbGVnYWN5LycsJy9fcHNfc2FuZGVsaXMvJywnL2Z1bmN0aW9uIHJlc29sdmUvJyksMSw0MCk7IH0gfQogICRvWydiYWNzX3NldHRpbmdzJ109Z2V0X29wdGlvbignd29vY29tbWVyY2VfYmFjc19zZXR0aW5ncycpOyAkYWNjPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2JhY3NfYWNjb3VudHMnKTsgJG9bJ2JhY3NfYWNjb3VudHMnXT1pc19hcnJheSgkYWNjKT9hcnJheV9tYXAoZnVuY3Rpb24oJGEpeyByZXR1cm4gYXJyYXkoJ25hbWUnPT4kYVsnYWNjb3VudF9uYW1lJ10/PycnLCdiYW5rJz0+JGFbJ2JhbmtfbmFtZSddPz8nJywnaWJhbic9PiRhWydpYmFuJ10/PycnLCducic9PiRhWydhY2NvdW50X251bWJlciddPz8nJywnYmljJz0+JGFbJ2JpYyddPz8nJyk7IH0sJGFjYyk6JGFjYzsKICAkb1snYmFjc19wcCddPSRncmVwKFdQX1BMVUdJTl9ESVIuJy93b29jb21tZXJjZS9pbmNsdWRlcy9nYXRld2F5cy9iYWNzL2NsYXNzLXdjLWdhdGV3YXktYmFjcy5waHAnLGFycmF5KCcvZnVuY3Rpb24gcHJvY2Vzc19wYXltZW50LycsJy91cGRhdGVfc3RhdHVzLycsJy9wYXltZW50X2NvbXBsZXRlLycsJy9mdW5jdGlvbiB0aGFua3lvdV9wYWdlLycsJy9mdW5jdGlvbiBlbWFpbF9pbnN0cnVjdGlvbnMvJyksMiwyMCk7CiAgJHRoPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCc7ICRvWyd0ZW1hX2RvYyddPSRncmVwKCR0aCxhcnJheSgnL2Z1bmN0aW9uIHBldHNob3BfZ2V0X2ludm9pY2VfZG9jdW1lbnRfdHlwZS8nLCcvcHJvZm9ybWEvJywnL3dvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19jaGFuZ2VkLycpLDMsMzApOwogICRvWydmYWt0X3V6c19jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19mYWt0X3V6c2FreW1haSIpOyAkb1snZmFrdF9laWxfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfZmFrdF9laWx1dGVzIik7CiAgJG9bJ2Zha3RfMzU3OTMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBzX2Zha3RfdXpzYWt5bWFpIFdIRVJFIHV6c2FreW1hc19pZD0zNTc5MyBPUiB1enNha3ltYXM9MzU3OTMiLEFSUkFZX0EpOwogICRvWydzYW5kZWxpYWlfZmFrdHVvc2UnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzYW5kZWxpcyxDT1VOVCgqKSBuIEZST00geyRwfXBzX2Zha3RfZWlsdXRlcyBHUk9VUCBCWSBzYW5kZWxpcyIsQVJSQVlfQSk7CiAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpJiZtZXRob2RfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScsJ3Jlc29sdmUnKSl7IHRyeXsgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0FWX1NvdXJjZScsJ3Jlc29sdmUnKTsgJG9bJ2F2X3NvdXJjZV9zaWcnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeC0+Z2V0TmFtZSgpO30sJHJtLT5nZXRQYXJhbWV0ZXJzKCkpOyAkb1sncmVzb2x2ZV8zNTc5MCddPVBldHNob3BfQVZfU291cmNlOjpyZXNvbHZlKDM1NzkwKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydyZXNvbHZlX2VyciddPSRlLT5nZXRNZXNzYWdlKCk7IH0gfQogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2UnKSl7IHRyeXsgJG9bJ2Zmc18zNTc5MCddPVBldHNob3BfRnVsZmlsbG1lbnRfU291cmNlOjpyZXNvbHZlKDM1NzkwKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydmZnNfZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfSB9CiAgJG9bJ3ByZWtlXzM1NzkwJ109YXJyYXkoJ3NhbmRlbGlzJz0+Z2V0X3Bvc3RfbWV0YSgzNTc5MCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwnc3JjJz0+Z2V0X3Bvc3RfbWV0YSgzNTc5MCwnX3BzX3NvdXJjZScsdHJ1ZSksJ2xlZ2FjeV9tYW51Zic9PmdldF9wb3N0X21ldGEoMzU3OTAsJ19sZWdhY3lfbWFudWZhY3R1cmVyJyx0cnVlKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDk5KTsK';
const VER='dep-221724';
const GKEY='ps_r4';
const PHASES=["GO"];
const OUT='analize/s1617_r4.json';
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
