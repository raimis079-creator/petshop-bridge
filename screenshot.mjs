process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA1ayddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJGVhbj0nNTIxNDAwMTgzMjg3Myc7ICRyPVtdOwogICRyWydtZXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG9zdF9pZCwgbWV0YV9rZXkgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV92YWx1ZT0lcyIsJGVhbiksQVJSQVlfQSk7CiAgJHJbJ3NyY19lYW4nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkLCBzb3VyY2UsIHN0b2NrX3F0eSBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIGVhbj0lcyIsJGVhbiksQVJSQVlfQSk7CiAgJGlkcz1hcnJheV91bmlxdWUoYXJyYXlfbWVyZ2UoYXJyYXlfY29sdW1uKCRyWydtZXRhJ10sJ3Bvc3RfaWQnKSxhcnJheV9jb2x1bW4oJHJbJ3NyY19lYW4nXSwncHJvZHVjdF9pZCcpKSk7CiAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwbz1nZXRfcG9zdCgkaWQpOyAkbT1mdW5jdGlvbigkaykgdXNlKCRpZCl7cmV0dXJuIGdldF9wb3N0X21ldGEoJGlkLCRrLHRydWUpO307CiAgICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsKICAgICRyWydwJ11bXT1bJ2lkJz0+JGlkLCd0Jz0+JHBvLT5wb3N0X3RpdGxlLCd0eXBlJz0+JHBvLT5wb3N0X3R5cGUsJ3BhcmVudCc9PiRwby0+cG9zdF9wYXJlbnQsJ3N0Jz0+JHBvLT5wb3N0X3N0YXR1cywnc2t1Jz0+JG0oJ19za3UnKSwnc2FuZCc9PiRtKCdfcHNfc2FuZGVsaXMnKSwnc3RvY2snPT4kbSgnX3N0b2NrJyksJ293bic9PiRtKCdfb3duX3N0b2NrX3F0eScpLCdtcyc9PiRtKCdfbWFuYWdlX3N0b2NrJyksJ3NzJz0+JG0oJ19zdG9ja19zdGF0dXMnKSwnc2F2Jz0+JG0oJ19jb3N0X3ByaWNlJyksJ3djcSc9PiRwcj8kcHItPmdldF9zdG9ja19xdWFudGl0eSgpOm51bGwsCiAgICAgICdicmFuZCc9PndwX2dldF9wb3N0X3Rlcm1zKCRwby0+cG9zdF9wYXJlbnQ/OiRpZCwncHJvZHVjdF9icmFuZCcsWydmaWVsZHMnPT4nc2x1Z3MnXSksCiAgICAgICdzcmMnPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzb3VyY2Usc3RvY2tfcXR5LGNvc3RfbmV0LGlzX2FjdGl2ZSBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCksQVJSQVlfQSksCiAgICAgICdwYXJ0Jz0+JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsa2lla2lzX2dhdXRhcyxraWVraXNfbGlrbyxhdHNhdWt0YSx0aWVrZWphcyxMRUZUKHBhc3RhYmEsNTApIHBhc3RhYmEgRlJPTSB7JHB9cHNfcGFydGlqb3MgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJGlkKSxBUlJBWV9BKSwKICAgICAgJ29wZW4nPT4kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG8uaWQgRlJPTSB7JHB9d2Nfb3JkZXJzIG8gSk9JTiB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgaSBPTiBpLm9yZGVyX2lkPW8uaWQgSk9JTiB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgaW0gT04gaW0ub3JkZXJfaXRlbV9pZD1pLm9yZGVyX2l0ZW1faWQgQU5EIGltLm1ldGFfa2V5IElOKCdfcHJvZHVjdF9pZCcsJ192YXJpYXRpb25faWQnKSBXSEVSRSBvLnN0YXR1cyBJTignd2MtcHJvY2Vzc2luZycsJ3djLW9uLWhvbGQnLCd3Yy1wZW5kaW5nJykgQU5EIGltLm1ldGFfdmFsdWU9JWQiLCRpZCkpXTsKICB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-101705';
const GKEY='ps_s1705k';
const PHASES=["1"];
const OUT='analize/s1705_k.json';
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
