process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc1IHBhc2xhdWd1IHNhbGluaW1hcyB2MiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfYmtZJ10pPyRfR0VUWydwc19ia1knXTonJzsKICBpZigkZiE9PSdBJyYmJGYhPT0nQicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjc1djInLCdmYXplJz0+JGYsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7CiAgJHRjPSR3cGRiLT5wcmVmaXguJ2NtcGx6X2Nvb2tpZXMnOyAkdHM9JHdwZGItPnByZWZpeC4nY21wbHpfc2VydmljZXMnOwogIHRyeXsKICAgIGlmKCRmPT09J0EnKXsKICAgICAgJHNpZD0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00gYCR0c2AgV0hFUkUgbmFtZSBJTiAoJ1lhbmRleCBNZXRyaWNhJywnTWljcm9zb2Z0IENsYXJpdHknKSIpOwogICAgICAkb1snc2FsaW5hbW9zJ109JHNpZDsKICAgICAgZm9yZWFjaCgkc2lkIGFzICRpZCl7CiAgICAgICAgdHJ5eyAkcz1uZXcgQ01QTFpfU0VSVklDRSgoaW50KSRpZCk7ICRzLT5kZWxldGUoKTsgJG9bJ3JleiddWyRpZF09J2RlbGV0ZSgpIGl2eWtkeXRhJzsgfQogICAgICAgIGNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydyZXonXVskaWRdPSdFUlIgJy4kZS0+Z2V0TWVzc2FnZSgpOyB9IH0KICAgICAgJG9bJ2xpa29fbGVudGVsZWplJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQsbmFtZSxsYW5ndWFnZSBGUk9NIGAkdHNgIE9SREVSIEJZIG5hbWUiLEFSUkFZX0EpOwogICAgICAvLyBLZXNhcwogICAgICBkZWxldGVfdHJhbnNpZW50KCdjbXBsel9jb29raWVzJyk7CiAgICAgIGRlbGV0ZV90cmFuc2llbnQoJ2NtcGx6X3NlcnZpY2VzJyk7CiAgICAgIGZvcmVhY2goJHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF9jbXBseiUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnRfdGltZW91dF9jbXBseiUnIikgYXMgJG9uKSBkZWxldGVfb3B0aW9uKCRvbik7CiAgICAgIGRlbGV0ZV9vcHRpb24oJ2NtcGx6X3RyYW5zaWVudHMnKTsKICAgICAgdXBkYXRlX29wdGlvbignY21wbHpfZ2VuZXJhdGVfbmV3X2Nvb2tpZXBvbGljeV9zbmFwc2hvdCcsdGltZSgpLGZhbHNlKTsKICAgICAgJG9bJ2tlc2FzJ109J2lzdmFseXRhcyc7CiAgICAgICRvWydjb29raWVzX3JvZG9taSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkdGNgIFdIRVJFIHNob3dPblBvbGljeT0xIEFORCBkZWxldGVkPTAiKTsKICAgIH0KICAgIGlmKCRmPT09J0InKXsKICAgICAgJG9bJ3NlcnZpY2VzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQsbmFtZSxsYW5ndWFnZSBGUk9NIGAkdHNgIE9SREVSIEJZIG5hbWUiLEFSUkFZX0EpOwogICAgICAkb1snY29va2llc19yb2RvbWknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJHRjYCBXSEVSRSBzaG93T25Qb2xpY3k9MSBBTkQgZGVsZXRlZD0wIik7CiAgICAgICRyPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9zbGFwdWt1LXBvbGl0aWthLycpLGFycmF5KCd0aW1lb3V0Jz0+NDUsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4nTW96aWxsYS81LjAgQ2hyb21lLzE1MicsJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnLCdQcmFnbWEnPT4nbm8tY2FjaGUnKSkpOwogICAgICAkYj1pc193cF9lcnJvcigkcik/Jyc6d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgICAkdHg9dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3RyaXBfdGFncygkYikpKTsKICAgICAgJG9bJ3BvbGl0aWthJ109YXJyYXkoJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLAogICAgICAgICd5YW5kZXgnPT5zdWJzdHJfY291bnQoJHR4LCdZYW5kZXgnKSwneW1fc2xhcHVrYWknPT5zdWJzdHJfY291bnQoJHR4LCdfeW0nKSwKICAgICAgICAnY2xhcml0eSc9PnN1YnN0cl9jb3VudCgkdHgsJ0NsYXJpdHknKStzdWJzdHJfY291bnQoJHR4LCdfY2xjaycpLAogICAgICAgICdhZHNlbnNlJz0+c3Vic3RyX2NvdW50KCR0eCwnQWRzZW5zZScpLCdnY2xfYXUnPT5zdWJzdHJfY291bnQoJHR4LCdfZ2NsX2F1JyksCiAgICAgICAgJ3dvb2NvbW1lcmNlJz0+c3Vic3RyX2NvdW50KCR0eCwnV29vQ29tbWVyY2UnKSwnYW5hbHl0aWNzJz0+c3Vic3RyX2NvdW50KCR0eCwnR29vZ2xlIEFuYWx5dGljcycpLAogICAgICAgICd3b3JkcHJlc3MnPT5zdWJzdHJfY291bnQoJHR4LCdXb3JkUHJlc3MnKSk7CiAgICAgIGlmKHByZWdfbWF0Y2goJy/ErmTEl3RpIHNsYXB1a2FpKC57MCw1MDB9KS9zdScsJHR4LCRtKSkgJG9bJ3NreXJpdXNfNl9wcmFkemlhJ109dHJpbSgkbVsxXSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-081958';
const GKEY='ps_bkY';
const PHASES=["A", "B"];
const OUT='analize/s1675_y.json';
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
