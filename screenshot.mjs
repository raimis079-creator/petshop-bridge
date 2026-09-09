process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjUgbCDigJQgT1BUX1JBS1RBUyByZWlrxaFtxJcgKGplaSB0dcWhxI1pYSDigJQgc3VnZW5lcnVvamEpICsgc25pcHBldGFzIOKAnlBldHNob3AgQWRzIFJlY29uIFByaWVtaWtsaXMgdjEuMCIgKFJFU1QgcHMtd2ViL3YxL2Fkcy1yZWNvbikuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjY1bCddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjY1IGwnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICRzPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZmFrdC1yZWtsYW1hLnBocCcpOwogIHByZWdfbWF0Y2goIi9PUFRfUkFLVEFTXHMqPVxzKicoW14nXSspJy8iLCRzLCRtKTsKICAkb3B0PSRtWzFdPz8nJzsgJG9bJ29wdF92YXJkYXMnXT0kb3B0OwogICR2PSRvcHQ/Z2V0X29wdGlvbigkb3B0LCcnKTonJzsKICBpZigkb3B0ICYmICR2PT09JycpeyAkdj1iaW4yaGV4KHJhbmRvbV9ieXRlcygxNikpOyB1cGRhdGVfb3B0aW9uKCRvcHQsJHYsZmFsc2UpOyAkb1snc3VnZW5lcnVvdGEnXT0xOyB9CiAgJG9bJ3Jha3RhcyddPSR2OwogICR5cmE9JHdwZGItPmdldF92YXIoIlNFTEVDVCBpZCBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1BldHNob3AgQWRzIFJlY29uIFByaWVtaWtsaXMlJyIpOwogIGlmKCR5cmEpeyAkb1snamF1X3lyYSddPShpbnQpJHlyYTsgd3Bfc2VuZF9qc29uKCRvKTsgfQogICRjb2RlPTw8PCdDT0RFJwphZGRfYWN0aW9uKCdyZXN0X2FwaV9pbml0JywgZnVuY3Rpb24oKXsKICByZWdpc3Rlcl9yZXN0X3JvdXRlKCdwcy13ZWIvdjEnLCcvYWRzLXJlY29uJyxhcnJheSgKICAgICdtZXRob2RzJz0+J1BPU1QnLCdwZXJtaXNzaW9uX2NhbGxiYWNrJz0+J19fcmV0dXJuX3RydWUnLAogICAgJ2NhbGxiYWNrJz0+ZnVuY3Rpb24oJHJlcSl7CiAgICAgICRrPShzdHJpbmcpJHJlcS0+Z2V0X2hlYWRlcigneC1wcy1rZXknKTsKICAgICAgJG9wdD0nJzsgJHM9QGZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZmFrdC1yZWtsYW1hLnBocCcpOwogICAgICBpZigkcyAmJiBwcmVnX21hdGNoKCIvT1BUX1JBS1RBU1xzKj1ccyonKFteJ10rKScvIiwkcywkbSkpICRvcHQ9JG1bMV07CiAgICAgICR0aWtyYXM9JG9wdD8oc3RyaW5nKWdldF9vcHRpb24oJG9wdCwnJyk6Jyc7CiAgICAgIGlmKCEkayB8fCAhJHRpa3JhcyB8fCAhaGFzaF9lcXVhbHMoJHRpa3JhcywkaykpIHJldHVybiBuZXcgV1BfUkVTVF9SZXNwb25zZShhcnJheSgnb2snPT4wLCdrbGFpZGEnPT4ncmFrdGFzJyksNDAzKTsKICAgICAgJGI9JHJlcS0+Z2V0X2JvZHkoKTsKICAgICAgaWYoc3RybGVuKCRiKT40MDAwMDApIHJldHVybiBuZXcgV1BfUkVTVF9SZXNwb25zZShhcnJheSgnb2snPT4wLCdrbGFpZGEnPT4ncGVyX2RpZGVsaXMnKSw0MTMpOwogICAgICB1cGRhdGVfb3B0aW9uKCdwc19hZHNfcmVjb24nLGFycmF5KCdrYWRhJz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCdkeWRpcyc9PnN0cmxlbigkYiksJ2JvZHknPT4kYiksZmFsc2UpOwogICAgICByZXR1cm4gbmV3IFdQX1JFU1RfUmVzcG9uc2UoYXJyYXkoJ29rJz0+MSwnZHlkaXMnPT5zdHJsZW4oJGIpKSwyMDApOwogICAgfSkpOwp9KTsKQ09ERTsKICB0b2tlbl9nZXRfYWxsKCc8P3BocCAnLiRjb2RlLCBUT0tFTl9QQVJTRSk7CiAgJG9rPSR3cGRiLT5pbnNlcnQoInskcH1zbmlwcGV0cyIsYXJyYXkoJ25hbWUnPT4nUGV0c2hvcCBBZHMgUmVjb24gUHJpZW1pa2xpcyB2MS4wIChwcy13ZWIvdjEvYWRzLXJlY29uIGkgcHNfYWRzX3JlY29uKScsJ2Rlc2NyaXB0aW9uJz0+J1MxNjY1OiBBZHMgU2NyaXB0IHJlY29uIEpTT04gcHJpZW1pbWFzLiBMYWlraW5hcyBpa2kgQWRzIHN1dHZhcmt5bW8uJywnY29kZSc9PiRjb2RlLCd0YWdzJz0+JycsJ3Njb3BlJz0+J2dsb2JhbCcsJ3ByaW9yaXR5Jz0+OSwnYWN0aXZlJz0+MSwnbW9kaWZpZWQnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpKTsKICAkb1snaW5zZXJ0J109JG9rPyhpbnQpJHdwZGItPmluc2VydF9pZDonRkFJTCAnLiR3cGRiLT5sYXN0X2Vycm9yOwogICRvWydwaW5nJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlKSkpOwogIHdwX3NlbmRfanNvbigkbyk7Cn0pOwo=';
const VER='dep-140937';
const GKEY='ps_s1665l';
const PHASES=["GO"];
const OUT='analize/s1665l.json';
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
