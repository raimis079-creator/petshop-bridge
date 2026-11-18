process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODg0dCB0ZWxlZm9ubyBudW90cmF1a29zOiBrcmVwc2VsaXMsIGthc2EsIGxhaXNrYWkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZihpc3NldCgkX0dFVFsncHNfczE4ODRlJ10pKXsgJHNpZD0oaW50KWdldF9vcHRpb24oJ3BzX3ByZW5fdGVzdGFzX3NpZCcpOyAkcz1QZXRzaG9wX1ByZW51bWVyYXRhOjpnYXV0aSgkc2lkKTsgaWYoISRzKXsgZWNobyAnbmVyYSc7IGV4aXQ7IH0KICAgICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX1ByZW51bWVyYXRhJywndDVfcGF5bG9hZCcpOyAkbS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgJHA9JG0tPmludm9rZShudWxsLCRzKTsKICAgICRmbG93PSRfR0VUWydwc19zMTg4NGUnXT09PSd0OSc/J3N1YnNjcmlwdGlvbl9zdGFydGVkJzonc3Vic2NyaXB0aW9uX3Q1X25vdGljZSc7CiAgICBpZigkZmxvdz09PSdzdWJzY3JpcHRpb25fc3RhcnRlZCcpICRwWydkZWxpdmVyeV9kYXRlJ109UGV0c2hvcF9QcmVudW1lcmF0YTo6c2l1bnRvc19kYXRhKCRzWyduZXh0X2N5Y2xlX2RhdGUnXSk7CiAgICAkeD1QZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjpyZW5kZXIoJGZsb3csJHAsWydyZWNpcGllbnRfZW1haWwnPT4kc1snZW1haWwnXSwnZmxvd19jbGFzcyc9Pid0cmFuc2FjdGlvbmFsJ10pOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IHRleHQvaHRtbDsgY2hhcnNldD11dGYtOCcpOyBlY2hvICc8IS0tIHRlbWE6ICcuZXNjX2h0bWwoJHhbJ3N1YmplY3QnXSkuJyAtLT4nLiR4WydodG1sJ107IGV4aXQ7IH0KICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODg0dCddKSkgcmV0dXJuOyAkcj1bJ3YnPT4ndDMnLCdzaG90cyc9PltdXTsgZ2xvYmFsICR3cGRiOwogIHRyeXsKICAkdWlkPTQ0OwogIGRlbGV0ZV91c2VyX21ldGEoJHVpZCwnX3dvb2NvbW1lcmNlX3BlcnNpc3RlbnRfY2FydF8nLmdldF9jdXJyZW50X2Jsb2dfaWQoKSk7CiAgJHJbJ3Nlc19kZWwnXT0kd3BkYi0+ZGVsZXRlKCR3cGRiLT5wcmVmaXguJ3dvb2NvbW1lcmNlX3Nlc3Npb25zJyxbJ3Nlc3Npb25fa2V5Jz0+KHN0cmluZykkdWlkXSk7CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBwIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX293bl9zdG9ja19xdHknIEFORCBDQVNUKG0ubWV0YV92YWx1ZSBBUyBTSUdORUQpPj01IEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gayBPTiBrLnBvc3RfaWQ9cC5JRCBBTkQgay5tZXRhX2tleT0nX3ByaWNlJyBBTkQgQ0FTVChrLm1ldGFfdmFsdWUgQVMgREVDSU1BTCgxMCwyKSkgQkVUV0VFTiAxMiBBTkQgNDAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBPUkRFUiBCWSBDQVNUKG0ubWV0YV92YWx1ZSBBUyBTSUdORUQpIERFU0MgTElNSVQgMzAiKTsKICAkcD1bXTsgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICR4PXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCR4ICYmICR4LT5pc190eXBlKCdzaW1wbGUnKSAmJiAkeC0+aXNfaW5fc3RvY2soKSAmJiAkeC0+aGFzX2Vub3VnaF9zdG9jaygyKSAmJiBQZXRzaG9wX1ByZW51bWVyYXRhX0thdGFsb2dhczo6Z2FsaW1hKCRpZCkpICRwW109KGludCkkaWQ7IGlmKGNvdW50KCRwKT49MikgYnJlYWs7IH0KICAkclsncHJla2VzJ109JHA7ICRyWydwYXYnXT1hcnJheV9tYXAoZnVuY3Rpb24oJGkpeyAkeD13Y19nZXRfcHJvZHVjdCgkaSk7IHJldHVybiAkeC0+Z2V0X25hbWUoKS4nICcuJHgtPmdldF9wcmljZSgpLicgQVY9Jy5nZXRfcG9zdF9tZXRhKCRpLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSk7IH0sJHApOwogICRleHA9dGltZSgpKzMqSE9VUl9JTl9TRUNPTkRTOyAkdG9rPVdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoJHVpZCktPmNyZWF0ZSgkZXhwKTsKICAkclsnY29va2llcyddPVtbJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKSwnZG9tYWluJz0+J3BldHNob3AubHQnXSxbJ25hbWUnPT4ncHNfanMnLCd2YWx1ZSc9PicxJywnZG9tYWluJz0+J3BldHNob3AubHQnXV07CiAgJFc9MzkwOwogICRyWydzaG90cyddW109WyduJz0+J3MxODg0XzAnLCd1Jz0+aG9tZV91cmwoJy8/dD0nLnRpbWUoKSksJ3cnPT4kVywnaCc9PjYwMF07CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4ODRfMScsJ3UnPT5ob21lX3VybCgnLz9hZGQtdG8tY2FydD0nLiRwWzBdLicmcXVhbnRpdHk9MScpLCd3Jz0+JFcsJ2gnPT42MDBdOwogICRyWydzaG90cyddW109WyduJz0+J3MxODg0XzInLCd1Jz0+aG9tZV91cmwoJy8/YWRkLXRvLWNhcnQ9Jy4kcFsxXS4nJnF1YW50aXR5PTEnKSwndyc9PiRXLCdoJz0+NjAwXTsKICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg4NF8zX2tyZXBzZWxpc19pc2onLCd1Jz0+d2NfZ2V0X2NhcnRfdXJsKCksJ3cnPT4kVywnaCc9PjE3MDAsJ2Z1bGwnPT4xLCdldmFsJz0+Iihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHMtcHJlbicpfHx7fSkuaW5uZXJUZXh0fHwnTkVSQSBCTE9LTyciXTsKICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg4NF8zaicsJ3UnPT53Y19nZXRfY2FydF91cmwoKSwndyc9PiRXLCdoJz0+NjAwLCdjbGljayc9PicjcHMtcHJlbiA+IGEnXTsKICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg4NF80X2tyZXBzZWxpc19paicsJ3UnPT53Y19nZXRfY2FydF91cmwoKSwndyc9PiRXLCdoJz0+MTcwMCwnZnVsbCc9PjEsJ2V2YWwnPT4iKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcy1wcmVuJyl8fHt9KS5pbm5lclRleHR8fCdORVJBIEJMT0tPJyJdOwogICRyWydzaG90cyddW109WyduJz0+J3MxODg0XzVfa2FzYScsJ3UnPT53Y19nZXRfY2hlY2tvdXRfdXJsKCksJ3cnPT4kVywnaCc9PjQyMDAsJ2Z1bGwnPT4xLCdldmFsJz0+Im5ldyBQcm9taXNlKHI9PnNldFRpbWVvdXQoKCk9PnIoWyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHMtcHJlbi1zYWx5Z29zJyl8fHt9KS5pbm5lclRleHR8fCdORVJBIFNBTFlHVScsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcy1wcmVuLXN1dGlraW1hcycpfHx7fSkuaW5uZXJUZXh0fHwnTkVSQSBWQVJORUxFUycsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcy1wcmVuLXBhc2t5cmEnKXx8e30pLmlubmVyVGV4dHx8Jy0nLCgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BheW1lbnQnKXx8e30pLmlubmVyVGV4dHx8JycpLnNsaWNlKDAsNDAwKV0uam9pbignIHx8ICcpKSw0MDAwKSkiXTsKICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg4NF82X2xhaXNrYXNfaWp1bmd0YScsJ3UnPT5ob21lX3VybCgnLz9wc19zMTg4NGU9dDkmbmM9Jy50aW1lKCkpLCd3Jz0+JFcsJ2gnPT4xNjAwLCdmdWxsJz0+MV07CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4ODRfN19sYWlza2FzXzdkJywndSc9PmhvbWVfdXJsKCcvP3BzX3MxODg0ZT10MTAmbmM9Jy50aW1lKCkpLCd3Jz0+JFcsJ2gnPT4xNjAwLCdmdWxsJz0+MV07CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydrbGFpZGEnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-220222';
const GKEY='ps_s1884t';
const PHASES=["T"];
const OUT='analize/s1895_shots.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
