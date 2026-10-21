process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkyYyAjMTQ3OCBKb3NpQ2F0IGVpbHV0ZXMgaSBBViAoa2FpcCBwcmlpbWFudCBwYXJ0aWphICM1Nikg4oCUIDEgc2F1c2FzIMK3IDIgdnlrZG8gwrcgMyBwYXRpa3JhICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc5MmMnXSkpIHJldHVybjsgJEY9KHN0cmluZykkX0dFVFsncHNfczE3OTJjJ107IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc5MmMnLCdmJz0+JEZdOwogICRPSUQ9MzY5MjY7ICRQQVJUPTU2OwogICRybT1mdW5jdGlvbigkbil7ICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0RhcmJhbGF1a2lzJywkbik7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyByZXR1cm4gJG07IH07CiAgJGJ1a2xlPWZ1bmN0aW9uKCkgdXNlKCRPSUQsJHJtLCR3cGRiLCRQKXsgJG89d2NfZ2V0X29yZGVyKCRPSUQpOyAkeD1bJ3N0YXR1cyc9PiRvLT5nZXRfc3RhdHVzKCksJ2xhdWtpYSc9PiRvLT5nZXRfbWV0YSgnX3BzX3RpZWtpbWFzX2xhdWtpYScpLCdzdW1hJz0+JG8tPmdldF90b3RhbCgpLCdlaWwnPT5bXV07CiAgICBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaWlkPT4kaXQpeyBpZigkaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJyk9PT0nYXYnICYmICEkaXQtPmdldF9tZXRhKCdfcHNfa29uc29saWRhY2lqYScpKSBjb250aW51ZTsgJHBpZD0kaXQtPmdldF9wcm9kdWN0X2lkKCk7ICR4WydlaWwnXVtdPSRpaWQuJyB8ICcubWJfc3Vic3RyKCRpdC0+Z2V0X25hbWUoKSwwLDQwKS4nIMOXJy4kaXQtPmdldF9xdWFudGl0eSgpLicgfCBzcmM9Jy4kaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJykuJyBrZWxpYXM9Jy4kaXQtPmdldF9tZXRhKCdfcHNfa2VsaWFzJykuJyBrb25zPScuJGl0LT5nZXRfbWV0YSgnX3BzX2tvbnNvbGlkYWNpamEnKS4nIGF2X3JlZD0nLiRpdC0+Z2V0X21ldGEoJ19wc19hdl9yZWR1Y2VkJykuJyB8IEFWIGxpa3V0aXMgJy4oY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1N0b2NrJyk/UGV0c2hvcF9BVl9TdG9jazo6cXR5KCRwaWQpOic/JykuJyB8ICcuanNvbl9lbmNvZGUoUGV0c2hvcF9BVl9UaWVraW1hczo6ZWlsdXRlc19idWtsZSgkT0lELChpbnQpJGlpZCkpOyB9CiAgICAkeFsndmlzb3NfZWlsJ109Y291bnQoJG8tPmdldF9pdGVtcygpKTsgJHhbJ3RpZWtfZWlsJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZS5pZCxlLnBhcnRpamFfaWQsZS5xdHksZS5xdHlfZ2F1dGEscC5idXNlbmEgRlJPTSB7JFB9cHNfdGlla2ltYXNfZWlsIGUgSk9JTiB7JFB9cHNfdGlla2ltYXMgcCBPTiBwLmlkPWUucGFydGlqYV9pZCBXSEVSRSBlLm9yZGVyX2lkPSVkIiwkT0lEKSxBUlJBWV9BKTsKICAgICRmPSRybSgnZmFrdGFpJyktPmludm9rZShudWxsLCRvLCRybSgnenVybmFsYXMnKS0+aW52b2tlKG51bGwsWyRPSURdKSk7ICR4WydlaWxlcyddPSRmWydlaWxlcyddOyAkeFsna2wnXT0kZlsna2wnXTsgJHhbJ3Rha2VsaXMnXT1hcnJheV9tYXAoZm4oJHQpPT4kdFsxXS4nIFsnLiR0WzJdLiddJywkZlsndGFrZWxpcyddKTsgcmV0dXJuICR4OyB9OwogIHRyeXsKICAgICRyWydwcmllcyddPSRidWtsZSgpOwogICAgaWYoJEY9PT0nMicpewogICAgICAkbz13Y19nZXRfb3JkZXIoJE9JRCk7ICRsaWtvPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wc190aWVraW1hc19laWwgZSBKT0lOIHskUH1wc190aWVraW1hcyBwIE9OIHAuaWQ9ZS5wYXJ0aWphX2lkIFdIRVJFIGUub3JkZXJfaWQ9JWQgQU5EIHAuYnVzZW5hPD4nZ2F1dGEnIiwkT0lEKSk7CiAgICAgICRleGM9ZmFsc2U7IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpdCl7IGlmKChpbnQpJGl0LT5nZXRfcHJvZHVjdF9pZCgpPT09MjExNjUpICRleGM9dHJ1ZTsgfQogICAgICBpZigkbGlrbyl7ICRyWydlcnInXT0nZGFyIHlyYSBsYXVraWFuxI1pxbMgdGlla2ltbyBlaWx1xI1pxbM6ICcuJGxpa287IH0KICAgICAgZWxzZWlmKCRleGMpeyAkclsnZXJyJ109J0V4Y2x1c2lvbiBlaWx1dMSXIGRhciB1xb5zYWt5bWUg4oCUIEluZ2Egam9zIG5lacWhxJdtxJcnOyB9CiAgICAgIGVsc2VpZihnZXRfb3B0aW9uKCdwc19zMTc5MmNfdnlrZHl0YScpKXsgJHJbJ2VyciddPSdqYXUgdnlrZHl0YSc7IH0KICAgICAgZWxzZSB7IHVwZGF0ZV9vcHRpb24oJ3BzX3MxNzkyY192eWtkeXRhJyxjdXJyZW50X3RpbWUoJ215c3FsJyksZmFsc2UpOwogICAgICAgICRvLT5kZWxldGVfbWV0YV9kYXRhKCdfcHNfdGlla2ltYXNfbGF1a2lhJyk7CiAgICAgICAgJHBlcmtlbHRhPVBldHNob3BfQVZfVGlla2ltYXM6OmVpbHV0ZXNfaV9hdigkbywkUEFSVCk7CiAgICAgICAgJG8tPmFkZF9vcmRlcl9ub3RlKHNwcmludGYoJ1RpZWtpbWFzOiB2aXNvcyBwcmVrxJdzIGdhdXRvcyAocGFydGlqYSAjJWQpLiBVxb5zYWt5bWFzIHBhcnVvxaF0YXMgc3VyaW5raW11aSBpxaEgQVYuJXMgKFMxNzkyIOKAlCBFeGNsdXNpb24gacWhaW10YXMsIFZGIG5ldHVyaSknLCRQQVJULCRwZXJrZWx0YT8nIMSuIEFWIHBlcmtlbHRvcyBlaWx1dMSXczogJy5pbXBsb2RlKCcsICcsJHBlcmtlbHRhKS4nLic6JycpLGZhbHNlLHRydWUpOwogICAgICAgICRvLT5zYXZlKCk7IGRvX2FjdGlvbigncHNfanVvc3RhX2lzdmFseXRpJyk7ICRyWydwZXJrZWx0YSddPSRwZXJrZWx0YTsgfQogICAgICAkclsncG8nXT0kYnVrbGUoKTsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-073848';
const GKEY='ps_s1792c';
const PHASES=["1"];
const OUT='analize/s1792p_c1.json';
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
