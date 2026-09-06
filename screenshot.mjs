process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjAgcnVuIGU5YyDigJQgQzogZGFyYnVvdG9qb3MgcGFza3lyYSDigJ5Jbmdh4oCcIChsb2dpbiBgaW5nYWAsIHRlcnJhQHBldHNob3AubHQsIHJvbMSXIGBwc19kYXJidW90b2phc2ApICsgc2xhcHRhxb5vZMW+aW8gbnVzdGF0eW1vIGxhacWha2FzIChkZXYtcGFzdGFzIHByYWxlaWTFvmlhIHRpayDFoWlhaSB1xb5rbGF1c2FpKSDCtyBROiBwYXRpa3JhIChyb2zElywgdGVpc8SXcywgcHJpc2lqdW5naW1vIHBlcmFkcmVzYXZpbWFzKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZTljJ10pKSByZXR1cm47CiAgJGY9c3RydG91cHBlcihzYW5pdGl6ZV9rZXkoJF9HRVRbJ3BzX2U5YyddKSk7ICRvPWFycmF5KCd2Jz0+J1MxNjIwIGU5YycsJ2YnPT4kZik7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjAwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJEo9ZnVuY3Rpb24oJG8peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7IH07CiAgJEVMPSd0ZXJyYUBwZXRzaG9wLmx0JzsgJExPR0lOPSdpbmdhJzsKICB0cnl7CiAgaWYoJGY9PT0nQycpewogICAgJGV4PWVtYWlsX2V4aXN0cygkRUwpOyAkb1snZW1haWxfZXhpc3RzJ109JGV4P2FycmF5KCRleCxnZXRfdXNlcl9ieSgnaWQnLCRleCktPnVzZXJfbG9naW4pOjA7ICR1bD11c2VybmFtZV9leGlzdHMoJExPR0lOKTsgJG9bJ2xvZ2luX2V4aXN0cyddPSR1bD86MDsKICAgIGlmKCRleCYmKCEkdWx8fCR1bCE9JGV4KSl7ICRvWydTVE9QJ109J2VsLiBwYcWhdGFzIGphdSBwcmlza2lydGFzIGtpdGFtIHZhcnRvdG9qdWknOyAkSigkbyk7IH0KICAgIGlmKCEkdWwpeyAkdWlkPXdwX2luc2VydF91c2VyKGFycmF5KCd1c2VyX2xvZ2luJz0+JExPR0lOLCd1c2VyX2VtYWlsJz0+JEVMLCd1c2VyX3Bhc3MnPT53cF9nZW5lcmF0ZV9wYXNzd29yZCgyNCx0cnVlLHRydWUpLCdyb2xlJz0+J3BzX2RhcmJ1b3RvamFzJywnZmlyc3RfbmFtZSc9PidJbmdhJywnZGlzcGxheV9uYW1lJz0+J0luZ2EnLCduaWNrbmFtZSc9PidJbmdhJywnbG9jYWxlJz0+J2x0X0xUJykpOyBpZihpc193cF9lcnJvcigkdWlkKSl7ICRvWydTVE9QJ109J2luc2VydDogJy4kdWlkLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyAkSigkbyk7IH0gJG9bJ3N1a3VydGEnXT0kdWlkOyB9IGVsc2UgeyAkdWlkPSR1bDsgJG9bJ2phdV9idXZvJ109JHVpZDsgfQogICAgJHU9Z2V0X3VzZXJfYnkoJ2lkJywkdWlkKTsgJG9bJ3VzZXInXT1hcnJheSgkdS0+SUQsJHUtPnVzZXJfbG9naW4sJHUtPnVzZXJfZW1haWwsJHUtPmRpc3BsYXlfbmFtZSxpbXBsb2RlKCcsJywkdS0+cm9sZXMpKTsKICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2Rldl9wYXN0YXNfbGVpc3RpJywxLGZhbHNlKTsgJHNlbnQ9cmV0cmlldmVfcGFzc3dvcmQoJExPR0lOKTsgZGVsZXRlX29wdGlvbigncHNfZGV2X3Bhc3Rhc19sZWlzdGknKTsKICAgICRvWydyZXNldF9sYWlza2FzJ109aXNfd3BfZXJyb3IoJHNlbnQpPydLTEFJREE6ICcuJHNlbnQtPmdldF9lcnJvcl9tZXNzYWdlKCk6KCRzZW50PT09dHJ1ZT8nacWhc2nFs3N0YSc6dmFyX2V4cG9ydCgkc2VudCx0cnVlKSk7ICRvWydsZWlzdGlfcG8nXT1nZXRfb3B0aW9uKCdwc19kZXZfcGFzdGFzX2xlaXN0aScsbnVsbCk7CiAgICAkb1sncmVzZXRfa2V5X3lyYSddPShpbnQpKChib29sKSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgdXNlcl9hY3RpdmF0aW9uX2tleSBGUk9NIHskcH11c2VycyBXSEVSRSBJRD0lZCIsJHVpZCkpKTsKICAgICR6PShhcnJheSlnZXRfb3B0aW9uKCdwc19kZXZfcGFzdGFzX3p1cm5hbGFzJyxhcnJheSgpKTsgJG9bJ2Rldl9wYXN0YXNfcGFzayddPWFycmF5X21hcChmdW5jdGlvbigkZSl7cmV0dXJuIGFycmF5KCRlWydsYWlrYXMnXT8/JycsJGVbJ2thbSddPz8nJyxtYl9zdWJzdHIoJGVbJ3RlbWEnXT8/JycsMCw2MCkpO30sYXJyYXlfc2xpY2UoJHosLTIpKTsgJEooJG8pOwogIH0KICBpZigkZj09PSdRJyl7CiAgICAkdT1nZXRfdXNlcl9ieSgnbG9naW4nLCRMT0dJTik7IGlmKCEkdSl7ICRvWydTVE9QJ109J27El3JhJzsgJEooJG8pOyB9ICRvWyd1c2VyJ109YXJyYXkoJHUtPklELCR1LT51c2VyX2xvZ2luLCR1LT51c2VyX2VtYWlsLCR1LT5kaXNwbGF5X25hbWUsaW1wbG9kZSgnLCcsJHUtPnJvbGVzKSwkdS0+dXNlcl9yZWdpc3RlcmVkKTsKICAgIGZvcmVhY2goYXJyYXkoJ21hbmFnZV93b29jb21tZXJjZScsJ2VkaXRfc2hvcF9vcmRlcnMnLCdlZGl0X3Byb2R1Y3RzJywndXBsb2FkX2ZpbGVzJywnYWN0aXZhdGVfcGx1Z2lucycsJ21hbmFnZV9vcHRpb25zJywnZWRpdF9zbmlwcGV0cycsJ21hbmFnZV9zbmlwcGV0cycsJ2xpc3RfdXNlcnMnLCdlZGl0X3BhZ2VzJywnZWRpdF9wb3N0cycsJ2VkaXRfdGhlbWVfb3B0aW9ucycpIGFzICRjKXsgJG9bJ2NhbiddWyRjXT0oaW50KXVzZXJfY2FuKCR1LCRjKTsgfQogICAgJHVpZD0kdS0+SUQ7ICRleHA9dGltZSgpKzYwMDsgJHRvaz1XUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5jcmVhdGUoJGV4cCk7CiAgICAkY3M9YXJyYXkobmV3IFdQX0h0dHBfQ29va2llKGFycmF5KCduYW1lJz0+U0VDVVJFX0FVVEhfQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnc2VjdXJlX2F1dGgnLCR0b2spKSksbmV3IFdQX0h0dHBfQ29va2llKGFycmF5KCduYW1lJz0+QVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdhdXRoJywkdG9rKSkpLG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PkxPR0dFRF9JTl9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdsb2dnZWRfaW4nLCR0b2spKSkpOwogICAgJEc9ZnVuY3Rpb24oJHUpIHVzZSgkY3MpeyAkcj13cF9yZW1vdGVfZ2V0KCR1LGFycmF5KCdjb29raWVzJz0+JGNzLCd0aW1lb3V0Jz0+OTAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdyZWRpcmVjdGlvbic9PjApKTsgcmV0dXJuIHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKS4oKCRsPShzdHJpbmcpd3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkciwnbG9jYXRpb24nKSk/JyDihpIgJy5tYl9zdWJzdHIoc3RyX3JlcGxhY2UoaG9tZV91cmwoKSwnJywkbCksMCw1MCk6JycpOyB9OwogICAgZm9yZWFjaChhcnJheSgnJywnYWRtaW4ucGhwP3BhZ2U9cHMtZGVzaycsJ2FkbWluLnBocD9wYWdlPXBzLWRlc2smdmlldz1uYXVqYXMnLCdhZG1pbi5waHA/cGFnZT1wcy1kZXNrJnZpZXc9c2Fza2FpdG9zJywnYWRtaW4ucGhwP3BhZ2U9cHMta2F0YWxvZ2FzJywncGx1Z2lucy5waHAnLCd1c2Vycy5waHAnLCdhZG1pbi5waHA/cGFnZT1zbmlwcGV0cycsJ2FkbWluLnBocD9wYWdlPXdjLXNldHRpbmdzJywnb3B0aW9ucy1nZW5lcmFsLnBocCcpIGFzICRwdGgpeyAkb1sncHJpZWlnYSddWyRwdGg/Oid3cC1hZG1pbi8nXT0kRyhhZG1pbl91cmwoJHB0aCkpOyB9CiAgICBXUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5kZXN0cm95KCR0b2spOyAkb1snbGVpc3RpJ109Z2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc19sZWlzdGknLG51bGwpOyAkb1sndGVtcF9saWtvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7ICRKKCRvKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy5iYXNlbmFtZSgkZS0+Z2V0RmlsZSgpKS4nOicuJGUtPmdldExpbmUoKTsgfQogICRKKCRvKTsKfSw5OSk7Cg==';
const VER='dep-095546';
const GKEY='ps_e9c';
const PHASES=["C", "Q"];
const OUT='analize/s1620_e9c.json';
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
