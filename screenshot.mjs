process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzUgZSDigJQgRTogY2FydF9hYmFuZG9uZWQgYmUgZWwuIHBhc3RvIG5lYmVrZWxpYW07IFQ6IHBhdGlrcmEuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmID0gaXNzZXQoJF9HRVRbJ3BzX3MxNjc1ZSddKSA/ICRfR0VUWydwc19zMTY3NWUnXSA6ICcnOwogIGlmICgkZiE9PSdFJyAmJiAkZiE9PSdUJykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE2NzUgZScsJ2ZhemUnPT4kZik7CiAgJHA9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1jYXJ0LWFiYW5kb25tZW50LnBocCc7CiAgdHJ5ewogICAgaWYoJGY9PT0nRScpewogICAgICAkYz1maWxlX2dldF9jb250ZW50cygkcCk7ICRvWydtZDVfcHJpZXMnXT1tZDUoJGMpOwogICAgICAkc2VuYXMgPSAiXHRcdFx0XCRwYXlsb2FkID0gc2VsZjo6YnVpbGRfcGF5bG9hZCggXCRyb3csIFwkdmFsaWQgKTtcbiIKICAgICAgICAgICAgIC4gIlx0XHRcdFwkZW0gPSBQZXRzaG9wX0V2ZW50X1JlZ2lzdHJ5OjplbWl0KFxuIgogICAgICAgICAgICAgLiAiXHRcdFx0XHQnY2FydF9hYmFuZG9uZWQnLFxuIgogICAgICAgICAgICAgLiAiXHRcdFx0XHRcJHJvd1snZW1haWwnXSA/IFwkcm93WydlbWFpbCddIDogJycsXG4iCiAgICAgICAgICAgICAuICJcdFx0XHRcdFwkcGF5bG9hZCxcbiIKICAgICAgICAgICAgIC4gIlx0XHRcdFx0YXJyYXkoICdldmVudF9pZCcgPT4gJ2NhcnRfYWJhbmRvbmVkXycgLiBcJGNhcnRfaWQgKVxuIgogICAgICAgICAgICAgLiAiXHRcdFx0KTtcbiIKICAgICAgICAgICAgIC4gIlx0XHRcdGlmICggISBlbXB0eSggXCRlbVsnb2snXSApIHx8ICEgaXNzZXQoIFwkZW1bJ29rJ10gKSApIHsgXCRvdXRbJ2V2ZW50cyddKys7IH0iOwogICAgICAkbmF1amFzID0gIlx0XHRcdFwkcGF5bG9hZCA9IHNlbGY6OmJ1aWxkX3BheWxvYWQoIFwkcm93LCBcJHZhbGlkICk7XG4iCiAgICAgICAgICAgICAuICJcdFx0XHQvKiBTMTY3NTogQkUgRUwuIFBBU1RPIEVWRU5UTyBORUJFS0VMSUFNLlxuIgogICAgICAgICAgICAgLiAiXHRcdFx0ICAgU2VuZGVyIGF0bWV0YSB0b2tpYSB1emtsYXVzYSAodmFsaWRhdGlvbjogc3Vic2NyaWJlciBtdXN0IGNvbnRhaW5cbiIKICAgICAgICAgICAgIC4gIlx0XHRcdCAgIGF0IGxlYXN0IG9uZSBvZjogaWQsIGVtYWlsLCBvciBwaG9uZSksIGlyYXNhcyBtaXJkYXZvIGBkZWFkYCwgb1xuIgogICAgICAgICAgICAgLiAiXHRcdFx0ICAgc2FyZ2FzIHNpdXNkYXZvIGxhaXNrYS4gU3ZlY2lvIGtyZXBzZWxpcyBiZSBhZHJlc28gbmVyYSBnZWRpbWFzIOKAlFxuIgogICAgICAgICAgICAgLiAiXHRcdFx0ICAgbmVyYSBrYW0gc2l1c3RpLiBLcmVwc2VsaXMgdmlzIHRpZWsgcGF6eW1pbWFzIGBhYmFuZG9uZWRgXG4iCiAgICAgICAgICAgICAuICJcdFx0XHQgICAoc3RhdGlzdGlrYSBpc2xpZWthKSwgdGlrIGkgRVNQIG5la2VsaWF1amFtLlxuIgogICAgICAgICAgICAgLiAiXHRcdFx0ICAgS2l0aSBlbWl0ZXJpYWkgKG9yZGVyX3BhaWQsIG9yZGVyX3NoaXBwZWQpIHRhaXAgZWxnaWFzaSBudW8gcHJhZHppdS4gKi9cbiIKICAgICAgICAgICAgIC4gIlx0XHRcdGlmICggXCRyb3dbJ2VtYWlsJ10gKSB7XG4iCiAgICAgICAgICAgICAuICJcdFx0XHRcdFwkZW0gPSBQZXRzaG9wX0V2ZW50X1JlZ2lzdHJ5OjplbWl0KFxuIgogICAgICAgICAgICAgLiAiXHRcdFx0XHRcdCdjYXJ0X2FiYW5kb25lZCcsXG4iCiAgICAgICAgICAgICAuICJcdFx0XHRcdFx0XCRyb3dbJ2VtYWlsJ10sXG4iCiAgICAgICAgICAgICAuICJcdFx0XHRcdFx0XCRwYXlsb2FkLFxuIgogICAgICAgICAgICAgLiAiXHRcdFx0XHRcdGFycmF5KCAnZXZlbnRfaWQnID0+ICdjYXJ0X2FiYW5kb25lZF8nIC4gXCRjYXJ0X2lkIClcbiIKICAgICAgICAgICAgIC4gIlx0XHRcdFx0KTtcbiIKICAgICAgICAgICAgIC4gIlx0XHRcdFx0aWYgKCAhIGVtcHR5KCBcJGVtWydvayddICkgfHwgISBpc3NldCggXCRlbVsnb2snXSApICkgeyBcJG91dFsnZXZlbnRzJ10rKzsgfVxuIgogICAgICAgICAgICAgLiAiXHRcdFx0fSI7CiAgICAgICRuPXN1YnN0cl9jb3VudCgkYywkc2VuYXMpOyAkb1sncmFkaW5pYWknXT0kbjsKICAgICAgaWYoJG4hPT0xKXsgJG9bJ0tMQUlEQSddPSdyYWRvICcuJG47IHdwX3NlbmRfanNvbigkbyk7IH0KICAgICAgJGM9c3RyX3JlcGxhY2UoJHNlbmFzLCRuYXVqYXMsJGMpOwogICAgICBpZighQHRva2VuX2dldF9hbGwoJGMsIFRPS0VOX1BBUlNFKSl7ICRvWydLTEFJREEnXT0nVE9LRU5fUEFSU0UnOyB3cF9zZW5kX2pzb24oJG8pOyB9CiAgICAgICRiYWs9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRiYWspKSBAbWtkaXIoJGJhaywwNzU1LHRydWUpOwogICAgICBmaWxlX3B1dF9jb250ZW50cygkYmFrLicvY2xhc3MtY2FydC1hYmFuZG9ubWVudC5waHAuYmFrX3MxNjc1JywgZmlsZV9nZXRfY29udGVudHMoJHApKTsKICAgICAgZmlsZV9wdXRfY29udGVudHMoJHAsJGMpOyAkb1snbWQ1X3BvJ109bWQ1KGZpbGVfZ2V0X2NvbnRlbnRzKCRwKSk7CiAgICB9IGVsc2UgewogICAgICAkdD0kd3BkYi0+cHJlZml4Lidwc19ldmVudF9sb2cnOwogICAgICAkb1snZGVhZF9iZV9wYXN0byddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIGV2ZW50X25hbWU9J2NhcnRfYWJhbmRvbmVkJyBBTkQgc3RhdHVzPSdkZWFkJyBBTkQgKGVtYWlsPScnIE9SIGVtYWlsIElTIE5VTEwpIik7CiAgICAgICRvWydzYXVzYXMnXT1QZXRzaG9wX0NhcnRfQWJhbmRvbm1lbnQ6OmRldGVjdCh0cnVlKTsKICAgICAgJG9bJ2Zyb250J109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MTUpKSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-202411';
const GKEY='ps_s1675e';
const PHASES=["E", "T"];
const OUT='analize/s1675_e.json';
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
