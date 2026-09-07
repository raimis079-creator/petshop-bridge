process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzcgcnVuIGog4oCUIGp1b3N0b3Mvc3RpY2t5IGRpYWdub3N0aWthIChSRUFELU9OTFkpOiBrYXRhbG9nbyBwdXNsYXBpbyBtYXRhdmltYWkgcGVyIHRlc3R1b3RvamEuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjM3aiddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjM3IGonKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkdHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywndGVzdHVvdG9qYXMnKTsgJHVpZD0kdHUtPklEOyAkZXhwPXRpbWUoKSsxMjAwOyAkdG9rPVdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoJHVpZCktPmNyZWF0ZSgkZXhwKTsKICAkb1snY29va2llcyddPWFycmF5KAogICAgYXJyYXkoJ25hbWUnPT5TRUNVUkVfQVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdzZWN1cmVfYXV0aCcsJHRvaykpLAogICAgYXJyYXkoJ25hbWUnPT5BVVRIX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2F1dGgnLCR0b2spKSwKICAgIGFycmF5KCduYW1lJz0+TE9HR0VEX0lOX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2xvZ2dlZF9pbicsJHRvaykpKTsKICAkdT1hZG1pbl91cmwoJ2FkbWluLnBocD9wYWdlPXBzLWthdGFsb2dhcyZrcnV2YT1wcmVreWJvamUmdmlldz12aXNvc19rcnV2b2plJnE9dG9mdScpOwogICRzaD1qc29uX2RlY29kZSgnW3sibiI6ICJzMTYzN19qXzE3NjAiLCAidSI6ICIiLCAidyI6IDE3NjAsICJoIjogODIwLCAiZXZhbCI6ICIoYXN5bmMoKT0+eyB3aW5kb3cuc2Nyb2xsVG8oMCw2MDApOyBhd2FpdCBuZXcgUHJvbWlzZShyPT5zZXRUaW1lb3V0KHIsNjAwKSk7XG4gdmFyIGNzPWdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKFwnLS1wcy12aXJzdXNcJyk7XG4gdmFyIGI9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcJy5wc2thdC1iYXJcJyk7IHZhciB0aD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwnLnBza2F0LWxlbnQtbGF1ayAucHNrYXQtdCB0aGVhZCB0aFwnKTtcbiB2YXIgbGF1az1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwnLnBza2F0LWxlbnQtbGF1a1wnKTsgdmFyIGxjcz1sYXVrP2dldENvbXB1dGVkU3R5bGUobGF1ayk6bnVsbDtcbiByZXR1cm4ge3ZpcnN1czpjcywgc2Nyb2xsWTp3aW5kb3cuc2Nyb2xsWSwgc2Nyb2xsWDp3aW5kb3cuc2Nyb2xsWCxcbiAgYmFyOiBiP3t0b3A6TWF0aC5yb3VuZChiLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCksYm90dG9tOk1hdGgucm91bmQoYi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20pLHBvczpnZXRDb21wdXRlZFN0eWxlKGIpLnBvc2l0aW9ufTpudWxsLFxuICB0aGVhZDogdGg/e3RvcDpNYXRoLnJvdW5kKHRoLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCkscG9zOmdldENvbXB1dGVkU3R5bGUodGgpLnBvc2l0aW9uLGNzc1RvcDpnZXRDb21wdXRlZFN0eWxlKHRoKS50b3B9Om51bGwsXG4gIGxhdWs6IGxhdWs/e292eDpsY3Mub3ZlcmZsb3dYLG92eTpsY3Mub3ZlcmZsb3dZLHNjcm9sbEg6bGF1ay5zY3JvbGxIZWlnaHQsY2xpZW50SDpsYXVrLmNsaWVudEhlaWdodCxyZWN0VG9wOk1hdGgucm91bmQobGF1ay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApfTpudWxsLFxuICBkb2NTY3JvbGw6IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQ9PT1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ/XCdodG1sXCc6XCdraXRhc1wnLFxuICB3cHdyYXBPdjogZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcJ3dwYm9keS1jb250ZW50XCcpfHxkb2N1bWVudC5ib2R5KS5vdmVyZmxvd307fSkoKSJ9LCB7Im4iOiAiczE2Mzdfal8xNzYwX2h4IiwgInUiOiAiIiwgInciOiAxNzYwLCAiaCI6IDgyMCwgImV2YWwiOiAiKGFzeW5jKCk9Pnsgd2luZG93LnNjcm9sbFRvKDQwMCw2MDApOyBhd2FpdCBuZXcgUHJvbWlzZShyPT5zZXRUaW1lb3V0KHIsNjAwKSk7XG4gdmFyIGNzPWdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKFwnLS1wcy12aXJzdXNcJyk7XG4gdmFyIGI9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcJy5wc2thdC1iYXJcJyk7IHZhciB0aD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwnLnBza2F0LWxlbnQtbGF1ayAucHNrYXQtdCB0aGVhZCB0aFwnKTtcbiB2YXIgbGF1az1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwnLnBza2F0LWxlbnQtbGF1a1wnKTsgdmFyIGxjcz1sYXVrP2dldENvbXB1dGVkU3R5bGUobGF1ayk6bnVsbDtcbiByZXR1cm4ge3ZpcnN1czpjcywgc2Nyb2xsWTp3aW5kb3cuc2Nyb2xsWSwgc2Nyb2xsWDp3aW5kb3cuc2Nyb2xsWCxcbiAgYmFyOiBiP3t0b3A6TWF0aC5yb3VuZChiLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCksYm90dG9tOk1hdGgucm91bmQoYi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20pLHBvczpnZXRDb21wdXRlZFN0eWxlKGIpLnBvc2l0aW9ufTpudWxsLFxuICB0aGVhZDogdGg/e3RvcDpNYXRoLnJvdW5kKHRoLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCkscG9zOmdldENvbXB1dGVkU3R5bGUodGgpLnBvc2l0aW9uLGNzc1RvcDpnZXRDb21wdXRlZFN0eWxlKHRoKS50b3B9Om51bGwsXG4gIGxhdWs6IGxhdWs/e292eDpsY3Mub3ZlcmZsb3dYLG92eTpsY3Mub3ZlcmZsb3dZLHNjcm9sbEg6bGF1ay5zY3JvbGxIZWlnaHQsY2xpZW50SDpsYXVrLmNsaWVudEhlaWdodCxyZWN0VG9wOk1hdGgucm91bmQobGF1ay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApfTpudWxsLFxuICBkb2NTY3JvbGw6IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQ9PT1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ/XCdodG1sXCc6XCdraXRhc1wnLFxuICB3cHdyYXBPdjogZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcJ3dwYm9keS1jb250ZW50XCcpfHxkb2N1bWVudC5ib2R5KS5vdmVyZmxvd307fSkoKSJ9LCB7Im4iOiAiczE2Mzdfal8xOTA3IiwgInUiOiAiIiwgInciOiAxOTA3LCAiaCI6IDkwMCwgImV2YWwiOiAiKGFzeW5jKCk9Pnsgd2luZG93LnNjcm9sbFRvKDAsNjAwKTsgYXdhaXQgbmV3IFByb21pc2Uocj0+c2V0VGltZW91dChyLDYwMCkpO1xuIHZhciBjcz1nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShcJy0tcHMtdmlyc3VzXCcpO1xuIHZhciBiPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCcucHNrYXQtYmFyXCcpOyB2YXIgdGg9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcJy5wc2thdC1sZW50LWxhdWsgLnBza2F0LXQgdGhlYWQgdGhcJyk7XG4gdmFyIGxhdWs9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcJy5wc2thdC1sZW50LWxhdWtcJyk7IHZhciBsY3M9bGF1az9nZXRDb21wdXRlZFN0eWxlKGxhdWspOm51bGw7XG4gcmV0dXJuIHt2aXJzdXM6Y3MsIHNjcm9sbFk6d2luZG93LnNjcm9sbFksIHNjcm9sbFg6d2luZG93LnNjcm9sbFgsXG4gIGJhcjogYj97dG9wOk1hdGgucm91bmQoYi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApLGJvdHRvbTpNYXRoLnJvdW5kKGIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tKSxwb3M6Z2V0Q29tcHV0ZWRTdHlsZShiKS5wb3NpdGlvbn06bnVsbCxcbiAgdGhlYWQ6IHRoP3t0b3A6TWF0aC5yb3VuZCh0aC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApLHBvczpnZXRDb21wdXRlZFN0eWxlKHRoKS5wb3NpdGlvbixjc3NUb3A6Z2V0Q29tcHV0ZWRTdHlsZSh0aCkudG9wfTpudWxsLFxuICBsYXVrOiBsYXVrP3tvdng6bGNzLm92ZXJmbG93WCxvdnk6bGNzLm92ZXJmbG93WSxzY3JvbGxIOmxhdWsuc2Nyb2xsSGVpZ2h0LGNsaWVudEg6bGF1ay5jbGllbnRIZWlnaHQscmVjdFRvcDpNYXRoLnJvdW5kKGxhdWsuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKX06bnVsbCxcbiAgZG9jU2Nyb2xsOiBkb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50PT09ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50P1wnaHRtbFwnOlwna2l0YXNcJyxcbiAgd3B3cmFwT3Y6IGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCd3cGJvZHktY29udGVudFwnKXx8ZG9jdW1lbnQuYm9keSkub3ZlcmZsb3d9O30pKCkifV0nLHRydWUpOyBmb3JlYWNoKCRzaCBhcyAmJHMpeyAkc1sndSddPSR1OyB9IHVuc2V0KCRzKTsKICAkb1snc2hvdHMnXT0kc2g7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-195139';
const GKEY='ps_s1637j';
const PHASES=["j"];
const OUT='analize/s1637_j.json';
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
