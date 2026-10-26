process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAwZSByZWNvbiDigJQga2FpcCBwYWRhcnl0YSBlc2FtYSBBbWJyb3NpYSBwcmVrxJcgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTgwMGUnXSk/JF9HRVRbJ3BzX3MxODAwZSddOicnKTsgaWYoJGYhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTgwMGUnKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgICBmb3JlYWNoKGFycmF5KDE5NzYwLDE5NzU2LDM2MjUyKSBhcyAkaWQpewogICAgICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJHg9YXJyYXkoJ2lkJz0+JGlkLCduYW1lJz0+JHByLT5nZXRfbmFtZSgpLCdzbHVnJz0+JHByLT5nZXRfc2x1ZygpLCd0eXBlJz0+JHByLT5nZXRfdHlwZSgpLCdzdGF0dXMnPT4kcHItPmdldF9zdGF0dXMoKSwnc2t1Jz0+JHByLT5nZXRfc2t1KCksCiAgICAgICAgJ3ByaWNlJz0+JHByLT5nZXRfcHJpY2UoKSwncmVnJz0+JHByLT5nZXRfcmVndWxhcl9wcmljZSgpLCd3ZWlnaHQnPT4kcHItPmdldF93ZWlnaHQoKSwnZGltcyc9PmFycmF5KCRwci0+Z2V0X2xlbmd0aCgpLCRwci0+Z2V0X3dpZHRoKCksJHByLT5nZXRfaGVpZ2h0KCkpLAogICAgICAgICdjYXRzJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcsYXJyYXkoJ2ZpZWxkcyc9PidhbGwnKSksJ2JyYW5kJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2JyYW5kJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpLAogICAgICAgICd0YWdzJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X3RhZycsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKSwKICAgICAgICAnYXR0cnMnPT5hcnJheV9tYXAoZnVuY3Rpb24oJGEpeyByZXR1cm4gYXJyYXkoJ25hbWUnPT4kYS0+Z2V0X25hbWUoKSwnb3B0cyc9PiRhLT5nZXRfb3B0aW9ucygpLCd2aXNpYmxlJz0+JGEtPmdldF92aXNpYmxlKCksJ3RheCc9PiRhLT5pc190YXhvbm9teSgpKTsgfSwkcHItPmdldF9hdHRyaWJ1dGVzKCkpLAogICAgICAgICdpbWcnPT53cF9nZXRfYXR0YWNobWVudF91cmwoJHByLT5nZXRfaW1hZ2VfaWQoKSksJ2dhbGxlcnknPT5hcnJheV9tYXAoJ3dwX2dldF9hdHRhY2htZW50X3VybCcsJHByLT5nZXRfZ2FsbGVyeV9pbWFnZV9pZHMoKSksCiAgICAgICAgJ2V4Y2VycHQnPT4kcHItPmdldF9zaG9ydF9kZXNjcmlwdGlvbigpLCdjb250ZW50Jz0+JHByLT5nZXRfZGVzY3JpcHRpb24oKSwKICAgICAgICAnbWV0YSc9PmFycmF5KCkpOwogICAgICBmb3JlYWNoKGdldF9wb3N0X21ldGEoJGlkKSBhcyAkaz0+JHYpeyBpZihpbl9hcnJheSgkayxhcnJheSgnX2VkaXRfbG9jaycsJ19lZGl0X2xhc3QnKSkpIGNvbnRpbnVlOyAkeFsnbWV0YSddWyRrXT1zdHJsZW4oJHZbMF0pPjMwMD9zdWJzdHIoJHZbMF0sMCwzMDApLifigKYnOiR2WzBdOyB9CiAgICAgICR4WydzcmMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJGlkKSxBUlJBWV9BKTsKICAgICAgJHhbJ2ZlZWRfbWFwJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19mZWVkaW5nX21hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkaWQpLEFSUkFZX0EpOwogICAgICAkb1sncHJla2VzJ11bXT0keDsKICAgIH0KICAgICRvWydmZWVkX2NvbHMnXT1hcnJheSgnbWFwJz0+JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19mZWVkaW5nX21hcCIsMCksJ3RhYmxlcyc9PiR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfZmVlZGluZ190YWJsZXMiLDApLCdyb3dzJz0+JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19mZWVkaW5nX3Jvd3MiLDApKTsKICAgICR0aWQ9JHdwZGItPmdldF92YXIoIlNFTEVDVCB0YWJsZV9pZCBGUk9NIHskcH1wc19mZWVkaW5nX21hcCBXSEVSRSBwcm9kdWN0X2lkPTE5NzYwIExJTUlUIDEiKTsKICAgIGlmKCR0aWQpeyAkb1snZmVlZF90YWJsZSddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19mZWVkaW5nX3RhYmxlcyBXSEVSRSBpZD0lZCIsJHRpZCksQVJSQVlfQSk7ICRvWydmZWVkX3Jvd3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRwfXBzX2ZlZWRpbmdfcm93cyBXSEVSRSB0YWJsZV9pZD0lZCBPUkRFUiBCWSBpZCBMSU1JVCAzMCIsJHRpZCksQVJSQVlfQSk7IH0KICAgIC8vIGthxI1pxbMga2F0ZWdvcmlqb3MKICAgICRvWydrYXRfY2F0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQudGVybV9pZCx0Lm5hbWUsdC5zbHVnLHR0LnBhcmVudCx0dC5jb3VudCBGUk9NIHskcH10ZXJtcyB0IEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgKHQubmFtZSBMSUtFICcla2F0JScgT1IgdC5zbHVnIExJS0UgJyVrYXQlJykgT1JERVIgQlkgdHQucGFyZW50LHQubmFtZSIsQVJSQVlfQSk7CiAgICAvLyBwYXZ5emR5czoga2HEjWnFsyBzYXVzYXMgc3RlcmlsaXp1b3RvbXMg4oCUIGthaXAgYXRyb2RvIGtpdGFzIGJyZW5kYXMgKHB2ei4gTW9uZ2UvRmFybWluYSkga2HEjWnFsyBwcmVrxJc6IHBpcm1hcyBwdWJsaXNoIHN1ICdzdGVyaWxpeicgcGF2YWRpbmltZQogICAgJGNpZD0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIElEIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF90aXRsZSBMSUtFICclc3RlcmlsaXolJyBBTkQgcG9zdF90aXRsZSBMSUtFICcla2F0JScgT1JERVIgQlkgSUQgREVTQyBMSU1JVCAxIik7CiAgICBpZigkY2lkKXsgJHByPXdjX2dldF9wcm9kdWN0KCRjaWQpOyAkb1sna2F0X3B2eiddPWFycmF5KCdpZCc9PiRjaWQsJ25hbWUnPT4kcHItPmdldF9uYW1lKCksJ2NhdHMnPT53cF9nZXRfcG9zdF90ZXJtcygkY2lkLCdwcm9kdWN0X2NhdCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKSwnYXR0cnMnPT5hcnJheV9rZXlzKCRwci0+Z2V0X2F0dHJpYnV0ZXMoKSksJ2V4Y2VycHQnPT4kcHItPmdldF9zaG9ydF9kZXNjcmlwdGlvbigpLCdjb250ZW50Jz0+c3Vic3RyKCRwci0+Z2V0X2Rlc2NyaXB0aW9uKCksMCwzMDAwKSwnZmVlZF9tYXAnPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRwfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRjaWQpLEFSUkFZX0EpKTsgfQogICAgJG9bJ2FtYnJvc2lhX3NhbmQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX3ZhbHVlIHNhbmQsIENPVU5UKCopIG4gRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19zYW5kZWxpcycgR1JPVVAgQlkgbWV0YV92YWx1ZSIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-120044';
const GKEY='ps_s1800e';
const PHASES=["GO"];
const OUT='analize/s1800_e.json';
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
