process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTcgcnVuIHI4IChyZWNvbiwgdGlrIHNrYWl0eW1hcykg4oCUIFdDRE4gNy4zLjAgY3JlZGl0bm90ZSDFoWFibG9uYXMgxK9qdW5ndGFzPyAoVGVtcGxhdGVzOjpnZXQpLCBlc2FtaSBgX3djZG5fY3JlZGl0bm90ZV9wZGZgIHXFvnNha3ltYWkvZmFpbGFpLCBgd2NfY3JlYXRlX3JlZnVuZGAgc3Vtb3MvZWlsdcSNacWzIHZhbGlkYWNpamEsIEZha3RfR3JhemluaW1haSBwYXJhxaFhcywgcmVmdW5kJ8WzIHN1IHByaXN0YXR5bXUgZ2FsaW15YsSXLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19yOCddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjE3IHI4Jyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMTIwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJGNscz1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGdldF9kZWNsYXJlZF9jbGFzc2VzKCksZnVuY3Rpb24oJGMpeyByZXR1cm4gc3RyaXBvcygkYywnVHljaGVcXFxcV0NETicpIT09ZmFsc2U7IH0pKTsgJG9bJ3djZG5fa2xhc2VzJ109YXJyYXlfc2xpY2UoJGNscywwLDYwKTsKICBmb3JlYWNoKCRjbHMgYXMgJGMpeyBpZihwcmVnX21hdGNoKCcvVGVtcGxhdGVzJC8nLCRjKSl7IHRyeXsgJG9bJ3RwbF9jbGFzcyddPSRjOyAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJGMsJ2dldCcpOyAkb1sndHBsX2dldF9zaWcnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeC0+Z2V0TmFtZSgpO30sJHJtLT5nZXRQYXJhbWV0ZXJzKCkpOyBmb3JlYWNoKGFycmF5KCdpbnZvaWNlJywnY3JlZGl0bm90ZScsJ3JlY2VpcHQnLCdwYWNraW5nc2xpcCcsJ2RlbGl2ZXJ5bm90ZScpIGFzICR0KXsgJG9bJ3RwbF9lbmFibGVkJ11bJHRdPSRjOjpnZXQoJHQsJ2VuYWJsZWQnKTsgfSAkb1snY3JlZGl0bm90ZV9zZXR0aW5ncyddPSRjOjpnZXQoJ2NyZWRpdG5vdGUnKTsgaWYoaXNfYXJyYXkoJG9bJ2NyZWRpdG5vdGVfc2V0dGluZ3MnXSkpICRvWydjcmVkaXRub3RlX3NldHRpbmdzJ109YXJyYXlfc2xpY2UoYXJyYXlfZmlsdGVyKCRvWydjcmVkaXRub3RlX3NldHRpbmdzJ10sJ2lzX3NjYWxhcicpLDAsNDAsdHJ1ZSk7IH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1sndHBsX2VyciddPSRlLT5nZXRNZXNzYWdlKCk7IH0gfSB9CiAgJG9bJ2NyZWRpdG5vdGVfbWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9yZGVyX2lkLG1ldGFfa2V5LExFRlQobWV0YV92YWx1ZSwxMjApIHYgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXkgSU4gKCdfd2Nkbl9jcmVkaXRub3RlX3BkZicsJ193Y2RuX2NyZWRpdG5vdGVfZGF0ZScpIixBUlJBWV9BKTsKICAkZ3JlcD1mdW5jdGlvbigkZmlsZSwkcGF0cywkY3R4PTEsJG1heD0zMCwkdz00MjApeyAkcj1hcnJheSgpOyBpZighZmlsZV9leGlzdHMoJGZpbGUpKSByZXR1cm4gJ07EllJBICcuJGZpbGU7ICRsPWZpbGUoJGZpbGUpOyBmb3JlYWNoKCRsIGFzICRpPT4kbG4peyBmb3JlYWNoKChhcnJheSkkcGF0cyBhcyAkcHQpeyBpZihwcmVnX21hdGNoKCRwdCwkbG4pKXsgJHJbXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIodHJpbShpbXBsb2RlKCcg4o+OICcsYXJyYXlfbWFwKCd0cmltJyxhcnJheV9zbGljZSgkbCxtYXgoMCwkaS0kY3R4KSwkY3R4KjIrMSkpKSksMCwkdyk7IGJyZWFrOyB9IH0gaWYoY291bnQoJHIpPj0kbWF4KSBicmVhazsgfSByZXR1cm4gJHI7IH07CiAgJG9bJ3djX2NyZWF0ZV9yZWZ1bmQnXT0kZ3JlcChXUF9QTFVHSU5fRElSLicvd29vY29tbWVyY2UvaW5jbHVkZXMvd2Mtb3JkZXItZnVuY3Rpb25zLnBocCcsYXJyYXkoJy9mdW5jdGlvbiB3Y19jcmVhdGVfcmVmdW5kLycsJy9tYXhfcmVmdW5kfEludmFsaWQgcmVmdW5kIGFtb3VudHxhbW91bnQuKj4vJywnL2xpbmVfaXRlbXMvJywnL3NoaXBwaW5nfGZlZS8nKSwxLDI1LDMwMCk7CiAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0Zha3RfR3JhemluaW1haScpKXsgdHJ5eyAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRmFrdF9HcmF6aW5pbWFpJywncmFzeXRpJyk7ICRvWydmYWt0X2dyYXpfc2lnJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHgtPmdldE5hbWUoKTt9LCRybS0+Z2V0UGFyYW1ldGVycygpKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7fSB9CiAgJG9bJ2Zha3RfZ3Jhel9jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19mYWt0X2dyYXppbmltYWkiKTsKICAkb1sncmVmdW5kc19hbGwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxwYXJlbnRfb3JkZXJfaWQsc3RhdHVzLHRvdGFsX2Ftb3VudCxkYXRlX2NyZWF0ZWRfZ210IEZST00geyRwfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyX3JlZnVuZCcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKICAkb1snYXZwbl9jb3VudGVyJ109Z2V0X29wdGlvbigncGV0c2hvcF9hdnBuX2NvdW50ZXInKTsgJG9bJ2lhcHZfY291bnRlciddPWdldF9vcHRpb24oJ3BldHNob3BfaWFwdl9jb3VudGVyJyk7ICRvWydrcl9vcGNpam9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsTEVGVChvcHRpb25fdmFsdWUsMTAwKSB2IEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJWtyXyVjb3VudGVyJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJWtyZWRpdCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVjcmVkaXQlJyIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDk5KTsK';
const VER='dep-064114';
const GKEY='ps_r8';
const PHASES=["GO"];
const OUT='analize/s1617_r8.json';
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
