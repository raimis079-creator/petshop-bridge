process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI0eSByeXRhcyB2MS44OiBsZW1wdXRlICJyaW5raW5pYWkgYmUgbnVvdHJhdWtvcyIuIEZhemVzOiAxIGRyeSwgMiBwYXRjaCwgMyBwYXRpa3JhLCA5IGF0c3RhdHl0aSAoLmJha19zMTcyNGMpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyNHknXSkpIHJldHVybjsgJGY9KHN0cmluZykkX0dFVFsncHNfczE3MjR5J107ICRyPVsndic9PidTMTcyNHknLCdmYXplJz0+JGZdOyAkcnk9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1yeXRhcy5waHAnOyAkYXJjaD1kaXJuYW1lKHVudHJhaWxpbmdzbGFzaGl0KEFCU1BBVEgpKS4nL3BzLWFyY2h5dmFzJzsKICAkdG9rPWZ1bmN0aW9uKCRjb2RlKXsgdHJ5eyB0b2tlbl9nZXRfYWxsKCRjb2RlLFRPS0VOX1BBUlNFKTsgcmV0dXJuICdvayc7IH1jYXRjaChUaHJvd2FibGUgJGUpeyByZXR1cm4gJ0tMQUlEQSAnLiRlLT5nZXRNZXNzYWdlKCk7IH0gfTsKICAkYmxrPSJcdFx0Lyogcmlua2luaWFpIGJlIG51b3RyYXVrb3MgKFMxNzI0KTogcHVibGlrdW90aSBNbk0gcmlua2luaWFpLCBrdXJpxbMgdGh1bWJuYWlsIG7El3JhIGFyYmEgZmFpbG8gZGlza2UgbsSXcmEgKi9cblx0XHR0cnkge1xuXHRcdFx0XCRya18gPSBcJHdwZGItPmdldF9yZXN1bHRzKCBcIlNFTEVDVCBwLklELCBwLnBvc3RfdGl0bGUsIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHtcJHdwZGItPnBvc3RtZXRhfSBXSEVSRSBwb3N0X2lkID0gcC5JRCBBTkQgbWV0YV9rZXkgPSAnX3RodW1ibmFpbF9pZCcgTElNSVQgMSkgdGh1bWIgRlJPTSB7XCR3cGRiLT5wb3N0c30gcCBKT0lOIHtcJHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkID0gcC5JRCBKT0lOIHtcJHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQgPSB0ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teSA9ICdwcm9kdWN0X3R5cGUnIEpPSU4ge1wkd3BkYi0+dGVybXN9IHQgT04gdC50ZXJtX2lkID0gdHQudGVybV9pZCBBTkQgdC5zbHVnID0gJ21peC1hbmQtbWF0Y2gnIFdIRVJFIHAucG9zdF90eXBlID0gJ3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzID0gJ3B1Ymxpc2gnXCIsIEFSUkFZX0EgKTtcblx0XHRcdFwkYmVfID0gYXJyYXkoKTtcblx0XHRcdGZvcmVhY2ggKCAoYXJyYXkpIFwkcmtfIGFzIFwkeF8gKSB7IFwkdGlkXyA9IChpbnQpIFwkeF9bJ3RodW1iJ107IFwkb2tfID0gXCR0aWRfICYmICggXCRmcF8gPSBnZXRfYXR0YWNoZWRfZmlsZSggXCR0aWRfICkgKSAmJiBpc19maWxlKCBcJGZwXyApOyBpZiAoICEgXCRva18gKSB7IFwkcHJfID0gZnVuY3Rpb25fZXhpc3RzKCAnd2NfZ2V0X3Byb2R1Y3QnICkgPyB3Y19nZXRfcHJvZHVjdCggKGludCkgXCR4X1snSUQnXSApIDogbnVsbDsgXCRpaWRfID0gXCRwcl8gPyAoaW50KSBcJHByXy0+Z2V0X2ltYWdlX2lkKCkgOiAwOyBpZiAoICEgXCRpaWRfIHx8ICEgKCBcJGZwXyA9IGdldF9hdHRhY2hlZF9maWxlKCBcJGlpZF8gKSApIHx8ICEgaXNfZmlsZSggXCRmcF8gKSApIFwkYmVfW10gPSAnIycgLiBcJHhfWydJRCddIC4gJyAnIC4gbWJfc3Vic3RyKCBcJHhfWydwb3N0X3RpdGxlJ10sIDAsIDMwICk7IH0gfVxuXHRcdFx0XCRhZGQoICdyaW5raW5pYWlfZm90bycsIFwkYmVfID8gKCBjb3VudCggXCRiZV8gKSA+PSAzID8gJ3JhdWRvbmEnIDogJ2dlbHRvbmEnICkgOiAnemFsaWEnLCAnUmlua2luaWFpIGJlIG51b3RyYXVrb3M6ICcgLiBjb3VudCggXCRiZV8gKSAuICcgacWhICcgLiBjb3VudCggKGFycmF5KSBcJHJrXyApIC4gKCBcJGJlXyA/ICcg4oCUICcgLiBpbXBsb2RlKCAnLCAnLCBhcnJheV9zbGljZSggXCRiZV8sIDAsIDQgKSApIDogJycgKSApO1xuXHRcdH0gY2F0Y2ggKCBcXFRocm93YWJsZSBcJGVfICkgeyBcJGFkZCggJ3JpbmtpbmlhaV9mb3RvJywgJ3BpbGthJywgJ1JpbmtpbmlhaSBiZSBudW90cmF1a29zOiAnIC4gXCRlXy0+Z2V0TWVzc2FnZSgpICk7IH1cbiI7CiAgJHJwPWZ1bmN0aW9uKCRzKSB1c2UoJGJsayl7ICRzPXN0cl9yZXBsYWNlKCIgKiBWZXJzaW9uOiAxLjdcbiIsIiAqIFZlcnNpb246IDEuOFxuIiwkcywkYzEpOyAkYT0iXHRcdC8qIG5lacWhc2nFs3N0aSAqL1xuIjsgJHM9c3RyX3JlcGxhY2UoJGEsJGJsay4kYSwkcywkYzIpOyByZXR1cm4gWyRzLFskYzEsJGMyXV07IH07CiAgdHJ5ewogICAgaWYoJGY9PT0nMScpeyBsaXN0KCRwLCRjKT0kcnAoZmlsZV9nZXRfY29udGVudHMoJHJ5KSk7ICRyWydjb3VudHMnXT0kYzsgJHJbJ2xpbnQnXT0kdG9rKCRwKTsgJHJbJ2phdSddPXN0cnBvcyhmaWxlX2dldF9jb250ZW50cygkcnkpLCdyaW5raW5pYWlfZm90bycpIT09ZmFsc2U7ICRyWydtZDVfZGFiYXInXT1tZDVfZmlsZSgkcnkpOyB9CiAgICBpZigkZj09PScyJyl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRyeSk7IGxpc3QoJHAsJGMpPSRycCgkcyk7IGlmKCRjWzBdIT09MXx8JGNbMV0hPT0xfHwkdG9rKCRwKSE9PSdvaycpIHRocm93IG5ldyBFeGNlcHRpb24oJ3BhdGNoICcuanNvbl9lbmNvZGUoJGMpLicgJy4kdG9rKCRwKSk7IGlmKCFpc19maWxlKCRhcmNoLicvcGV0c2hvcC1yeXRhcy5waHAuYmFrX3MxNzI0YycpKSBjb3B5KCRyeSwkYXJjaC4nL3BldHNob3Atcnl0YXMucGhwLmJha19zMTcyNGMnKTsgZmlsZV9wdXRfY29udGVudHMoJHJ5LCRwKTsgJHJbJ21kNSddPW1kNV9maWxlKCRyeSk7ICR4PXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/cHNfaGI9Jy50aW1lKCkpLFsndGltZW91dCc9PjI1LCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkclsnaGVhcnRiZWF0J109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpOyBpZigkclsnaGVhcnRiZWF0J10hPT0yMDApeyBjb3B5KCRhcmNoLicvcGV0c2hvcC1yeXRhcy5waHAuYmFrX3MxNzI0YycsJHJ5KTsgJHJbJ1JPTExCQUNLJ109dHJ1ZTsgfSB9CiAgICBpZigkZj09PSczJyl7ICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX1J5dGFzJywncGF0aWtyb3MnKTsgJG0tPnNldEFjY2Vzc2libGUodHJ1ZSk7ICRwdD0kbS0+aW52b2tlKG51bGwpOyBmb3JlYWNoKCRwdCBhcyAkeCl7IGlmKGluX2FycmF5KCR4Wydrb2RhcyddLFsncmlua2luaWFpX2ZvdG8nLCdib3R1X3V6dHZhcmEnXSkpICRyWydsJ11bXT0keDsgfSAkclsnbiddPWNvdW50KCRwdCk7ICRyWydtZDUnXT1tZDVfZmlsZSgkcnkpOyB9CiAgICBpZigkZj09PSc5Jyl7IGNvcHkoJGFyY2guJy9wZXRzaG9wLXJ5dGFzLnBocC5iYWtfczE3MjRjJywkcnkpOyAkclsnbWQ1J109bWQ1X2ZpbGUoJHJ5KTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-112602';
const GKEY='ps_s1724y';
const PHASES=["1", "2"];
const OUT='analize/s1724_y.json';
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
