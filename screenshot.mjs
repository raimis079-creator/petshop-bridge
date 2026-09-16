process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODkgYSDigJQgcmVhZC1vbmx5OiBpZcWha29tIElOUFMwNiAvIEV4Y2x1c2lvbiBJbnRlc3RpbmFsIFZGIFhNTCBjYWNoZSdlIGlyIHZmX29ic2VydmVyLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4OWEnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY4OSBhJyk7CiAgJGY9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BldHNob3AtdmYtY2FjaGUueG1sJzsKICAkb1snZmFpbGFzJ109YXJyYXkoJ3lyYSc9PmZpbGVfZXhpc3RzKCRmKSwnZHlkaXMnPT5maWxlX2V4aXN0cygkZik/ZmlsZXNpemUoJGYpOjAsJ2xhaWthcyc9PmZpbGVfZXhpc3RzKCRmKT9kYXRlKCdZLW0tZCBIOmknLGZpbGVtdGltZSgkZikpOicnKTsKICAkcHI9Z2V0X3Bvc3QoMTg1NTEpOwogICRvWydwcmVrZSddPWFycmF5KCdpZCc9PjE4NTUxLCdwYXYnPT4kcHI/JHByLT5wb3N0X3RpdGxlOictJywnc3QnPT4kcHI/JHByLT5wb3N0X3N0YXR1czonLScsJ3NrdSc9PmdldF9wb3N0X21ldGEoMTg1NTEsJ19za3UnLHRydWUpLCdlYW4nPT5nZXRfcG9zdF9tZXRhKDE4NTUxLCdfZWFuJyx0cnVlKSwnZ3Rpbic9PmdldF9wb3N0X21ldGEoMTg1NTEsJ19ndGluJyx0cnVlKSwnYmFyY29kZSc9PmdldF9wb3N0X21ldGEoMTg1NTEsJ19iYXJjb2RlJyx0cnVlKSwndmYnPT5nZXRfcG9zdF9tZXRhKDE4NTUxLCdfdmZfc3VwcGxpZXJfc2t1Jyx0cnVlKSk7CiAgaWYgKGZpbGVfZXhpc3RzKCRmKSkgewogICAgJHg9QHNpbXBsZXhtbF9sb2FkX2ZpbGUoJGYpOwogICAgaWYgKCR4PT09ZmFsc2UpeyAkb1sneG1sX2tsYWlkYSddPTE7IH0KICAgIGVsc2UgewogICAgICAkcm93cz0keC0+eHBhdGgoJy8vcm93Jyk7IGlmKCEkcm93cykgJHJvd3M9JHgtPnhwYXRoKCcvLypbbG9jYWwtbmFtZSgpPSJyb3ciXScpOwogICAgICAkb1snZWlsdWNpdSddPWlzX2FycmF5KCRyb3dzKT9jb3VudCgkcm93cyk6MDsKICAgICAgJHJhZG89YXJyYXkoKTsgJGV4Y2w9YXJyYXkoKTsgJG1vbm89YXJyYXkoKTsgJGtpYXVsPWFycmF5KCk7CiAgICAgICRlYW49KHN0cmluZylnZXRfcG9zdF9tZXRhKDE4NTUxLCdfZWFuJyx0cnVlKTsKICAgICAgZm9yZWFjaCgoYXJyYXkpJHJvd3MgYXMgJHIpewogICAgICAgICRhPWFycmF5KCk7IGZvcmVhY2goJHItPmNoaWxkcmVuKCkgYXMgJGs9PiR2KXsgJGFbJGtdPXRyaW0oKHN0cmluZykkdik7IH0KICAgICAgICAkdD1pbXBsb2RlKCcgJywkYSk7ICR0bD1tYl9zdHJ0b2xvd2VyKCR0KTsKICAgICAgICAkc2t1PSRhWydza3VfaWQnXT8/KCRhWydza3UnXT8/JycpOwogICAgICAgICRubT0kYVsncHJvZHVjdF9uYW1lJ10/PycnOwogICAgICAgIGlmIChzdHJpcG9zKCRza3UsJ0lOUCcpPT09MCB8fCBzdHJpcG9zKCRza3UsJ0hFUCcpPT09MCB8fCBzdHJpcG9zKCR0LCdJTlBTMDYnKSE9PWZhbHNlKSAkcmFkb1tdPSRhOwogICAgICAgIGlmIChtYl9zdHJpcG9zKCRubSwnRXhjbHVzaW9uJykhPT1mYWxzZSkgJGV4Y2xbXT1hcnJheSgnc2t1Jz0+JHNrdSwncGF2Jz0+JG5tLCdlYW4nPT4kYVsnYmFyY29kZSddPz8nJywncXR5Jz0+JGFbJ3F0eSddPz8nJywna2FpbmEnPT4kYVsnYmFzZV9wcmljZSddPz8nJyk7CiAgICAgICAgaWYgKG1iX3N0cnBvcygkdGwsJ21vbm9wcm90ZWluJykhPT1mYWxzZSkgJG1vbm9bXT1hcnJheSgnc2t1Jz0+JHNrdSwncGF2Jz0+JG5tKTsKICAgICAgICBpZiAoJGVhbiAmJiBzdHJwb3MoJHQsJGVhbikhPT1mYWxzZSkgJGtpYXVsW109JGE7CiAgICAgIH0KICAgICAgJG9bJ2lucF9oZXAnXT0kcmFkbzsgJG9bJ2V4Y2x1c2lvbl9mZWVkZSddPSRleGNsOyAkb1snZXhjbHVzaW9uX24nXT1jb3VudCgkZXhjbCk7CiAgICAgICRvWydtb25vcHJvdGVpbiddPWFycmF5X3NsaWNlKCRtb25vLDAsNDApOyAkb1sncGFnYWxfZWFuJ109JGtpYXVsOwogICAgICAkb1sncHZ6X2VpbHV0ZSddPWlzc2V0KCRyb3dzWzBdKT9qc29uX2RlY29kZShqc29uX2VuY29kZSgkcm93c1swXSksdHJ1ZSk6bnVsbDsKICAgIH0KICB9CiAgJG9bJ29ic2VydmVyJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc2t1LHRpdGxlLGRlY2lzaW9uLHJlYXNvbixtYXRjaGVkX2lkIEZST00geyRwfXZmX29ic2VydmVyIFdIRVJFIHNrdSBMSUtFICdJTlAlJyBPUiBza3UgTElLRSAnSEVQJScgT1IgdGl0bGUgTElLRSAnJUludGVzdGluYWwlJyBPUiB0aXRsZSBMSUtFICclTW9ub3Byb3RlaW4lJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDMwIixBUlJBWV9BKTsKICAkb1snZSddPSR3cGRiLT5sYXN0X2Vycm9yOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-153342';
const GKEY='ps_s1689a';
const PHASES=["GO"];
const OUT='analize/s1689_a.json';
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
