process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxOTA0cCBwYXJ0aWpvcyB2cyBsaWt1dGlzIHNhcmFzYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxOTA0cCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzUxMk0nKTsgZ2xvYmFsICR3cGRiOyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOyAkcD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE5MDRwJ107CiAgdHJ5ewogICRyWydjb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19wYXJ0aWpvcyIpOwogICRvd249W107IGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9pZCxtZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JyIsQVJSQVlfQSkgYXMgJHgpICRvd25bKGludCkkeFsncG9zdF9pZCddXT0oc3RyaW5nKSR4WydtZXRhX3ZhbHVlJ107CiAgJHNhbGVzPVtdOyBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIENPQUxFU0NFKE5VTExJRihsLnZhcmlhdGlvbl9pZCwwKSxsLnByb2R1Y3RfaWQpIHBpZCwgU1VNKGwucHJvZHVjdF9xdHkpIHEsIENPVU5UKERJU1RJTkNUIGwub3JkZXJfaWQpIG4gRlJPTSB7JHB9d2Nfb3JkZXJfcHJvZHVjdF9sb29rdXAgbCBKT0lOIHskcH13Y19vcmRlcnMgbyBPTiBvLmlkPWwub3JkZXJfaWQgV0hFUkUgby5zdGF0dXMgSU4oJ3djLWNvbXBsZXRlZCcsJ3djLXByb2Nlc3NpbmcnKSBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj1VVENfVElNRVNUQU1QKCktSU5URVJWQUwgOTAgREFZIEdST1VQIEJZIDEiLEFSUkFZX0EpIGFzICR4KSAkc2FsZXNbKGludCkkeFsncGlkJ11dPVsoaW50KSR4WydxJ10sKGludCkkeFsnbiddXTsKICAkTD1bXTsgJHN1bT1bJ3Blcic9PjAsJ3Blcl92bnQnPT4wLCd0cic9PjAsJ3RyX3ZudCc9PjAsJ3N1dCc9PjAsJ3Blcl9uZXB1Yic9PjBdOwogIGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJvZHVjdF9pZCwgU1VNKGtpZWtpc19saWtvKSBsaWtvLCBDT1VOVCgqKSBucCBGUk9NIHskcH1wc19wYXJ0aWpvcyBXSEVSRSBhdHNhdWt0YT0wIEdST1VQIEJZIHByb2R1Y3RfaWQiLEFSUkFZX0EpIGFzICR4KXsKICAgICRwaWQ9KGludCkkeFsncHJvZHVjdF9pZCddOyAkcGFydD0oaW50KSR4WydsaWtvJ107ICRzdD0oc3RyaW5nKWdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKTsgJHRpPWlzc2V0KCRvd25bJHBpZF0pJiYkb3duWyRwaWRdIT09Jyc7CiAgICAkYXY9JHRpPyhpbnQpJG93blskcGlkXTooaW50KSRzdDsgaWYoJGF2PT09JHBhcnQpeyRzdW1bJ3N1dCddKys7IGNvbnRpbnVlO30KICAgIGlmKCRhdjwkcGFydCl7ICRzdW1bJ3RyJ10rKzsgJHN1bVsndHJfdm50J10rPSRhdi0kcGFydDsgY29udGludWU7IH0KICAgICRwbz1nZXRfcG9zdCgkcGlkKTsgaWYoISRwbykgY29udGludWU7ICRwdWI9JHBvLT5wb3N0X3N0YXR1cz09PSdwdWJsaXNoJzsgaWYoISRwdWIgJiYgJHBvLT5wb3N0X3R5cGU9PT0ncHJvZHVjdF92YXJpYXRpb24nKXsgJHBwPWdldF9wb3N0KCRwby0+cG9zdF9wYXJlbnQpOyAkcHViPSRwcCYmJHBwLT5wb3N0X3N0YXR1cz09PSdwdWJsaXNoJyYmJHBvLT5wb3N0X3N0YXR1cz09PSdwdWJsaXNoJzsgfQogICAgJHN1bVsncGVyJ10rKzsgJHN1bVsncGVyX3ZudCddKz0kYXYtJHBhcnQ7IGlmKCEkcHViKXsgJHN1bVsncGVyX25lcHViJ10rKzsgY29udGludWU7IH0KICAgICRzPSRzYWxlc1skcGlkXT8/WzAsMF07CiAgICAkTFtdPVsnaWQnPT4kcGlkLCdza3UnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJHBpZCwnX3NrdScsdHJ1ZSksJ3Bhdic9Pm1iX3N1YnN0cihodG1sX2VudGl0eV9kZWNvZGUoZ2V0X3RoZV90aXRsZSgkcGlkKSksMCw5MCksJ3N2ZXRhaW5lJz0+JGF2LCdwYXJ0aWpvcyc9PiRwYXJ0LCdza2lydCc9PiRhdi0kcGFydCwndGlla2VqYXMnPT4kdGk/J3lyYSc6J2dyeW5haSBBVicsJ3RpZWtlam9fbGlrJz0+JHRpPyRzdDonJywncGFyZHVvdGFfOTBkX3ZudCc9PiRzWzBdLCd1enNfOTBkJz0+JHNbMV0sJ2thaW5hJz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRwaWQsJ19wcmljZScsdHJ1ZSldOwogIH0KICB1c29ydCgkTCxmbigkYSwkYik9PlskYlsncGFyZHVvdGFfOTBkX3ZudCddLCRiWydza2lydCddXTw9PlskYVsncGFyZHVvdGFfOTBkX3ZudCddLCRhWydza2lydCddXSk7CiAgJHJbJ3N1dmVzdGluZSddPSRzdW07ICRyWydzYXJhc2FzJ109JEw7CiAgfWNhdGNoKFxUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-090702';
const GKEY='ps_s1904p';
const PHASES=["1"];
const OUT='analize/s1904_p.json';
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
