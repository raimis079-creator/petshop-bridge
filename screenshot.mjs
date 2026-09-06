process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjMgcjMg4oCUIFJFQ09OICh0aWsgc2thaXR5bWFzKToganVvc3RhIChwdW5rdGFpLCBzdXJpbmt0aS9laWxlcyksIFBldHNob3BfUGFydGlqb3M6OnByaWltdGkgLyBwYXNrdXRpbmVfc2F2aWthaW5hLCBUaWVraW1vIHByaWltdGkoKSBrxatuYXMsIHBzX3BhcnRpam9zIHN0dWxwZWxpYWksIMW+ZW5rbMWzL3RpZWvEl2rFsyBzxIVzYWphLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19yNSddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjIzIHIzJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMTIwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJGxpbmVzPWZ1bmN0aW9uKCRmaWxlLCRhLCRiKXsgJEw9ZXhwbG9kZSgiXG4iLChzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoJGZpbGUpKTsgJHI9YXJyYXkoKTsgZm9yKCRpPSRhLTE7JGk8bWluKCRiLGNvdW50KCRMKSk7JGkrKyl7ICRyW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHJ0cmltKCRMWyRpXSksMCwyMTApOyB9IHJldHVybiAkcjsgfTsKICAkZz1mdW5jdGlvbigkZmlsZSwkcmUsJG1heD00MCl7ICRMPWV4cGxvZGUoIlxuIiwoc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKCRmaWxlKSk7ICRyPWFycmF5KCk7IGZvcmVhY2goJEwgYXMgJGs9PiRsKXsgaWYocHJlZ19tYXRjaCgkcmUsJGwpKSAkcltdPSgkaysxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDE5MCk7IGlmKGNvdW50KCRyKT49JG1heCkgYnJlYWs7IH0gcmV0dXJuICRyOyB9OwogICRqZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWp1b3N0YS5waHAnOyAkb1snanVvc3RhX2R5ZGlzJ109ZmlsZXNpemUoJGpmKTsgJG9bJ2p1b3N0YV9tZDUnXT1tZDVfZmlsZSgkamYpOyAkb1snanVvc3RhJ109JGcoJGpmLCcvVmVyc2lvbnxAdmVyc2lvbnx2MVwuXGR8VGlla2ltYXN8TGFpxaFrYWl8TGFpc2thaXxwcy10aWVraW1hc3xwcy1sYWlza2FpfGZ1bmN0aW9uIHN1cmlua3RpfGZ1bmN0aW9uIGVpbGVzfGZ1bmN0aW9uIHB1bmt0YWl8ZnVuY3Rpb24gcmVpa2lhfHBzX2p1b3N0YV9yZWlraWF8cHJla3lib2plfHV6c2FreXRpL2knLDQ1KTsKICAkcGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1wYXJ0aWpvcy5waHAnOyAkb1sncGFydF9wcmlpbXRpJ109JGxpbmVzKCRwZiwxNjUsMjAwKTsgJG9bJ3BhcnRfcGFzayddPSRsaW5lcygkcGYsMzA0LDMxOCk7ICRvWydwYXJ0X2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX3BhcnRpam9zIik7CiAgJHRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYXYtdGlla2ltYXMucGhwJzsgJG9bJ3RpZWtfcHJpaW10aSddPSRsaW5lcygkdGYsMTI0MywxMzAwKTsgJG9bJ3RpZWtfbWQ1J109bWQ1X2ZpbGUoJHRmKTsgJG9bJ3RpZWtfZHlkaXMnXT1maWxlc2l6ZSgkdGYpOwogICRvWyd6ZW5rbGFpX3ZmJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC5uYW1lLENPVU5UKCopIG4gRlJPTSB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIEpPSU4geyRwfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgSk9JTiB7JHB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9ci5vYmplY3RfaWQgQU5EIG0ubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIG0ubWV0YV92YWx1ZT0ndmYnIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPXIub2JqZWN0X2lkIEFORCBwby5wb3N0X3N0YXR1cz0ncHVibGlzaCcgR1JPVVAgQlkgdC5uYW1lIE9SREVSIEJZIG4gREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKICAkb1snemVua2xhaV9uX3BhZ2FsX3RpZWsnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLm1ldGFfdmFsdWUgc2FuZCxDT1VOVChESVNUSU5DVCB0dC50ZXJtX2lkKSBuIEZST00geyRwfXRlcm1fcmVsYXRpb25zaGlwcyByIEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD1yLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwcm9kdWN0X2JyYW5kJyBKT0lOIHskcH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1yLm9iamVjdF9pZCBBTkQgbS5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBHUk9VUCBCWSBtLm1ldGFfdmFsdWUiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-132501';
const GKEY='ps_r5';
const PHASES=["R"];
const OUT='analize/s1623_r3.json';
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
