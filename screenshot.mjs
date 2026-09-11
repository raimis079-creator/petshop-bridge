process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjcxIGVrb25vbWlrYSBBMiBpc3RvcmlqYSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY3MWUnXSkgfHwgJF9HRVRbJ3BzX3MxNjcxZSddIT09J0UyJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7ICRvPWFycmF5KCd2Jz0+J1MxNjcxZTInKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogIHRyeSB7CiAgICAkb1snaXN0X3NwYW4nXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIE1JTihkYXRhKSBudW8sIE1BWChkYXRhKSBpa2ksIENPVU5UKCopIG4sIFJPVU5EKFNVTShzdW1hKSkgc3VtYSBGUk9NIHskcH1wc19pc3RfdXpzYWt5bWFpIiwgQVJSQVlfQSk7CiAgICAkb1snc3RhdHVzYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXNhcywgaXZ5a2R5dGFzLCBDT1VOVCgqKSBuIEZST00geyRwfXBzX2lzdF91enNha3ltYWkgR1JPVVAgQlkgc3RhdHVzYXMsIGl2eWtkeXRhcyBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTAiLCBBUlJBWV9BKTsKICAgICRXPSJ1Lml2eWtkeXRhcz0xIEFORCB1LmRhdGEgPj0gREFURV9TVUIoJzIwMjYtMDktMDgnLCBJTlRFUlZBTCAxMiBNT05USCkiOwogICAgJG9bJzEybSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHN1bWEpKSBzdW1hLCBST1VORChBVkcoc3VtYSksMikgdmlkLCBDT1VOVChESVNUSU5DVCBlbWFpbCkga2xpZW50YWkgRlJPTSB7JHB9cHNfaXN0X3V6c2FreW1haSB1IFdIRVJFICRXIiwgQVJSQVlfQSk7CiAgICAkb1snMTJtX21lbmVzaWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURV9GT1JNQVQoZGF0YSwnJVktJW0nKSBtLCBDT1VOVCgqKSBuLCBST1VORChTVU0oc3VtYSkpIHN1bWEgRlJPTSB7JHB9cHNfaXN0X3V6c2FreW1haSB1IFdIRVJFICRXIEdST1VQIEJZIG0gT1JERVIgQlkgbSIsIEFSUkFZX0EpOwogICAgJG9bJ3Bha2FydG90aW51bWFzJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBDT1VOVCgqKSBrbGllbnRhaSwgU1VNKGs+MSkgZ3JpemUsIFJPVU5EKEFWRyhrKSwyKSB2aWRfdXpzIEZST00gKFNFTEVDVCBlbWFpbCwgQ09VTlQoKikgayBGUk9NIHskcH1wc19pc3RfdXpzYWt5bWFpIHUgV0hFUkUgJFcgR1JPVVAgQlkgZW1haWwpIHgiLCBBUlJBWV9BKTsKICAgIC8vIGVpbHV0xJdzIHN1IFdQIHByZWvEl21pcyDihpIga2F0ZWdvcmlqYS9icmVuZGFzL3NhdmlrYWluYQogICAgJHNxbD0iU0VMRUNUIGUud2NfcHJvZHVjdF9pZCBwaWQsIFNVTShlLmtpZWtpcykgdm50LCBST1VORChTVU0oZS5zdW1hKSkgc3VtYSwgQ09VTlQoRElTVElOQ1QgZS51enNha3ltb19pZCkgdXpzIEZST00geyRwfXBzX2lzdF9laWx1dGVzIGUgSk9JTiB7JHB9cHNfaXN0X3V6c2FreW1haSB1IE9OIHUuaWQ9ZS51enNha3ltb19pZCBXSEVSRSAkVyBBTkQgZS53Y19wcm9kdWN0X2lkPjAgR1JPVVAgQlkgcGlkIjsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygkc3FsLCBBUlJBWV9BKTsgJG9bJ3N1c2lldHVfcHJla2l1J109Y291bnQoJHJvd3MpOwogICAgJG9bJ25lc3VzaWV0YSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgZWlsLCBST1VORChTVU0oZS5zdW1hKSkgc3VtYSBGUk9NIHskcH1wc19pc3RfZWlsdXRlcyBlIEpPSU4geyRwfXBzX2lzdF91enNha3ltYWkgdSBPTiB1LmlkPWUudXpzYWt5bW9faWQgV0hFUkUgJFcgQU5EIChlLndjX3Byb2R1Y3RfaWQgSVMgTlVMTCBPUiBlLndjX3Byb2R1Y3RfaWQ9MCkiLCBBUlJBWV9BKTsKICAgICRlaz1qc29uX2RlY29kZShmaWxlX2dldF9jb250ZW50cyh3cF91cGxvYWRfZGlyKClbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMvczE2NzFfcHJla2VzX2Vrb25vbWlrYS5qc29uJyksdHJ1ZSk7ICRtYXA9YXJyYXkoKTsgZm9yZWFjaCgkZWsgYXMgJHgpeyAkbWFwWyR4WzBdXT0keDsgfSAvLyBpZCxrYWluYSxzYXYsbWFyemElLGd5dixzdWIsYnJhbmQsc2FuZAogICAgJGFnZz1hcnJheSgpOyAkdG9wPWFycmF5KCk7CiAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsgJHg9JG1hcFsoaW50KSRyWydwaWQnXV0/P251bGw7ICRnPSR4PyR4WzRdOic/JzsgJHN1Yj0keD8keFs1XTonPyc7ICRiPSR4PygkeFs2XT86Jz8nKTonPyc7ICRzYW5kPSR4PyR4WzddOic/JzsgJG09JHg/JHhbM106bnVsbDsgJHN1bWE9KGZsb2F0KSRyWydzdW1hJ107CiAgICAgIGZvcmVhY2goYXJyYXkoJ2d5dnwnLiRnLCdzdWJ8Jy4kZy4nfCcuJHN1YiwnYnJhbmR8Jy4kYiwnc2FuZHwnLiRzYW5kKSBhcyAkayl7IGlmKCFpc3NldCgkYWdnWyRrXSkpJGFnZ1ska109YXJyYXkoJ3N1bWEnPT4wLCd2bnQnPT4wLCd1enMnPT4wLCdwcmVraXUnPT4wLCdtYXJ6YV9ldXInPT4wLCdzdV9tJz0+MCk7ICRhPSYkYWdnWyRrXTsgJGFbJ3N1bWEnXSs9JHN1bWE7ICRhWyd2bnQnXSs9KGludCkkclsndm50J107ICRhWyd1enMnXSs9KGludCkkclsndXpzJ107ICRhWydwcmVraXUnXSsrOyBpZigkbSE9PW51bGwpeyRhWydtYXJ6YV9ldXInXSs9JHN1bWEvMS4yMSokbS8xMDA7ICRhWydzdV9tJ10rPSRzdW1hO30gdW5zZXQoJGEpOyB9CiAgICAgICR0b3BbXT1hcnJheSgoaW50KSRyWydwaWQnXSwkc3VtYSwoaW50KSRyWyd2bnQnXSwoaW50KSRyWyd1enMnXSwkbSwkZywkc3ViLCRiLCRzYW5kKTsKICAgIH0KICAgIGZvcmVhY2goJGFnZyBhcyAkaz0+JiRhKXsgJGFbJ3N1bWEnXT1yb3VuZCgkYVsnc3VtYSddKTsgJGFbJ21hcnphX3BjdCddPSRhWydzdV9tJ10+MD9yb3VuZCgxMDAqJGFbJ21hcnphX2V1ciddLygkYVsnc3VfbSddLzEuMjEpLDEpOm51bGw7ICRhWydtYXJ6YV9ldXInXT1yb3VuZCgkYVsnbWFyemFfZXVyJ10pOyB1bnNldCgkYVsnc3VfbSddKTsgfSB1bnNldCgkYSk7CiAgICB1YXNvcnQoJGFnZyxmdW5jdGlvbigkeCwkeSl7cmV0dXJuICR5WydzdW1hJ10tJHhbJ3N1bWEnXTt9KTsgJG9bJ2FnZyddPSRhZ2c7CiAgICB1c29ydCgkdG9wLGZ1bmN0aW9uKCR4LCR5KXtyZXR1cm4gJHlbMV08PT4keFsxXTt9KTsgJG9bJ3RvcDQwJ109YXJyYXlfc2xpY2UoJHRvcCwwLDQwKTsKICAgIGZvcmVhY2goJG9bJ3RvcDQwJ10gYXMgJiR0KXsgJHRbXT1tYl9zdWJzdHIoZ2V0X3RoZV90aXRsZSgkdFswXSksMCw1MCk7IH0gdW5zZXQoJHQpOwogICAgZmlsZV9wdXRfY29udGVudHMod3BfdXBsb2FkX2RpcigpWydiYXNlZGlyJ10uJy9wcy1iYWNrdXBzL3MxNjcxX2lzdG9yaWphX3ByZWtlcy5qc29uJywganNvbl9lbmNvZGUoJHRvcCkpOwogICAgLy8gcHJpc3RhdHltby92aWR1dGluaXMga3JlcMWhZWxpcwogICAgJG9bJ2tyZXBzZWxpcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIENBU0UgV0hFTiBzdW1hPDMwIFRIRU4gJzwzMCcgV0hFTiBzdW1hPDUwIFRIRU4gJzMwLTUwJyBXSEVOIHN1bWE8ODAgVEhFTiAnNTAtODAnIFdIRU4gc3VtYTwxMjAgVEhFTiAnODAtMTIwJyBFTFNFICcxMjArJyBFTkQgZywgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHN1bWEpKSBzdW1hIEZST00geyRwfXBzX2lzdF91enNha3ltYWkgdSBXSEVSRSAkVyBHUk9VUCBCWSBnIE9SREVSIEJZIE1JTihzdW1hKSIsIEFSUkFZX0EpOwogICAgJG9bJ3NpdW50aW1hcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIExFRlQoc2l1bnRpbWFzLDQwKSBzLCBDT1VOVCgqKSBuIEZST00geyRwfXBzX2lzdF91enNha3ltYWkgdSBXSEVSRSAkVyBHUk9VUCBCWSBzIE9SREVSIEJZIG4gREVTQyBMSU1JVCA4IiwgQVJSQVlfQSk7CiAgfSBjYXRjaCAoVGhyb3dhYmxlICRlKSB7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-151950';
const GKEY='ps_s1671e';
const PHASES=["E2"];
const OUT='analize/s1671_e2.json';
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
