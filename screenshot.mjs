process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTQgcnVuIGU1ciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpICMzIGRhbGluaXMg4oCeU2l1bnRhIGdyxK/FvnRh4oCcOiB2YXJpa2xpbyBgcGV0c2hvcC1hdi1yZWR1Y2UucGhwYCBncsSFxb5pbmltbyBrYWJsaXVrYXMgKHdvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19jYW5jZWxsZWQgcHJpb3IuIDE1KSDFoWFsdGluaXM7IGBQZXRzaG9wX0FWX1N0b2NrOjppbmNyZWFzZS9kZWNyZWFzZS9xdHlgOyB0ZXN0aW5pxbMgZ3LEr8W+dGFuxI1pxbMgdcW+c2FreW3FsyBixatrbMSXICgjMzU0NDAsICMzNTQ0MSwgIzM1NDE5LCAjMzU0MjkpICsga2FuZGlkYXRhaSBkYWxpbmlhbSB0ZXN0dWkgKG1pxaFyxatzLCBjb21wbGV0ZWQsIGR2aSBkYWx5cykuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2U1ciddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjE0IGU1cicpOyBnbG9iYWwgJHdwZGIsICR3cF9maWx0ZXI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDI4MCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRzcmM9ZnVuY3Rpb24oJGZuLCRtYXg9OTApeyB0cnl7ICRyPWlzX2FycmF5KCRmbik/bmV3IFJlZmxlY3Rpb25NZXRob2QoJGZuWzBdLCRmblsxXSk6KGlzX3N0cmluZygkZm4pJiZzdHJwb3MoJGZuLCc6OicpP25ldyBSZWZsZWN0aW9uTWV0aG9kKCRmbik6bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZm4pKTsgJGY9ZmlsZSgkci0+Z2V0RmlsZU5hbWUoKSk7IHJldHVybiBhcnJheSgnZic9PmJhc2VuYW1lKCRyLT5nZXRGaWxlTmFtZSgpKS4nOicuJHItPmdldFN0YXJ0TGluZSgpLCdzcmMnPT5hcnJheV9tYXAoZnVuY3Rpb24oJGwpeyByZXR1cm4gcnRyaW0obWJfc3Vic3RyKCRsLDAsMjIwKSk7IH0sYXJyYXlfc2xpY2UoJGYsJHItPmdldFN0YXJ0TGluZSgpLTEsbWluKCRtYXgsJHItPmdldEVuZExpbmUoKS0kci0+Z2V0U3RhcnRMaW5lKCkrMSkpKSk7IH1jYXRjaChUaHJvd2FibGUgJGUpeyByZXR1cm4gJ0VSUiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0gfTsKICB0cnl7CiAgICBmb3JlYWNoKGFycmF5KCd3b29jb21tZXJjZV9vcmRlcl9zdGF0dXNfY2FuY2VsbGVkJykgYXMgJGgpeyBpZihpc3NldCgkd3BfZmlsdGVyWyRoXSkpeyBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKXsgZm9yZWFjaCgkY2JzIGFzICRjYil7ICRmbj0kY2JbJ2Z1bmN0aW9uJ107ICRuYW1lPWlzX2FycmF5KCRmbik/KGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV06KGlzX3N0cmluZygkZm4pPyRmbjonY2xvc3VyZScpOyAkb1snY2FuY2VsbGVkX2hvb2tzJ11bXT0kcHIuJyAnLiRuYW1lOyBpZihpc19hcnJheSgkZm4pJiZzdHJpcG9zKCRuYW1lLCdyZWR1Y2UnKSE9PWZhbHNlfHxzdHJpcG9zKCRuYW1lLCdncmF6aW4nKSE9PWZhbHNlfHxzdHJpcG9zKCRuYW1lLCdBVl8nKSE9PWZhbHNlKXsgJG9bJ3NyY18nLiRuYW1lXT0kc3JjKCRmbiw5MCk7IH0gfSB9IH0gfQogICAgZm9yZWFjaChhcnJheSgnaW5jcmVhc2UnLCdkZWNyZWFzZScsJ3F0eScpIGFzICRtKXsgJG9bJ2F2c3RvY2tfJy4kbV09JHNyYyhhcnJheSgnUGV0c2hvcF9BVl9TdG9jaycsJG0pLDQwKTsgfQogICAgJG9bJ2F2c3RvY2tfbWV0b2RhaSddPWFycmF5X21hcChmdW5jdGlvbigkbSl7IHJldHVybiAkbS0+Z2V0TmFtZSgpOyB9LChuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0FWX1N0b2NrJykpLT5nZXRNZXRob2RzKCkpOwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1JlZHVjZScpKXsgJG9bJ2F2cmVkdWNlX21ldG9kYWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJG0peyByZXR1cm4gJG0tPmdldE5hbWUoKTsgfSwobmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9BVl9SZWR1Y2UnKSktPmdldE1ldGhvZHMoKSk7IGZvcmVhY2goYXJyYXkoJ2dyYXppbnRpJywnbnVyYXN5dGknLCdyZWR1Y2UnLCdyZXN0b3JlJykgYXMgJG0peyBpZihtZXRob2RfZXhpc3RzKCdQZXRzaG9wX0FWX1JlZHVjZScsJG0pKSAkb1snYXZyZWR1Y2VfJy4kbV09JHNyYyhhcnJheSgnUGV0c2hvcF9BVl9SZWR1Y2UnLCRtKSw5MCk7IH0gfQogICAgJG9bJ3JlZHVjZV9rbGFzZXMnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGdldF9kZWNsYXJlZF9jbGFzc2VzKCksZnVuY3Rpb24oJGMpeyByZXR1cm4gcHJlZ19tYXRjaCgnL0FWX1JlZHVjZXxBdl9SZWR1Y2V8UmVkdWNlL2knLCRjKTsgfSkpOwogICAgLy8gdGVzdGluaWFpOiBkYWx5cywgc3RhdHVzYXMsIGdyaXp0YSwgaXNzaXVzdGEsIHNlbm9zLCBlaWx1dMSXcyAoa2VsaWFzL3NyYy9yZWR1Y2VkX3F0eS9fcmVkdWNlZF9zdG9jaykKICAgIGZvcmVhY2goYXJyYXkoMzU0NDAsMzU0NDEsMzU0MTksMzU0MjksMzU0NDIsMzU0MjEsMzU0MjgsMzU0MzcsMzU0MzgsMzU0MTcsMzU0MjcsMzU0MTgpIGFzICRpZCl7ICR4PXdjX2dldF9vcmRlcigkaWQpOyBpZighJHgpIGNvbnRpbnVlOyAkZWlsPWFycmF5KCk7IGZvcmVhY2goJHgtPmdldF9pdGVtcygpIGFzICRpaWQ9PiRpdCl7ICRlaWxbJGlpZF09YXJyYXkoJ3BpZCc9PiRpdC0+Z2V0X3Byb2R1Y3RfaWQoKSwncSc9PiRpdC0+Z2V0X3F1YW50aXR5KCksJ2snPT4oc3RyaW5nKSRpdC0+Z2V0X21ldGEoJ19wc19rZWxpYXMnKSwnc3JjJz0+KHN0cmluZykkaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJyksJ3JxJz0+KHN0cmluZykkaXQtPmdldF9tZXRhKCdfcHNfYXZfcmVkdWNlZF9xdHknKSwncnMnPT4oc3RyaW5nKSRpdC0+Z2V0X21ldGEoJ19yZWR1Y2VkX3N0b2NrJyksJ293bic9PmdldF9wb3N0X21ldGEoJGl0LT5nZXRfcHJvZHVjdF9pZCgpLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksJ3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkaXQtPmdldF9wcm9kdWN0X2lkKCksJ19zdG9jaycsdHJ1ZSksJ24nPT5tYl9zdWJzdHIoJGl0LT5nZXRfbmFtZSgpLDAsMzApKTsgfQogICAgICAkb1sndXpzJ11bJGlkXT1hcnJheSgnc3QnPT4keC0+Z2V0X3N0YXR1cygpLCdncml6dGEnPT4oc3RyaW5nKSR4LT5nZXRfbWV0YSgnX3BzX3NpdW50YV9ncml6dGEnKSwnaXNzJz0+KHN0cmluZykkeC0+Z2V0X21ldGEoJ19wc19kYWx5c19pc3NpdXN0YScpLCdzZW5vcyc9PihzdHJpbmcpJHgtPmdldF9tZXRhKCdfcHNfc2l1bnRvc19zZW5vcycpLCdhdl9yZWR1Y2VkJz0+KHN0cmluZykkeC0+Z2V0X21ldGEoJ19wc19hdl9yZWR1Y2VkJyksJ2F2X3Jlc3RvcmVkJz0+KHN0cmluZykkeC0+Z2V0X21ldGEoJ19wc19hdl9yZXN0b3JlZCcpLCdzZW50X3NyYyc9PihzdHJpbmcpJHgtPmdldF9tZXRhKCdfcHNfZHJvcHNoaXBfc2VudF9zcmMnKSwncmVnJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRzKXsgcmV0dXJuICRzWydzYW5kZWxpcyddLic6Jy5pbXBsb2RlKCcvJywkc1snbnVtZXJpYWknXSk7IH0sUGV0c2hvcF9TaXVudG9zOjpzYXJhc2FzKCRpZCkpLCdzZWsnPT5tYl9zdWJzdHIoKHN0cmluZykkeC0+Z2V0X21ldGEoJ19wc192ZW5pcGFrX3Nla2ltYXMnKSwwLDE2MCksJ2VpbCc9PiRlaWwpOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDk5KTsK';
const VER='dep-154916';
const GKEY='ps_e5r';
const PHASES=["R"];
const OUT='analize/s1614_e5r.json';
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
