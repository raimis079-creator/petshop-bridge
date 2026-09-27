process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI1ciByZWFkLW9ubHk6IFdQQUkgIzIgYsWra2zElyAoWkIgcHJvZHVjdHMpIOKAlCBpbXBvcnRzIGVpbHV0xJcsIGlzdG9yaWphLCDFoWFsdGluaXMsIGtpdGkgaW1wb3J0YWkgcGFseWdpbmltdWkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzI1ciddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE3MjVyJywnZGFiYXJfdXRjJz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgIGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wbXhpX2ltcG9ydHMgT1JERVIgQlkgaWQiLEFSUkFZX0EpIGFzICRpbSl7ICRvPUB1bnNlcmlhbGl6ZSgkaW1bJ29wdGlvbnMnXSk7CiAgICAgICRyWydpbXBvcnRzJ11bJGltWydpZCddXT1bJ25hbWUnPT4kaW1bJ25hbWUnXSwnZnJpZW5kbHknPT4kaW1bJ2ZyaWVuZGx5X25hbWUnXT8/bnVsbCwndHlwZSc9PiRpbVsndHlwZSddLCdwYXRoJz0+bWJfc3Vic3RyKChzdHJpbmcpJGltWydwYXRoJ10sMCwxNTApLCd0cmlnZ2VyZWQnPT4kaW1bJ3RyaWdnZXJlZCddLCdwcm9jZXNzaW5nJz0+JGltWydwcm9jZXNzaW5nJ10sJ2V4ZWN1dGluZyc9PiRpbVsnZXhlY3V0aW5nJ10sJ2NhbmNlbGVkJz0+JGltWydjYW5jZWxlZCddLCdmYWlsZWQnPT4kaW1bJ2ZhaWxlZCddPz9udWxsLCdxdWV1ZV9jaHVuayc9PiRpbVsncXVldWVfY2h1bmtfbnVtYmVyJ10sJ2NvdW50Jz0+JGltWydjb3VudCddLCdpbXBvcnRlZCc9PiRpbVsnaW1wb3J0ZWQnXSwnY3JlYXRlZCc9PiRpbVsnY3JlYXRlZCddLCd1cGRhdGVkJz0+JGltWyd1cGRhdGVkJ10sJ3NraXBwZWQnPT4kaW1bJ3NraXBwZWQnXSwnZGVsZXRlZCc9PiRpbVsnZGVsZXRlZCddLCdsYXN0X2FjdGl2aXR5Jz0+JGltWydsYXN0X2FjdGl2aXR5J10sJ3JlZ2lzdGVyZWRfb24nPT4kaW1bJ3JlZ2lzdGVyZWRfb24nXSwnaXRlcmF0aW9uJz0+JGltWydpdGVyYXRpb24nXT8/bnVsbCwnc2VsZWN0aXZlX2hhc2hpbmcnPT4kb1snaXNfc2VsZWN0aXZlX2hhc2hpbmcnXT8/bnVsbCwncmVjb3Jkc19wZXJfcmVxdWVzdCc9PiRvWydyZWNvcmRzX3Blcl9yZXF1ZXN0J10/P251bGwsJ3VwZGF0ZV9hbGwnPT4kb1sndXBkYXRlX2FsbF9kYXRhJ10/P251bGwsJ2lzX3VwZGF0ZV9wcmljZSc9PiRvWydpc191cGRhdGVfcHJpY2UnXT8/bnVsbCwnaXNfdXBkYXRlX2N1c3RvbV9maWVsZHMnPT4kb1snaXNfdXBkYXRlX2N1c3RvbV9maWVsZHMnXT8/bnVsbCwnY3JlYXRlX25ldyc9PiRvWydjcmVhdGVfbmV3X3JlY29yZHMnXT8/bnVsbF07CiAgICB9CiAgICAkclsnaGlzdDInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCx0eXBlLHRpbWVfcnVuLGRhdGUsTEVGVChzdW1tYXJ5LDE2MCkgcyBGUk9NIHskUH1wbXhpX2hpc3RvcnkgV0hFUkUgaW1wb3J0X2lkPTIgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAyNSIsQVJSQVlfQSk7CiAgICAkclsnaGlzdDJfZGllbm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURShkYXRlKSBkLCBDT1VOVCgqKSBuLCBTVU0oc3VtbWFyeSBMSUtFICclZmluaXNoZWQlJykgYmFpZ3RhLCBNQVgodGltZV9ydW4pIG1heF9zIEZST00geyRQfXBteGlfaGlzdG9yeSBXSEVSRSBpbXBvcnRfaWQ9MiBBTkQgZGF0ZT49VVRDX1RJTUVTVEFNUCgpLUlOVEVSVkFMIDEwIERBWSBHUk9VUCBCWSBEQVRFKGRhdGUpIE9SREVSIEJZIGQgREVTQyIsQVJSQVlfQSk7CiAgICAkdXA9d3BfdXBsb2FkX2RpcigpWydiYXNlZGlyJ107IGZvcmVhY2goZ2xvYigkdXAuJy93cGFsbGltcG9ydC9maWxlcy8qJyk/OltdIGFzICRmKSAkclsnZmFpbGFpJ11bXT1iYXNlbmFtZSgkZikuJyAnLmZpbGVzaXplKCRmKS4nICcuZGF0ZSgnWS1tLWQgSDppJyxmaWxlbXRpbWUoJGYpKTsKICAgICRyWyd6Yl9wcmVraXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J196Yl9lbmFibGVkJyBBTkQgbWV0YV92YWx1ZT0neWVzJyIpOwogICAgJHJbJ3piX2F0bmF1amludGFfMjRoJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfemJfZW5hYmxlZCcgQU5EIG0ubWV0YV92YWx1ZT0neWVzJyBBTkQgcC5wb3N0X21vZGlmaWVkX2dtdD49VVRDX1RJTUVTVEFNUCgpLUlOVEVSVkFMIDI0IEhPVVIiKTsKICAgICRyWydwbXhpX3Bvc3RzXzInXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG14aV9wb3N0cyBXSEVSRSBpbXBvcnRfaWQ9MiIpOwogICAgJHJbJ3BteGlfcG9zdHNfMl9pdGVyJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaXRlcmF0aW9uLCBDT1VOVCgqKSBuIEZST00geyRQfXBteGlfcG9zdHMgV0hFUkUgaW1wb3J0X2lkPTIgR1JPVVAgQlkgaXRlcmF0aW9uIE9SREVSIEJZIGl0ZXJhdGlvbiBERVNDIExJTUlUIDUiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-171113';
const GKEY='ps_s1725r';
const PHASES=["1"];
const OUT='analize/s1725_r.json';
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
