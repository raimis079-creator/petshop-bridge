process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjAgcnVuIGUzciDigJQgUjoga2xpZW50byBwYXNreXJvcyAoNTc4NykgcHVzbGFwacWzIG1hdG9taSB0ZWtzdGFpICsgc3ZlxI1pbyDigJ5LYWlwIG1hdG8ga2xpZW50YXPigJwgKyBXQyB2ZXJ0aW3FsyBixatrbMSXICh0aWsgc2thaXR5bWFzKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZTNyJ10pKSByZXR1cm47CiAgJGY9c3RydG91cHBlcihzYW5pdGl6ZV9rZXkoJF9HRVRbJ3BzX2UzciddKSk7ICRvPWFycmF5KCd2Jz0+J1MxNjIwIGUzcicsJ2YnPT4kZik7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjUwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJEo9ZnVuY3Rpb24oJG8peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7IH07CiAgdHJ5ewogICR1aWQ9NTc4NzsgJGV4cD10aW1lKCkrMTgwMDsgJHRvaz1XUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5jcmVhdGUoJGV4cCk7CiAgJGNzPWFycmF5KG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PlNFQ1VSRV9BVVRIX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ3NlY3VyZV9hdXRoJywkdG9rKSkpLG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PkFVVEhfQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnYXV0aCcsJHRvaykpKSxuZXcgV1BfSHR0cF9Db29raWUoYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKSkpKTsKICAkdGVrc3Rhcz1mdW5jdGlvbigkaCl7ICRoPXByZWdfcmVwbGFjZSgnIzwoc2NyaXB0fHN0eWxlfG5vc2NyaXB0fHN2ZylcYi4qPzwvXDE+I3NpJywnICcsJGgpOyBpZihwcmVnX21hdGNoKCcjPG1haW5cYi4qPzwvbWFpbj4jc2knLCRoLCRtKSkgJGg9JG1bMF07IGVsc2VpZihwcmVnX21hdGNoKCcjPGRpdltePl0rY2xhc3M9IlteIl0qd29vY29tbWVyY2VbXiJdKiIuKiNzaScsJGgsJG0pKSAkaD0kbVswXTsgJGg9cHJlZ19yZXBsYWNlKCcjPChicnwvcHwvbGl8L3RyfC9oXGR8L2RpdnwvdGR8L3RofC9sYWJlbHwvb3B0aW9ufC9hfC9idXR0b258L3NwYW4pW14+XSo+I2knLCJcbiIsJGgpOyAkdD1odG1sX2VudGl0eV9kZWNvZGUod3Bfc3RyaXBfYWxsX3RhZ3MoJGgpLEVOVF9RVU9URVMsJ1VURi04Jyk7ICRvdXQ9YXJyYXkoKTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJHQpIGFzICRsKXsgJGw9dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJGwpKTsgaWYoJGw9PT0nJ3x8bWJfc3RybGVuKCRsKTwyfHxwcmVnX21hdGNoKCcvXltcZFxzLiw64oKsJeKCrFwt4oCT4oCUI3xdKyQvdScsJGwpKSBjb250aW51ZTsgJG91dFskbF09MTsgfSByZXR1cm4gYXJyYXlfc2xpY2UoYXJyYXlfa2V5cygkb3V0KSwwLDExMCk7IH07CiAgJEc9ZnVuY3Rpb24oJHUsJGxvZz10cnVlKSB1c2UoJGNzLCR0ZWtzdGFzKXsgJHI9d3BfcmVtb3RlX2dldCgkdSxhcnJheSgnY29va2llcyc9PiRsb2c/JGNzOmFycmF5KCksJ3RpbWVvdXQnPT45MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MikpOyByZXR1cm4gYXJyYXkoJ2NvZGUnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksJ3QnPT4kdGVrc3Rhcygoc3RyaW5nKXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSkpOyB9OwogICRteT13Y19nZXRfcGFnZV9wZXJtYWxpbmsoJ215YWNjb3VudCcpOyAkb1snbXknXT0kbXk7ICRvWydsb2NhbGUnXT1nZXRfbG9jYWxlKCk7ICRvWyd3Y190ZCddPWlzX3RleHRkb21haW5fbG9hZGVkKCd3b29jb21tZXJjZScpOyAkb1snd2Nfb3JkZXJzX3N0ciddPV9fKCdPcmRlcnMnLCd3b29jb21tZXJjZScpOyAkb1snd2NfdmVyJ109V0MoKS0+dmVyc2lvbjsKICAkb1snbWVudSddPXdjX2dldF9hY2NvdW50X21lbnVfaXRlbXMoKTsgJG9bJ3N0YXR1c2FpJ109d2NfZ2V0X29yZGVyX3N0YXR1c2VzKCk7CiAgJG9yZHM9d2NfZ2V0X29yZGVycyhhcnJheSgnY3VzdG9tZXJfaWQnPT4kdWlkLCdsaW1pdCc9PjYwLCdvcmRlcmJ5Jz0+J2RhdGUnLCdvcmRlcic9PidERVNDJywncmV0dXJuJz0+J2lkcycpKTsgJG9bJ3V6c19uJ109Y291bnQoJG9yZHMpOyAkc2VsPWFycmF5KCk7IGZvcmVhY2goJG9yZHMgYXMgJGlkKXsgJHg9d2NfZ2V0X29yZGVyKCRpZCk7ICRzdD0keC0+Z2V0X3N0YXR1cygpOyBpZighaXNzZXQoJHNlbFskc3RdKSl7ICRzZWxbJHN0XT0kaWQ7IH0gfSAkb1snc2VsJ109JHNlbDsKICAkb1sncF9kYXNoYm9hcmQnXT0kRygkbXkpOyAkb1sncF9vcmRlcnMnXT0kRyh3Y19nZXRfZW5kcG9pbnRfdXJsKCdvcmRlcnMnLCcnLCRteSkpOyAkb1sncF9lZGl0X2FkZHJlc3MnXT0kRyh3Y19nZXRfZW5kcG9pbnRfdXJsKCdlZGl0LWFkZHJlc3MnLCcnLCRteSkpOyAkb1sncF9lZGl0X2FjY291bnQnXT0kRyh3Y19nZXRfZW5kcG9pbnRfdXJsKCdlZGl0LWFjY291bnQnLCcnLCRteSkpOwogIGZvcmVhY2goYXJyYXkoJ2NvbXBsZXRlZCcsJ3Byb2Nlc3NpbmcnLCdvbi1ob2xkJywnY2FuY2VsbGVkJykgYXMgJHN0KXsgaWYoaXNzZXQoJHNlbFskc3RdKSl7ICRvWydwX3ZpZXdfJy4kc3RdPSRHKHdjX2dldF9lbmRwb2ludF91cmwoJ3ZpZXctb3JkZXInLCRzZWxbJHN0XSwkbXkpKTsgJG9bJ3Bfdmlld18nLiRzdF1bJ2lkJ109JHNlbFskc3RdOyB9IH0KICBmb3JlYWNoKGFycmF5X2tleXMoJG9bJ21lbnUnXSkgYXMgJGVwKXsgaWYoIWluX2FycmF5KCRlcCxhcnJheSgnZGFzaGJvYXJkJywnb3JkZXJzJywnZWRpdC1hZGRyZXNzJywnZWRpdC1hY2NvdW50JywnY3VzdG9tZXItbG9nb3V0Jywndmlldy1vcmRlcicpLHRydWUpKXsgJG9bJ3BfZXBfJy4kZXBdPSRHKHdjX2dldF9lbmRwb2ludF91cmwoJGVwLCcnLCRteSkpOyB9IH0KICAkZz13Y19nZXRfb3JkZXIoMzU4MTMpOyAkb1sncF9zdmVjaW9fYWNpdSddPSRHKCRnLT5nZXRfY2hlY2tvdXRfb3JkZXJfcmVjZWl2ZWRfdXJsKCksZmFsc2UpOyAkb1sncF9zdmVjaW9fYWNpdSddWydpZCddPTM1ODEzOwogICRvWydwX2xvZ2luJ109JEcoJG15LGZhbHNlKTsKICAkb1sndGVtcF9saWtvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy5iYXNlbmFtZSgkZS0+Z2V0RmlsZSgpKS4nOicuJGUtPmdldExpbmUoKTsgfQogICRKKCRvKTsKfSw5OSk7Cg==';
const VER='dep-090525';
const GKEY='ps_e3r';
const PHASES=["R"];
const OUT='analize/s1620_e3r.json';
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
