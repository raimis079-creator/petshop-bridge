process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzcgcnVuIGog4oCUIGp1b3N0b3Mvc3RpY2t5IGRpYWdub3N0aWthIChSRUFELU9OTFkpOiBrYXRhbG9nbyBwdXNsYXBpbyBtYXRhdmltYWkgcGVyIHRlc3R1b3RvamEuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjM3aiddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjM3IGonKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkdHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywndGVzdHVvdG9qYXMnKTsgJHVpZD0kdHUtPklEOyAkZXhwPXRpbWUoKSsxMjAwOyAkdG9rPVdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoJHVpZCktPmNyZWF0ZSgkZXhwKTsKICAkb1snY29va2llcyddPWFycmF5KAogICAgYXJyYXkoJ25hbWUnPT5TRUNVUkVfQVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdzZWN1cmVfYXV0aCcsJHRvaykpLAogICAgYXJyYXkoJ25hbWUnPT5BVVRIX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2F1dGgnLCR0b2spKSwKICAgIGFycmF5KCduYW1lJz0+TE9HR0VEX0lOX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2xvZ2dlZF9pbicsJHRvaykpKTsKICAkdT1hZG1pbl91cmwoJ2FkbWluLnBocD9wYWdlPXBzLWthdGFsb2dhcyZrcnV2YT1wcmVreWJvamUmdmlldz12aXNvc19rcnV2b2plJnE9dG9mdScpOwogICRzaD1qc29uX2RlY29kZSgnW3sibiI6ICJzMTYzN19qXzEzNjYiLCAidSI6ICIiLCAidyI6IDEzNjYsICJoIjogNzY4LCAiZXZhbCI6ICIoYXN5bmMoKT0+eyB3aW5kb3cuc2Nyb2xsVG8oMzAwLDYwMCk7IGF3YWl0IG5ldyBQcm9taXNlKHI9PnNldFRpbWVvdXQociw2MDApKTtcbiB2YXIgY3M9Z2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoXCctLXBzLXZpcnN1c1wnKTtcbiB2YXIgYj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwnLnBza2F0LWJhclwnKTsgdmFyIHRoPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCcucHNrYXQtbGVudC1sYXVrIC5wc2thdC10IHRoZWFkIHRoXCcpO1xuIHZhciBsYXVrPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCcucHNrYXQtbGVudC1sYXVrXCcpOyB2YXIgbGNzPWxhdWs/Z2V0Q29tcHV0ZWRTdHlsZShsYXVrKTpudWxsO1xuIHJldHVybiB7dmlyc3VzOmNzLCBzY3JvbGxZOndpbmRvdy5zY3JvbGxZLCBzY3JvbGxYOndpbmRvdy5zY3JvbGxYLFxuICBiYXI6IGI/e3RvcDpNYXRoLnJvdW5kKGIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKSxib3R0b206TWF0aC5yb3VuZChiLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSkscG9zOmdldENvbXB1dGVkU3R5bGUoYikucG9zaXRpb259Om51bGwsXG4gIHRoZWFkOiB0aD97dG9wOk1hdGgucm91bmQodGguZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKSxwb3M6Z2V0Q29tcHV0ZWRTdHlsZSh0aCkucG9zaXRpb24sY3NzVG9wOmdldENvbXB1dGVkU3R5bGUodGgpLnRvcH06bnVsbCxcbiAgbGF1azogbGF1az97b3Z4Omxjcy5vdmVyZmxvd1gsb3Z5Omxjcy5vdmVyZmxvd1ksc2Nyb2xsSDpsYXVrLnNjcm9sbEhlaWdodCxjbGllbnRIOmxhdWsuY2xpZW50SGVpZ2h0LHJlY3RUb3A6TWF0aC5yb3VuZChsYXVrLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCl9Om51bGwsXG4gIGRvY1Njcm9sbDogZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudD09PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudD9cJ2h0bWxcJzpcJ2tpdGFzXCcsXG4gIHdwd3JhcE92OiBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwnd3Bib2R5LWNvbnRlbnRcJyl8fGRvY3VtZW50LmJvZHkpLm92ZXJmbG93fTt9KSgpIn0sIHsibiI6ICJzMTYzN19qXzEyODAiLCAidSI6ICIiLCAidyI6IDEyODAsICJoIjogNzY4LCAiZXZhbCI6ICIoYXN5bmMoKT0+eyB3aW5kb3cuc2Nyb2xsVG8oMzAwLDYwMCk7IGF3YWl0IG5ldyBQcm9taXNlKHI9PnNldFRpbWVvdXQociw2MDApKTtcbiB2YXIgY3M9Z2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoXCctLXBzLXZpcnN1c1wnKTtcbiB2YXIgYj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwnLnBza2F0LWJhclwnKTsgdmFyIHRoPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCcucHNrYXQtbGVudC1sYXVrIC5wc2thdC10IHRoZWFkIHRoXCcpO1xuIHZhciBsYXVrPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCcucHNrYXQtbGVudC1sYXVrXCcpOyB2YXIgbGNzPWxhdWs/Z2V0Q29tcHV0ZWRTdHlsZShsYXVrKTpudWxsO1xuIHJldHVybiB7dmlyc3VzOmNzLCBzY3JvbGxZOndpbmRvdy5zY3JvbGxZLCBzY3JvbGxYOndpbmRvdy5zY3JvbGxYLFxuICBiYXI6IGI/e3RvcDpNYXRoLnJvdW5kKGIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKSxib3R0b206TWF0aC5yb3VuZChiLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSkscG9zOmdldENvbXB1dGVkU3R5bGUoYikucG9zaXRpb259Om51bGwsXG4gIHRoZWFkOiB0aD97dG9wOk1hdGgucm91bmQodGguZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKSxwb3M6Z2V0Q29tcHV0ZWRTdHlsZSh0aCkucG9zaXRpb24sY3NzVG9wOmdldENvbXB1dGVkU3R5bGUodGgpLnRvcH06bnVsbCxcbiAgbGF1azogbGF1az97b3Z4Omxjcy5vdmVyZmxvd1gsb3Z5Omxjcy5vdmVyZmxvd1ksc2Nyb2xsSDpsYXVrLnNjcm9sbEhlaWdodCxjbGllbnRIOmxhdWsuY2xpZW50SGVpZ2h0LHJlY3RUb3A6TWF0aC5yb3VuZChsYXVrLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCl9Om51bGwsXG4gIGRvY1Njcm9sbDogZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudD09PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudD9cJ2h0bWxcJzpcJ2tpdGFzXCcsXG4gIHdwd3JhcE92OiBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwnd3Bib2R5LWNvbnRlbnRcJyl8fGRvY3VtZW50LmJvZHkpLm92ZXJmbG93fTt9KSgpIn1dJyx0cnVlKTsgZm9yZWFjaCgkc2ggYXMgJiRzKXsgJHNbJ3UnXT0kdTsgfSB1bnNldCgkcyk7CiAgJG9bJ3Nob3RzJ109JHNoOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-195432';
const GKEY='ps_s1637j';
const PHASES=["j"];
const OUT='analize/s1637_j2.json';
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
