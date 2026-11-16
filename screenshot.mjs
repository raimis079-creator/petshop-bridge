process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc0dCB0ZXN0aW5lIHBhc2t5cmEgKyB0ZWxlZm9ubyBudW90cmF1a29zICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg3NHQnXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxODc0dCcsJ3Nob3RzJz0+W11dOwogIHRyeXsKICAkZW09J3RlcnJhQGd5dnVuYWkubHQnOyAkdT1nZXRfdXNlcl9ieSgnZW1haWwnLCRlbSk7CiAgaWYoISR1KXsgJHVpZD13cF9pbnNlcnRfdXNlcihbJ3VzZXJfbG9naW4nPT4ncHJlbnVtZXJhdG9zLXRlc3RhcycsJ3VzZXJfZW1haWwnPT4kZW0sJ3VzZXJfcGFzcyc9PndwX2dlbmVyYXRlX3Bhc3N3b3JkKDI0KSwncm9sZSc9PidjdXN0b21lcicsJ2ZpcnN0X25hbWUnPT4nVGVzdGFzJywnbGFzdF9uYW1lJz0+J1ByZW51bWVyYXRhJywnZGlzcGxheV9uYW1lJz0+J1ByZW51bWVyYXRvcyB0ZXN0YXMnXSk7CiAgICBpZihpc193cF9lcnJvcigkdWlkKSl7ICRyWydrbGFpZGEnXT0kdWlkLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBnb3RvIG91dDsgfSAkclsnc3VrdXJ0YSddPSR1aWQ7IH0KICBlbHNlIHsgJHVpZD0kdS0+SUQ7ICRyWydqYXVfeXJhJ109WyR1aWQsJHUtPnVzZXJfbG9naW4sJHUtPnJvbGVzXTsgfQogICR0PWdldF9vcHRpb24oJ3BzX3ByZW51bWVyYXRhX3Rlc3R1b3RvamFpJyxbXSk7IGlmKCFpc19hcnJheSgkdCkpICR0PVtdOyBpZighaW5fYXJyYXkoJHVpZCwkdCkpICR0W109JHVpZDsgdXBkYXRlX29wdGlvbigncHNfcHJlbnVtZXJhdGFfdGVzdHVvdG9qYWknLGFycmF5X3ZhbHVlcyhhcnJheV9tYXAoJ2ludHZhbCcsJHQpKSxmYWxzZSk7ICRyWyd0ZXN0dW90b2phaSddPSR0OwogICRleHA9dGltZSgpKzMqSE9VUl9JTl9TRUNPTkRTOyAkdG9rPVdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoJHVpZCktPmNyZWF0ZSgkZXhwKTsKICAkclsnY29va2llcyddPVtbJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKV1dOwogICRwPVtdOyBmb3JlYWNoKFsxODU4NywxOTQ5NiwxODU5MCwxOTU4MiwxODU2MF0gYXMgJGlkKXsgJHg9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoJHggJiYgJHgtPmlzX3R5cGUoJ3NpbXBsZScpICYmICR4LT5pc19pbl9zdG9jaygpICYmICR4LT5pc19wdXJjaGFzYWJsZSgpKSAkcFtdPSRpZDsgaWYoY291bnQoJHApPj0yKSBicmVhazsgfQogICRyWydwcmVrZXMnXT0kcDsgJHAxPSRwWzBdOyAkcDI9JHBbMV0/PyRwWzBdOwogICR0ZXJtcz13Y19nZXRfcHJvZHVjdF90ZXJtX2lkcygkcDEsJ3Byb2R1Y3RfY2F0Jyk7ICRrYXQ9JHRlcm1zP2dldF90ZXJtX2xpbmsoKGludCllbmQoJHRlcm1zKSwncHJvZHVjdF9jYXQnKTpob21lX3VybCgnL3BhcmR1b3R1dmUvJyk7CiAgJFc9MzkwOyAkcT0nP3Q9Jy50aW1lKCk7CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfMV9wcmVrZScsJ3UnPT5nZXRfcGVybWFsaW5rKCRwMSkuJHEsJ3cnPT4kVywnaCc9PjE4MDBdOwogICRyWydzaG90cyddW109WyduJz0+J3MxODc0XzJfa2F0YWxvZ2FzJywndSc9Pihpc193cF9lcnJvcigka2F0KT9ob21lX3VybCgnL3BhcmR1b3R1dmUvJyk6JGthdCkuJHEsJ3cnPT4kVywnaCc9PjE2MDBdOwogICRyWydzaG90cyddW109WyduJz0+J3MxODc0XzNhX2lkZXRpJywndSc9PmhvbWVfdXJsKCcvP2FkZC10by1jYXJ0PScuJHAxLicmcXVhbnRpdHk9MScpLCd3Jz0+JFcsJ2gnPT45MDBdOwogICRyWydzaG90cyddW109WyduJz0+J3MxODc0XzNiX2lkZXRpJywndSc9PmhvbWVfdXJsKCcvP2FkZC10by1jYXJ0PScuJHAyLicmcXVhbnRpdHk9MicpLCd3Jz0+JFcsJ2gnPT45MDBdOwogICRyWydzaG90cyddW109WyduJz0+J3MxODc0XzRfa3JlcHNlbGlzX2lzaicsJ3UnPT53Y19nZXRfY2FydF91cmwoKSwndyc9PiRXLCdoJz0+MTgwMCwnZXZhbCc9PiIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BzLXByZW4nKXx8e30pLmlubmVyVGV4dHx8J05FUkEgQkxPS08nIl07CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfNV9qdW5naWtsaXMnLCd1Jz0+d2NfZ2V0X2NhcnRfdXJsKCksJ3cnPT4kVywnaCc9PjkwMCwnY2xpY2snPT4nI3BzLXByZW4gPiBhJ107CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfNl9rcmVwc2VsaXNfaWonLCd1Jz0+d2NfZ2V0X2NhcnRfdXJsKCksJ3cnPT4kVywnaCc9PjIyMDAsJ2V2YWwnPT4iKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcy1wcmVuJyl8fHt9KS5pbm5lclRleHR8fCdORVJBIEJMT0tPJyJdOwogICRyWydzaG90cyddW109WyduJz0+J3MxODc0XzdfcGxpdXMnLCd1Jz0+d2NfZ2V0X2NhcnRfdXJsKCksJ3cnPT4kVywnaCc9PjkwMCwnY2xpY2snPT4nYVthcmlhLWxhYmVsPSJSZcSNaWF1Il0nXTsKICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg3NF84X2tyZXBzZWxpc18zNScsJ3UnPT53Y19nZXRfY2FydF91cmwoKSwndyc9PiRXLCdoJz0+MjIwMCwnZXZhbCc9PiIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BzLXByZW4nKXx8e30pLmlubmVyVGV4dHx8J05FUkEgQkxPS08nIl07CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfOV9rYXNhJywndSc9PndjX2dldF9jaGVja291dF91cmwoKSwndyc9PiRXLCdoJz0+MzYwMCwnZnVsbCc9PjEsJ2V2YWwnPT4iWyAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBzLXByZW4tc2FseWdvcycpfHx7fSkuaW5uZXJUZXh0fHwnTkVSQSBTQUxZR1UnLCAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBzLXByZW4tc3V0aWtpbWFzJyl8fHt9KS5pbm5lclRleHR8fCdORVJBIFZBUk5FTEVTJywgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYXltZW50Jyl8fHt9KS5pbm5lclRleHR8fCcnIF0uam9pbignIHx8ICcpIl07CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfMTBfcGFza3lyYScsJ3UnPT53Y19nZXRfYWNjb3VudF9lbmRwb2ludF91cmwoJ3ByZW51bWVyYXRvcycpLCd3Jz0+JFcsJ2gnPT4xODAwXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2tsYWlkYSddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgb3V0OiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-212657';
const GKEY='ps_s1874t';
const PHASES=["GO"];
const OUT='analize/s1874_t.json';
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
