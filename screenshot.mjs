process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTIgcnVuIGU0ciDigJQgUjogdmFyaWtsaW8ga29uc3RhbnRvcyBpciByZWdpc3RybyByYcWheW1vIHNlbWFudGlrYSAoU1RBVFVTQUksIFBldHNob3BfU2l1bnRvczo6emFsaWFzL3ByaWRldGlfaXNfcGx1Z2lubywgYXTFoWF1a2ltbyBrYWJsaXVrYWkpIOKAlCB0aWsgc2thaXR5bWFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2U0ciddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J3J1biBlNHInKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgxMjApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkc3JjPWZ1bmN0aW9uKCRjbHMsJG0sJG1heD0yMDAwKXsgdHJ5eyAkcj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgkY2xzLCRtKTsgJGxzPWZpbGUoJHItPmdldEZpbGVOYW1lKCkpOyByZXR1cm4gbWJfc3Vic3RyKGltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGxzLCRyLT5nZXRTdGFydExpbmUoKS0xLCRyLT5nZXRFbmRMaW5lKCktJHItPmdldFN0YXJ0TGluZSgpKzEpKSwwLCRtYXgpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgcmV0dXJuICdFUlIgJy4kZS0+Z2V0TWVzc2FnZSgpOyB9IH07CiAgdHJ5ewogICAgJG9bJ1NUQVRVU0FJJ109UGV0c2hvcF9EZXNrOjpTVEFUVVNBSTsgJG9bJ01FVEFfUEFLJ109UGV0c2hvcF9EZXNrOjpNRVRBX1BBSzsKICAgICRvWyd6YWxpYXMnXT0kc3JjKCdQZXRzaG9wX1NpdW50b3MnLCd6YWxpYXMnLDEyMDApOyAkb1sncHJpZGV0aSddPSRzcmMoJ1BldHNob3BfU2l1bnRvcycsJ3ByaWRldGlfaXNfcGx1Z2lubycsMjIwMCk7ICRvWydyZWdpc3RydW90YV9ncnVwaXUnXT0kc3JjKCdQZXRzaG9wX1NpdW50b3MnLCdyZWdpc3RydW90YV9ncnVwaXUnLDkwMCk7CiAgICBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZmkpeyAkYz1maWxlX2dldF9jb250ZW50cygkZmkpOyBpZihwcmVnX21hdGNoX2FsbCgiL2FkZF9hY3Rpb25cKFxzKid3b29jb21tZXJjZV9vcmRlcl9zdGF0dXNfKGNhbmNlbGxlZHxjb21wbGV0ZWRfdG9fY2FuY2VsbGVkfHByb2Nlc3NpbmdfdG9fY2FuY2VsbGVkfFthLXpfLV0qY2FuY2VsW2Etel8tXSopJ1teXG5dezAsMTQwfS8iLCRjLCRtKSl7ICRvWydjYW5jZWxfaG9va2FpJ11bYmFzZW5hbWUoJGZpKV09YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVswXSkpOyB9IGlmKHByZWdfbWF0Y2hfYWxsKCIvQVYgZ3LEhcW+aW5pbWFzW15cbl17MCwxMjB9L3UiLCRjLCRtKSl7ICRvWydhdl9ncmF6aW5pbWFzJ11bYmFzZW5hbWUoJGZpKV09YXJyYXlfc2xpY2UoYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVswXSkpLDAsMyk7IH0gfQogICAgJG9bJ2F2X3N0b2NrJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1N0b2NrJyk/YXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gJG0tPmdldE5hbWUoKTt9LChuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0FWX1N0b2NrJykpLT5nZXRNZXRob2RzKCkpOiduZXJhJzsKICAgICRvWydsaWt1dGlzX2RsJ109JHNyYygnUGV0c2hvcF9EYXJiYWxhdWtpcycsJ2xpa3V0aXMnLDE1MDApOwogICAgJG9bJ3NpdW50b3NfMzU0NDAnXT1QZXRzaG9wX1NpdW50b3M6OnNhcmFzYXMoMzU0NDApOyAkb1snc2l1bnRvc18zNTQzOCddPVBldHNob3BfU2l1bnRvczo6c2FyYXNhcygzNTQzOCk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDk5KTsK';
const VER='dep-083803';
const GKEY='ps_e4r';
const PHASES=["R"];
const OUT='analize/e4_run1r.json';
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
