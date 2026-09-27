process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI4bWIgcmVhZC1vbmx5OiB1xb5zYWt5bW8ga2VsaW8gdGFpc3lrbMSXIChBViBwaXJtYSBhciB0aWVrxJdqYXMgcGlybWE/KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjhtYiddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE3MjhtYiddOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7IEBzZXRfdGltZV9saW1pdCgxNTApOwogIHRyeXsKICAgICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYXYtb3JkZXIucGhwJzsgJHQ9ZmlsZSgkZik7ICRyWydhdl9vcmRlciddPVsnbWQ1Jz0+bWQ1X2ZpbGUoJGYpLCdlaWwnPT5jb3VudCgkdCldOwogICAgLy8gZWlsdXTEl3Mgc3Ugc3ByZW5kaW11IGFwaWUga2VsacSFCiAgICAkbz1bXTsgZm9yZWFjaCgkdCBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvcmVzb2x2ZXxkcm9wc2hpcHx0aWVrZWp8cGlybWF8X3BzX3NvdXJjZXxhdl91enRlbmthfFBldHNob3BfQVZfU3RvY2svaXUnLCRsKSkgJG9bXT0oJGkrMSkuJzogJy5ydHJpbSgkbCk7IH0gJHJbJ2F2X29yZGVyJ11bJ2VpbHV0ZXMnXT1hcnJheV9zbGljZSgkbywwLDgwKTsKICAgIC8vIEthcyBkYXIga3ZpZcSNaWEga2VsaXVpOiBpZcWha29tIG11LXBsdWdpbnMsIGt1ciByYcWhb21hIF9wc19zb3VyY2UKICAgICRrYXM9W107IGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRtZil7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRtZik7IGlmKHByZWdfbWF0Y2hfYWxsKCIvKHVwZGF0ZV9tZXRhX2RhdGF8YWRkX21ldGFfZGF0YXx3Y191cGRhdGVfb3JkZXJfaXRlbV9tZXRhKVxcKFxccypbXixdKiw/XFxzKidfcHNfc291cmNlJy8iLCRjLCRtKSkgJGthc1tiYXNlbmFtZSgkbWYpXT1jb3VudCgkbVswXSk7IH0gJHJbJ3Jhc3l0b2phaV9wc19zb3VyY2UnXT0ka2FzOwogICAgLy8gUmVhbMWrcyB1xb5zYWt5bWFpIHBvIFQtMDogZWlsdXTEl3MsIGt1cmnFsyBwcmVrxJcgdHVyaSBpciBBViwgaXIgdGlla8SXam8gxaFhbHRpbsSvCiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvaS5vcmRlcl9pZCwgb2kub3JkZXJfaXRlbV9pZCwgb20ubWV0YV92YWx1ZSBwaWQsIG9pbS5tZXRhX3ZhbHVlIHNyYywgby5kYXRlX2NyZWF0ZWRfZ210IGQKICAgICAgRlJPTSB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgb2kKICAgICAgSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgb20gT04gb20ub3JkZXJfaXRlbV9pZD1vaS5vcmRlcl9pdGVtX2lkIEFORCBvbS5tZXRhX2tleT0nX3Byb2R1Y3RfaWQnCiAgICAgIExFRlQgSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgb2ltIE9OIG9pbS5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQgQU5EIG9pbS5tZXRhX2tleT0nX3BzX3NvdXJjZScKICAgICAgSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gby5pZD1vaS5vcmRlcl9pZAogICAgICBXSEVSRSBvaS5vcmRlcl9pdGVtX3R5cGU9J2xpbmVfaXRlbScgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDgnIEFORCBvLnN0YXR1cyBJTiAoJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnKQogICAgICAgIEFORCBvbS5tZXRhX3ZhbHVlIElOIChTRUxFQ1QgcHJvZHVjdF9pZCBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHNvdXJjZT0nYXYnIEFORCBpc19hY3RpdmU9MSkgQU5EIG9tLm1ldGFfdmFsdWUgSU4gKFNFTEVDVCBwcm9kdWN0X2lkIEZST00geyRQfXBzX3NvdXJjZXMgV0hFUkUgc291cmNlPD4nYXYnIEFORCBpc19hY3RpdmU9MSkKICAgICAgT1JERVIgQlkgby5pZCBERVNDIExJTUlUIDQwIixBUlJBWV9BKTsKICAgIGZvcmVhY2goJHJvd3MgYXMgJiR4KXsgJHhbJ3BhdiddPW1iX3N1YnN0cihodG1sX2VudGl0eV9kZWNvZGUoZ2V0X3RoZV90aXRsZSgkeFsncGlkJ10pKSwwLDQ1KTsgJHhbJ2ltJ109W107IGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXksbWV0YV92YWx1ZSBGUk9NIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBXSEVSRSBvcmRlcl9pdGVtX2lkPSVkIEFORCBtZXRhX2tleSBMSUtFICdcXF9wcyUlJyIsJHhbJ29yZGVyX2l0ZW1faWQnXSksQVJSQVlfQSkgYXMgJG0pICR4WydpbSddWyRtWydtZXRhX2tleSddXT1tYl9zdWJzdHIoJG1bJ21ldGFfdmFsdWUnXSwwLDQwKTsgfQogICAgJHJbJ21peF9laWx1dGVzJ109JHJvd3M7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-211141';
const GKEY='ps_s1728mb';
const PHASES=["1"];
const OUT='analize/s1728_mb.json';
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
