process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQyYiByZWNvbjogZ3LEhcW+aW5pbW8gdGVrc3RhcywgZm9vdGVyIGlrb27El2zEl3MsIHZhcm5lbMSXIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0MmInXSkpIHJldHVybjsgJEY9JF9HRVRbJ3BzX3MxNzQyYiddOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE3NDJiJywnZic9PiRGXTsKICB0cnl7CiAgaWYoJEY9PT0nMScpewogICAgZm9yZWFjaChbMzQ1MjM9PlsncGVyIDE0IGRpZW4nLCcxNCAoa2V0dXJpb2xpa2EpIGRpZW4nXSwzNDUyND0+WydudW8gcHJla8SXcyBnYXZpbW8gZGllbm9zJywnZ2F2aW1vIGRpZW4nXV0gYXMgJGlkPT4ka2V5cyl7ICRjPWdldF9wb3N0X2ZpZWxkKCdwb3N0X2NvbnRlbnQnLCRpZCk7ICRyWydwJ11bJGlkXVsnbGVuJ109c3RybGVuKCRjKTsgJHJbJ3AnXVskaWRdWydtZDUnXT1tZDUoJGMpOyAkclsncCddWyRpZF1bJ2Jsb2NrcyddPXN1YnN0cl9jb3VudCgkYywnPCEtLSB3cDonKTsgZm9yZWFjaCgka2V5cyBhcyAkayl7ICRwPTA7ICRuPTA7IHdoaWxlKCgkcD1tYl9zdHJpcG9zKCRjLCRrLCRwKSkhPT1mYWxzZSAmJiAkbjw2KXsgJHJbJ3AnXVskaWRdWydoaXQnXVska11bXT1tYl9zdWJzdHIoJGMsbWF4KDAsJHAtMjYwKSw1MjApOyAkcCs9bWJfc3RybGVuKCRrKTsgJG4rKzsgfSB9IH0KICAgICRyWydwJ11bMzQ1MjNdWydidWlsZGVyJ109W2dldF9wb3N0X21ldGEoMzQ1MjMsJ19lbGVtZW50b3JfZWRpdF9tb2RlJyx0cnVlKSwgZ2V0X3Bvc3RfbWV0YSgzNDUyMywnX3dwX3BhZ2VfdGVtcGxhdGUnLHRydWUpXTsKICB9CiAgaWYoJEY9PT0nMicpewogICAgJG09Z2V0X3RoZW1lX21vZHMoKTsgZm9yZWFjaCgkbSBhcyAkaz0+JHYpIGlmKHByZWdfbWF0Y2goJy9wYXltZW50fGZvb3Rlcl9ib3R0b218Zm9vdGVyXzJ8YWJzb2x1dGV8Zm9vdGVyX2NvbG9yfGZvb3Rlcl9iZ3xmb290ZXJfMV8vaScsJGspKSAkclsnbW9kcyddWyRrXT1pc19zY2FsYXIoJHYpPyR2OiR2OwogICAgJHRkPWdldF90ZW1wbGF0ZV9kaXJlY3RvcnkoKTsgJG91dD1zaGVsbF9leGVjKCdncmVwIC1ybiAicGF5bWVudC1pY29uXHxwYXltZW50X2ljb25zIiAnLmVzY2FwZXNoZWxsYXJnKCR0ZCkuJyAtLWluY2x1ZGU9Ki5waHAgMj4vZGV2L251bGwgfCBoZWFkIC0zMCcpOyAkclsnZ3JlcCddPSRvdXQ7CiAgfQogIGlmKCRGPT09JzMnKXsKICAgICRyWydjaGVja2VkX2RlZmF1bHQnXT1hcHBseV9maWx0ZXJzKCd3b29jb21tZXJjZV90ZXJtc19pc19jaGVja2VkX2RlZmF1bHQnLCBpc3NldCgkX1BPU1RbJ3Rlcm1zJ10pKTsKICAgIGdsb2JhbCAkd3BfZmlsdGVyOyBmb3JlYWNoKFsnd29vY29tbWVyY2VfdGVybXNfaXNfY2hlY2tlZF9kZWZhdWx0Jywnd29vY29tbWVyY2VfZ2V0X3Rlcm1zX2FuZF9jb25kaXRpb25zX2NoZWNrYm94X3RleHQnLCd3b29jb21tZXJjZV9jaGVja291dF9zaG93X3Rlcm1zJ10gYXMgJGgpeyBpZihpc3NldCgkd3BfZmlsdGVyWyRoXSkpIGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcD0+JGNicykgZm9yZWFjaCgkY2JzIGFzICRjYil7ICRmPSRjYlsnZnVuY3Rpb24nXTsgJHJbJ2hvb2tzJ11bJGhdW109JHAuJyAnLihpc19zdHJpbmcoJGYpPyRmOihpc19hcnJheSgkZik/KGlzX29iamVjdCgkZlswXSk/Z2V0X2NsYXNzKCRmWzBdKTokZlswXSkuJzo6Jy4kZlsxXTonY2xvc3VyZScpKTsgfSB9CiAgICAkclsnd2NfdGV4dF9kZWZhdWx0J109d2NfZ2V0X3Rlcm1zX2FuZF9jb25kaXRpb25zX2NoZWNrYm94X3RleHQoKTsKICAgICRyWydyZXBsYWNlZCddPXdjX3JlcGxhY2VfcG9saWN5X3BhZ2VfbGlua19wbGFjZWhvbGRlcnMod2NfZ2V0X3Rlcm1zX2FuZF9jb25kaXRpb25zX2NoZWNrYm94X3RleHQoKSk7CiAgICAkclsnZmxhdHNvbWVfdGVybXNfbW9kJ109Z2V0X3RoZW1lX21vZCgnY2hlY2tvdXRfdGVybXNfYW5kX2NvbmRpdGlvbnMnKTsKICAgIG9iX3N0YXJ0KCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfY2hlY2tvdXRfcHJpdmFjeV9wb2xpY3lfdGV4dCcpKSB3Y19jaGVja291dF9wcml2YWN5X3BvbGljeV90ZXh0KCk7ICRyWydwcml2X3JlbmRlciddPW9iX2dldF9jbGVhbigpOwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-155355';
const GKEY='ps_s1742b';
const PHASES=["1", "2", "3"];
const OUT='analize/s1742_b.json';
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
