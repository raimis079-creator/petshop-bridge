process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjczIG1jICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19tYyddKT8kX0dFVFsncHNfbWMnXTonJzsgaWYoJGYhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY3MycsJ2ZhemUnPT4kZik7CiAgJHA9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL2ZlZWRzL2dvb2dsZS54bWwnOyBpZighZmlsZV9leGlzdHMoJHApKXsgZm9yZWFjaChnbG9iKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy8qL2dvb2dsZS54bWwnKSBhcyAkZyl7JHA9JGc7fSB9CiAgJG9bJ2ZlZWQnXT0kcDsgJG9bJ2ZlZWRfYWdlX21pbiddPWZpbGVfZXhpc3RzKCRwKT9yb3VuZCgodGltZSgpLWZpbGVtdGltZSgkcCkpLzYwKTpudWxsOwogIGlmKGZpbGVfZXhpc3RzKCRwKSl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgJG9bJ2l0ZW1zJ109c3Vic3RyX2NvdW50KCRjLCc8aXRlbT4nKTsgJG9bJ3N3J109c3Vic3RyX2NvdW50KCRjLCc8ZzpzaGlwcGluZ193ZWlnaHQ+Jyk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-200922';
const GKEY='ps_mc';
const PHASES=["GO"];
const OUT='analize/s1673_c3.json';
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


  // S1673 GTM API read-only: purchase/consent/EC
  if(process.env.GTM_SA_JSON){ try{
    let raw=process.env.GTM_SA_JSON.trim(); if(!raw.startsWith('{')){ raw='{'+raw+'}'; } const sa=JSON.parse(raw); const crypto=await import('crypto');
    const now=Math.floor(Date.now()/1000); const b=s=>Buffer.from(JSON.stringify(s)).toString('base64url');
    const hdr=b({alg:'RS256',typ:'JWT'}); const clm=b({iss:sa.client_email,scope:'https://www.googleapis.com/auth/tagmanager.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
    const sig=crypto.createSign('RSA-SHA256').update(hdr+'.'+clm).sign(sa.private_key,'base64url');
    const tr=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+hdr+'.'+clm+'.'+sig});
    const tj=await tr.json(); out.gtm={token:tr.status};
    if(tj.access_token){ const H={Authorization:'Bearer '+tj.access_token}; const G='https://tagmanager.googleapis.com/tagmanager/v2/';
      const ac=await (await fetch(G+'accounts',{headers:H})).json(); out.gtm.accounts=(ac.account||[]).map(a=>a.path);
      let cpath=null; for(const a of (ac.account||[])){ const cs=await (await fetch(G+a.path+'/containers',{headers:H})).json(); for(const c of (cs.container||[])){ if(c.publicId==='GTM-MF3GZGT') cpath=c.path; } }
      out.gtm.container=cpath;
      if(cpath){ const ws=await (await fetch(G+cpath+'/workspaces',{headers:H})).json(); const w=(ws.workspace||[])[0]; out.gtm.workspace=w&&w.path;
        const vs=await (await fetch(G+cpath+'/versions:live',{headers:H})).json(); out.gtm.live={v:vs.containerVersionId,name:vs.name,tags:(vs.tag||[]).length,triggers:(vs.trigger||[]).length,vars:(vs.variable||[]).length};
        const P=t=>{ const o={}; for(const p of (t.parameter||[])){ if(p.type==='TEMPLATE'||p.type==='BOOLEAN'||p.type==='INTEGER') o[p.key]=p.value; else if(p.type==='LIST') o[p.key]='LIST['+(p.list||[]).length+']'; else if(p.type==='MAP') o[p.key]='MAP'; } return o; };
        const trg={}; for(const t of (vs.trigger||[])) trg[t.triggerId]=t.name+'('+t.type+')';
        out.gtm.tags=(vs.tag||[]).filter(t=>['15','16','24','29','30'].includes(String(t.tagId))).map(t=>({id:t.tagId,name:t.name,type:t.type,paused:t.paused||false,consent:t.consentSettings,block:(t.blockingTriggerId||[]).map(i=>trg[i]||i),param:JSON.stringify(t.parameter||[]).slice(0,2500)}));
        out.gtm.vars=(vs.variable||[]).map(v=>({name:v.name,type:v.type,param:JSON.stringify(v.parameter||[]).slice(0,400)})).filter(v=>/consent|gclid|user|email|purchase|conv|ec|enhanced|ads|value|trans/i.test(v.name+v.type));
        out.gtm.triggers=(vs.trigger||[]).filter(t=>/granted|BLOCK/.test(t.name)).map(t=>({name:t.name,filter:JSON.stringify(t.filter||[]).slice(0,500)}));
      }
    } else out.gtm.token_body=JSON.stringify(tj).slice(0,300);
  }catch(e){ out.gtm_klaida=String(e).slice(0,400); } }
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
