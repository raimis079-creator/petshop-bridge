process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc2ZiBkaWRlbGl1IG1haXN1IHNhdmlrYWluYSBpciBkYWJhcnRpbmUgYnVrbGUgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODc2ZiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NzZmJ107CiAgdHJ5ewogICRyWydzYXYnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBMRUZUKHBhdmFkaW5pbWFzX3R1b19tZXR1LDQwKSBwLCBEQVRFX0ZPUk1BVChhcG1va2V0YV9hdCwnJVktJW0nKSBtLCBTVU0oa2lla2lzKSBxLCBST1VORChBVkcoa2FpbmFfdm50X2N0KSoxLjIxLzEwMCwyKSBrYWluYSwgUk9VTkQoQVZHKHNhdmlrYWluYV92bnRfY3QpLzEwMCwyKSBzYXYgRlJPTSB7JFB9cHNfZmFrdF9laWx1dGVzIFdIRVJFIChwYXZhZGluaW1hc190dW9fbWV0dSBMSUtFICdKb3NlcmEgU2Vuc2lwbHVzIDEyJScgT1IgcGF2YWRpbmltYXNfdHVvX21ldHUgTElLRSAnSk9TRVJBIEZFU1RJVkFMJScgT1IgcGF2YWRpbmltYXNfdHVvX21ldHUgTElLRSAnRXhjbHVzaW9uIEh5cG9hbGxlcmdlbmljIG1hxb7FsyB2ZWlzbGnFsyDFoXVuxbMgbWFpc3RhcyBzdSBrJScgT1IgcGF2YWRpbmltYXNfdHVvX21ldHUgTElLRSAnSm9zZXJhIEluZG9vciAxMCUnIE9SIHBhdmFkaW5pbWFzX3R1b19tZXR1IExJS0UgJ0pvc2VyYSBLaXR0ZW4gMTAlJykgQU5EIENPQUxFU0NFKHRlc3RpbmlzLDApPTAgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsMiIsQVJSQVlfQSk7CiAgJGlkcz1bMTc5NzgsMTgxNTQsMTgwMDAsMTgxMDksMTgwODQsMTgwNzcsMTgwMTgsMTc5NTAsMTg1ODcsMTg1NjAsMTY1NTgsMTk3NjAsMTY0NzIsMTgwNDYsMTc5NjJdOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkbz13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJG8pIGNvbnRpbnVlOyAkbT1bXTsgZm9yZWFjaChbJ192Zl9jb3N0JywnX3ZmX3BlcnNvbmFsX2Nvc3QnLCdfbWFudWFsX3ByaWNlX292ZXJyaWRlJywnX3BldHNob3BfbmVlZHNfcHJpY2VfcmV2aWV3JywnX3ZmX3ByaWNlX2luaXRpYWxpemVkJywnX3BldHNob3BfbG9ja19wcmljaW5nJywnX3BzX2thaW5hMjRfaWQnLCdfcHNfa2FpbmEyNCddIGFzICRrKXsgJHY9Z2V0X3Bvc3RfbWV0YSgkaWQsJGssdHJ1ZSk7IGlmKCR2IT09JycpICRtWyRrXT1pc19zY2FsYXIoJHYpPyR2Ompzb25fZW5jb2RlKCR2KTsgfQogICAgJHJbJ2RhYiddWyRpZF09Wyd0Jz0+bWJfc3Vic3RyKCRvLT5nZXRfbmFtZSgpLDAsNTApLCdrYWluYSc9PiRvLT5nZXRfcHJpY2UoKSwnc3QnPT4kby0+Z2V0X3N0b2NrX3N0YXR1cygpLCdxdHknPT4kby0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ2Vhbic9PmdldF9wb3N0X21ldGEoJGlkLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsdHJ1ZSk/OmdldF9wb3N0X21ldGEoJGlkLCdfZWFuJyx0cnVlKT86Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19lYW4nLHRydWUpLCdza3UnPT4kby0+Z2V0X3NrdSgpLCdtZXRhJz0+JG0sJ21vZCc9PmdldF9wb3N0X2ZpZWxkKCdwb3N0X21vZGlmaWVkJywkaWQpLCd1cmwnPT5nZXRfcGVybWFsaW5rKCRpZCldOyB9CiAgLy8gVkYga2FpbnUgcG9reWNpYWk6IGFyIHlyYSB6dXJuYWxhcwogICRyWydvcGMnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclcmVwcmljZSUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV2Zl9rYWluJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJXByaWNlX2xvZyUnIExJTUlUIDE1Iik7CiAgJHJbJ2xlbnQnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAnJXByaWNlJSciKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0VSUiddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7IH0pOwo=';
const VER='dep-084623';
const GKEY='ps_s1876f';
const PHASES=["1"];
const OUT='analize/s1876_f.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
