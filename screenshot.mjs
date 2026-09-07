process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgdGY3IOKAlCAxNyBmaWtzdW90xbMgTW5NIHJpbmtpbmnFsyAocG8gMSBrdmFwxIUgw5c4LCDiiJIxMCUpOiBrYXQuIERBVUdJQVU9UElHSUFVID4g4oCeS3JhaWthcyBkYXVnaWF1PXBpZ2lhdSIsIGZvdG8gacWhIHZpZW5ldGluxJdzLiBQYXRpa3JhLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTYzNXRmNyddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2MzUgdGY3Jyk7CiAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJFZBSUtBST1hcnJheSgxNzcwNywxNzcwNCwxNzcwMSwxNzY5OCwxNzY5NSwxNzY5MiwxNzY4OSwxNzY4NiwxNzY4MywxNzY4MCwxNzY3NywxNzY3NCwxNzY3MSwxNzY2OCwxNzY2NSwxNzY2MiwxNzY1OSk7CiAgJHRldmFzPShpbnQpZ2V0X3Rlcm0oOTksJ3Byb2R1Y3RfY2F0JyktPnBhcmVudDsgJG9bJ2RwX3RldmFzJ109JHRldmFzOwogICR0PWdldF90ZXJtX2J5KCduYW1lJywnS3JhaWthcyBkYXVnaWF1PXBpZ2lhdScsJ3Byb2R1Y3RfY2F0Jyk7CiAgaWYoISR0KXsgJHI9d3BfaW5zZXJ0X3Rlcm0oJ0tyYWlrYXMgZGF1Z2lhdT1waWdpYXUnLCdwcm9kdWN0X2NhdCcsYXJyYXkoJ3BhcmVudCc9PiR0ZXZhcykpOyAka3Q9aXNfd3BfZXJyb3IoJHIpPzA6JHJbJ3Rlcm1faWQnXTsgfSBlbHNlICRrdD0kdC0+dGVybV9pZDsKICAkb1sna2F0X2lkJ109JGt0OyAkdGI9JHAuJ3djX21ubV9jaGlsZF9pdGVtcyc7CiAgZm9yZWFjaCgkVkFJS0FJIGFzICRwaWQpewogICAgJHY9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGlmKCEkdil7ICRvWydwcmFsZWlzdGEnXVtdPSRwaWQ7IGNvbnRpbnVlOyB9CiAgICAkcGF2PSc4IFZOVC4g4oCUICcuJHYtPmdldF9uYW1lKCk7CiAgICAkc2x1Zz1zYW5pdGl6ZV90aXRsZSgnOC12bnQtJy4kdi0+Z2V0X3NsdWcoKSk7CiAgICBpZihnZXRfcGFnZV9ieV9wYXRoKCRzbHVnLE9CSkVDVCwncHJvZHVjdCcpKXsgJG9bJ2phdV9idXZvJ11bXT0kcGlkOyBjb250aW51ZTsgfQogICAgJGM9bmV3IFdDX1Byb2R1Y3RfTWl4X2FuZF9NYXRjaCgpOwogICAgJGMtPnNldF9uYW1lKCRwYXYpOyAkYy0+c2V0X3NsdWcoJHNsdWcpOyAkYy0+c2V0X3N0YXR1cygncHVibGlzaCcpOyAkYy0+c2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgndmlzaWJsZScpOwogICAgJGMtPnNldF9zaG9ydF9kZXNjcmlwdGlvbignOCBwYWt1b8SNacWzIHJpbmtpbnlzIHN1IDEwICUgbnVvbGFpZGEuICcuJHYtPmdldF9zaG9ydF9kZXNjcmlwdGlvbigpKTsKICAgICRpZD0kYy0+c2F2ZSgpOwogICAgZm9yZWFjaChhcnJheSgnX21ubV9taW5fY29udGFpbmVyX3NpemUnPT44LCdfbW5tX21heF9jb250YWluZXJfc2l6ZSc9PjgsJ19tbm1fcGVyX3Byb2R1Y3RfcHJpY2luZyc9Pid5ZXMnLCdfbW5tX3Blcl9wcm9kdWN0X2Rpc2NvdW50Jz0+MTAsJ19tbm1fcGFja2luZ19tb2RlJz0+J3RvZ2V0aGVyJywnX21ubV93ZWlnaHRfY3VtdWxhdGl2ZSc9Pid5ZXMnLCdfbW5tX2NvbnRlbnRfc291cmNlJz0+J3Byb2R1Y3RzJywnX21ubV9sYXlvdXRfb3ZlcnJpZGUnPT4nbm8nLCdfbW5tX2xheW91dF9zdHlsZSc9Pid0YWJ1bGFyJywnX21ubV9hZGRfdG9fY2FydF9mb3JtX2xvY2F0aW9uJz0+J2RlZmF1bHQnKSBhcyAkaz0+JHZ2KSB1cGRhdGVfcG9zdF9tZXRhKCRpZCwkaywkdnYpOwogICAgJHdwZGItPmluc2VydCgkdGIsYXJyYXkoJ3Byb2R1Y3RfaWQnPT4kcGlkLCdjb250YWluZXJfaWQnPT4kaWQsJ21lbnVfb3JkZXInPT4xKSk7CiAgICB3cF9zZXRfb2JqZWN0X3Rlcm1zKCRpZCxhcnJheSgoaW50KSRrdCwxMDcpLCdwcm9kdWN0X2NhdCcpOwogICAgd3Bfc2V0X29iamVjdF90ZXJtcygkaWQsYXJyYXkoJ0JlbG9DYXQnKSwncHJvZHVjdF9icmFuZCcpOwogICAgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsJ2JlbGNvcl90b2Z1Jyk7CiAgICAkdGg9Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfdGh1bWJuYWlsX2lkJyx0cnVlKTsgaWYoJHRoKSB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX3RodW1ibmFpbF9pZCcsJHRoKTsKICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRpZCk7CiAgICAkb1snc3VrdXJ0YSddWyRwaWRdPSRpZDsKICB9CiAgd3BfY2FjaGVfZmx1c2goKTsKICAkb1sndmlzbyddPWNvdW50KCRvWydzdWt1cnRhJ10/P2FycmF5KCkpOwogICRwaXJtYXM9cmVzZXQoJG9bJ3N1a3VydGEnXSk7ICRjMj13Y19nZXRfcHJvZHVjdCgkcGlybWFzKTsKICAkb1sncHZ6J109YXJyYXkoJ2lkJz0+JHBpcm1hcywncGF2Jz0+bWJfc3Vic3RyKCRjMi0+Z2V0X25hbWUoKSwwLDYwKSwndXJsJz0+Z2V0X3Blcm1hbGluaygkcGlybWFzKSwnbnVvbGFpZGEnPT5nZXRfcG9zdF9tZXRhKCRwaXJtYXMsJ19tbm1fcGVyX3Byb2R1Y3RfZGlzY291bnQnLHRydWUpLCd0aHVtYic9PmdldF9wb3N0X21ldGEoJHBpcm1hcywnX3RodW1ibmFpbF9pZCcsdHJ1ZSk/MTowKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-103119';
const GKEY='ps_s1635tf7';
const PHASES=["T8"];
const OUT='analize/s1635_tf7.json';
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
