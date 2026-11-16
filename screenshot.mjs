process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODcwZiBsYWlza3UgZGlzcGF0Y2ggdHlyaW1hcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzBmJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCg5MCk7IGdsb2JhbCAkd3BkYiwkd3BfZmlsdGVyOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NzBmJ107CiAgJHJbJ25vdyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgTk9XKCkiKTsKICAkclsncGVuZGluZ19kdWUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmbG93LCBDT1VOVCgqKSBuLCBNSU4oc2NoZWR1bGVkX2F0KSBtbiBGUk9NIHskUH1wc19lbWFpbF9qb2JzIFdIRVJFIHN0YXR1cz0ncGVuZGluZycgQU5EIHNjaGVkdWxlZF9hdDw9Tk9XKCkgR1JPVVAgQlkgZmxvdyIsQVJSQVlfQSk7CiAgJHJbJ3NlbnRfdnNfc2NoZWQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmbG93LCBzY2hlZHVsZWRfYXQsIHNlbnRfYXQsIFRJTUVTVEFNUERJRkYoTUlOVVRFLHNjaGVkdWxlZF9hdCxzZW50X2F0KSB2ZWx1X21pbiBGUk9NIHskUH1wc19lbWFpbF9qb2JzIFdIRVJFIHN0YXR1cz0nc2VudCcgQU5EIGZsb3cgTElLRSAncG9zdF9wdXJjaGFzZSUnIEFORCBzZW50X2F0Pj0nMjAyNi0xMS0wOScgT1JERVIgQlkgc2VudF9hdCBERVNDIExJTUlUIDI1IixBUlJBWV9BKTsKICAkclsnc2VudF92YWxhbmRvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIEhPVVIoc2VudF9hdCkgaCwgQ09VTlQoKikgbiBGUk9NIHskUH1wc19lbWFpbF9qb2JzIFdIRVJFIHN0YXR1cz0nc2VudCcgQU5EIGZsb3cgTElLRSAncG9zdF9wdXJjaGFzZSUnIEFORCBzZW50X2F0Pj0nMjAyNi0xMC0yMCcgR1JPVVAgQlkgMSBPUkRFUiBCWSAxIixBUlJBWV9BKTsKICAkclsnY2InXT1bXTsgaWYoaXNzZXQoJHdwX2ZpbHRlclsncHNfZW1haWxfZGlzcGF0Y2hfY3JvbiddKSl7IGZvcmVhY2goJHdwX2ZpbHRlclsncHNfZW1haWxfZGlzcGF0Y2hfY3JvbiddLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKXsgZm9yZWFjaCgkY2JzIGFzICRjKXsgJGY9JGNbJ2Z1bmN0aW9uJ107IHRyeXsgJHJmPWlzX2FycmF5KCRmKT9uZXcgUmVmbGVjdGlvbk1ldGhvZCgkZlswXSwkZlsxXSk6bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZik7ICRmbj0kcmYtPmdldEZpbGVOYW1lKCk7ICRyWydjYiddW109WyRmbiwkcmYtPmdldFN0YXJ0TGluZSgpLCRyZi0+Z2V0RW5kTGluZSgpXTsKICAgICBpZihpc19maWxlKCRmbikpeyAkTD1maWxlKCRmbik7ICRzPW1heCgwLCRyZi0+Z2V0U3RhcnRMaW5lKCktMSk7ICRlPW1pbihjb3VudCgkTCksJHJmLT5nZXRFbmRMaW5lKCkpOyAkclsnc3JjJ109bWJfc3Vic3RyKGltcGxvZGUoJycsYXJyYXlfc2xpY2UoJEwsJHMsbWluKDYwLCRlLSRzKSkpLDAsNTAwMCk7ICRoaXRzPVtdOyBmb3JlYWNoKCRMIGFzICRpPT4kbG4peyBpZihwcmVnX21hdGNoKCcvcXVpZXR8dHlsfHZhbGFuZHxob3VyfGxhbmdhc3x3aW5kb3d8bGltaXR8Y2FwfG1heF9wZXJ8SFwnXCl8ZGF0ZVwoLkd8ZGF0ZVwoLkgvaScsJGxuKSkgJGhpdHNbXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbG4pLDAsMTcwKTsgfSAkclsnaGl0cyddPWFycmF5X3NsaWNlKCRoaXRzLDAsNDApOyB9IH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnY2InXVtdPSdFUlIgJy4kZS0+Z2V0TWVzc2FnZSgpOyB9IH0gfSB9CiAgZm9yZWFjaCgkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwc19lc3AlJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwc19lbWFpbCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2xhaXNrJScgTElNSVQgMzAiKSBhcyAkb24peyAkdj1nZXRfb3B0aW9uKCRvbik7ICRyWydvcGMnXVskb25dPW1iX3N1YnN0cihpc19zY2FsYXIoJHYpPyhzdHJpbmcpJHY6anNvbl9lbmNvZGUoJHYsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSksMCwzMDApOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7IH0pOwo=';
const VER='dep-075652';
const GKEY='ps_s1870f';
const PHASES=["1"];
const OUT='analize/s1870_f.json';
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
